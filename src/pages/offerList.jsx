import { useState, useEffect } from 'react';
import { PencilIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, Button, CardBody, CardFooter, IconButton, Tooltip, Input, Switch } from "@material-tailwind/react";
import { useSelector, useDispatch } from 'react-redux';
import { setCampaignInfo, setOfferInfo, setOffers } from '../globalStates/dataSlice';
import AddOffers from '@/components/Offers/AddOffers';
import { DELETE_OFFER_ROUTE, EDIT_OFFER_ROUTE, HOST } from '@/utils/ApiRoutes';
import axios from 'axios';
import Image from 'next/image';

export default function OfferList() {
  const TABLE_HEAD = ["Id", "Category Name", "Offer Title", "Offer Description", 'Redirect Url', 'offerImage', "isActive", ""];
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const offers = useSelector((state) => state.data.offers);
  const loanTypes = useSelector((state) => state.data.loanTypes);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const pageSize = 10;


  const [formData, setFormData] = useState({
    loanTypeId: null,
    offerTitle: null,
    offerDescription: null,
    offerImage: null,
    redirectUrl: null,
    isActive: 1
  });

  const updateFormData = (field, value) => {

    setFormData({ ...formData, [field]: value });
  };



  useEffect(() => {
    if (offers.length > 0) {
      const calculatedTotalPages = Math.ceil(offers.length / pageSize);
      setTotalPages(calculatedTotalPages);
    }
  }, [offers]);

  const handleEdit = (id) => {
    const offer = offers.find((offer) => offer.id == id);
    dispatch(setOfferInfo(offer));
    setOpen(!open);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const filteredCampaigns = offers.filter((offer) =>
    offer.offerTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const paginatedRows = filteredCampaigns.slice(startIndex, endIndex);

  async function handelStatusChange(id) {

    const offer = offers.find((offer) => offer.id == id);

    const response = await axios.post(EDIT_OFFER_ROUTE, { formData: { ...offer, isActive: offer.isActive == 1 ? 0 : 1 }, id: id });


    if (response.data.status) {
      const updatedOffer = response.data.offer;

      const offerIndex = offers.findIndex(offer => offer.id === id);


      if (offerIndex !== -1) {
        const updatedOffers = [...offers];
        updatedOffers[offerIndex] = updatedOffer;
        dispatch(setOffers(updatedOffers));
      }

      dispatch(setOfferInfo(null));

    }

  }


  function handleDelete(id) {
    axios.post(DELETE_OFFER_ROUTE, { id: id })
      .then((res) => {
        console.log(res.data.status);

        if (res.data.status) {
          const removedOfferId = id;
          const updatedOffers = offers.filter(offer => offer.id !== removedOfferId);
          dispatch(setOffers(updatedOffers));
        }

      })
      .catch((error) => console.error(error));
  }
  return (
    <Card className="h-full w-full">

      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              Offer List
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
            <AddOffers open={open} setOpen={setOpen} updateFormData={updateFormData} loanTypes={loanTypes} formData={formData} offers={offers} setFormData={setFormData} />
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
            {paginatedRows.map(({ id, loanTypeId, offerTitle, offerDescription, isActive, offerImage, redirectUrl }, index) => {
              const isLast = index === paginatedRows.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
              const categoryName = loanTypes.find((a) => a.id == loanTypeId).LoanType

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
                        {categoryName}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {offerTitle}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {offerDescription}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Typography variant="small" color="blue-gray" className="font-normal">
                        {redirectUrl}
                      </Typography>
                    </td>

                    <td className={classes}>
                      <Image src={`${HOST}/offerImage/${offerImage}`} height={150} width={150} />
                    </td>




                    <td className={classes}>
                      <Switch checked={isActive == 1 ? true : false} onClick={() => handelStatusChange(id)} label={isActive === 1 ? "Active" : "InActive"} />

                    </td>

                    <td className={`${classes}`}>
                      <Tooltip content="Edit Offer">
                        <IconButton variant="text" onClick={() => handleEdit(id)}>
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip content="Delete Offer">
                        <IconButton variant="text" onClick={() => handleDelete(id)}>
                          <TrashIcon className="h-4 w-4" />
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
