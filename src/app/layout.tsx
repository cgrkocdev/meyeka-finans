import type { Metadata } from "next";
import "./globals.css";
import {AuthProvider} from "@/components/auth-provider";

export const metadata: Metadata = { title:"Meyeka Finans", description:"Şirket finans yönetim paneli" };
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="tr"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
