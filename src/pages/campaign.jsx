import { useState, useEffect } from 'react';
import { PencilIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, Button, CardBody, CardFooter, IconButton, Tooltip, Input, Switch } from "@material-tailwind/react";
import { useSelector, useDispatch } from 'react-redux';
import { setCampaignInfo, setCampaigns } from '../globalStates/dataSlice';
import AddCampaign from '@/components/Campaigns/AddCampaign';
import { EDIT_CAMPAIGN_ROUTE, HOST } from '@/utils/ApiRoutes';
import axios from 'axios';
import Image from 'next/image';

export default function Campaign() {
  const TABLE_HEAD = ["id", "CampaignName", "LoanType", "CampaignFields", "CampaignImage", "isActive", "isDashboard", ""];
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const campaigns = useSelector((state) => state.data.campaigns);
  const loanTypes = useSelector((state) => state.data.loanTypes);
  const columnNames = useSelector((state) => state.data.columnNames);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const pageSize = 10;

  const [formData, setFormData] = useState({
    CampaignName: null,
    CampaignFields: null,
    isActive: 0,
    LoanTypeId: null,
    isDashboard: 0,
    CampaignImg: null
  });

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    if (campaigns.length > 0) {
      const calculatedTotalPages = Math.ceil(campaigns.length / pageSize);
      setTotalPages(calculatedTotalPages);
    }
  }, [campaigns]);

  const handleEdit = (id) => {
    const campaign = campaigns.find((campaign) => campaign.id == id);
    dispatch(setCampaignInfo(campaign));
    setOpen(!open);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.CampaignName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedRows = filteredCampaigns.slice(startIndex, endIndex);

  async function handelIsDashboard(id) {

    const campaign = campaigns.find((c) => c.id == id);
                                                                          
    const response = await axios.post(EDIT_CAMPAIGN_ROUTE, { formData: {...campaign, isDashboard: campaign.isDashboard == 1 ? 0 : 1}, id: id });

    if (response.data.status) {                      
      const campaign = response.data.campaign;

      console.log(campaign)

      const campiagnIndex = campaigns.findIndex(campaign => campaign.id === id);


      if (campiagnIndex !== -1) {
        const updatedCampaigns = [...campaigns];
        updatedCampaigns[campiagnIndex] = campaign;
        dispatch(setCampaigns(updatedCampaigns)); 
      }
      dispatch(setCampaignInfo(null));
    }
  }

  console.log(campaigns)


  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Campaign List
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AddCampaign open={open} setOpen={setOpen} updateFormData={updateFormData} loanTypes={loanTypes} formData={formData} columnNames={columnNames} campaigns={campaigns} setFormData={setFormData} />
          </div>
        </div>
      </CardHeader>

      <CardBody className="overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
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
            {paginatedRows.map(({ id, CampaignName, LoanType, CampaignFields, isActive, isDashboard, CampaignImg }, index) => {
              const isLast = index === paginatedRows.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
           
    
              return (
                id !== "All" && (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {id}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {CampaignName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {LoanType}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {CampaignFields && CampaignFields.length > 20 ? `${CampaignFields.substring(0, 40)}...` : CampaignFields}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Image src={`${HOST}/assets/campaignImage/${CampaignImg}`} height={150} width={150} />
                    </td>


                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {isActive === 1 ? "Yes" : "No"}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Switch checked={isDashboard == 1 ? true : false} onClick={() => handelIsDashboard(id)} label={isDashboard === 1 ? "Yes" : "No"} />

                    </td>

                    <td className={classes}>
                      <Tooltip content="Edit Campaign">
                        <IconButton variant="text" onClick={() => handleEdit(id)}>
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                )
              );
            })}
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
    </Card>
  );
}
