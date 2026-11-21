"use client";

import {useEffect,useState} from "react";

type Currency="TRY"|"USD";
type RateResponse={rate:number;date?:string;source:string};
let rateRequest:Promise<RateResponse>|null=null;
function fetchUsdRate(){
 rateRequest??=fetch("/api/exchange-rate").then(async response=>{const data=await response.json();if(!response.ok)throw new Error(data.error??"Kur alınamadı.");return data as RateResponse}).catch(error=>{rateRequest=null;throw error});
 return rateRequest;
}

export function parseTurkishMoney(value:FormDataEntryValue|null){
 const normalized=String(value??"").replace(/\./g,"").replace(",",".");
 return Number(normalized);
}

export function formatTurkishMoneyInput(value:string|number){
 // Metin alanındaki noktalar bu bileşenin eklediği binlik ayırıcılardır.
 // Sayısal varsayılan değerlerdeki nokta ise JavaScript ondalık ayırıcıdır.
 const source=typeof value==="number"?String(value).replace(".",","):value;
 const text=source.replace(/\./g,"").replace(/[^\d,]/g,"");
 const hasDecimal=text.includes(",");
 const [integerPart="",...decimalParts]=text.split(",");
 const integer=(integerPart.replace(/^0+(?=\d)/,"")||"0").replace(/\B(?=(\d{3})+(?!\d))/g,".");
 const decimal=decimalParts.join("").slice(0,2);
 return hasDecimal?`${integer},${decimal}`:integer;
}

const rateFormatter=new Intl.NumberFormat("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:4});
const conversionFormatter=new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",minimumFractionDigits:2,maximumFractionDigits:2});

export function MoneyInput({name,defaultValue,placeholder="0,00",required=false,onValueChange,defaultCurrency="TRY",defaultExchangeRate,defaultExchangeRateDate}:{name:string;defaultValue?:number;className?:string;placeholder?:string;required?:boolean;onValueChange?:(value:number)=>void;defaultCurrency?:Currency;defaultExchangeRate?:number;defaultExchangeRateDate?:string}){
 const [value,setValue]=useState(defaultValue===undefined||defaultValue===0?"":formatTurkishMoneyInput(defaultValue));
 const [currency,setCurrency]=useState<Currency>(defaultCurrency),[rate,setRate]=useState(defaultExchangeRate??0),[rateDate,setRateDate]=useState(defaultExchangeRateDate??""),[loading,setLoading]=useState(false),[error,setError]=useState("");
 const enteredAmount=parseTurkishMoney(value),tlAmount=currency==="USD"?enteredAmount*rate:enteredAmount;
 useEffect(()=>{if(currency!=="USD"||rate>0)return;let active=true;setLoading(true);setError("");fetchUsdRate().then(data=>{if(active){setRate(data.rate);setRateDate(data.date??"")}}).catch(cause=>{if(active)setError(cause instanceof Error?cause.message:"Kur alınamadı.")}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[currency,rate]);
 useEffect(()=>onValueChange?.(Number.isFinite(tlAmount)?tlAmount:0),[tlAmount,onValueChange]);
 return <div className="mt-1.5">
  <div className="flex h-11 overflow-hidden rounded-xl border border-[#dedbd3] bg-white focus-within:border-[#c5a300]"><input name={name} type="text" inputMode="decimal" autoComplete="off" required={required} value={value} className="min-w-0 flex-1 px-3 text-sm outline-none" placeholder={placeholder} onChange={event=>setValue(formatTurkishMoneyInput(event.target.value))}/><div className="m-1 flex shrink-0 rounded-lg bg-[#f1f0ec] p-0.5 text-[11px] font-bold"><button type="button" aria-pressed={currency==="TRY"} onClick={()=>{setCurrency("TRY");setError("")}} className={`rounded-md px-3 ${currency==="TRY"?"bg-white shadow-sm":"text-[#777]"}`}>TL</button><button type="button" aria-pressed={currency==="USD"} onClick={()=>setCurrency("USD")} className={`rounded-md px-3 ${currency==="USD"?"bg-white shadow-sm":"text-[#777]"}`}>$</button></div></div>
  <input type="hidden" name={`${name}Currency`} value={currency}/><input type="hidden" name={`${name}ExchangeRate`} value={rate?String(rate).replace(".",","):""}/><input type="hidden" name={`${name}ExchangeRateDate`} value={rateDate}/>
  {currency==="USD"&&<div className={`mt-2 rounded-xl border px-3 py-2 ${error?"border-red-200 bg-red-50 text-red-600":"border-[#ead476] bg-[#fffdf2]"}`}>{loading?<span className="text-xs text-[#777]">Güncel TCMB kuru alınıyor...</span>:error?<span className="text-xs">{error}</span>:rate>0?<><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-[#6f5900]">TL Karşılığı</span><strong className="text-base text-[#171717]">{conversionFormatter.format(tlAmount)}</strong></div><div className="mt-1 text-[11px] text-[#777]">{formatTurkishMoneyInput(enteredAmount||0)} $ × {rateFormatter.format(rate)} TL{rateDate?` · TCMB ${rateDate}`:""}</div></>:null}</div>}
 </div>;
}
