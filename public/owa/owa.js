const traces = {
  find: {
    prompt: 'Where is the authentication logic?',
    tool: 'search_code',
    detail: 'Searches the indexed repository for related code and file names.',
    secondTool: 'read_file',
    secondDetail: 'Opens the relevant file before composing a response.',
    result: 'Points to the relevant files and explains what each one does, with source context.',
    insightTitle: 'Context before confidence.',
    insight: 'Search is a tool, not a decorative loading state. The agent can inspect the code before it makes a claim about it.',
  },
  edit: {
    prompt: 'Add input validation to app/api.py.',
    tool: 'read_file',
    detail: 'Inspects the current code and surrounding structure.',
    secondTool: 'patch_file → approval',
    secondDetail: 'Proposes a targeted change and asks before writing it.',
    result: 'After approval, applies the patch; the resulting diff remains available for review.',
    insightTitle: 'Changes have a pause.',
    insight: 'A suggested edit is not an invisible edit. OwA’s default write policy asks the developer to approve the change.',
  },
  test: {
    prompt: 'Run the tests and summarize failures.',
    tool: 'git_status',
    detail: 'Checks the state of the current workspace.',
    secondTool: 'run_command → approval',
    secondDetail: 'Requests permission before invoking a shell command.',
    result: 'Uses the actual command output and exit code to describe the result.',
    insightTitle: 'An action is evidence.',
    insight: 'The tool result matters more than a model’s claim that it ran something. Command execution is approved and sandboxed by default.',
  },
};

const steps = {
  workspace: {
    kicker: '01 / Workspace',
    title: 'Start with the files that are actually here.',
    description: 'OwA binds to the current project. Its direct file and Git tools can inspect the workspace without requiring a model to guess its shape.',
    code: 'list_dir · read_file · git_status',
    source: 'https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/app/tools/registry.py',
  },
  index: {
    kicker: '02 / Index',
    title: 'Make a compact map of the project.',
    description: 'The developer runs /index to build a local SQLite index. OwA skips common dependency and build directories, and records embedding metadata so incompatible vectors are not silently reused.',
    code: '/index · .owaignore · .owa/index.db',
    source: 'https://github.com/ZakaCoding/ollama-workspace-agent/tree/main/app/indexer',
  },
  retrieve: {
    kicker: '03 / Retrieve',
    title: 'Bring back evidence within the budget.',
    description: 'Search blends lexical and semantic signals when embeddings are available. It falls back to lexical search when they are not, and trims long results into source-linked excerpts for the model.',
    code: 'search_code · lexical + semantic · source excerpts',
    source: 'https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/app/indexer/search.py',
  },
  act: {
    kicker: '04 / Act',
    title: 'Keep the human at the boundary.',
    description: 'OwA can patch files and request commands, but the default policy asks first. Shell commands use a Docker sandbox by default; the developer can inspect what happened afterward.',
    code: 'patch_file · approve · run_command · git_diff',
    source: 'https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/app/tools/approval.py',
  },
};

const evidenceCases = {
  approval: [
    {
      path: 'app/tools/approval.py',
      summary: 'A failed or interrupted approval prompt returns false.',
      title: 'The human says yes or no.',
      detail: 'The default policy is “ask.” Deny, invalid policy, EOF, and interruption all return false. The decision is made before the command runs.',
      linkLabel: 'Read approval.py ↗',
    },
    {
      path: 'app/tools/shell.py',
      summary: 'A command asks first, then uses Docker by default.',
      title: 'The command has another boundary.',
      detail: 'After approval, shell execution defaults to a Docker container without network access. The developer can explicitly choose host execution instead.',
      linkLabel: 'Read shell.py ↗',
    },
    {
      path: 'app/tools/registry.py',
      summary: 'The registry names the actions the model can request.',
      title: 'The available tools are explicit.',
      detail: 'The agent can request registered tools such as run_command, read_file, and git_diff. The registry makes the action surface inspectable.',
      linkLabel: 'Read registry.py ↗',
    },
  ],
  context: [
    {
      path: 'app/indexer/search.py',
      summary: 'Search combines lexical and semantic signals when possible.',
      title: 'Retrieval can degrade openly.',
      detail: 'A compatible embedding index adds a semantic signal. If embeddings are missing or incompatible, OwA warns and scores with lexical signals instead.',
      linkLabel: 'Read search.py ↗',
    },
    {
      path: 'app/agent/context.py',
      summary: 'The evidence budget is shared across source excerpts.',
      title: 'The excerpt has a cost.',
      detail: 'OwA reserves room for prompts, tools, conversation, and output. It then shares the remaining evidence budget across eligible results and keeps citation headers.',
      linkLabel: 'Read context.py ↗',
    },
    {
      path: 'app/indexer/relevance.py',
      summary: 'Identifiers, paths, and phrases add precise match signals.',
      title: 'Exact names deserve attention.',
      detail: 'The relevance helpers split code identifiers and check quoted phrases, explicit paths, and symbol names. These signals help the search stay useful for code.',
      linkLabel: 'Read relevance.py ↗',
    },
  ],
};

const byId = (id) => document.getElementById(id);
let audioContext;

const primeAudio = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    audioContext ||= new AudioContextClass();
    if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  } catch {
    // The page remains usable when a browser does not offer Web Audio.
  }
};

// Browsers unlock audio after a gesture. Prime it on the first pointer or key
// action so interaction sounds need no separate on/off control.
document.addEventListener('pointerdown', primeAudio, { once: true, passive: true });
document.addEventListener('keydown', primeAudio, { once: true });

const chime = (kind = 'tap') => {
  try {
    primeAudio();
    if (!audioContext) return;
    const start = audioContext.currentTime;
    const notes = kind === 'success' ? [530, 795] : kind === 'deny' ? [260, 210] : [420, 510];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const at = start + index * 0.055;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.028, at + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.13);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(at);
      oscillator.stop(at + 0.14);
    });
  } catch {
    // All interactions still work if audio is unavailable.
  }
};

document.addEventListener('click', (event) => {
  if (event.target.closest('a')) chime();
});

document.querySelectorAll('[data-trace]').forEach((button) => {
  button.addEventListener('click', () => {
    const trace = traces[button.dataset.trace];
    if (!trace) return;
    document.querySelectorAll('[data-trace]').forEach((choice) => {
      const active = choice === button;
      choice.classList.toggle('is-active', active);
      choice.setAttribute('aria-pressed', String(active));
    });
    Object.entries({
      'trace-prompt': trace.prompt,
      'trace-tool': trace.tool,
      'trace-detail': trace.detail,
      'trace-second-tool': trace.secondTool,
      'trace-second-detail': trace.secondDetail,
      'trace-result': trace.result,
      'trace-insight-title': trace.insightTitle,
      'trace-insight': trace.insight,
    }).forEach(([id, value]) => { byId(id).textContent = value; });
    chime();
  });
});

document.querySelectorAll('[data-step]').forEach((button) => {
  button.addEventListener('click', () => {
    const step = steps[button.dataset.step];
    if (!step) return;
    document.querySelectorAll('[data-step]').forEach((node) => {
      const active = node === button;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
    byId('step-kicker').textContent = step.kicker;
    byId('step-title').textContent = step.title;
    byId('step-description').textContent = step.description;
    byId('step-code').textContent = step.code;
    byId('step-source').href = step.source;
    chime();
  });
});

let currentEvidenceCase = 'approval';
let selectedEvidenceIndex = 0;
const evidenceRange = byId('evidence-count');
const evidenceButtons = [...document.querySelectorAll('[data-evidence-index]')];
const renderEvidenceDesk = () => {
  const files = evidenceCases[currentEvidenceCase];
  const count = Number(evidenceRange.value);
  byId('evidence-count-value').textContent = `${count} of 3`;
  evidenceButtons.forEach((button, index) => {
    const file = files[index];
    const included = index < count;
    button.querySelector('.desk-file-path').textContent = file.path;
    button.querySelector('.desk-file-summary').textContent = file.summary;
    button.querySelector('.desk-file-state').textContent = included ? 'In context' : 'Outside pile';
    button.classList.toggle('is-out', !included);
    button.classList.toggle('is-selected', index === selectedEvidenceIndex);
    button.setAttribute('aria-pressed', String(index === selectedEvidenceIndex));
  });
  const selected = files[selectedEvidenceIndex];
  document.querySelector('.desk-inspector-eyebrow').textContent = `${selectedEvidenceIndex < count ? 'In the pile' : 'Outside the pile'} / 0${selectedEvidenceIndex + 1}`;
  byId('desk-file-title').textContent = selected.title;
  byId('desk-file-detail').textContent = selected.detail;
  const link = byId('desk-file-link');
  link.textContent = selected.linkLabel;
  link.href = `https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/${selected.path}`;
  byId('desk-outcome-text').textContent = `${count} source ${count === 1 ? 'card is' : 'cards are'} in this illustrative pile. ${count < 3 ? 'The rest remain one click away; ' : 'All three are visible; '}OwA keeps citations so a developer can inspect a full file when an excerpt misses context.`;
};

document.querySelectorAll('[data-desk-case]').forEach((button) => {
  button.addEventListener('click', () => {
    currentEvidenceCase = button.dataset.deskCase;
    selectedEvidenceIndex = 0;
    document.querySelectorAll('[data-desk-case]').forEach((choice) => {
      const active = choice === button;
      choice.classList.toggle('is-active', active);
      choice.setAttribute('aria-pressed', String(active));
    });
    renderEvidenceDesk();
    chime();
  });
});
evidenceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedEvidenceIndex = Number(button.dataset.evidenceIndex);
    renderEvidenceDesk();
    chime();
  });
});
evidenceRange.addEventListener('input', renderEvidenceDesk);
evidenceRange.addEventListener('change', () => chime());

const approvalVisual = document.querySelector('.approval-visual');
byId('approve-command').addEventListener('click', () => {
  byId('approval-feedback').textContent = 'Demo: permission granted. In OwA, the approved command would run in its configured sandbox and return real output.';
  byId('approval-visual-symbol').textContent = '✓';
  approvalVisual.dataset.state = 'approved';
  chime('success');
});
byId('deny-command').addEventListener('click', () => {
  byId('approval-feedback').textContent = 'Demo: request denied. No command would run.';
  byId('approval-visual-symbol').textContent = '×';
  approvalVisual.dataset.state = 'denied';
  chime('deny');
});

document.querySelectorAll('.detail-list details, .field-note').forEach((detail) => {
  detail.addEventListener('toggle', () => { if (detail.open) chime(); });
});

const imageCallouts = [...document.querySelectorAll('.image-callout')];
imageCallouts.forEach((callout) => {
  callout.addEventListener('toggle', () => {
    if (!callout.open) return;
    imageCallouts.filter((other) => other !== callout).forEach((other) => { other.open = false; });
    chime();
  });
});

const copyButton = byId('copy-install');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('pipx install ollama-workspace-agent\ncd your-project\nowa');
    copyButton.textContent = 'Copied ✓';
    chime('success');
  } catch {
    copyButton.textContent = 'Select the commands to copy';
  }
  window.setTimeout(() => { copyButton.textContent = 'Copy command'; }, 2400);
});

const progressBar = byId('reading-progress-bar');
let progressQueued = false;
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0}%`;
  progressQueued = false;
};
window.addEventListener('scroll', () => {
  if (!progressQueued) {
    progressQueued = true;
    requestAnimationFrame(updateProgress);
  }
}, { passive: true });
updateProgress();

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('.chapter[id], .evidence-desk[id]')];
  const railLinks = [...document.querySelectorAll('.story-rail a[href^="#"]')];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      railLinks.forEach((link) => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-18% 0px -68% 0px' });
  sections.forEach((section) => observer.observe(section));
}
