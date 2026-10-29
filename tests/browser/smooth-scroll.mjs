import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.TEST_BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('[data-projects-snap]')[3]?.offsetTop > 0);
  await page.evaluate(() => document.fonts.ready);
  const targets = await page.evaluate(() => {
    const root = document.querySelector('[data-scroll-root]');
    const offset = root.scrollTop - root.getBoundingClientRect().top - parseFloat(getComputedStyle(root).scrollPaddingTop);
    return [...root.querySelectorAll('[data-projects-snap]')].map(marker => offset + marker.getBoundingClientRect().top);
  });
  assert.equal(await page.locator('[data-scroll-root]').evaluate(root => root.classList.contains('lenis')), true);
  const intervals = [];
  let maxTrackError = 0;
  await page.mouse.move(1000, 400);
  for (const [from, wheel, destination] of [
    [targets[0] - 160, 240, targets[0]],
    [targets[0], 6000, targets[1]],
    [targets[1], -6000, targets[0]],
  ]) {
    await page.evaluate(top => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      document.querySelector('[data-scroll-root]').scrollTop = top;
    }, from);
    await page.waitForTimeout(1000);
    await page.evaluate(targets => {
      const root = document.querySelector('[data-scroll-root]');
      const track = document.querySelector('#projects .will-change-transform');
      const width = track.parentElement.clientWidth;
      window.__smoothTrace = [];
      window.__sampleSmooth = true;
      const sample = time => {
        const top = root.scrollTop;
        const x = parseFloat(track.style.transform.slice('translate3d('.length));
        const progress = Math.max(0, Math.min(targets.at(-1) - targets[0], top - targets[0]));
        const expected = -progress / (targets[1] - targets[0]) * width;
        window.__smoothTrace.push({ time, top, error: Math.abs(x - expected) });
        if (window.__sampleSmooth) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    }, targets);
    await page.mouse.wheel(0, wheel);
    await page.waitForTimeout(1400);
    const trace = await page.evaluate(() => { window.__sampleSmooth = false; return window.__smoothTrace; });
    assert.ok(trace.length > 10);
    assert.ok(Math.abs(trace.at(-1).top - destination) < 2, 'must settle on the immediate target');
    const direction = Math.sign(destination - from);
    for (let index = 1; index < trace.length; index++) {
      const step = (trace[index].top - trace[index - 1].top) * direction;
      assert.ok(step >= -1, 'entry and chapter animation must not move backwards');
      assert.ok(step < (targets[1] - targets[0]) * 0.5, 'animation must not jump a chapter in one frame');
      intervals.push(trace[index].time - trace[index - 1].time);
      maxTrackError = Math.max(maxTrackError, trace[index].error);
    }
    console.log('PASS Lenis interpolation / monotonic entry / same-frame track', from, '->', destination);
  }
  assert.ok(maxTrackError < 2, `track lags behind scrolling: ${maxTrackError}px`);
  assert.deepEqual(errors, []);
  intervals.sort((a, b) => a - b);
  console.log(JSON.stringify({ frameIntervalP95Ms: intervals[Math.floor(intervals.length * 0.95)], maxTrackErrorPx: maxTrackError, runtimeErrors: errors.length }));
} finally { await browser.close(); }
