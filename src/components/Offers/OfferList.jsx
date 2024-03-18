import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux';

export default function OfferList({ offerData, selectedLead }) {

    const loanTypes = useSelector((state)=> state.data.loanTypes)


    function formatDate(applicationDate) {
        // Convert the applicationDate string to a Date object
        const dateObj = new Date(applicationDate);
    
        // Array of month names
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
    
        // Get the month, day, and year from the Date object
        const month = monthNames[dateObj.getMonth()];
        const day = dateObj.getDate();
        const year = dateObj.getFullYear();
    
        // Construct the desired date string
        const formattedDate = `${month} ${day}, ${year}`;
    
        return formattedDate;
    }

   
    return (
        <div className=''>
            {

                offerData.length > 0 ? offerData.map((offer, index)=>(

                <div key={index} className='shadow-lg p-5 space-y-2 divide-y divide-dashed divide-black rounded-lg text-black'>

                    <div className='flex gap-5'>

                        <div className='flex gap-5 items-center'>

                            <div className='w-1/2 p-2 rounded-lg bg-gray-500'>

                                <Image src={`/fibelogo.png`} height={100} width={100} alt='logo' />

                            </div>

                            <div className='w-1/2 '>

                                <p>
                                    Fibe
                                </p>
                                <p className='text-md font-bold'>
                                    Other :
                                </p>
                                <p>
                                   { (loanTypes.find((l)=> l.id == offer.personName.LoanTypeId).LoanType)}
                                </p>
                                <p className='text-md font-bold'>
                                    Remark :
                                </p>
                                 
                                <p className='w-56'>
                                   {offer.applicationRemark}
                                </p>
                               

                            </div>

                        </div>

                        <div className='w-[24%]'>

                            <p>Requested Loan Amount</p>
                            <p className='text-lg font-bold'>{offer.personName?.LoanAmountRequired || 0}</p>

                        </div>

                        <div className='w-[24%]'>

                            <p>Requested Loan Amount</p>
                            <p className='text-lg font-bold'>{offer.personName?.approvedLimit || 0}</p>

                        </div>

                        <div >

                            <Image src={`/rejected.png`} height={100} width={100} alt='logo' />

                        </div>

                    </div>


                    <div className='flex justify-between items-center p-2'>
                        <div>
                            <p className='text-lg font-semibold'>
                                Date : {formatDate(offer.applicationDate)}
                            </p> 
                            <p>
                           
                            </p>
                        </div>

                        <div>
                            <button className='px-8 py-2 bg-red-500 rounded-lg text-white'>click</button>
                        </div>

                    </div>

                </div>

                )) : selectedLead ==   0 ? <p className='text-center my-5'>Select Lead</p> : <p className='text-center my-5'>Data Not Available</p>
            }

        </div>


    )
}
