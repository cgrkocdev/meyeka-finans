import { chromium } from "playwright";
import assert from "node:assert/strict";

const baseURL=process.env.BASE_URL??"http://localhost:3000";
const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});
const context=await browser.newContext({acceptDownloads:true});
const page=await context.newPage();
const errors=[];
page.on("console",msg=>{if(msg.type()==="error")errors.push(msg.text())});
page.on("pageerror",err=>errors.push(err.message));

async function open(path){const response=await page.goto(baseURL+path,{waitUntil:"domcontentloaded",timeout:30000});assert.equal(response?.status(),200,`${path} HTTP 200 olmalı`)}
async function addRecord(path,button,name,amount){await open(path);await page.getByRole("button",{name:button}).click();const form=page.locator("form").last();assert.equal(await form.evaluate(f=>f.checkValidity()),false,"Boş form geçersiz olmalı");await form.locator('[name="name"]').fill(name);await form.locator('[name="amount"]').fill(String(amount));await form.locator('[name="detail"]').fill("Test kategorisi");await form.locator('[name="status"]').selectOption({label:"Ödendi"});await form.getByRole("button",{name:"Kaydet"}).click();await page.getByText(name,{exact:true}).waitFor();await page.getByPlaceholder("Kayıtlarda ara...").fill(name);assert.equal(await page.getByText(name,{exact:true}).count(),1);await page.getByPlaceholder("Kayıtlarda ara...").fill("");await page.locator("select").first().selectOption({label:"Ödendi"});const download=page.waitForEvent("download");await page.getByRole("button",{name:"Dışa aktar"}).click();assert.ok((await download).suggestedFilename().endsWith(".csv"));await page.getByTitle("Sil").first().click();assert.equal(await page.getByText(name,{exact:true}).count(),0)}

await open("/giris");await page.locator('[name="username"]').fill("yanlis");await page.locator('[name="password"]').fill("0000");await page.getByRole("button",{name:"Giriş yap"}).click();await page.getByText("Kullanıcı adı veya şifre hatalı.").waitFor();await page.locator('[name="username"]').fill("meyeka");await page.locator('[name="password"]').fill("7472");await page.getByRole("button",{name:"Giriş yap"}).click();await page.waitForURL(baseURL+"/");

await addRecord("/gelirler","Gelir ekle","E2E gelir",12500);
await addRecord("/giderler","Gider ekle","E2E gider",4500);
await addRecord("/odemeler","Ödeme planla","E2E ödeme",3200);
await addRecord("/abonelikler","Abonelik ekle","E2E abonelik",700);

for(const [path,button] of [["/personel","Personel ekle"],["/takvim","Etkinlik ekle"]]){await open(path);await page.getByRole("button",{name:button}).click();const form=page.locator("form").last();await form.locator('[name="title"]').fill("E2E genel kayıt");await form.getByRole("button",{name:"Kaydet"}).click();await page.getByText("Kayıt oluşturuldu").waitFor()}

await open("/raporlar");for(const name of ["PDF indir","Excel indir"]){const download=page.waitForEvent("download");await page.getByRole("button",{name}).click();assert.ok((await download).suggestedFilename().startsWith("meyeka-finans-raporu"))}
await open("/bildirimler");await page.getByText("Bildiriminiz yok").waitFor();
await open("/ayarlar");const settings=page.locator("form");await settings.locator('[name="current"]').fill("7472");await settings.locator('[name="next"]').fill("7472");await settings.locator('[name="confirm"]').fill("7472");await settings.getByRole("button",{name:"Şifreyi güncelle"}).click();await page.getByText("Şifreniz başarıyla değiştirildi.").waitFor();
await open("/yardim");await page.getByAltText("Yardım merkezi").waitFor();await page.getByText("HUDUTSUZDUR").waitFor();

const routes=["/","/gelirler","/giderler","/odemeler","/takvim","/personel","/abonelikler","/raporlar","/kategoriler","/bildirimler","/ayarlar","/yardim"];
for(const route of routes)await open(route);
assert.deepEqual(errors,[],`Tarayıcı hataları: ${errors.join(" | ")}`);
console.log(JSON.stringify({result:"BAŞARILI",routes:routes.length,forms:8,downloads:6,consoleErrors:errors.length},null,2));
await browser.close();
