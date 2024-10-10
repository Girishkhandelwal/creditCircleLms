//components/Leads/LeadsTable.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button, CardBody, CardFooter, IconButton } from "@material-tailwind/react";
import axios from 'axios';
import { GET_LEADS_ROUTE } from '../../utils/ApiRoutes';
import { setLeads, setCurrentPage } from '../../globalStates/dataSlice';

export default function LeadsTable({ selectedFields, selectedLoanType, selectedUtmSource, dateRange, setTotalLeads, status }) {

  const TABLE_HEAD = Array.isArray(selectedFields) ? selectedFields : [selectedFields];;
  const [totalPages, setTotalPages] = useState(null);

  const dispatch = useDispatch();
  const leads = useSelector((state) => state.data.leads);
  const currentPage = useSelector((state) => state.data.currentPage);
  const pageSize = 10;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedRows = leads.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
  };
  
  
  useEffect(() => {
    axios.post(GET_LEADS_ROUTE, { currentPage, pageSize, LoanType:selectedLoanType, UtmSource:selectedUtmSource, dateRange, applicationStatus : status })
      .then((response) => {
        const totalLeadsCount = response.data.totalLeadsCount;
        const calculatedTotalPages = Math.ceil(totalLeadsCount / pageSize);
        setTotalPages(calculatedTotalPages);
        setTotalLeads(totalLeadsCount)
        dispatch(setLeads(response.data.leads));
      })
      .catch((error) => {
        console.error('Error fetching leads:', error);
      });
  }, [currentPage, dispatch, selectedLoanType, selectedUtmSource, dateRange, status]);


  function convertToIST(dateString) {
    const dateObject = new Date(dateString);
    const formattedDate = `${dateObject.getUTCFullYear()}-${(dateObject.getUTCMonth() + 1).toString().padStart(2, '0')}-${dateObject.getUTCDate().toString().padStart(2, '0')} ${dateObject.getUTCHours().toString().padStart(2, '0')}:${dateObject.getUTCMinutes().toString().padStart(2, '0')}:${dateObject.getUTCSeconds().toString().padStart(2, '0')}`;
    return formattedDate;
  }


  return (
    <>
      <CardBody className="overflow-scroll px-0">
        <div className='tableclass'>
          
        <table className="w-full min-w-max table-auto text-left ">
          <thead className='sticky -top-6 bg-blue-200'>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>


          <tbody>
            {leads.map((lead, index) => {
              const isLast = index === paginatedRows.length - 1;
              const classes = isLast
                ? "p-4"
                : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={lead.LeadId}>
                  {TABLE_HEAD.map((head) => (
                    <td key={head} className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal capitalize"
                        >
                          {head == 'LeadCaptureDateTime' ? convertToIST(lead[head]) : head === 'LoanType' ? lead.loanType?.LoanType : lead[head]}   
                        </Typography>
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>

        </table>

        </div>
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

            // Show dynamic range around the clicked page
            if (
              (page >= currentPage - 2 && page <= currentPage + 2) ||
              page === 1 ||
              page === totalPages
            ) {
              // Display first page
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

              // Display "..." before dynamic range
              if (page === currentPage - 2 && currentPage > 4) {
                return (
                  <IconButton key={page} variant="text" size="sm" disabled>
                    ...
                  </IconButton>
                );
              }

              // Display dynamic range
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

              // Display "..." after dynamic range
              if (page === currentPage + 2 && currentPage < totalPages - 3) {
                return (
                  <IconButton key={page} variant="text" size="sm" disabled>
                    ...
                  </IconButton>
                );
              }

              // Display last page
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

            // Hide other pages
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
    </>
  );
}
