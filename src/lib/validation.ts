import {z} from "zod";
export const transactionSchema=z.object({title:z.string().trim().min(2).max(120),amount:z.coerce.number().positive(),type:z.enum(["INCOME","EXPENSE"]),transactionDate:z.coerce.date(),dueDate:z.coerce.date().optional(),categoryId:z.string().cuid().optional(),description:z.string().max(1000).optional()});
