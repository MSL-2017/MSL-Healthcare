import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3025";
const executablePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser = await chromium.launch({ executablePath, args: ["--disable-gpu"] });
const output = process.env.QA_OUTPUT;

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto(base);

  const hero = page.locator(".heroSlides");
  const slidePaths = await hero.locator("img").evaluateAll(nodes =>
    nodes.map(node => new URL(node.src).searchParams.get("url")));
  assert.deepEqual(slidePaths, ["/uk-hospital-tour.webp", "/uk-nursing-discussion.webp", "/uk-clinical-assessment.webp"]);
  const current = () => hero.locator('[data-active="true"]');
  const currentImage = () => current().getAttribute("src");
  const nextImage = previous => page.waitForFunction(src =>
    document.querySelector('.heroSlide[data-active="true"]')?.getAttribute("src") !== src, previous);
  assert.equal(await hero.locator("img").count(), 3);
  assert.equal(await page.locator(".heroCarousel button").count(), 0);
  await page.locator(".heroGrid").evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)));
  const bounds = await hero.boundingBox();
  const images = [await currentImage()];
  const times = [];
  for (let step = 0; step < 3; step++) {
    await nextImage(images.at(-1));
    images.push(await currentImage());
    times.push(await page.evaluate(() => performance.now()));
    assert.deepEqual(await hero.boundingBox(), bounds);
  }
  assert.equal(new Set(images.slice(0, 3)).size, 3);
  assert.equal(images[3], images[0]);
  assert.ok(times.slice(1).every((time, index) => Math.abs(time - times[index] - 2000) < 200));
  assert.equal(await current().evaluate(img => getComputedStyle(img).transitionDuration), "0.6s");

  await hero.hover();
  await page.waitForTimeout(2200);
  assert.equal(await currentImage(), images[0]);
  await page.mouse.move(0, 0);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(2200);
  assert.equal(await currentImage(), images[0]);
  await page.evaluate(() => {
    delete document.hidden;
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await nextImage(images[0]);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.waitForTimeout(2200);
  assert.equal(await currentImage(), images[0]);

  const photos = page.locator(".heroSlides img, .audiences img, .staffingSequence:not([aria-hidden]) img");
  const sources = await photos.evaluateAll(nodes => nodes.map(node => {
    const url = new URL(node.src);
    return url.searchParams.get("url") || url.pathname;
  }));
  assert.equal(sources.length, 10);
  assert.equal(new Set(sources).size, 10);

  if (output) await fs.mkdir(output, { recursive: true });
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    const overlaps = await page.evaluate(() =>
      document.querySelector("h1").getBoundingClientRect().top <=
      document.querySelector(".mast .bar").getBoundingClientRect().bottom);
    assert.equal(overlaps, false);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.equal(await page.locator(".homeHero").getByText(/Photos: Anthony Clingerman/).count(), 0);
    assert.ok(await page.locator(".finalCTA + .homePhotoCredit").isVisible());
    assert.equal(await page.locator('img[src*="neuven-consult"], img[alt*="Neuven"]').count(), 0);
    assert.equal(await page.locator("footer .footerLogo img").count(), 1);
    const heading = page.locator(".homeHero h1");
    assert.equal(await heading.textContent(), "Healthcare staffing, built around people.");
    if (width >= 1024) {
      const lines = await heading.evaluate(element =>
        Math.round(element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight)));
      assert.equal(lines, 2, `Desktop hero must use two lines at ${width}px`);
    }

    const measurements = await page.locator(".audiences article, .audiences .cardPhoto, .audiences .under, .staffingSequence:not([aria-hidden]) .cardPhoto")
      .evaluateAll(nodes => nodes.map(node => {
        const { y, width, height } = node.getBoundingClientRect();
        return { y, width, height };
      }));
    for (const [a, b] of [[1, 4], [6, 7], [7, 8]]) {
      assert.ok(Math.abs(measurements[a].height - measurements[b].height) < 1);
      assert.ok(Math.abs(measurements[a].width - measurements[b].width) < 1);
    }
    if (width >= 768) {
      for (const [a, b] of [[0, 3], [1, 4], [2, 5]]) {
        assert.ok(Math.abs(measurements[a].y - measurements[b].y) < 1);
      }
      assert.ok(Math.abs(measurements[0].height - measurements[3].height) < 1);
    }

    if (output) {
      await photos.evaluateAll(async nodes => {
        for (const img of nodes) img.loading = "eager";
        await Promise.all(nodes.map(img => img.decode()));
      });
      await page.screenshot({ path: path.join(output, `updated-${width}.png`) });
      if (width === 1440) {
        await page.locator(".audiences").screenshot({ path: path.join(output, "aligned-audiences.png") });
        await page.locator(".serviceGallery").screenshot({ path: path.join(output, "staffing-gallery.png") });
      }
    }
    console.log(width, "hero, header and image alignment verified");
  }

  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base);
    const gallery = page.locator(".staffingViewport");
    const track = gallery.locator(".staffingTrack");
    await gallery.scrollIntoViewIfNeeded();
    assert.equal(await gallery.getByRole("link").count(), 5);
    assert.equal(await gallery.locator('[aria-hidden="true"] a[tabindex="-1"]').count(), 5);
    const position = () => track.evaluate(element => element.getBoundingClientRect().left);
    const start = await position();
    await page.waitForTimeout(300);
    assert.ok(await position() < start - 2, `Right-to-left motion at ${width}px`);
    const maxGap = await track.evaluate(async element => {
      const [animation] = element.getAnimations();
      const [first, duplicate] = element.children;
      animation.pause();
      await animation.ready;
      animation.currentTime = 0;
      const starts = Array.from(first.children, card => card.getBoundingClientRect().left);
      animation.currentTime = animation.effect.getComputedTiming().duration - .01;
      const ends = Array.from(duplicate.children, card => card.getBoundingClientRect().left);
      animation.currentTime = 0;
      animation.play();
      return Math.max(...starts.map((left, index) => Math.abs(left - ends[index])));
    });
    assert.ok(maxGap < .1, `Loop seam at ${width}px`);
    await gallery.hover();
    assert.equal(await track.evaluate(element => getComputedStyle(element).animationPlayState), "paused");
    await page.getByRole("button", { name: "Pause scrolling" }).focus();
    await page.keyboard.press("Tab");
    assert.equal(await gallery.getAttribute("data-manual"), "true");
    assert.equal(await track.evaluate(element => getComputedStyle(element).animationName), "none");
    await page.getByRole("button", { name: "Resume scrolling" }).click();
    await page.mouse.move(0, 0);
    assert.equal(await track.evaluate(element => getComputedStyle(element).animationPlayState), "running");
  }

  const touchPage = await browser.newPage({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true });
  await touchPage.goto(base);
  const mobileGallery = touchPage.locator(".staffingViewport");
  await mobileGallery.scrollIntoViewIfNeeded();
  const galleryBox = await mobileGallery.boundingBox();
  const session = await touchPage.context().newCDPSession(touchPage);
  const y = Math.round(galleryBox.y + galleryBox.height / 2);
  const x = Math.round(galleryBox.x + galleryBox.width * .8);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await touchPage.waitForFunction(() => document.querySelector(".staffingViewport").dataset.manual === "true");
  const touchStart = await mobileGallery.evaluate(element => element.scrollLeft);
  for (const offset of [30, 70, 110, 150]) {
    await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - offset, y }] });
  }
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await touchPage.waitForFunction(start => document.querySelector(".staffingViewport").scrollLeft > start + 20, touchStart);
  await mobileGallery.getByRole("link").last().tap();
  await touchPage.waitForURL("**/healthcare-specialisms#mental-health-nurses");
  await touchPage.emulateMedia({ reducedMotion: "reduce" });
  await touchPage.goto(base);
  assert.equal(await touchPage.getByRole("button", { name: "Pause scrolling" }).count(), 0);
  assert.equal(await mobileGallery.locator(".staffingTrack").evaluate(element => element.getAnimations().length), 0);
  console.log("Staffing motion, seamless loop, hover and keyboard pause, touch swipe and reduced motion verified");

  for (const device of [page, touchPage]) {
    const touch = device === touchPage;
    if (!touch) await device.setViewportSize({ width: 1440, height: 900 });
    for (const [label, destination, heading] of [
      ["Register with MSL", "/register", "Register with MSL"],
      ["Request staff", "/request-staff", "Request healthcare staff"],
    ]) {
      await device.goto(base);
      const cta = device.locator(".finalCTA").getByRole("link", { name: label, exact: true });
      assert.equal(await cta.getAttribute("href"), destination);
      if (!touch) {
        await cta.hover();
        await cta.focus();
      }
      const colors = await cta.evaluate(element => {
        const { color, backgroundColor } = getComputedStyle(element);
        return { color, backgroundColor };
      });
      assert.notEqual(colors.color, colors.backgroundColor, `${label} must remain visible`);
      if (touch) await cta.tap();
      else await cta.press("Enter");
      await device.waitForURL(base + destination);
      assert.equal(await device.locator("main h1").innerText(), heading);
      assert.ok(await device.locator("main form").isVisible());
    }
  }
  await touchPage.close();
  console.log("Both bottom CTAs verified by keyboard and mobile touch.");
  assert.deepEqual(errors, []);
  console.log("PASS: 3-slide loop, 2s cadence, crossfade, no buttons, no carousel layout shift, hover, visibility, reduced motion and unique photos.");
} finally {
  await browser.close();
}
