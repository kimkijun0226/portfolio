// Run against the local server with the same Playwright environment variables as scroll.mjs.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(process.env.TEST_BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('[data-projects-snap]')[3]?.offsetTop > 0);
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(() => {
    const root = document.querySelector('[data-scroll-root]');
    const offset = root.scrollTop - root.getBoundingClientRect().top - parseFloat(getComputedStyle(root).scrollPaddingTop);
    const section = document.querySelector('#projects');
    return {
      targets: [...root.querySelectorAll('[data-projects-snap]')].map(marker => offset + marker.getBoundingClientRect().top),
      before: Math.max(0, offset + section.previousElementSibling.getBoundingClientRect().top),
      after: offset + section.nextElementSibling.getBoundingClientRect().top,
    };
  });
  const { targets } = metrics;
  await page.mouse.move(1000, 400);
  for (let repeat = 0; repeat < 2; repeat++) {
    for (const [start, delta, stops] of [
      [targets[0], 80, targets],
      [targets[3], -80, [...targets].reverse()],
    ]) {
      await page.evaluate(top => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
        const root = document.querySelector('[data-scroll-root]');
        root.scrollTop = top;
        window.__boundaryTrace = [top];
        window.__recordBoundary = true;
        const sample = () => {
          window.__boundaryTrace.push(root.scrollTop);
          if (window.__recordBoundary) requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
      }, start);
      for (let index = 0; index < 100; index++) {
        await page.mouse.wheel(0, delta);
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(700);
      const { top, trace } = await page.evaluate(() => {
        window.__recordBoundary = false;
        return { top: document.querySelector('[data-scroll-root]').scrollTop, trace: window.__boundaryTrace };
      });
      const destination = stops.at(-1);
      assert.ok(Math.sign(delta) * (top - destination) > 20, `continuous wheel failed to exit Projects at ${destination}: ${top}`);
      for (const target of stops) {
        assert.ok(trace.some(value => Math.abs(value - target) < 2), `must visit adjacent chapter ${target}`);
      }
      console.log('PASS continuous vertical wheel visits all 4 chapters and exits without stopping', repeat + 1, delta > 0 ? 'down' : 'up');
    }
  }
} finally { await browser.close(); }
