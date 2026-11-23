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

  const photos = page.locator(".heroSlides img, .audiences img, .serviceGallery img");
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
    assert.equal(await page.locator(".credentials").count(), 1);
    assert.ok(await page.locator(".partners + .credentials + footer").count());
    const heading = page.locator(".homeHero h1");
    assert.equal(await heading.textContent(), "Healthcare staffing, built around people.");
    if (width >= 1024) {
      const lines = await heading.evaluate(element =>
        Math.round(element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight)));
      assert.equal(lines, 2, `Desktop hero must use two lines at ${width}px`);
    }

    const measurements = await page.locator(".audiences article, .audiences .cardPhoto, .audiences .under, .serviceGallery .cardPhoto")
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

  const touchPage = await browser.newPage({ viewport: { width: 390, height: 900 }, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
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
