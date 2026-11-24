import assert from "node:assert/strict";
import path from "node:path";

const journeys = [
  { source: "/", menu: 0, links: [["Candidate services", "/for-candidates"], ["Healthcare jobs", "/healthcare-jobs"]] },
  { source: "/for-candidates", menu: 0, links: [["Register", "/register"], ["Candidate compliance", "/candidate-compliance"], ["Recommend a friend", "/recommend-a-friend"]] },
  { source: "/", menu: 1, links: [["Client services", "/for-clients"]] },
  { source: "/for-clients", menu: 1, links: [["Staffing solutions", "/staffing-solutions"], ["Healthcare specialisms", "/healthcare-specialisms"], ["Request staff", "/request-staff"]] },
];

async function waitForScroll(page, position) {
  await page.waitForFunction(y => Math.abs(window.scrollY - y) <= 1, position);
}

async function assertHeadingVisible(page) {
  const heading = await page.locator("main h1").boundingBox();
  const header = await page.locator(".mast").boundingBox();
  assert.ok(heading && header && heading.y >= header.y + header.height,
    "Destination heading must start beneath the sticky header");
}

export async function verifyScroll(page, base) {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const { source, menu, links } of journeys) {
      for (const [label, destination] of links) {
        for (const halfway of [false, true]) {
          await page.goto(base + source);
          const position = await page.evaluate(half => {
            const y = half ? Math.round((document.documentElement.scrollHeight - innerHeight) / 2) : 0;
            window.scrollTo(0, y);
            return y;
          }, halfway);
          await waitForScroll(page, position);
          const details = width === 1440 ? page.locator(".largeNav details").nth(menu) : page.locator(".smallNav");
          await details.locator(":scope > summary").click();
          if (width < 940) {
            const group = details.locator(".mobileGroup").nth(menu);
            assert.equal(await group.getAttribute("open"), null);
            await group.locator("summary").click();
            assert.equal(page.url(), base + source, "Expanding a submenu must stay on the source page");
            assert.equal(await group.getAttribute("open"), "");
          }
          const link = details.getByRole("link", { name: label, exact: true });
          assert.equal(await link.getAttribute("href"), destination, label);
          await link.click();
          await page.waitForURL(base + destination);
          await waitForScroll(page, 0);
          await page.locator("main h1").waitFor();
          await assertHeadingVisible(page);
          assert.equal(await page.evaluate(() => scrollY), 0, destination + " settled scroll");
        }
      }
    }
    console.log(width, "all nine audience menu links start at the top from both source positions");
  }

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base + "/for-candidates");
  await page.locator(".mast").evaluate(header => header.dataset.qaPersistent = "true");
  const referralLink = page.getByRole("link", { name: "See the referral scheme" });
  await referralLink.evaluate(link => {
    link.addEventListener("click", () => {
      window.__qaSourceScroll = window.scrollY;
    }, { once: true });
  });
  await referralLink.click();
  await page.waitForURL(base + "/recommend-a-friend");
  const candidateScroll = await page.evaluate(() => window.__qaSourceScroll);
  assert.ok(candidateScroll > 0);
  await waitForScroll(page, 0);
  assert.equal(await page.locator(".mast").getAttribute("data-qa-persistent"), "true");
  const hero = page.locator(".route-page > :first-child");
  assert.equal(await hero.evaluate(element => getComputedStyle(element).animationName), "route-enter");
  await page.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(await hero.evaluate(element => getComputedStyle(element).animationName), "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("link", { name: "Ask about a referral" }).click();
  await page.waitForURL("**#referral-enquiry");
  const anchorScroll = await page.evaluate(() => scrollY);
  assert.ok(anchorScroll > 0);
  const anchor = await page.locator("#referral-enquiry").boundingBox();
  const header = await page.locator(".mast").boundingBox();
  assert.ok(anchor && header && anchor.y >= header.y + header.height);
  await page.goBack();
  await waitForScroll(page, 0);
  await page.goBack();
  await page.waitForURL(base + "/for-candidates");
  await waitForScroll(page, candidateScroll);
  await page.goForward();
  await page.waitForURL(base + "/recommend-a-friend");
  await waitForScroll(page, 0);
  await page.goForward();
  await page.waitForURL("**#referral-enquiry");
  await waitForScroll(page, anchorScroll);
  console.log("CTA, anchor offset, and Back/Forward scroll restoration verified");
}

export async function verifyStickyClearance(page, base) {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + "/candidate-compliance");
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue("--mast-clearance"));
    await page.evaluate(() => { document.documentElement.style.fontSize = "24px"; });
    await page.waitForFunction(() =>
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) >=
      document.querySelector(".mast").getBoundingClientRect().height + 11);
    await page.getByRole("link", { name: "View company policies" }).click();
    await page.waitForURL("**#company-policies");
    const anchor = await page.locator("#company-policies").boundingBox();
    const header = await page.locator(".mast").boundingBox();
    assert.ok(anchor && header && anchor.y >= header.y + header.height, `Expanded navbar overlaps anchor at ${width}px`);

    await page.goto(base);
    await page.waitForFunction(() => document.documentElement.style.getPropertyValue("--mast-clearance"));
    await page.keyboard.press("Tab");
    const cta = page.locator(".audiences").getByRole("link", { name: "Register with MSL" });
    await cta.evaluate(element => {
      window.scrollTo(0, window.scrollY + element.getBoundingClientRect().top - 38);
    });
    const obscured = await cta.boundingBox();
    assert.ok(obscured && obscured.y < (await page.locator(".mast").boundingBox()).height);
    await cta.evaluate(element => element.focus({ preventScroll: true }));
    await cta.evaluate(element => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const revealed = await cta.boundingBox();
    assert.ok(revealed && revealed.y >= (await page.locator(".mast").boundingBox()).height, `Keyboard focus obstructed at ${width}px`);
    console.log(`${width}px verified: enlarged navbar clears anchor targets and keyboard-focused controls.`);
  }
}

export async function verifyMobileMenu(page, base, routes, output) {
  const menu = page.locator(".smallNav");
  const toggle = menu.locator(":scope > summary");
  const panel = menu.getByRole("navigation", { name: "Mobile" });
  const candidates = panel.getByText("For candidates", { exact: true });
  const clients = panel.getByText("For clients", { exact: true });
  await page.goto(base);
  const quickApply = page.locator(".mast .quick");
  assert.equal(await quickApply.evaluate(link => {
    const range = document.createRange();
    range.selectNodeContents(link);
    return range.getClientRects().length;
  }), 1, "Quick apply should stay on one line at 320px");
  await toggle.tap();
  const [hitArea, bounds] = await Promise.all([toggle.boundingBox(), panel.boundingBox()]);
  assert.ok(hitArea && hitArea.height >= 44 && hitArea.width >= 44);
  assert.ok(bounds && bounds.x >= 0 && bounds.x + bounds.width <= 320 && bounds.y + bounds.height <= 568);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY), "hidden");
  await candidates.tap();
  assert.equal(await candidates.locator("..").getAttribute("open"), "");
  if (output) await page.screenshot({ path: path.join(output, "menu-320.png"), animations: "disabled" });
  await candidates.tap();
  assert.equal(await candidates.locator("..").getAttribute("open"), null);
  await clients.tap();
  assert.equal(await clients.locator("..").getAttribute("open"), "");
  assert.equal(page.url(), base + "/");
  await panel.getByRole("link", { name: "Staffing solutions" }).tap();
  await page.waitForURL(base + "/staffing-solutions");
  assert.equal(await menu.getAttribute("open"), null);
  assert.notEqual(await page.evaluate(() => getComputedStyle(document.documentElement).overflowY), "hidden");

  for (const route of routes) {
    for (const halfway of [false, true]) {
      await page.goto(base + route);
      if (halfway) await page.evaluate(() => window.scrollTo(0, (document.documentElement.scrollHeight - innerHeight) / 2));
      await toggle.tap();
      const destination = route === "/" ? "/contact" : "/";
      await panel.getByRole("link", { name: route === "/" ? "Contact" : "Home", exact: true }).tap();
      await page.waitForURL(base + destination);
      await waitForScroll(page, 0);
      await assertHeadingVisible(page);
      assert.equal(await menu.getAttribute("open"), null);
    }
  }
  console.log("320px touch menu, tap targets, scroll lock, and navigation from every page verified");
}
