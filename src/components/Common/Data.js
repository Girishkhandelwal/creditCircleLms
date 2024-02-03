import { PresentationChartBarIcon, UserCircleIcon, InboxIcon } from "@heroicons/react/24/solid";

export const SideBarList = [
    {
        id: 0,
        icon: <PresentationChartBarIcon className="h-5 w-5" />,
        text: "Dashboard",
        pathName: "/"
    },
    {
        id: 1,
        icon: <UserCircleIcon className="h-5 w-5" />,
        text: "Leads",
        pathName: "/Adm/leads"
    },
    {
        id: 2,
        icon: <InboxIcon className="h-5 w-5" />,
        text: "Campaign",
        pathName: "/campaign"
    },
    
];