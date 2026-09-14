import {PrismaClient,Role} from "@prisma/client";import bcrypt from "bcryptjs";
const prisma=new PrismaClient();
async function main(){const company=await prisma.company.upsert({where:{id:"meyeka-company"},update:{name:"Meyeka"},create:{id:"meyeka-company",name:"Meyeka",currency:"TRY"}});const passwordHash=await bcrypt.hash("7472",12);await prisma.user.upsert({where:{email:"admin@meyeka.com"},update:{name:"Muhammed Yasir KALKAN",passwordHash},create:{name:"Muhammed Yasir KALKAN",email:"admin@meyeka.com",passwordHash,role:Role.ADMIN,companyId:company.id}});await prisma.setting.upsert({where:{companyId:company.id},update:{},create:{companyId:company.id}})}
main().finally(()=>prisma.$disconnect());
