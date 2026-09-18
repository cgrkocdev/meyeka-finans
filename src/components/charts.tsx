"use client";
import {Area,AreaChart,CartesianGrid,Cell,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import type {CategoryPoint,MonthlyPoint} from "@/lib/data";
import {compact,money} from "@/lib/format";

const EmptyChart=({height}:{height:number})=><div style={{height}} className="grid place-items-center text-sm text-[#999]">Henüz grafik verisi bulunmuyor.</div>;

export function CashChart({data=[]}:{data?:MonthlyPoint[]}){
 if(!data.some(item=>item.gelir||item.gider))return <EmptyChart height={245}/>;
 return <ResponsiveContainer width="100%" height={245}><AreaChart data={data} margin={{left:-18,right:6,top:12}}><defs><linearGradient id="inc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f5c400" stopOpacity=".28"/><stop offset="1" stopColor="#f5c400" stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#eeede9"/><XAxis dataKey="ay" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false} tickFormatter={compact}/><Tooltip formatter={value=>money(Number(value))}/><Area type="monotone" dataKey="gelir" name="Gelir" stroke="#d9aa00" strokeWidth={2.5} fill="url(#inc)"/><Area type="monotone" dataKey="gider" name="Gider" stroke="#282828" strokeWidth={2} fill="transparent"/></AreaChart></ResponsiveContainer>
}

export function CategoryChart({data=[]}:{data?:CategoryPoint[]}){
 if(!data.length)return <EmptyChart height={190}/>;
 const total=data.reduce((sum,item)=>sum+item.value,0);
 return <div className="flex items-center gap-3"><div className="relative h-[190px] w-1/2"><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" innerRadius={54} outerRadius={78}>{data.map(item=><Cell key={item.name} fill={item.color}/>)}</Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center"><b className="number text-sm">{money(total)}</b></div></div><div className="flex-1 space-y-3">{data.map(item=><div key={item.name} className="flex items-center text-xs"><i className="mr-2 size-2.5 rounded-full" style={{background:item.color}}/><span className="truncate">{item.name}</span><b className="ml-auto">%{Math.round(item.value/total*100)}</b></div>)}</div></div>
}
