import { useState } from 'react'
import { Card, Typography, List, ListItem, ListItemPrefix, Accordion, AccordionHeader, AccordionBody } from "@material-tailwind/react";
import { SideBarList } from './Data'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsLogin } from '@/globalStates/dataSlice';
import { PowerIcon } from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const SideBar = () => {
    const [open, setOpen] = useState(false);


    const router = useRouter()
    const dispatch = useDispatch()

    function handleLogout() {
        dispatch(setIsLogin(false))
    }

    return (
        <Card className="bg-blue-900 rounded-none">
            <div className="mb-2 p-4">
                <Typography variant="h4" color="blue-gray" className='text-center text-white'>
                    CREDIT CIRCLE
                </Typography>
            </div>
            <List>
                {SideBarList.map((item) => (
                    <Link className='text-white' href={`${item.pathName}`} key={item.id}>
                        <ListItem>
                            <ListItemPrefix>
                                {item.icon}
                            </ListItemPrefix>
                            {item.text}
                        </ListItem>
                    </Link>
                ))}

                <Accordion
                    open={open}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem className="p-0" selected={open} >
                        <AccordionHeader onClick={() => setOpen(!open)} className="border-b-0 p-3 text-white">
                            <ListItemPrefix>
                                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal text-white">
                                Logs
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                        <List className="p-0">
                        <Link href={`/logs/whatsapp`} className='text-white'>
                            <ListItem>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                WhatsApp logs
                            </ListItem>
                            </Link>
                            <Link href={`/logs/lead-push`} className='text-white'>
                                <ListItem>
                                    <ListItemPrefix>
                                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                    </ListItemPrefix>
                                    Lead Push Logs
                                </ListItem>
                            </Link>

                            <Link href={`/logs/email`} className='text-white'>
                            <ListItem>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                Email Logs
                            </ListItem>
                            </Link>
                        </List>
                    </AccordionBody>
                </Accordion>

                <ListItem className='text-white' onClick={handleLogout}>
                    <ListItemPrefix>
                        <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Log Out
                </ListItem>


            </List>
        </Card>
    );
};

export default SideBar;
