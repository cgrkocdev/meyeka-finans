export async function GET(){
 try{
  const response=await fetch("https://www.tcmb.gov.tr/kurlar/today.xml",{next:{revalidate:3600}});
  if(!response.ok)throw new Error(`TCMB yanıtı: ${response.status}`);
  const xml=await response.text();
  const usdBlock=xml.match(/<Currency[^>]+CurrencyCode="USD"[\s\S]*?<\/Currency>/)?.[0];
  const rate=Number(usdBlock?.match(/<ForexSelling>([^<]+)<\/ForexSelling>/)?.[1]);
  const sourceDate=xml.match(/<Tarih_Date[^>]+Date="([^"]+)"/)?.[1],date=sourceDate?(()=>{const [month,day,year]=sourceDate.split("/");return `${day}.${month}.${year}`})():undefined;
  if(!Number.isFinite(rate)||rate<=0)throw new Error("USD satış kuru bulunamadı.");
  return Response.json({currency:"USD",rate,date,source:"TCMB Döviz Satış"});
 }catch(error){
  return Response.json({error:error instanceof Error?error.message:"Kur alınamadı."},{status:503});
 }
}
