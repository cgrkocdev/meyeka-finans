"use client";

import Link from "next/link";
import {useEffect,useMemo,useState} from "react";
import {ArrowDownLeft,ArrowUpRight,ChevronRight,Ellipsis,TrendingDown,TrendingUp,WalletCards} from "lucide-react";
import {Shell} from "./shell";
import {CashChart,CategoryChart} from "./charts";
import {NotificationList} from "./notification-center";
import {money} from "@/lib/format";
import type {Row} from "./table-page";

type Period="month"|"quarter"|"year";
const monthNames=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
const colors=["#f5c400","#282828","#4f7cff","#18a66a","#ef7d42","#8b5cf6"];
function read(key:string){try{return JSON.parse(localStorage.getItem(key)??"[]") as Row[]}catch{return []}}
function rowDate(value:string){const [day,month,year]=value.split(".").map(Number);return day&&month&&year?new Date(year,month-1,day):new Date(value)}

export function Dashboard(){
 const [period,setPeriod]=useState<Period>("month");
 const [income,setIncome]=useState<Row[]>([]),[expense,setExpense]=useState<Row[]>([]);
 useEffect(()=>{const load=()=>{setIncome(read("meyeka-gelirler"));setExpense(read("meyeka-giderler"))};load();window.addEventListener("storage",load);window.addEventListener("focus",load);return()=>{window.removeEventListener("storage",load);window.removeEventListener("focus",load)}},[]);
 const now=new Date();
 const inPeriod=(row:Row)=>{const date=rowDate(row.date);if(Number.isNaN(date.getTime())||date.getFullYear()!==now.getFullYear())return false;if(period==="year")return true;if(period==="quarter")return Math.floor(date.getMonth()/3)===Math.floor(now.getMonth()/3);return date.getMonth()===now.getMonth()};
 const filteredIncome=income.filter(inPeriod),filteredExpense=expense.filter(inPeriod);
 const incomeTotal=filteredIncome.reduce((sum,row)=>sum+Number(row.amount),0),expenseTotal=filteredExpense.reduce((sum,row)=>sum+Number(row.amount),0),balance=incomeTotal-expenseTotal;
 const stats=[{label:"Toplam bakiye",value:balance,up:balance>=0,icon:WalletCards},{label:"Bu dönem gelir",value:incomeTotal,up:true,icon:ArrowDownLeft},{label:"Bu dönem gider",value:expenseTotal,up:false,icon:ArrowUpRight},{label:"Net nakit akışı",value:balance,up:balance>=0,icon:TrendingUp}];
 const monthly=useMemo(()=>Array.from({length:6},(_,offset)=>{const date=new Date(now.getFullYear(),now.getMonth()-5+offset,1);const sum=(rows:Row[])=>rows.filter(row=>{const d=rowDate(row.date);return d.getFullYear()===date.getFullYear()&&d.getMonth()===date.getMonth()}).reduce((total,row)=>total+Number(row.amount),0);return{ay:monthNames[date.getMonth()],gelir:sum(income),gider:sum(expense)}}),[income,expense]);
 const categories=useMemo(()=>Object.entries(filteredExpense.reduce<Record<string,number>>((acc,row)=>{const key=row.detail||"Diğer";acc[key]=(acc[key]??0)+Number(row.amount);return acc},{})).map(([name,value],index)=>({name,value,color:colors[index%colors.length]})),[filteredExpense]);
 const transactions=[...income.map(row=>({...row,type:"in" as const})),...expense.map(row=>({...row,type:"out" as const}))].sort((a,b)=>rowDate(b.date).getTime()-rowDate(a.date).getTime()).slice(0,5);
 return <Shell title="Günaydın, Muhammed 👋" subtitle={new Intl.DateTimeFormat("tr-TR",{dateStyle:"long"}).format(now)}><div className="mx-auto max-w-[1500px] enter">
  <section className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end"><div><h2 className="text-2xl font-bold tracking-[-.035em] md:text-[28px]">Finansal durumunuz</h2><p className="mt-1 text-sm text-[#777772]">Girdiğiniz gelir ve giderlerin güncel özeti.</p></div><div className="flex items-center gap-1 rounded-xl border border-[#e5e3de] bg-white p-1.5 text-xs">{[["month","Bu ay"],["quarter","Bu çeyrek"],["year","Bu yıl"]].map(([key,label])=><button key={key} onClick={()=>setPeriod(key as Period)} className={`rounded-lg px-3 py-2 font-semibold ${period===key?"bg-[#171717] text-white":"text-[#73736f] hover:bg-[#f4f3ef]"}`}>{label}</button>)}</div></section>
  <section className="card mb-4 border-l-4 border-l-[#f5c400] p-5"><NotificationList/></section>
  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(({label,value,up,icon:Icon},i)=><article key={label} className="card p-5" style={{animationDelay:`${i*50}ms`}}><div className="flex items-center justify-between"><span className="text-[13px] font-medium text-[#797974]">{label}</span><div className="grid size-9 place-items-center rounded-xl bg-[#f5f5f2]"><Icon size={18}/></div></div><div className="mt-4 flex items-end justify-between gap-2"><b className="number text-[27px]">{money(value)}</b><span className={`mb-1 ${up?"text-[#15945e]":"text-[#d84b47]"}`}>{up?<TrendingUp size={15}/>:<TrendingDown size={15}/>}</span></div><p className="mt-1 text-[11px] text-[#aaa9a4]">Seçili dönem</p></article>)}</section>
  <section className="mt-4 grid gap-4 xl:grid-cols-[1.55fr_1fr]"><article className="card p-5 md:p-6"><div><h3 className="font-bold">Gelir / gider analizi</h3><p className="mt-1 text-xs text-[#8b8b86]">Son 6 aylık finansal hareket</p></div><div className="mt-3"><CashChart data={monthly}/></div></article><article className="card p-5 md:p-6"><div className="flex justify-between"><div><h3 className="font-bold">Gider dağılımı</h3><p className="mt-1 text-xs text-[#8b8b86]">Seçili dönem</p></div><Link href="/raporlar" aria-label="Raporları aç" className="rounded-lg p-1 hover:bg-[#f4f3ef]"><Ellipsis size={20}/></Link></div><CategoryChart data={categories}/></article></section>
  <section className="mt-4 card overflow-hidden"><div className="flex items-center justify-between border-b border-[#eeece8] p-5"><div><h3 className="font-bold">Son işlemler</h3><p className="mt-1 text-xs text-[#8b8b86]">En güncel gelir ve giderler</p></div><Link href="/gelirler" className="flex items-center text-xs font-semibold">Tümünü gör <ChevronRight size={15}/></Link></div>{transactions.length?<div>{transactions.map(row=><div key={row.id} className="flex items-center gap-3 border-b border-[#f0efeb] px-5 py-3.5 last:border-0"><div className={`grid size-9 place-items-center rounded-xl ${row.type==="in"?"bg-[#eaf8f0] text-[#15945e]":"bg-[#fff0ee] text-[#dc514c]"}`}>{row.type==="in"?<ArrowDownLeft size={18}/>:<ArrowUpRight size={18}/>}</div><div><div className="text-sm font-semibold">{row.name}</div><div className="mt-0.5 text-[11px] text-[#8c8c87]">{row.detail} · {row.date}</div></div><div className={`number ml-auto text-sm font-bold ${row.type==="in"?"text-[#15945e]":"text-[#dc514c]"}`}>{row.type==="in"?"+":"−"}{money(row.amount)}</div></div>)}</div>:<div className="py-12 text-center text-sm text-[#999]">Henüz gelir veya gider kaydı bulunmuyor.</div>}</section>
 </div></Shell>
}
