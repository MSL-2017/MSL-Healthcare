import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3040";
const origin = new URL(base).origin;
const cookieName = "msl_cookie_consent";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--disable-gpu"],
});

async function open(page, route) {
  const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 45000 });
  assert.equal(response.status(), 200);
}

async function checkStorage(context, page, decision) {
  const all = await context.cookies();
  assert.deepEqual(all.map(cookie => cookie.name), decision ? [cookieName] : []);
  if (decision) {
    const [cookie] = all;
    const record = JSON.parse(decodeURIComponent(cookie.value));
    assert.equal(record.version, 1);
    assert.equal(record.decision, decision);
    assert.ok(Number.isInteger(record.timestamp) && Math.abs(Date.now() - record.timestamp) < 120_000);
    assert.ok(Math.abs(cookie.expires - record.timestamp / 1000 - 180 * 86400) < 3);
    assert.equal(cookie.path, "/");
    assert.equal(cookie.sameSite, "Lax");
    if (origin.startsWith("https:")) assert.equal(cookie.secure, true);
  }
  const other = await page.evaluate(async () => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    databases: await indexedDB.databases(),
    caches: await caches.keys(),
  }));
  assert.deepEqual(other, { local: [], session: [], databases: [], caches: [] });
}

try {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__cookieLayoutShift = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cookieLayoutShift += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  const external = new Set();
  const errors = [];
  context.on("request", request => {
    const url = new URL(request.url());
    if (url.origin !== origin || /\/(?:_vercel\/(?:insights|speed-insights)|collect|track|pixel)(?:\/|$)/.test(url.pathname)) {
      external.add(url.origin + url.pathname);
    }
  });
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (/hydration|did not match/i.test(message.text())) errors.push(message.text()); });
  await open(page, "/candidate-compliance");
  const banner = page.getByRole("region", { name: "Your privacy matters" });
  const panel = page.getByRole("dialog", { name: "Cookie preferences" });
  const footerSettings = page.locator("footer").getByRole("link", { name: "Cookie settings" });
  await banner.waitFor();
  assert.ok(await page.evaluate(() => window.__cookieLayoutShift < .1));
  assert.equal(await banner.getByRole("link", { name: "Cookie Policy" }).getAttribute("href"), "/cookie-policy");
  await checkStorage(context, page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await checkStorage(context, page);

  for (const width of [1440, 1024, 941, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width > 700 ? 900 : 568 });
    const [accept, reject, bounds] = await Promise.all([
      banner.getByRole("button", { name: "Accept all" }).boundingBox(),
      banner.getByRole("button", { name: "Reject all" }).boundingBox(),
      banner.boundingBox(),
    ]);
    assert.ok(Math.abs(accept.width - reject.width) < 1 && Math.abs(accept.height - reject.height) < 1);
    assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    assert.equal(await banner.evaluate(node => getComputedStyle(node).animationName), "none");
  }

  const manage = banner.getByRole("button", { name: "Manage cookie preferences" });
  await manage.focus();
  await page.keyboard.press("Enter");
  await panel.waitFor();
  assert.equal(await panel.getByRole("heading", { level: 3 }).count(), 1);
  assert.equal(await panel.getByRole("checkbox").count(), 0);
  for (let step = 0; step < 3; step++) {
    await page.keyboard.press("Tab");
    assert.ok(await panel.evaluate(el => el.contains(document.activeElement)));
  }
  await page.keyboard.press("Escape");
  await panel.waitFor({ state: "hidden" });
  assert.ok(await manage.evaluate(el => el === document.activeElement));
  await checkStorage(context, page);

  await banner.getByRole("link", { name: "Cookie Policy" }).click();
  await page.waitForURL("**/cookie-policy");
  await banner.waitFor();
  await page.getByRole("heading", { name: "Strictly necessary storage" }).waitFor();
  await checkStorage(context, page);
  await banner.getByRole("button", { name: "Accept all" }).click();
  await banner.waitFor({ state: "hidden" });
  await checkStorage(context, page, "accept-all");

  const saved = await context.storageState();
  const returning = await browser.newContext({ storageState: saved });
  const returnPage = await returning.newPage();
  await open(returnPage, "/about");
  await returnPage.locator("footer").getByRole("link", { name: "Cookie settings" }).click();
  await returnPage.getByRole("dialog", { name: "Cookie preferences" }).waitFor();
  assert.equal(await returnPage.getByRole("region", { name: "Your privacy matters" }).count(), 0);
  await checkStorage(returning, returnPage, "accept-all");
  await returning.close();

  await footerSettings.click();
  await panel.waitFor();
  await panel.getByRole("button", { name: "Reject all" }).click();
  await panel.waitFor({ state: "hidden" });
  assert.ok(await footerSettings.evaluate(el => el === document.activeElement));
  await checkStorage(context, page, "reject-all");

  await footerSettings.click();
  await panel.waitFor();
  await panel.getByRole("button", { name: "Save preferences" }).click();
  await panel.waitFor({ state: "hidden" });
  await checkStorage(context, page, "save-preferences");

  await context.clearCookies();
  await open(page, "/");
  await banner.getByRole("button", { name: "Reject all" }).click();
  await checkStorage(context, page, "reject-all");
  await open(page, "/contact");
  await footerSettings.click();
  await panel.waitFor();
  assert.equal(await banner.count(), 0);
  await panel.getByRole("button", { name: "Close" }).click();

  for (const value of [
    "invalid",
    encodeURIComponent(JSON.stringify({ version: 0, timestamp: Date.now(), decision: "accept-all" })),
    encodeURIComponent(JSON.stringify({ version: 1, timestamp: Date.now() - 181 * 86400_000, decision: "accept-all" })),
  ]) {
    await context.clearCookies();
    await context.addCookies([{ name: cookieName, value, url: origin }]);
    await open(page, "/for-candidates");
    await banner.waitFor();
  }
  assert.deepEqual([...external], []);
  assert.deepEqual(errors, []);
  console.log("PASS: fresh and returning visits, accept/reject/save, storage, expiry/version, keyboard, responsive layout and network isolation.");
} finally {
  await browser.close();
}
