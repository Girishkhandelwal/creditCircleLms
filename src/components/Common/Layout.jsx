import React, { useEffect } from 'react'
import SideBar from './SideBar'
import Navbar from './Header'
import { useSelector, useDispatch } from 'react-redux';
import { setCampaigns, setLoanTypes, setColumnNames, setUtmSources} from '../../globalStates/dataSlice'
import { useRouter } from 'next/router';
import { GET_ALL_CAMPAIGNS_ROUTE, GET_ALL_LOAN_TYPES_ROUTE, GET_LEAD_COLUMN_ROUTE, GET_UTM_SOURCE_ROUTE } from '../../utils/ApiRoutes'
import axios from 'axios'



export default function Layout({ children }) {
    const router = useRouter()
    const dispatch = useDispatch()
    
    const isLogin = useSelector((state)=> state.data.isLogin)
    const campaignInfo = useSelector((state)=> state.data.campaignInfo );

    useEffect(() => {
        if (!isLogin) {
            router.push('/Auth/login')
        } else {

            axios.get(GET_ALL_CAMPAIGNS_ROUTE)
                .then(response => {
                    dispatch(setCampaigns([{ id: "All", CampaignName: "All", LoanTypeId: "All" }, ...response.data.campaigns]));

                })
                .catch(error => {
                    console.error('Error fetching campaigns:', error);
                });


            axios.get(GET_ALL_LOAN_TYPES_ROUTE)
                .then(response => {
                    dispatch(setLoanTypes([{ id: "All", LoanType: "All" }, ...response.data.loanTypes]));
                })
                .catch(error => {
                    console.error('Error fetching loan types:', error);
                });

            axios.get(GET_LEAD_COLUMN_ROUTE)
                .then(response => {
                    dispatch(setColumnNames(response.data.columns));
                })
                .catch(error => {
                    console.error('Error fetching loan types:', error);
                });

            // Fetch loan types using Axios
            axios.get(GET_UTM_SOURCE_ROUTE)
                .then(response => {
                    dispatch(setUtmSources(["All", ...response.data.utmSources]));
                })
                .catch(error => {
                    console.error('Error fetching UtmSource values:', error);
                });
        }


    }, [isLogin])


    useEffect(()=>{
       
        if (!campaignInfo) {
            axios.get(GET_ALL_CAMPAIGNS_ROUTE)
            .then(response => {
                dispatch(setCampaigns([{ id: "All", CampaignName: "All", LoanTypeId: "All" }, ...response.data.campaigns]));

            })
            .catch(error => {
                console.error('Error fetching campaigns:', error);
            });
        }

    },[campaignInfo])



    return (
        <>
            {isLogin ? <div className="flex max-h-screen overflow-hidden">

                <SideBar />

                <div className={`overflow-y-scroll  scroll-smooth scrollbar-thin scrollbar-thumb-primary-color scrollbar-track-white scrollbar-thumb-rounded-full w-[calc(100%)]`}>
                    <Navbar />
                    <div className="px-4 md:px-4"> {children}</div>
                </div>
            </div> : <div className="px-4 md:px-4"> {children}</div>}

        </>
    )
}
