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

    {
        id: 3,
        icon: <InboxIcon className="h-5 w-5" />,
        text: "Offers",
        pathName: "/offers"
    },

    {
        id: 4,
        icon: <InboxIcon className="h-5 w-5" />,
        text: "Offers List",
        pathName: "/offerList"
    },

    {
        id: 5,
        icon: <InboxIcon className="h-5 w-5" />,
        text: "Offers Banner",
        pathName: "/offersBanner"
    },

    {
        id: 6,
        icon: <InboxIcon className="h-5 w-5" />,
        text: "Category",
        pathName: "/category"
    },
    
];