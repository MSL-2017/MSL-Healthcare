import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const base = process.env.PREVIEW_URL || "http://localhost:3028";
const executablePath = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const output = process.env.QA_OUTPUT;
const browser = await chromium.launch({ executablePath, args: ["--disable-gpu"] });

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const sitemap = await page.request.get(base + "/sitemap.xml");
  assert.ok(sitemap.ok());
  const routes = Array.from((await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g),
    ([, location]) => new URL(location).pathname);
  assert.ok(routes.length > 1);

  const partners = page.getByRole("region", { name: "Our Partners & Affiliations" });
  const track = partners.locator(".partnersTrack");
  const sourceLogos = partners.locator(".partnersSequence:not([aria-hidden]) img");
  const expectedLogos = ["rec-member.jpg", "nhs-wales.png", "nhs-workforce-alliance.png", "healthtrust-europe.jpg"];
  const expectedCredits = [
    ["Siri Sandela", "https://www.linkedin.com/in/siri-sandela/"],
    ["Outlier Synapse", "https://www.outliersynapse.com/"],
  ];

  for (const route of routes) {
    assert.equal((await page.goto(base + route, { waitUntil: "domcontentloaded" })).status(), 200, route);
    assert.equal(await partners.count(), 1, route);
    assert.equal(await sourceLogos.count(), expectedLogos.length, route);
    assert.equal(await page.locator('img[src*="neuven-consult"], img[alt*="Neuven"]').count(), 0, route);
    assert.deepEqual(await track.locator("img").evaluateAll(images => images.map(image => {
      const url = new URL(image.src);
      return (url.searchParams.get("url") ?? url.pathname).split("/").at(-1);
    })), [...expectedLogos, ...expectedLogos], route);
    const credits = page.locator("footer .footerCredits");
    assert.equal(await credits.innerText(), "Designed and developed by Siri Sandela & Outlier Synapse", route);
    for (const [name, url] of expectedCredits) {
      const link = credits.getByRole("link", { name });
      assert.equal(await link.getAttribute("href"), url, route);
      assert.equal(await link.getAttribute("target"), "_blank", route);
      assert.equal(await link.getAttribute("rel"), "noopener noreferrer", route);
    }
    assert.equal(await partners.locator("button").count(), 0, route);
    assert.equal(await partners.evaluate((element, home) => {
      const next = element.nextElementSibling;
      return home && next?.classList.contains("credentials") ? next.nextElementSibling?.tagName : next?.tagName;
    }, route === "/"), "FOOTER", route);
  }
  console.log(`Four partner logos and both footer credits verified on all ${routes.length} routes.`);

  if (output) await fs.mkdir(output, { recursive: true });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await partners.scrollIntoViewIfNeeded();
    await sourceLogos.evaluateAll(async images => {
      for (const image of images) image.loading = "eager";
      await Promise.all(images.map(image => image.decode()));
    });
    assert.equal(await partners.getByRole("img").count(), expectedLogos.length);
    assert.equal(await partners.locator('[aria-hidden="true"] a, [aria-hidden="true"] button, [aria-hidden="true"] [tabindex]').count(), 0);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));

    const seam = await track.evaluate(async element => {
      const [animation] = element.getAnimations();
      const [first, duplicate] = element.querySelectorAll("ul");
      const duration = animation.effect.getComputedTiming().duration;
      animation.pause();
      await animation.ready;
      animation.currentTime = 0;
      const bounds = [...first.children, duplicate.firstElementChild].map(item => item.getBoundingClientRect());
      const gaps = bounds.slice(1).map((item, index) => item.left - bounds[index].right);
      const start = bounds.slice(0, -1).map(item => item.left);
      animation.currentTime = duration - .01;
      const end = Array.from(duplicate.children, item => item.getBoundingClientRect().left);
      const coversViewport = first.getBoundingClientRect().width >= element.parentElement.getBoundingClientRect().width - .05;
      animation.currentTime = 0;
      animation.play();
      return {
        duration,
        coversViewport,
        maxGap: Math.max(...end.map((value, index) => Math.abs(value - start[index]))),
        gapVariation: Math.max(...gaps) - Math.min(...gaps),
      };
    });
    assert.equal(seam.duration, 30_000);
    assert.ok(seam.coversViewport && seam.maxGap < .1 && seam.gapVariation < .1, JSON.stringify(seam));

    const playback = () => track.evaluate(element => getComputedStyle(element).animationPlayState);
    await partners.hover();
    assert.equal(await playback(), "paused");
    await page.mouse.move(0, 0);
    assert.equal(await playback(), "running");
    const x = () => track.evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
    const start = await x();
    await page.waitForFunction(position =>
      new DOMMatrixReadOnly(getComputedStyle(document.querySelector(".partnersTrack")).transform).m41 < position, start);

    if (output) await partners.screenshot({ path: path.join(output, `partners-${width}.png`) });
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await track.evaluate(element => element.getAnimations().length), 0);
    assert.equal(await partners.getByRole("button").count(), 0);
    assert.ok(await sourceLogos.evaluateAll(images => images.every(image => {
      const { left, right, height } = image.getBoundingClientRect();
      return left >= 0 && right <= innerWidth && height > 0;
    })));
    if (output && width === 390) {
      await partners.screenshot({ path: path.join(output, "partners-reduced-motion-390.png") });
    }
    await page.emulateMedia({ reducedMotion: "no-preference" });
    console.log(`${width}px verified: four original logos, no buttons, seamless right-to-left loop, hover pause and static reduced motion.`);
  }
} finally {
  await browser.close();
}
