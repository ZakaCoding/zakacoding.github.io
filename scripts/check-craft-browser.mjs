// Optional QA tool: PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node scripts/check-craft-browser.mjs
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
import { writeFile, mkdir } from 'node:fs/promises';
await mkdir('docs/evidence/craft-story', { recursive: true });
const previewOrigin = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:4175';
const browser = await chromium.launch({headless:true});
const reports=[];
for(const [width,height,motion] of [[1440,1000,'no-preference'],[1366,768,'no-preference'],[768,1024,'no-preference'],[390,844,'no-preference'],[320,740,'reduce']]) {
 const page=await browser.newPage({viewport:{width,height},reducedMotion:motion});
 const errors=[]; const failures=[]; const requests=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 page.on('response',r=>{if(r.status()>=400)failures.push([r.status(),r.url()])});
 page.on('request',r=>requests.push(r.url()));
 await page.goto(`${previewOrigin}/work/craft/`,{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(1100);
 await page.screenshot({animations:'disabled',path:`docs/evidence/craft-story/craft-${width}-hero.png`});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
 const cta=await page.locator('.hero-actions .button').boundingBox();
 const initialVideoRequest=requests.some(u=>u.endsWith('.mp4'));
 for(const step of ['review','applied','create']){
  await page.locator(`[data-step="${step}"]`).click();
  if(await page.locator('#workflow-shot').getAttribute('src')!==`/craft/${step}.webp`)throw Error('Workflow failed');
  await page.locator('.workflow-image [data-enlarge]').click();
  if(!await page.locator('.lightbox').evaluate(e=>e.open))throw Error('Lightbox failed');
  await page.keyboard.press('Escape');
 }
 await page.locator('[data-enlarge="coffee"]').click();
 await page.locator('#lightbox-image').evaluate(async e=>{await e.decode()});
 await page.screenshot({animations:'disabled',path:`docs/evidence/craft-story/craft-${width}-lightbox.png`});
 await page.locator('.lightbox-close').click();
 await page.locator('.engineering-details summary').nth(1).click();
 const detailsOpen=await page.locator('.engineering-details details').nth(1).getAttribute('open')!==null;
 await page.locator('[data-play-film]').click();
 await page.waitForFunction(() => document.querySelector('video').currentTime > 0.2);
 const video=await page.locator('video').evaluate(v=>({readyState:v.readyState,error:v.error?.message,duration:v.duration,paused:v.paused,currentTime:v.currentTime}));
 await page.locator('[data-film-toggle]').click();
 if (!await page.locator('video').evaluate(v => v.paused)) throw Error('Pause control failed');
 await page.locator('[data-film-mute]').click();
 if (!await page.locator('video').evaluate(v => v.muted)) throw Error('Mute control failed');
 await page.locator('[data-film-mute]').click();
 if (await page.locator('video').evaluate(v => v.muted)) throw Error('Unmute control failed');
 await page.locator('.film-seek').fill('8');
 await page.locator('.film-seek').dispatchEvent('input');
 await page.waitForFunction(() => Math.abs(document.querySelector('video').currentTime - 8) < 0.3);
 await page.locator('[data-open-film]').click();
 if (!await page.locator('#film-dialog').evaluate(d => d.open)) throw Error('Video popup failed');
 if (await page.locator('#film-dialog video').count() !== 1) throw Error('Popup must use the same player');
 if (Math.abs(await page.locator('video').evaluate(v => v.currentTime) - 8) > 0.3) throw Error('Popup reset playback');
 await page.locator('[data-film-toggle]').click();
 await page.waitForFunction(() => document.querySelector('video').currentTime > 8.3);
 await page.keyboard.press('Escape');
 await page.waitForFunction(() => !document.querySelector('#film-dialog').open);
 if (!await page.locator('video').evaluate(v => v.paused)) throw Error('Popup close must pause playback');
 if (!await page.locator('[data-open-film]').evaluate(b => b === document.activeElement)) throw Error('Popup focus was not restored');
 await page.locator('[data-open-film]').click();
 await page.locator('.film-dialog-close').click();
 await page.waitForFunction(() => !document.querySelector('#film-dialog').open);
 const playerControls = { pause: true, mute: true, seek: true, popup: true, playbackPreserved: true, escape: true, closeButton: true, focusRestored: true };
 // Visit each section to exercise reveal and document overflow throughout the story.
 for(const section of await page.locator('main > section').all()) { await section.scrollIntoViewIfNeeded(); await page.waitForTimeout(motion==='reduce'?0:180); }
 await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo({top:0,behavior:'instant'}); });
 await page.waitForTimeout(1100);
 await page.screenshot({animations:'disabled',path:`docs/evidence/craft-story/craft-${width}-full.png`,fullPage:true});
 const broken=await page.locator('main img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
 reports.push({width,height,motion,overflow,heroCtaVisible:cta.y+cta.height<=height,initialVideoRequest,detailsOpen,video,playerControls,broken,errors,failures});
 await page.close();
}
const home=await browser.newPage({viewport:{width:1440,height:1000}});
await home.goto(previewOrigin,{waitUntil:'networkidle'});
await home.screenshot({animations:'disabled',path:'docs/evidence/craft-story/home-1440.png'});
const homepage={craftLink:await home.locator('a[href="/work/craft/"]').count(),logisticsLink:await home.locator('a[href="/work/logistics/"]').count(),craftCard:await home.locator('.hero-craft-card').innerText()};
await browser.close();
await writeFile('docs/evidence/craft-story/browser.json',JSON.stringify({reports,homepage},null,2)+'\n');
console.log(JSON.stringify({reports,homepage},null,2));
if(reports.some(r=>r.overflow||!r.heroCtaVisible||r.initialVideoRequest||r.broken.length||r.errors.length||r.failures.length||!r.video.readyState||r.video.error))process.exit(1);
