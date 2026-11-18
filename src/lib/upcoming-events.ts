export type UpcomingEventKind="receivable"|"expense"|"payment"|"subscription"|"card-statement"|"card-due";
export type UpcomingEvent={id:string;title:string;message:string;date:Date;dateText:string;daysLeft:number;kind:UpcomingEventKind;amount?:number;owner?:string};

type StoredRow={id?:string;name?:string;title?:string;detail?:string;category?:string;description?:string;date?:string;renewal?:string;amount?:number;usedLimit?:number;status?:string;bank?:string;owner?:string;lastFour?:string;statementDay?:number;dueDay?:number;paymentMethod?:"cash"|"installment";installmentAmount?:number;paidAmount?:number};
const DAY=86_400_000;
const closedStatuses=new Set(["Tahsil edildi","Ödendi","İptal"]);

function read(storage:Storage,key:string){try{return JSON.parse(storage.getItem(key)??"[]") as StoredRow[]}catch{return[]}}
function parseDate(value?:string){if(!value)return null;const [day,month,year]=value.split(".").map(Number);if(!day||!month||!year)return null;const date=new Date(year,month-1,day,12);return date.getFullYear()===year&&date.getMonth()===month-1&&date.getDate()===day?date:null}
function recurringDate(day:number,now:Date){
 const create=(year:number,month:number)=>new Date(year,month,Math.min(day,new Date(year,month+1,0).getDate()),12);
 const current=create(now.getFullYear(),now.getMonth());return current.getTime()>=start(now).getTime()?current:create(now.getMonth()===11?now.getFullYear()+1:now.getFullYear(),(now.getMonth()+1)%12);
}
function start(date:Date){return new Date(date.getFullYear(),date.getMonth(),date.getDate(),12)}
function format(date:Date){return new Intl.DateTimeFormat("tr-TR",{day:"2-digit",month:"long",weekday:"short"}).format(date)}

export function collectUpcomingEvents(storage:Storage,now=new Date(),windowDays=7){
 const today=start(now),events:UpcomingEvent[]=[];
 function add(source:string,row:StoredRow,date:Date|null,kind:UpcomingEventKind,title:string,message:string,amount?:number){
  if(!date)return;const daysLeft=Math.round((start(date).getTime()-today.getTime())/DAY);if(daysLeft<0||daysLeft>windowDays)return;
  events.push({id:`${source}-${row.id??title}-${date.toISOString().slice(0,10)}`,title,message,date,dateText:format(date),daysLeft,kind,amount});
 }
 for(const row of read(storage,"meyeka-gelirler")){if(!closedStatuses.has(row.status??""))add("alacak",row,parseDate(row.date),"receivable",row.name??"Alacak",`${row.category??row.detail??"Alacak"} tahsilatı bekleniyor.`,row.amount)}
 for(const row of read(storage,"meyeka-giderler")){if(closedStatuses.has(row.status??""))continue;if(row.paymentMethod==="installment"&&row.statementDay&&(row.paidAmount??0)<(row.amount??0))add("taksit",row,recurringDate(row.statementDay,now),"expense",`${row.name??"Taksit"} Ödemesi`,`${row.category??row.detail??"Taksitli gider"} için yeni taksit kesim tarihi yaklaşıyor.`,row.installmentAmount);else add("gider",row,parseDate(row.date),"expense",row.name??"Gider",`${row.category??row.detail??"Gider"} ödemesi yaklaşıyor.`,row.amount)}
 for(const row of read(storage,"meyeka-ödemeler")){if(!closedStatuses.has(row.status??""))add("odeme",row,parseDate(row.date),"payment",row.name??row.title??"Ödeme",`${row.category??row.detail??"Planlanan ödeme"} vadesi yaklaşıyor.`,row.amount)}
 for(const row of read(storage,"meyeka-abonelikler")){if(row.status!=="İptal")add("abonelik",row,parseDate(row.date??row.renewal),"subscription",row.name??"Abonelik Yenilemesi",`${row.category??row.detail??"Abonelik"} yenileme tarihi yaklaşıyor.`,row.amount)}
 for(const row of read(storage,"meyeka-kredi-kartlari")){
  const card=`${row.bank??"Kredi Kartı"} •••• ${row.lastFour??""}`,owner=row.owner?` · ${row.owner}`:"";
  if(row.statementDay)add("kart-ekstre",row,recurringDate(row.statementDay,now),"card-statement",`${card} Ekstre Kesimi`,`Hesap kesim tarihi yaklaşıyor${owner}.`);
  if(row.dueDay)add("kart-odeme",row,recurringDate(row.dueDay,now),"card-due",`${card} Son Ödeme`,`Kart borcunun son ödeme tarihi yaklaşıyor${owner}.`,row.usedLimit);
 }
 return events.sort((a,b)=>a.date.getTime()-b.date.getTime()||a.title.localeCompare(b.title,"tr"));
}
