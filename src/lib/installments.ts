import type {Row} from "@/components/table-page";

function parseDate(value:string){
 const [day,month,year]=value.split(".").map(Number);
 return day&&month&&year?new Date(year,month-1,day):new Date(value);
}

export function dueInstallmentCount(row:Row,now=new Date()){
 if(row.paymentMethod!=="installment"||!row.installmentCount||!row.statementDay)return 0;
 const purchase=parseDate(row.date);
 if(Number.isNaN(purchase.getTime()))return 0;
 let first=new Date(purchase.getFullYear(),purchase.getMonth(),row.statementDay);
 if(first<purchase)first=new Date(purchase.getFullYear(),purchase.getMonth()+1,row.statementDay);
 if(now<first)return 0;
 const months=(now.getFullYear()-first.getFullYear())*12+now.getMonth()-first.getMonth();
 const reachedThisMonth=now.getDate()>=Math.min(row.statementDay,new Date(now.getFullYear(),now.getMonth()+1,0).getDate());
 return Math.min(row.installmentCount,Math.max(0,months+(reachedThisMonth?1:0)));
}

export function recognizedExpense(row:Row,now=new Date()){
 if(row.paymentMethod!=="installment")return Number(row.amount)||0;
 const scheduled=dueInstallmentCount(row,now)*(Number(row.installmentAmount)||0);
 return Math.min(Number(row.amount)||0,Math.max(Number(row.paidAmount)||0,scheduled));
}

export function remainingExpense(row:Row,now=new Date()){
 return Math.max(0,(Number(row.amount)||0)-recognizedExpense(row,now));
}
