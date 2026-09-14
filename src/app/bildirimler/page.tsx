import {Shell} from "@/components/shell";import {NotificationList} from "@/components/notification-center";
export default function NotificationsPage(){return <Shell title="Bildirimler" subtitle="Finansal hatırlatmalar ve sistem bildirimleri"><div className="mx-auto max-w-[900px] enter"><div className="card p-6"><NotificationList/></div></div></Shell>}
