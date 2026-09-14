"use client";
import {Bell,Check,ChevronRight,X} from "lucide-react";
import {useEffect,useState} from "react";
import {createPortal} from "react-dom";

export const notificationItems:NotificationItem[]=[];
type NotificationItem={id:number;title:string;message:string;time:string;label:string;color:string;bg:string;Icon:typeof Bell};

const STORAGE_KEY="meyeka-read-notification-ids";
function readStoredIds(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)??"[]") as number[]}catch{return[]}}
export function useNotifications(){
 const [readIds,setReadIds]=useState<number[]>([]);
 useEffect(()=>{const sync=()=>setReadIds(readStoredIds());sync();window.addEventListener("meyeka-notifications",sync);return()=>window.removeEventListener("meyeka-notifications",sync)},[]);
 function markRead(id:number){const next=[...new Set([...readStoredIds(),id])];localStorage.setItem(STORAGE_KEY,JSON.stringify(next));setReadIds(next);window.dispatchEvent(new Event("meyeka-notifications"))}
 const unreadCount=notificationItems.filter(item=>!readIds.includes(item.id)).length;
 return{readIds,unreadCount,markRead};
}

export function NotificationList({compact=false,onNavigate}:{compact?:boolean;onNavigate?:()=>void}){
 const {readIds,unreadCount,markRead}=useNotifications();
 return <div>
  {!compact&&<div className="mb-5 flex items-end justify-between"><div><h2 className="text-lg font-bold tracking-tight">Güncel bildirimler</h2><p className="mt-1 text-xs text-[#888883]">Ödemeler ve finansal hatırlatmalar</p></div><span className="rounded-full bg-[#fff3b4] px-3 py-1 text-xs font-bold text-[#755e00]">{unreadCount} okunmamış</span></div>}
  <div className={compact?"divide-y divide-[#efede8]":"grid gap-3"}>
   {notificationItems.length===0&&<div className="px-5 py-10 text-center"><div className="mx-auto grid size-11 place-items-center rounded-full bg-[#f5f4f0] text-[#8c8b86]"><Bell size={19}/></div><b className="mt-3 block text-sm">Bildiriminiz yok</b><p className="mt-1 text-xs text-[#999]">Yeni bildirimler burada görünecek.</p></div>}
   {notificationItems.map(({id,title,message,time,label,color,bg,Icon})=>{const read=readIds.includes(id);return <article key={id} className={`group relative flex gap-3.5 transition ${compact?"px-5 py-4 hover:bg-[#fafaf7]":"rounded-2xl border border-[#e9e6df] p-4 hover:border-[#d8d4ca] hover:shadow-sm"} ${read?"bg-white":"bg-[#fffef9]"}`}>
    <div className="grid size-10 shrink-0 place-items-center rounded-xl" style={{color,backgroundColor:bg}}><Icon size={19}/></div>
    <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><b className={`text-sm leading-5 ${read?"text-[#686864]":"text-[#171717]"}`}>{title}</b>{!read&&<i className="size-2 shrink-0 rounded-full bg-[#f5c400]"/>}</div><p className="mt-1 text-xs leading-5 text-[#686864]">{message}</p><div className="mt-3 flex flex-wrap items-center gap-2"><span className="rounded-md px-2 py-1 text-[10px] font-semibold" style={{color,backgroundColor:bg}}>{label}</span><span className="mr-auto text-[11px] text-[#aaa9a4]">{time}</span>{read?<span style={{height:30,display:"inline-flex",alignItems:"center",gap:5,borderRadius:8,padding:"0 10px",background:"#eef8f2",color:"#168953",fontSize:12,fontWeight:600,lineHeight:1}}><Check size={13}/> Okundu</span>:<button onClick={()=>markRead(id)} style={{height:30,display:"inline-flex",alignItems:"center",justifyContent:"center",gap:5,borderRadius:8,padding:"0 11px",border:"1px solid #ead476",background:"#fff8d8",color:"#665100",fontFamily:"inherit",fontSize:12,fontWeight:600,lineHeight:1,boxShadow:"none",whiteSpace:"nowrap"}} onMouseEnter={e=>e.currentTarget.style.background="#fff2ad"} onMouseLeave={e=>e.currentTarget.style.background="#fff8d8"}><Check size={13} strokeWidth={2}/> Okundu işaretle</button>}</div></div>
   </article>})}
  </div>
  {compact&&<a href="/bildirimler" onClick={onNavigate} className="flex items-center justify-center gap-1 border-t border-[#ebe9e4] bg-[#fafaf8] px-5 py-3.5 text-xs font-bold hover:bg-[#f5f4f0]">Tüm bildirimleri gör <ChevronRight size={14}/></a>}
 </div>
}

export function NotificationBell(){
 const [open,setOpen]=useState(false);const [mounted,setMounted]=useState(false);const {unreadCount}=useNotifications();
 useEffect(()=>setMounted(true),[]);
 useEffect(()=>{function close(e:KeyboardEvent){if(e.key==="Escape")setOpen(false)}window.addEventListener("keydown",close);return()=>window.removeEventListener("keydown",close)},[]);
 const overlay=open&&mounted?createPortal(<><button aria-label="Bildirim panelini kapat" onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(18,18,16,.08)",border:0}}/><section role="dialog" aria-label="Bildirimler" style={{position:"fixed",right:24,top:76,zIndex:1000,width:"min(410px, calc(100vw - 32px))",maxHeight:"calc(100vh - 96px)",overflow:"hidden",background:"white",border:"1px solid #dedbd3",borderRadius:18,boxShadow:"0 24px 70px rgba(24,24,20,.24)"}}><div className="flex items-center justify-between border-b border-gray-200 px-5 py-4"><div><div className="flex items-center gap-2"><h2 className="text-base font-bold tracking-tight">Bildirimler</h2>{unreadCount>0&&<span className="rounded-full bg-[#f5c400] px-2 py-0.5 text-[10px] font-bold">{unreadCount} yeni</span>}</div><p className="mt-1 text-xs text-gray-500">Finansal hareketlerinizi kaçırmayın</p></div><button onClick={()=>setOpen(false)} className="grid size-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100" aria-label="Kapat"><X size={17}/></button></div><div style={{maxHeight:"calc(100vh - 190px)",overflowY:"auto"}}><NotificationList compact onNavigate={()=>setOpen(false)}/></div></section></>,document.body):null;
 return <div className="relative">
  <button onClick={()=>setOpen(value=>!value)} aria-label={`Bildirimler, ${unreadCount} okunmamış`} aria-expanded={open} className={`relative grid size-10 place-items-center rounded-xl border bg-white transition hover:border-[#c9c5bc] hover:bg-[#fffef9] ${unreadCount?"border-[#dfca67] animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_0_3px_rgba(245,196,0,.13)]":"border-[#e2e0dc]"}`}><Bell size={18}/>{unreadCount>0&&<span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-[#171717] text-[10px] font-bold text-white ring-2 ring-[#f7f7f5]">{unreadCount}</span>}</button>
  {overlay}
 </div>
}
