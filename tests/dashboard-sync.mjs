import {chromium} from "playwright";
import assert from "node:assert/strict";

const baseURL=process.env.BASE_URL??"http://localhost:3000";
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
const page=await browser.newPage();
const errors=[];
page.on("console",message=>{if(message.type()==="error")errors.push(message.text())});
await page.goto(`${baseURL}/giris`,{waitUntil:"domcontentloaded"});
await page.locator('[name="username"]').fill("meyeka");
await page.locator('[name="password"]').fill("7472");
await page.getByRole("button",{name:"Giriş yap"}).click();
await page.waitForURL(`${baseURL}/`);
const date=new Intl.DateTimeFormat("tr-TR").format(new Date());
await page.evaluate(({date})=>{
 localStorage.setItem("meyeka-gelirler",JSON.stringify([{id:"sync-income",name:"Senkron gelir",detail:"Satış",date,amount:12500,status:"Ödendi",type:"in"}]));
 localStorage.setItem("meyeka-giderler",JSON.stringify([{id:"sync-expense",name:"Senkron gider",detail:"Ofis",date,amount:4500,status:"Ödendi",type:"out"}]));
},{date});
await page.reload({waitUntil:"domcontentloaded"});
await page.getByText("Senkron gelir",{exact:true}).waitFor();
await page.getByText("Senkron gider",{exact:true}).waitFor();
const cards=page.locator("section").nth(2);
assert.match(await cards.innerText(),/12[.,]500/);
assert.match(await cards.innerText(),/4[.,]500/);
assert.match(await cards.innerText(),/8[.,]000/);
await page.getByRole("button",{name:"Bu yıl"}).click();
assert.equal(errors.length,0,errors.join(" | "));
console.log(JSON.stringify({result:"BAŞARILI",income:12500,expense:4500,balance:8000,consoleErrors:0},null,2));
await browser.close();
