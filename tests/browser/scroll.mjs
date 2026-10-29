// Run against the local dev server; PLAYWRIGHT_MODULE can point to an installed Playwright module.
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

async function run(page, label) {
  await page.goto(process.env.TEST_BASE_URL || 'http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => {
    const markers = document.querySelectorAll('[data-projects-snap]');
    return markers.length > 0 && (markers.length === 1 || markers[markers.length - 1].offsetTop > 0);
  });
  await page.evaluate(() => document.fonts.ready);
  const read = () => page.evaluate(() => {
    const root = document.querySelector('[data-scroll-root]');
    const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const offset = root.scrollTop - root.getBoundingClientRect().top;
    const section = document.querySelector('#projects');
    const before = section.previousElementSibling.getBoundingClientRect();
    return {
      top: root.scrollTop,
      targets: Array.from(section.querySelectorAll('[data-projects-snap]')).map(el => offset + el.getBoundingClientRect().top - padding),
      after: offset + section.nextElementSibling.getBoundingClientRect().top - padding,
      before: Math.max(0, offset + before.top - padding),
      stickyTop: section.querySelector('[data-projects-sticky]').getBoundingClientRect().top - root.getBoundingClientRect().top,
      padding,
    };
  });
  const near = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 2, `${label}: ${message}: ${actual} vs ${expected}`);
  const place = async top => {
    await page.evaluate(top => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      document.querySelector('[data-scroll-root]').scrollTop = top;
    }, top);
    await page.waitForTimeout(750);
  };
  const wait = () => page.waitForTimeout(950);
  const wheel = async amount => { await page.mouse.wheel(0, amount); };
  const metrics = await read();
  const first = metrics.targets[0];
  const last = metrics.targets.at(-1);
  await page.mouse.move(Math.min(1000, page.viewportSize().width - 25), 400);

  for (const [start, amount] of [[100, 80], [first - 200, 8], [first, -8], [last, 8]]) {
    await place(start); await wheel(amount); await wait();
    near((await read()).top, start + amount, 'ordinary scrolling outside Projects stays native');
  }
  console.log('PASS', label, 'ordinary vertical scrolling outside Projects');

  await place(first); await wheel(8); await page.waitForTimeout(65);
  const previewTop = (await read()).top;
  assert.ok(previewTop > first && previewTop <= first + 9, 'small wheel must interpolate within its requested distance');
  await wait(); near((await read()).top, first, 'small wheel does not commit a chapter');
  await wheel((metrics.targets[1] - first) * 0.39); await wait();
  near((await read()).top, first, 'below 40 percent returns to the current card');
  await wheel((metrics.targets[1] - first) * 0.41); await wait();
  near((await read()).top, metrics.targets[1], 'above 40 percent advances one chapter');
  console.log('PASS', label, 'proportional small input / 40 percent threshold');

  // A strong burst cannot skip the adjacent chapter while its transition runs.
  for (const [start, direction, expected] of [
    [first, 1, metrics.targets[1]],
    [metrics.targets[1], 1, metrics.targets[2]],
    [metrics.targets[2], 1, last],
    [last, -1, metrics.targets[2]],
    [metrics.targets[2], -1, metrics.targets[1]],
    [metrics.targets[1], -1, first],
  ]) {
    await place(start);
    for (let index = 0; index < 3; index++) {
      await wheel(direction * (index < 5 ? 6000 : 600 / (index - 3)));
      await page.waitForTimeout(20);
    }
    await wait(); near((await read()).top, expected, 'one burst stops at the immediate chapter including both ends');
    console.log('PASS', label, 'one chapter including entry / exit', start, '->', expected);
  }

  if (label !== 'reduced motion') {
    for (const [start, direction] of [[first, 1], [first, -1], [last, 1]]) {
      await place(start); await wheel(direction * 8); await page.waitForTimeout(150);
      await wheel(-direction * 8); await wait();
      near((await read()).top, start, 'opposite wheel reverses chapter / boundary animation');
    }
    console.log('PASS', label, 'direction reversal including both boundaries');
  }

  await place(first); await page.mouse.wheel(120, 0); await wait();
  near((await read()).top, first, 'small horizontal trackpad input also returns to the current card');
  console.log('PASS', label, 'horizontal trackpad compatibility');

  return { read, place, near };
}

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) });
  try {
    const mode = process.env.SCROLL_BROWSER_MODE;
    if (!mode || mode === 'desktop') {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      const desktop = await run(page, 'desktop');
      let state = await desktop.read();
      await desktop.place(state.targets[0]);
      const heading = await page.locator('#projects h2').boundingBox();
      const dragX = Math.min(1200, heading.x + heading.width - 15);
      await page.mouse.move(dragX, heading.y + heading.height / 2);
      await page.mouse.down();
      await page.mouse.move(dragX - 700, heading.y + heading.height / 2, { steps: 12 });
      await page.mouse.up(); await page.waitForTimeout(950);
      desktop.near((await desktop.read()).top, state.targets[1], 'real mouse drag commits one card');
      console.log('PASS desktop real mouse drag');
      await desktop.place(state.targets[0]);
      await page.mouse.move(dragX, heading.y + heading.height / 2);
      await page.mouse.wheel(0, 100); await page.waitForTimeout(65);
      await page.mouse.click(dragX, heading.y + heading.height / 2);
      await page.waitForTimeout(900);
      desktop.near((await desktop.read()).top, state.targets[0], 'plain click cannot strand partial wheel input');
      console.log('PASS desktop click during wheel movement');

      await desktop.place(state.targets[0]);
      await page.locator('[data-scroll-root]').focus();
      await page.keyboard.press('PageDown'); await page.waitForTimeout(1300);
      desktop.near((await desktop.read()).top, state.targets[1], 'PageDown aligns next card');
      await page.keyboard.press('PageUp'); await page.waitForTimeout(1300);
      desktop.near((await desktop.read()).top, state.targets[0], 'PageUp aligns previous card');
      console.log('PASS desktop keyboard');

      // Exercise the navigation action independently of the menu's hover animations.
      const navigation = page.locator('nav[aria-label="페이지 섹션 내비게이션"]');
      await navigation.locator('button').filter({ hasText: 'Skills' }).evaluate(button => button.click());
      await page.waitForTimeout(1000);
      desktop.near((await desktop.read()).top, state.after, 'navigation reaches Skills');
      await navigation.locator('button').filter({ hasText: 'Projects' }).evaluate(button => button.click());
      await page.waitForTimeout(1000);
      desktop.near((await desktop.read()).top, state.targets[0], 'navigation reaches first project');
      console.log('PASS desktop section navigation');

      await desktop.place(state.targets[1]);
      await page.setViewportSize({ width: 1024, height: 700 });
      await page.waitForTimeout(1000);
      state = await desktop.read(); desktop.near(state.top, state.targets[1], 'resize preserves current card');
      desktop.near(state.stickyTop, state.padding, 'resize preserves header alignment');
      console.log('PASS desktop resize');
      await page.close();
    }

    if (!mode || mode === 'mobile') {
      const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      const mobileChecks = await run(mobile, 'mobile viewport');
      const mobileState = await mobileChecks.read();
      const touch = await mobile.context().newCDPSession(mobile);
      for (const [index, fromY, toY, expected] of [[0, 650, 350, 0], [0, 700, 150, 1], [1, 150, 700, 0]]) {
        await mobileChecks.place(mobileState.targets[index]);
        await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 200, y: fromY }] });
        for (let part = 1; part <= 10; part++) {
          await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: fromY + (toY - fromY) * part / 10 }] });
          await mobile.waitForTimeout(35);
        }
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await mobile.waitForTimeout(1800);
        mobileChecks.near((await mobileChecks.read()).top, mobileState.targets[expected], 'native touch swipe settles its nearest card');
      }
      console.log('PASS mobile native touch swipes both directions');
      await mobile.close();
    }

    if (!mode || mode === 'reduced') {
      const reduced = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
      await run(reduced, 'reduced motion');
      await reduced.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
