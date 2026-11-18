const TURKISH_DATE_PATTERN=/^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$/;

export function todayTurkishDate(date=new Date()){
 return new Intl.DateTimeFormat("tr-TR",{day:"2-digit",month:"2-digit",year:"numeric"}).format(date);
}

export function isValidTurkishDate(value:string){
 const match=TURKISH_DATE_PATTERN.exec(value.trim());
 if(!match)return false;
 const day=Number(match[1]),month=Number(match[2]),year=Number(match[3]);
 const date=new Date(year,month-1,day);
 return date.getFullYear()===year&&date.getMonth()===month-1&&date.getDate()===day;
}

export const turkishDatePattern="(0[1-9]|[12][0-9]|3[01])\\.(0[1-9]|1[0-2])\\.[0-9]{4}";
