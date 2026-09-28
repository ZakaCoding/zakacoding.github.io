// A standalone, editorial case study. The trace controls are illustrative;
// product claims and limitations are linked to the OwA source throughout.
export const renderOwaStory = () => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f5f5f7">
  <meta name="description" content="Inside OwA: a local coding agent built around repository evidence, explicit approvals, and the constraints of smaller Ollama models.">
  <meta property="og:type" content="article">
  <meta property="og:title" content="OwA — the codebase before the answer · Zaka Noor">
  <meta property="og:description" content="An interactive engineering story about grounding a local coding agent in the developer's own repository.">
  <meta property="og:url" content="https://zakacoding.github.io/work/owa/">
  <meta property="og:image" content="https://zakacoding.github.io/owa/local-loop.png">
  <link rel="canonical" href="https://zakacoding.github.io/work/owa/">
  <link rel="icon" href="/logo/favicon.png">
  <link rel="preload" href="/owa/local-loop.png" as="image">
  <link rel="stylesheet" href="/owa/owa.css">
  <script src="/owa/owa.js" defer></script>
  <title>OwA — the codebase before the answer · Zaka Noor</title>
</head>
<body>
  <a class="skip-link" href="#main">Skip to story</a>
  <div class="reading-progress" aria-hidden="true"><span id="reading-progress-bar"></span></div>
  <header class="site-header">
    <a class="site-brand" href="/" aria-label="ZakaCoding home"><img src="/logo/logo.svg" width="1082" height="512" alt=""><span>ZakaCoding</span></a>
    <nav aria-label="Main navigation"><a href="/#/archive">All work</a><a href="/#/about">About</a><a href="https://github.com/ZakaCoding/ollama-workspace-agent" target="_blank" rel="noreferrer">Source <span aria-hidden="true">↗</span></a></nav>
  </header>

  <main id="main">
    <section class="hero" aria-labelledby="story-title">
      <div class="hero-copy">
        <a class="breadcrumb" href="/#/archive">← Selected work</a>
        <p class="eyebrow"><span class="status-light"></span> Independent project <span class="eyebrow-divider">/</span> Local AI <span class="eyebrow-divider">/</span> 2026</p>
        <h1 id="story-title">The codebase<br><em>before the answer.</em></h1>
        <p class="hero-lede">OwA is a coding agent for Ollama that starts with the workspace in front of it. It reads, searches, and asks before it changes things.</p>
        <div class="hero-actions"><a class="primary-link" href="#trace">Explore the interaction <span aria-hidden="true">↘</span></a><a class="quiet-link" href="https://github.com/ZakaCoding/ollama-workspace-agent" target="_blank" rel="noreferrer">Read the source ↗</a></div>
        <p class="hero-caption">Designed and built by Zaka Noor · Python CLI + optional HTTP API</p>
      </div>
      <figure class="hero-image">
        <img src="/owa/local-loop.png" width="1536" height="1024" alt="Illustration of repository files connected to a small local computer by glowing threads" fetchpriority="high">
        <figcaption>01 / The local loop — conceptual illustration</figcaption>
        <details class="image-callout image-callout-files"><summary>your repository <span aria-hidden="true">↗</span></summary><p>OwA reads the workspace and builds a local index when you request it.</p></details>
        <details class="image-callout image-callout-model"><summary>your model <span aria-hidden="true">↗</span></summary><p>Ollama runs on a machine you configure, locally or over a private connection.</p></details>
      </figure>
      <div class="hero-index" aria-label="Project facts"><span>01 / An indexed workspace</span><span>02 / Ollama on a machine you choose</span><span>03 / Actions you can review</span></div>
    </section>

    <div class="story-grid">
      <aside class="story-rail" aria-label="On this page">
        <p>In this story</p>
        <a href="#question">The question</a>
        <a href="#trace">A sample trace</a>
        <a href="#system">How it works</a>
        <a href="#evidence-desk">Evidence desk</a>
        <a href="#boundaries">The boundaries</a>
        <a href="#evidence">What we learned</a>
        <a href="#try-owa">Try OwA</a>
      </aside>

      <div class="story-body">
        <section class="chapter" id="question" aria-labelledby="question-title">
          <div class="chapter-heading"><span class="chapter-number">01 / The question</span><h2 id="question-title">Can a small local model be a useful <em>coding partner?</em></h2></div>
          <div class="prose-layout"><div class="prose"><p class="lead">A coding assistant is only as useful as the evidence it can reach. Ask one where authentication lives, and a plausible answer is not enough. It needs to find the relevant files and show its work.</p><p>OwA began with that tension: keep inference under the developer’s control, while giving a smaller model enough context and tools to work inside a real repository. The machine running Ollama can be local or reachable over a private network. Either way, the workspace remains the center of the experience.</p><p>The interface is deliberately simple: a CLI for the daily loop, plus an optional HTTP API. The interesting design work happens between the prompt and the answer.</p></div><aside class="hand-note"><span class="note-star" aria-hidden="true">✳</span><p>Before asking the model to be clever, let it look around.</p><small>Working principle / OwA</small></aside></div>
        </section>

        <section class="chapter trace-chapter" id="trace" aria-labelledby="trace-title">
          <div class="chapter-heading"><span class="chapter-number">02 / A sample trace</span><h2 id="trace-title">Pick a request.<br><em>See the path it takes.</em></h2><p>These short traces illustrate OwA’s documented tools and approval flow. They are examples, not a live model session or benchmark result.</p></div>
          <div class="trace-controls" role="group" aria-label="Choose an example request"><button class="trace-choice is-active" type="button" data-trace="find" aria-pressed="true"><span>01</span> Find the code</button><button class="trace-choice" type="button" data-trace="edit" aria-pressed="false"><span>02</span> Change a file</button><button class="trace-choice" type="button" data-trace="test" aria-pressed="false"><span>03</span> Run a check</button></div>
          <div class="trace-stage">
            <div class="trace-terminal" aria-label="Illustrative OwA terminal"><div class="terminal-bar"><span class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>owa / example workspace</span><span>● local</span></div><div class="terminal-content"><p class="terminal-prompt"><span>›</span> <span id="trace-prompt">Where is the authentication logic?</span></p><div class="terminal-event"><span class="terminal-glyph" aria-hidden="true">↳</span><div><span class="terminal-label" id="trace-tool">search_code</span><p id="trace-detail">Searches the indexed repository for related code and file names.</p></div></div><div class="terminal-event"><span class="terminal-glyph" aria-hidden="true">↳</span><div><span class="terminal-label" id="trace-second-tool">read_file</span><p id="trace-second-detail">Opens the relevant file before composing a response.</p></div></div><div class="terminal-result"><span>assistant</span><p id="trace-result">Points to the relevant files and explains what each one does, with source context.</p></div></div></div>
            <aside class="trace-aside" aria-live="polite"><span class="aside-kicker">What matters here</span><h3 id="trace-insight-title">Context before confidence.</h3><p id="trace-insight">Search is a tool, not a decorative loading state. The agent can inspect the code before it makes a claim about it.</p><span class="trace-aside-foot">Select another request to follow a different path ↖</span></aside>
          </div>
          <p class="source-line">The example uses documented <a href="https://github.com/ZakaCoding/ollama-workspace-agent#tools" target="_blank" rel="noreferrer">workspace tools ↗</a> and describes their intended flow.</p>
        </section>

        <section class="chapter" id="system" aria-labelledby="system-title">
          <div class="chapter-heading"><span class="chapter-number">03 / The system</span><h2 id="system-title">A loop with<br><em>places to inspect.</em></h2><p>Choose a part of the loop to see the engineering decision behind it.</p></div>
          <div class="system-lab">
            <div class="system-flow" role="group" aria-label="Explore the OwA workflow"><button type="button" class="flow-node is-active" data-step="workspace" aria-pressed="true"><span class="flow-num">01</span><span class="flow-icon" aria-hidden="true">⌗</span><strong>Workspace</strong><small>See what exists</small></button><span class="flow-join" aria-hidden="true"></span><button type="button" class="flow-node" data-step="index" aria-pressed="false"><span class="flow-num">02</span><span class="flow-icon" aria-hidden="true">◫</span><strong>Index</strong><small>Keep it local</small></button><span class="flow-join" aria-hidden="true"></span><button type="button" class="flow-node" data-step="retrieve" aria-pressed="false"><span class="flow-num">03</span><span class="flow-icon" aria-hidden="true">⌕</span><strong>Retrieve</strong><small>Find evidence</small></button><span class="flow-join" aria-hidden="true"></span><button type="button" class="flow-node" data-step="act" aria-pressed="false"><span class="flow-num">04</span><span class="flow-icon" aria-hidden="true">↗</span><strong>Act</strong><small>Ask first</small></button></div>
            <div class="system-detail" aria-live="polite"><span class="aside-kicker" id="step-kicker">01 / Workspace</span><h3 id="step-title">Start with the files that are actually here.</h3><p id="step-description">OwA binds to the current project. Its direct file and Git tools can inspect the workspace without requiring a model to guess its shape.</p><div class="system-detail-foot"><code id="step-code">list_dir · read_file · git_status</code><a id="step-source" href="https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/app/tools/registry.py" target="_blank" rel="noreferrer">Inspect the source ↗</a></div></div>
          </div>
          <div class="evidence-desk" id="evidence-desk" aria-labelledby="desk-title">
            <div class="desk-intro"><span class="aside-kicker">A closer look / retrieval</span><h3 id="desk-title">Build the model’s reading pile.</h3><p>Choose a question, then decide how many source cards fit. This is a curated tour of real OwA files, not a live search or a measured ranking.</p></div>
            <div class="desk-controls">
              <div class="desk-questions" role="group" aria-label="Choose a source question"><button type="button" class="desk-question is-active" data-desk-case="approval" aria-pressed="true">Where is command approval?</button><button type="button" class="desk-question" data-desk-case="context" aria-pressed="false">How is evidence trimmed?</button></div>
              <label class="desk-budget" for="evidence-count"><span>Cards in the reading pile <strong id="evidence-count-value">2 of 3</strong></span><input id="evidence-count" type="range" min="1" max="3" value="2"><span class="budget-labels"><span>More focus</span><span>More coverage</span></span></label>
            </div>
            <div class="desk-workspace">
              <div class="desk-files" role="group" aria-label="Explore source cards">
                <button type="button" class="desk-file is-selected" data-evidence-index="0" aria-pressed="true"><span class="desk-file-top"><span class="desk-file-number">01 / source</span><span class="desk-file-state">In context</span></span><strong class="desk-file-path">app/tools/approval.py</strong><span class="desk-file-summary">A failed or interrupted approval prompt returns false.</span><span class="desk-file-foot">Open the file note ↗</span></button>
                <button type="button" class="desk-file" data-evidence-index="1" aria-pressed="false"><span class="desk-file-top"><span class="desk-file-number">02 / source</span><span class="desk-file-state">In context</span></span><strong class="desk-file-path">app/tools/shell.py</strong><span class="desk-file-summary">A command asks first, then uses Docker by default.</span><span class="desk-file-foot">Open the file note ↗</span></button>
                <button type="button" class="desk-file is-out" data-evidence-index="2" aria-pressed="false"><span class="desk-file-top"><span class="desk-file-number">03 / source</span><span class="desk-file-state">Outside pile</span></span><strong class="desk-file-path">app/tools/registry.py</strong><span class="desk-file-summary">The tool registry exposes the actions the model can request.</span><span class="desk-file-foot">Open the file note ↗</span></button>
              </div>
              <aside class="desk-inspector" aria-live="polite"><span class="desk-inspector-eyebrow">Selected source / 01</span><h4 id="desk-file-title">The human says yes or no.</h4><p id="desk-file-detail">The default policy is “ask.” Deny, invalid policy, EOF, and interruption all return false. The decision is made before the command runs.</p><a id="desk-file-link" href="https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/app/tools/approval.py" target="_blank" rel="noreferrer">Read approval.py ↗</a></aside>
            </div>
            <div class="desk-outcome"><span class="desk-outcome-icon" aria-hidden="true">↘</span><p id="desk-outcome-text" role="status">Two source cards are in this illustrative pile. The third remains one click away; OwA keeps citations so a developer can inspect a full file when an excerpt misses context.</p></div>
          </div>
          <div class="prose-layout after-lab"><div class="prose"><p>Search blends lexical and semantic signals when embeddings are available. If the embedding index is incompatible or unavailable, OwA can still use lexical search and tells the developer why. Retrieved excerpts are budgeted so a small model receives focused evidence instead of an unbounded dump.</p><p>That tradeoff is visible. Compression saves context, but an excerpt can miss something important. OwA keeps source references so the full file can be opened when the detail matters.</p></div><aside class="hand-note"><span class="note-star" aria-hidden="true">↗</span><p>Less context can be better, if the path back to the source stays open.</p><small>On retrieval / OwA</small></aside></div>
        </section>

        <section class="chapter boundaries-chapter" id="boundaries" aria-labelledby="boundaries-title">
          <div class="chapter-heading"><span class="chapter-number">04 / The boundaries</span><h2 id="boundaries-title">Useful tools need<br><em>clear edges.</em></h2><p>OwA separates reading from changing. The default approval policy asks before file writes and shell commands.</p></div>
          <div class="approval-demo"><div class="approval-copy"><span class="aside-kicker">Try the decision</span><h3>OwA requests a command.</h3><p>A model proposes <code>pytest -q</code>. You decide whether it runs. This control is a page demonstration; it never executes a command.</p><div class="approval-actions"><button id="approve-command" class="approval-yes" type="button">Allow once <span aria-hidden="true">↗</span></button><button id="deny-command" class="approval-no" type="button">Deny</button></div><p class="approval-feedback" id="approval-feedback" role="status">Waiting for your choice. The default prompt is “no.”</p></div><div class="approval-visual" aria-hidden="true"><span class="approval-visual-top">agent → human</span><strong id="approval-visual-symbol">?</strong><span class="approval-visual-bottom">permission boundary</span></div></div>
          <div class="detail-list"><details><summary><span>01 / File changes</span><strong>Approval is a decision point.</strong><span aria-hidden="true">+</span></summary><p>Patch and write tools can change the workspace, so OwA’s default policy asks first. An absent or interrupted response rejects the request. Policies can be set to ask, deny, or allow by the developer.</p><a href="https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/app/tools/approval.py" target="_blank" rel="noreferrer">Read approval logic ↗</a></details><details><summary><span>02 / Shell commands</span><strong>A container is the default boundary.</strong><span aria-hidden="true">+</span></summary><p>Approved shell commands run in a Docker sandbox by default, with no network and a read-only root filesystem. The user must provide the sandbox image locally. Host execution is an explicit configuration choice.</p><a href="https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/app/tools/shell.py" target="_blank" rel="noreferrer">Read command handling ↗</a></details><details><summary><span>03 / Network and privacy</span><strong>“Local” depends on your setup.</strong><span aria-hidden="true">+</span></summary><p>OwA does not require cloud API keys or telemetry. Inference and embeddings run on the Ollama server you configure; code can leave your machine if you deliberately point it at a remote service or enable external MCP tools.</p><a href="https://github.com/ZakaCoding/ollama-workspace-agent#privacy--safety" target="_blank" rel="noreferrer">Read privacy notes ↗</a></details></div>
        </section>

        <section class="chapter evidence-chapter" id="evidence" aria-labelledby="evidence-title"><div class="chapter-heading"><span class="chapter-number">05 / What we learned</span><h2 id="evidence-title">Test the workflow.<br><em>Show the limits.</em></h2></div><div class="evidence-grid"><div class="evidence-main"><span class="evidence-overline">September 2026 / recorded evaluation</span><div class="evidence-numbers"><div><strong>40<span>/40</span></strong><p>planned Qwen case runs passed in a frozen-source, twenty-case fixture matrix</p></div><div><strong>40<span>/42</span></strong><p>Ornith passed all planned runs across 42 attempts, with interruptions retained and retried</p></div></div><p class="evidence-note">These are scoped workflow checks in disposable workspaces, not a claim about arbitrary repositories or hardware. A later 0.7.0 live evaluation was incomplete because the configured Ollama service timed out; it did not establish a correctness result.</p><a href="https://github.com/ZakaCoding/ollama-workspace-agent/blob/main/benchmarks/2026-09-21-workflow/README.md" target="_blank" rel="noreferrer">Read the method and raw traces ↗</a></div><aside class="evidence-side"><span class="aside-kicker">What I kept</span><p>Grounded answers, reviewable changes, honest incomplete states, and visibility into the agent’s limits.</p><span class="aside-kicker">What remains hard</span><p>Model speed, retrieval misses, and the quality of an answer when the useful context is larger than the budget.</p></aside></div><div class="field-notes"><div class="field-notes-heading"><span class="aside-kicker">Open a field note</span><p>Three moments from the recorded fixture runs.</p></div><details class="field-note"><summary><span>01 / Recovery</span><strong>A patch did not match the source.</strong><span aria-hidden="true">↗</span></summary><p>One Qwen tool call failed because the patch’s original text did not match. OwA corrected the patch, and the independent source tests passed. The failed call remains visible in the recorded total of 61 successful tools out of 64 calls.</p></details><details class="field-note"><summary><span>02 / Restraint</span><strong>The requested symbol was absent.</strong><span aria-hidden="true">↗</span></summary><p>The evaluation includes a question about a symbol that does not exist in its fixture. The expected behavior is to say it cannot be located, rather than invent a file. An early evaluator predicate even misread a correct refusal; that predicate was fixed before the final matrices.</p></details><details class="field-note"><summary><span>03 / Interruption</span><strong>The model service stopped answering.</strong><span aria-hidden="true">↗</span></summary><p>Two Ornith attempts were interrupted by failed model requests. OwA returned an explicit incomplete state, and the affected cases passed after the run resumed. The traces do not establish the underlying cause of the requests failing.</p></details></div></section>

        <section class="chapter try-chapter" id="try-owa" aria-labelledby="try-title"><div class="chapter-heading"><span class="chapter-number">06 / Take it for a spin</span><h2 id="try-title">Your repository.<br><em>Your machine.</em></h2><p>OwA is open source. The current setup and requirements live in its README; this is the shortest path to the CLI after you have Ollama and models ready.</p></div><div class="install-block"><div class="install-top"><span>Terminal / install</span><button type="button" id="copy-install" aria-live="polite">Copy command</button></div><pre><code>pipx install ollama-workspace-agent
cd your-project
owa</code></pre></div><p class="source-line">Python 3.11+, a reachable Ollama server, and chat and embedding models are required. <a href="https://github.com/ZakaCoding/ollama-workspace-agent#quick-start" target="_blank" rel="noreferrer">Follow the full setup ↗</a></p><div class="closing-links"><a class="primary-link" href="https://github.com/ZakaCoding/ollama-workspace-agent" target="_blank" rel="noreferrer">Explore the repository ↗</a><a class="quiet-link" href="https://zakacoding.github.io/ollama-workspace-agent/" target="_blank" rel="noreferrer">Visit project site ↗</a><a class="quiet-link" href="/#/archive">Back to selected work →</a></div></section>
      </div>
    </div>
  </main>
  <footer class="site-footer"><span>OwA / Zaka Noor / 2026</span><a href="/">Back to portfolio ↑</a></footer>
</body>
</html>`;
