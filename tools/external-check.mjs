import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = process.env.SITE_URL || 'http://127.0.0.1:4173';
const output = process.env.EVIDENCE_DIR || 'artifacts/external';
await mkdir(output,{recursive:true});
const browser = await chromium.launch({channel:'msedge'});
const results = [];
try {
 for (const method of ['pointer','keyboard']) {
  const page = await browser.newPage();
  await page.goto(base);
  const link = page.locator('.studio-small-link');
  assert.equal(await link.getAttribute('href'),'https://ismailstudio.my/');
  if(method==='pointer') await link.click();
  else {await link.focus(); await page.keyboard.press('Enter');}
  await page.waitForURL('https://www.ismailstudio.my/');
  await page.locator('body').waitFor({state:'visible'});
  assert.match(await page.title(),/ISMAIL/i);
  results.push({method,placement:'studio',href:'https://ismailstudio.my/',final:page.url(),title:await page.title()});
  await page.screenshot({path:`${output}/portfolio-${method}.png`});
  await page.close();
 }
 const page = await browser.newPage();
 await page.goto(base);
 const footerLink = page.locator('.footer-credit a');
 assert.equal(await footerLink.getAttribute('href'),'https://ismailstudio.my/');
 const popupPromise = page.waitForEvent('popup');
 await footerLink.click();
 const popup = await popupPromise;
 await popup.waitForURL('https://www.ismailstudio.my/');
 assert.match(await popup.title(),/ISMAIL/i);
 results.push({method:'pointer',placement:'footer',final:popup.url(),openerProtected:await popup.evaluate(()=>window.opener===null)});
 assert(results.at(-1).openerProtected);
 await popup.close(); await page.close();
 const contactPage = await browser.newPage();
 await contactPage.goto(base);
 await contactPage.locator('.studio-cta').focus();
 await contactPage.keyboard.press('Enter');
 await contactPage.waitForURL('https://www.ismailstudio.my/#contact');
 assert(await contactPage.locator('#contact').isVisible());
 results.push({method:'keyboard',placement:'enquiry',final:contactPage.url(),contactSection:true});
 await contactPage.close();
 await writeFile(`${output}/results.json`,JSON.stringify({base,checkedAt:new Date().toISOString(),results},null,2));
 console.log('PASS: exact ISMAIL links navigate to the real portfolio by pointer and keyboard; footer new tab is protected');
}finally{await browser.close();}
