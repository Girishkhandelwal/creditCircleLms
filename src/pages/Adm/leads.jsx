import React, { useState, useEffect } from 'react';
import { Card, Select, Option } from "@material-tailwind/react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import LeadsTable from '@/components/Leads/LeadsTable';
import axios from 'axios';
import { GET_EXPORT_LEADS_ROUTE } from '../../utils/ApiRoutes';
import SelectFields from '../../components/Leads/SelectFields'
import * as XLSX from 'xlsx';
import Datepicker from "react-tailwindcss-datepicker";
import { useSelector } from 'react-redux';

export default function Leads() {
    const [totalLeads, setTotalLeads] = useState(0)
    const [Fields, setFields] = useState([])
    const [selectedFields, setSelectedFields] = useState(['LeadId', 'LoanType', 'FirstName', 'LastName', 'MobileNumber', 'LeadCaptureDateTime']);
    const [selectedCampaign, setSelectedCampaign] = useState("All");
    const [selectedLoanType, setSelectedLoanType] = useState("All");
    const [selectedUtmSource, setSelectedUtmSource] = useState("All");
    const [dateRange, setDateRange] = useState({
        startDate: null,
        endDate: null
    });
    const [status, setStatus] = useState("All")


    const campaigns = useSelector((state) => state.data.campaigns);
    const loanTypes = useSelector((state) => state.data.loanTypes);
    const columnNames = useSelector((state) => state.data.columnNames);
    const utmSources = useSelector((state) => state.data.utmSources);



    useEffect(() => {

        if (selectedCampaign) {
            const campaign = campaigns.find((campaign) => campaign.id == selectedCampaign)

            // const fileds = selectedCampaign != "All" ? campaign.CampaignFields ? campaign.CampaignFields.split(',') : selectedFields : columnNames

            setSelectedLoanType(campaign.LoanTypeId)

            setFields(columnNames)
        }

    }, [selectedCampaign])


    const exportToExcel = () => {
        // Use axios to get leads data for export
        axios.post(GET_EXPORT_LEADS_ROUTE, { LoanType: selectedLoanType, selectedFields, UtmSource: selectedUtmSource, dateRange, applicationStatus: status })
            .then(response => {
                const leadsData = response.data.leads;

                // Create a worksheet
                const ws = XLSX.utils.json_to_sheet(leadsData);

                // Create a workbook
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Leads');

                // Save the workbook
                XLSX.writeFile(wb, 'leads_data.xlsx');
            })
            .catch(error => {
                console.error('Error exporting leads data:', error);
            });
    };


    const handleValueChange = (newValue) => {
        setDateRange(newValue);
    }


    return (

        <Card className="h-full w-full">
            {/* filter div*/}
            <div className="rounded-none mx-5">

                <div className='flex'>
                    <div className='w-1/2  border-[1px] rounded-md border-gray-500 mb-4 '>

                        <Datepicker
                            value={dateRange}
                            onChange={handleValueChange}
                            showShortcuts={true}
                            border={true}

                        />


                    </div>
                    <div className='mx-5'>
                        <p className='text-lg'>Total Leads : {totalLeads}</p>
                    </div>

                </div>

                <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div className="flex gap-4 gap-4">

                        {loanTypes.length > 0 && <Select label="Select LoanType" value={selectedLoanType} onChange={(value) => { setSelectedLoanType(value); setSelectedCampaign("All") }}>

                            {loanTypes.map(loanType => (
                                <Option key={loanType.id} value={loanType.id}>
                                    {loanType.LoanType}
                                </Option>
                            ))}
                        </Select>}

                        {campaigns.length > 0 && <Select label="Select Campaign" size={'sm'} value={selectedCampaign} onChange={(value) => setSelectedCampaign(value)}>
                            {campaigns.map(campaign => (
                                <Option key={campaign.id} value={campaign.id}>
                                    {campaign.CampaignName}
                                </Option>
                            ))}
                        </Select>}


                        {Fields.length > 0 && (
                            <SelectFields
                                label="Select Fields"
                                options={Fields}
                                selectedOptions={selectedFields}
                                onChange={(values) => setSelectedFields(values)}
                            />
                        )}

                        {utmSources.length > 0 && (
                            <Select
                                label="Select Utm Source"
                                size="sm"
                                value={selectedUtmSource}
                                onChange={(value) => setSelectedUtmSource(value)}
                            >
                                {utmSources.map((utm, index) => (
                                    <Option key={index} value={utm}>
                                        {utm}
                                    </Option>
                                ))}
                            </Select>
                        )}

                        <Select label="Select Status" value={status} onChange={(value)=> setStatus(value)} >

                            <Option value='All'>
                                All
                            </Option>

                            <Option value='success'>
                                Success
                            </Option>
                            <Option value='failure'>
                                Failure
                            </Option>

                            <Option value='pending'>
                                Pending
                            </Option>

                            <Option value='reject'>
                                Reject
                            </Option>

                        </Select>

                        <button
                            onClick={exportToExcel}
                            className="flex gap-2 items-center bg-blue-800 px-5 py-2 rounded-lg text-white"
                            size="sm"
                        >
                            <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" /> Excel
                        </button>

                    </div>
                </div>

            </div>
            <LeadsTable selectedFields={selectedFields} selectedLoanType={selectedLoanType} selectedUtmSource={selectedUtmSource} dateRange={dateRange} setTotalLeads={setTotalLeads} status={status}/>
        </Card>
    )
}
