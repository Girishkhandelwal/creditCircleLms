import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Input,
    Select, Option
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import OfferList from "@/components/Offers/OfferList";
import { GET_UNIQUE_OFFERS_LEADS, GET_OFFERS_LIST } from '../utils/ApiRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { setOfferList } from '@/globalStates/dataSlice';
import Datepicker from "react-tailwindcss-datepicker";

const TABLE_HEAD = [""];

export default function Offers() {
    const dispatch = useDispatch()
    const tableRows = useSelector((state) => state.data.offerList)
    const [status, setStatus] = useState('All');
    const [selectedLead, setSelectedLead] = useState(0)
    const [offerData, setOfferData] = useState([]);
    const [totalPages, setTotalPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalLeads, setTotalLeads] = useState(0)
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });

    const pageSize = 10;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedRows = tableRows.slice(startIndex, endIndex);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    useEffect(() => {
        axios.post(GET_UNIQUE_OFFERS_LEADS, { currentPage, pageSize, dateRange, status }).then((res) => {

            dispatch(setOfferList(res.data.uniqueLeads))
            setTotalLeads(res.data.count)
            const totalLeadsCount = res.data.count;
            const calculatedTotalPages = Math.ceil(totalLeadsCount / pageSize);
            setTotalPages(calculatedTotalPages);

        });
    }, [currentPage, dateRange, status]);

    useEffect(() => {

        if (selectedLead !== 0) {
            axios.post(GET_OFFERS_LIST, { status, selectedLead }).then((res) => {
                setOfferData(res.data.offersList);
            });
        }

    }, [status, selectedLead]);

    const handleSearch = (event) => {

        setSearchTerm(event.target.value);
    };


    const filteredRows = tableRows.filter(row =>

        (row.personName.FullName && row.personName.FullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ((!row.personName.FullName) && (row.personName.FirstName + " " + row.personName.LastName).toLowerCase().includes(searchTerm.toLowerCase()))

    );


    const handleValueChange = (newValue) => {
        setDateRange(newValue);
    }

    return (

        <Card className="h-full w-full">
            <div className="rounded-none p-5" >
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Offers
                        </Typography>
                    </div>

                </div>

                <div className='flex justify-between'>

                    <div className='w-1/2  border-[1px] rounded-md border-gray-500  '>

                        <Datepicker
                            value={dateRange}
                            onChange={handleValueChange}
                            showShortcuts={true}
                            border={true}

                        />

                    </div>

                    <div className="flex w-full shrink-0 gap-2 md:w-max">
                        <div className="w-full md:w-72">
                            <Input
                                label="Search"
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                                onChange={handleSearch}
                            />
                        </div>

                    </div>
                </div>

                
                <div className='flex justify-between mt-5'>


                    <div className="w-72">
                        <Select label="Select Status" value={status} onChange={(value) => setStatus(value)}>
                            <Option value='All'>All</Option>
                            <Option value='success'>Success</Option>
                            <Option value='failure'>Failure</Option>
                            <Option value='pending'>Pending</Option>
                        </Select>
                    </div>
                    <div className='mx-5'>
                        <p className='text-lg'>Total Leads : {totalLeads}</p>
                    </div>

                </div>

            </div>

            <CardBody className="overflow-scroll px-0">
                <table className="w-full min-w-max table-auto text-left">
                    <thead className="w-[90%]">
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70 text-center font-bold"
                                    >
                                        Status Wise Offer List
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="flex ">
                        <div className="w-[35%]">
                            {filteredRows.length > 0 && filteredRows.map(({ leadId, personName }, index) => {
                                const isLast = index === paginatedRows.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";
                                const fullName = personName && personName.FullName ? personName.FullName : personName.FirstName + " " + personName.LastName;

                                return (
                                    <tr key={index}>
                                        <td className={classes} onClick={()=>setSelectedLead(leadId)} >
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal text-md text-blue-500 cursor-pointer"
                                            >
                                                {fullName}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal text-md "
                                            >
                                               Phone No. {personName.MobileNumber}
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </div>
                        <div className='w-[55%]'>
                            <OfferList offerData={offerData} selectedLead={selectedLead} />
                        </div>
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Button
                    variant="outlined"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <div className="flex items-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1;
                        if (
                            (page >= currentPage - 2 && page <= currentPage + 2) ||
                            page === 1 ||
                            page === totalPages
                        ) {
                            if (page === 1) {
                                return (
                                    <IconButton
                                        key={page}
                                        variant={currentPage === page ? "outlined" : "text"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </IconButton>
                                );
                            }
                            if (page === currentPage - 2 && currentPage > 4) {
                                return (
                                    <IconButton key={page} variant="text" size="sm" disabled>
                                        ...
                                    </IconButton>
                                );
                            }
                            if (page >= currentPage - 2 && page <= currentPage + 2) {
                                return (
                                    <IconButton
                                        key={page}
                                        variant={currentPage === page ? "outlined" : "text"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </IconButton>
                                );
                            }
                            if (page === currentPage + 2 && currentPage < totalPages - 3) {
                                return (
                                    <IconButton key={page} variant="text" size="sm" disabled>
                                        ...
                                    </IconButton>
                                );
                            }
                            if (page === totalPages) {
                                return (
                                    <IconButton
                                        key={page}
                                        variant={currentPage === page ? "outlined" : "text"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </IconButton>
                                );
                            }
                        }
                        return null;
                    })}
                </div>
                <Button
                    variant="outlined"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </CardFooter>
        </Card>
    );
}
