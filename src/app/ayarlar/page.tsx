import {Shell} from "@/components/shell";import {SecuritySettings} from "@/components/security-settings";
export default function SettingsPage(){return <Shell title="Ayarlar" subtitle="Şirket ve kullanıcı tercihleri"><div className="mx-auto max-w-[1000px] enter"><div className="card p-6"><h2 className="mb-5 text-xl font-bold">Hesap ve güvenlik</h2><SecuritySettings/></div></div></Shell>}
