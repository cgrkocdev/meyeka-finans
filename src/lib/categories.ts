export type CategoryKind="income"|"expense";
export type FinanceCategory={id:string;name:string;kind:CategoryKind;color:string};

export const defaultCategories:FinanceCategory[]=[
 {id:"income-sales",name:"Satış Gelirleri",kind:"income",color:"#18a66a"},
 {id:"income-services",name:"Hizmet Gelirleri",kind:"income",color:"#4f7cff"},
 {id:"income-other",name:"Diğer Gelirler",kind:"income",color:"#8b5cf6"},
 {id:"expense-personnel",name:"Personel",kind:"expense",color:"#ef7d42"},
 {id:"expense-rent",name:"Kira ve Ofis",kind:"expense",color:"#f5c400"},
 {id:"expense-tax",name:"Vergi ve Resmî Ödemeler",kind:"expense",color:"#dc514c"},
 {id:"expense-software",name:"Yazılım ve Abonelikler",kind:"expense",color:"#4f7cff"},
 {id:"expense-marketing",name:"Pazarlama",kind:"expense",color:"#8b5cf6"},
 {id:"expense-other",name:"Diğer Giderler",kind:"expense",color:"#282828"}
];

export const categoryStorageKey="meyeka-kategoriler";
export function readCategories(){
 try{const stored=localStorage.getItem(categoryStorageKey);return stored?JSON.parse(stored) as FinanceCategory[]:defaultCategories}catch{return defaultCategories}
}
