import {chromium} from "playwright-core";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import {verifyScroll, verifyMobileMenu} from "./scroll.mjs";

const base=process.env.PREVIEW_URL || "http://127.0.0.1:3016";
const executablePath=process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const browser=await chromium.launch({executablePath,headless:true,args:["--disable-gpu"]});
const output=path.resolve(process.env.QA_OUTPUT || "qa/output");
await fs.mkdir(output,{recursive:true});
try {
 const context=await browser.newContext();
 const sitemap=await (await context.request.get(base+"/sitemap.xml")).text();
 const routes=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>new URL(match[1]).pathname);
 assert.equal(routes.length,16);
 const errors=new Set(), localLinks=new Set(),visited=new Set();
 await context.addInitScript(()=>{window.__layoutShift=0;new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__layoutShift+=entry.value}).observe({type:"layout-shift",buffered:true})});
 const page=await context.newPage();
 page.on("pageerror",e=>errors.add(String(e)));
 page.on("console",m=>{if(m.type()==="error")errors.add(m.text())});
 for(const width of [1440,1024,768,430,390,375,320]){
   await page.setViewportSize({width,height:900});
   for(const route of routes){
     const response=await page.goto(base+route);
     assert.equal(response.status(),200,route);
     await page.locator("main h1").waitFor();
     assert.equal(await page.locator("main h1").count(),1,route);
     assert.ok(await page.locator('link[rel="canonical"]').count(),route+" canonical");
     await page.evaluate(async()=>{for(const image of document.images){image.loading="eager"}await Promise.all(Array.from(document.images,image=>image.decode()))});
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
     assert.ok(overflow<=1,route+" overflow at "+width+": "+overflow);
     assert.ok(await page.evaluate(()=>window.__layoutShift)<0.1,route+" layout shift at "+width);
     assert.ok(await page.locator(".brand").evaluateAll(imgs=>imgs.length===2 && imgs.every(img=>Math.abs(img.width/img.height-320/115)<.06)),route+" logo");
     const hrefs=await page.locator("a[href]").evaluateAll(nodes=>nodes.map(el=>el.getAttribute("href")));
     for(const href of hrefs){
       assert.ok(href && href!=="#" && !/^https?:\/\/(www\.)?mslhealthcare\.co\.uk/i.test(href),route+" invalid link "+href);
       if(href.startsWith("#"))assert.equal(await page.locator(href).count(),1,route+" missing anchor "+href);
       if(href.startsWith("/"))localLinks.add(href.split(/[?#]/)[0]);
     }
     if(process.env.QA_ALL_SCREENSHOTS || route==="/" || route==="/register"&&width===390){
       await page.waitForTimeout(900);
       await page.screenshot({path:path.join(output,(route==="/"?"home":route.slice(1))+"-"+width+".png")});
     }
     visited.add(route); console.log(width,route,"OK");
   }
 }
 for(const [legacy,newPath] of [["/Candidates","/for-candidates"],["/clients","/for-clients"],["/about-us","/about"],["/send-cv","/register"],["/compliance","/candidate-compliance"]]){const r=await context.request.get(base+legacy,{maxRedirects:0});assert.equal(r.status(),308);assert.equal(new URL(r.headers().location,base).pathname,newPath)}
 for(const href of localLinks){if(!visited.has(href))assert.equal((await context.request.get(base+href)).status(),200,href)}
 await page.goto(base+"/candidate-compliance");
 assert.equal(await page.getByRole("link",{name:/^Open .* PDF$/}).count(),10);
 await page.getByRole("navigation",{name:"Resource categories"}).getByRole("link",{name:"During assignments"}).click();
 await page.waitForURL("**#assignment-resources");
 await page.goto(base+"/for-candidates");
 await page.getByRole("link",{name:"See the referral scheme"}).click();
 await page.waitForURL("**/recommend-a-friend");
 await page.goto(base);await page.locator(".smallNav > summary").click();
 await page.locator(".mobileGroup > summary").last().click();
 await page.locator(".smallNav").getByRole("link",{name:"Request staff",exact:true}).click();
 await page.waitForURL("**/request-staff");assert.equal(await page.locator(".smallNav").getAttribute("open"),null);
 await page.goto(base+"/healthcare-jobs");await page.getByLabel("Your nursing specialty").selectOption("A&E");await page.getByRole("button",{name:"Continue to registration"}).click();await page.waitForURL("**/register?**");assert.equal(await page.getByLabel("Specialism").inputValue(),"A&E");
 await page.setViewportSize({width:320,height:520});
 for(const route of ["/register","/contact","/request-staff","/recommend-a-friend"]){
   await page.goto(base+route);const form=page.locator("form");
   const prepare=form.getByRole("button",{name:"Prepare email draft"});
   await prepare.click();
   assert.ok(await form.locator(":invalid").count()>0);
   await form.getByLabel("Full name").focus();
   assert.ok(await form.evaluate(element => element.getBoundingClientRect().right <= innerWidth));
   await form.getByLabel("Full name").fill("QA Example");await form.getByLabel("Email address").fill("qa@example.com");
   if(route==="/request-staff")await form.getByLabel("Organisation").fill("Example organisation");
   await form.locator('textarea[name="Message"]').fill("  ");await form.getByRole("checkbox").check();await prepare.click();
   assert.equal(await form.locator('textarea[name="Message"]').evaluate(field=>field.validationMessage),"Enter a brief message.");
   await form.locator('textarea[name="Message"]').fill("Local test only");await prepare.click();
   const draft=form.getByRole("link",{name:"Open email draft"});await draft.waitFor();
   assert.match(await draft.getAttribute("href"),/^mailto:info@mslhealthcare.co.uk\?/);
   await form.locator('textarea[name="Message"]').fill("Edited");assert.equal(await draft.count(),0);
 }
 await page.setViewportSize({width:1440,height:900});await page.goto(base);
 await page.locator(".largeNav summary").first().focus();await page.keyboard.press("Enter");await page.locator(".dropdown a").first().waitFor();await page.keyboard.press("Escape");
 await page.evaluate(()=>{window.__reveals=0;const animate=Element.prototype.animate;Element.prototype.animate=function(...args){window.__reveals++;return animate.apply(this,args)}});
 await page.locator(".serviceGallery").scrollIntoViewIfNeeded();await page.waitForTimeout(600);assert.ok(await page.evaluate(()=>window.__reveals)>0);
 await page.emulateMedia({reducedMotion:"reduce"});await page.goto(base);await page.locator(".serviceGallery").scrollIntoViewIfNeeded();
 assert.equal(await page.evaluate(()=>document.getAnimations().filter(a=>a.playState==="running").length),0);
 await page.emulateMedia({reducedMotion:"no-preference"});
 await verifyScroll(page, base);
 const mobile = await browser.newContext({ viewport:{width:320,height:568}, isMobile:true, hasTouch:true });
 await verifyMobileMenu(await mobile.newPage(), base, routes, output);
 await mobile.close();
 assert.deepEqual([...errors],[]);
 console.log("PASS",routes.length,"routes at seven viewports; local destinations, media, forms, menus, motion and browser errors checked.");
} finally {await browser.close()}
