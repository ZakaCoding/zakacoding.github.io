const assets = {
  'interface-study': ['Craft interface study', 'Craft proposal panel beside a landing page, from the existing interface study'],
  review: ['Review each suggestion', 'Craft proposal with individual approval checkboxes, captured in an isolated application test'],
  applied: ['Applied and checked', 'Craft panel reporting the result of approved changes in an isolated application test'],
  create: ['Create Design proposal', 'Craft approval card showing target boards, sections, typography, layers and usage'],
  coffee: ['Ember & Oak · compiler example', 'Full coffee shop design generated from an offline fixture in a real Penpot acceptance test'],
  saas: ['Software product · compiler example', 'Full software landing page generated from an offline fixture in a real Penpot acceptance test'],
  studio: ['Creative studio · compiler example', 'Full creative studio design generated from an offline fixture in a real Penpot acceptance test'],
  'native-editor': ['Native, editable Penpot boards', 'Actual Penpot editor with desktop and mobile coffee shop boards and native editable layers'],
};
const dialog = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
let opener;
function closeLightbox() { dialog.close(); }
document.querySelectorAll('[data-enlarge]').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.enlarge;
    const asset = assets[name];
    if (!asset) return;
    opener = button;
    document.querySelector('#lightbox-title').textContent = asset[0];
    lightboxImage.src = `/craft/${name}.webp`;
    lightboxImage.alt = asset[1];
    dialog.showModal();
    document.querySelector('.lightbox-scroll').scrollTop = 0;
  });
});
document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
dialog.addEventListener('click', event => { if (event.target === dialog) closeLightbox(); });
dialog.addEventListener('close', () => { lightboxImage.removeAttribute('src'); opener?.focus({ preventScroll: true }); });
const steps = {
  review: { title: 'See the before and after.', copy: 'Ask for a clearer headline or better layer names. Craft inspects the active page and puts the proposed changes in front of you, with checkboxes for each one.', principle: 'A suggestion becomes an edit only after your approval.', caption: 'Review · real application UI / test environment' },
  applied: { title: 'Your choices become the changes.', copy: 'Choose the edits you want and leave the others unchecked. Craft applies the selected changes, then reads the affected layers again to check what actually happened.', principle: 'An applied change gets checked against the canvas.', caption: 'Applied · real application UI / test environment' },
  create: { title: 'Turn a brief into editable boards.', copy: 'Describe a page. Review the proposed desktop and mobile boards, sections, palette and typography. When you approve, Craft creates native layers alongside your existing work.', principle: 'A first version you can keep shaping in the editor.', caption: 'Create Design · real application UI / offline fixture' },
};
document.querySelectorAll('[data-step]').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.step;
    const step = steps[name];
    document.querySelectorAll('[data-step]').forEach(choice => {
      const selected = choice === button;
      choice.classList.toggle('is-active', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });
    document.querySelector('#step-title').textContent = step.title;
    document.querySelector('#step-copy').textContent = step.copy;
    document.querySelector('#step-principle').textContent = step.principle;
    document.querySelector('#workflow-caption').textContent = step.caption;
    const image = document.querySelector('#workflow-shot');
    image.src = `/craft/${name}.webp`;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      image.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out' });
    }
    image.alt = assets[name][1];
    image.closest('[data-enlarge]').dataset.enlarge = name;
  });
});
const film = document.querySelector('#craft-film');
document.querySelector('[data-play-film]').addEventListener('click', () => { film.play().catch(() => {}); });
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
  if (!reduceMotion.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));
    document.documentElement.classList.add('reveal-ready');
  }
  // Playback is always user initiated. Pause video when it leaves the viewport.
  const videoObserver = new IntersectionObserver(entries => { if (!entries[0].isIntersecting) film.pause(); });
  videoObserver.observe(film);
  const chapterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.chapter-bar nav a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('.chapter-bar nav a').forEach(link => { const section = document.querySelector(link.hash); if (section) chapterObserver.observe(section); });
}
