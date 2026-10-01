import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { projects } from '../src/lib/projects.js';
import { renderOwaStory } from './owa-story.mjs';

const origin = 'https://zakacoding.dev';
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const visual = (project) => project.visual === 'logistics'
  ? '<figure class="project-visual ecosystem"><span>OMS</span><span>WMS</span><strong>DiGILOG<small>Shared operational context</small></strong><span>TMS</span><span>FMS</span><span>VMS</span><figcaption>Scope diagram · five connected product areas</figcaption></figure>'
  : project.visual === 'owa'
    ? '<figure class="project-visual terminal"><div>owa — workspace</div><pre>$ owa\n\n› explain this deployment flow\n\nReading the relevant code before answering…</pre><figcaption>Illustrative workflow · explore the source for current behavior</figcaption></figure>'
    : '<figure class="project-visual concept"><span>Central idea</span><div>↙ &nbsp; connects to &nbsp; ↘</div><span>Concept</span><span>Relationship</span><figcaption>Concept map illustration · explore the live canvas below</figcaption></figure>';
const shell = (title, description, path, body) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} | ${path.includes('logistics') ? 'Yes it is a lot of boxes' : 'One more idea and then I sleep'}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${origin}${path}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)} · Zaka Noor"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${origin}/social-preview.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/logo/favicon.png"><link rel="stylesheet" href="/work.css"></head><body><a class="skip-link" href="#main">Skip to content</a><header><a class="brand" href="/">ZakaCoding</a><nav aria-label="Main navigation"><a href="/#/archive">Work</a><a href="/#/about">About</a><a href="mailto:hello@zakacoding.dev">Contact</a></nav></header><main id="main">${body}<section class="contact"><p>Have a related problem?</p><h2>Let’s talk about it.</h2><a class="button" href="/#/about?chat=1">Start a conversation ↗</a><a href="mailto:hello@zakacoding.dev">hello@zakacoding.dev</a></section></main><footer>Zaka Noor · Indonesia · GMT+7 <a href="/">Back home ↑</a></footer></body></html>`;

await mkdir('dist/work', { recursive: true });
for (const project of projects) {
  const path = `/work/${project.slug}/`;
  if (project.slug === 'owa') {
    await mkdir(`dist${path}`, { recursive: true });
    await writeFile(`dist${path}index.html`, renderOwaStory());
    continue;
  }
  const body = `<a class="back" href="/#/archive">← Selected work</a><p class="eyebrow">${escape(project.category)}</p><h1>${escape(project.name)}</h1><p class="lede">${escape(project.summary)}</p><p class="role">${escape(project.role)}</p><ul class="tags">${project.technologies.map((tag) => `<li>${escape(tag)}</li>`).join('')}</ul>${visual(project)}<section><p class="eyebrow">01 / The problem</p><h2>What needed to be clearer</h2><p>${escape(project.problem)}</p></section><section><p class="eyebrow">02 / The approach</p><h2>How I approached it</h2><p>${escape(project.approach)}</p><div class="decisions">${project.decisions.map(([title, copy]) => `<article><h3>${escape(title)}</h3><p>${escape(copy)}</p></article>`).join('')}</div></section><section><p class="eyebrow">03 / The result</p><h2>What you can explore</h2><p>${escape(project.outcome)}</p><div class="links">${project.links.map(([label, url]) => `<a class="button" href="${escape(url)}">${escape(label)} ↗</a>`).join('')}</div></section>`;
  await mkdir(`dist${path}`, { recursive: true });
  await writeFile(`dist${path}index.html`, shell(project.name, project.summary, path, body));
}
await writeFile('dist/work/index.html', `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=/#/archive"><title>Work | It worked on my machine</title><link rel="canonical" href="${origin}/#/archive"></head><body><p><a href="/#/archive">Open the work board</a></p></body></html>`);
const urls = ['/', '/work/', ...projects.map((project) => `/work/${project.slug}/`)];
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
const template = await readFile('dist/index.html', 'utf8');
await writeFile('dist/404.html', template.replace('<title>', '<meta name="robots" content="noindex"><title>'));
console.log(`Generated ${projects.length} project stories, work index, sitemap, and 404 page.`);
