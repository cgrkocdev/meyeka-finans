export const money=(n:number)=>new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0}).format(n);
export const compact=(n:number)=>new Intl.NumberFormat("tr-TR",{notation:"compact",maximumFractionDigits:1}).format(n);
