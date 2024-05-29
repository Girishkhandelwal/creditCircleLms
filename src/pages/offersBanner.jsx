import { useState, useEffect } from 'react';
import { PencilIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, Button, CardBody, CardFooter, IconButton, Tooltip, Input, Switch } from "@material-tailwind/react";
import { useSelector, useDispatch } from 'react-redux';
import { setCampaigns, setOffersBanner, setOffersBannerInfo } from '../globalStates/dataSlice';
import AddCampaign from '@/components/Campaigns/AddCampaign';
import { EDIT_CAMPAIGN_ROUTE, EDIT_OFFERS_BANNER_ROUTE, HOST } from '@/utils/ApiRoutes';
import axios from 'axios';
import Image from 'next/image';
import AddOffersBanner from '@/components/Offers/AddOffersBanner';


export default function Campaign() {
    const TABLE_HEAD = ["id", "Alt Text", "Redirect Url", "Banner Image",  "isActive", "isDashboard", ""];
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const offersBanner = useSelector((state) => state.data.offersBanner);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const pageSize = 10;

    const [formData, setFormData] = useState({
        altText: null,
        bannerImage: null,
        redirectUrl: null,
        isActive: 0,
        isDashboard: 0,
    });

    const updateFormData = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    useEffect(() => {
        if (offersBanner.length > 0) {
            const calculatedTotalPages = Math.ceil(offersBanner.length / pageSize);
            setTotalPages(calculatedTotalPages);
        }
    }, [offersBanner]);

    const handleEdit = (id) => {
        const offersBnr = offersBanner.find((b) => b.id == id);
        dispatch(setOffersBannerInfo(offersBnr));
        setOpen(!open);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    console.log(offersBanner)

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const filteredBanner = offersBanner.filter((b) =>
        b.altText &&   b.altText.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedRows = filteredBanner.slice(startIndex, endIndex);

    async function handelIsDashboard(id) {

        const banner = offersBanner.find((b) => b.id == id);

        const response = await axios.post(EDIT_OFFERS_BANNER_ROUTE, { formData: { ...banner, isDashboard: banner.isDashboard == 1 ? 0 : 1 }, id: id });

        if (response.data.status) {
            const banner = response.data.offerBanner;


            const bannerIndex = offersBanner.findIndex(b => b.id === id);

            if (bannerIndex !== -1) {
                const updatedBanners = [...offersBanner];
                updatedBanners[bannerIndex] = banner;
                dispatch(setOffersBanner(updatedBanners));
            }
            dispatch(setOffersBannerInfo(null));
        }
    }


    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Offer Banner List
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
                        <AddOffersBanner open={open} setOpen={setOpen} updateFormData={updateFormData} formData={formData} offersBanner={offersBanner} setFormData={setFormData} />
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
                        {paginatedRows.map(({ id, altText, bannerImage, redirectUrl, isActive, isDashboard }, index) => {
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
                                                {altText}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {redirectUrl}
                                            </Typography>
                                        </td>


                                        <td className={classes}>
                                            <Image src={`${HOST}/bannerImage/${bannerImage}`} height={150} width={150} />
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
                                            <Tooltip content="Edit Banner">
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
