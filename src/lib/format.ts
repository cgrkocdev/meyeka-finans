export const money=(n:number)=>new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",minimumFractionDigits:0,maximumFractionDigits:2}).format(n);
export const compact=(n:number)=>new Intl.NumberFormat("tr-TR",{notation:"compact",maximumFractionDigits:1}).format(n);
