import React from 'react'
import { Card, Typography, List, ListItem, ListItemPrefix } from "@material-tailwind/react";
import { SideBarList } from './Data'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setIsLogin } from '@/globalStates/dataSlice';
import { PowerIcon } from "@heroicons/react/24/solid";

const SideBar = () => {
    const router = useRouter()
    const dispatch = useDispatch()

    function handleLogout() {
        dispatch(setIsLogin(false))
    }

    return (
        <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2 p-4">
                <Typography variant="h4" color="blue-gray" className='text-center'>
                    CREDIT CIRCLE
                </Typography>
            </div>
            <List>
                {SideBarList.map((item) => (
                    <Link href={`${item.pathName}`} key={item.id}>
                        <ListItem>
                            <ListItemPrefix>
                                {item.icon}
                            </ListItemPrefix>
                            {item.text}
                        </ListItem>
                    </Link>
                ))}
               
                    <ListItem onClick={handleLogout}>
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
