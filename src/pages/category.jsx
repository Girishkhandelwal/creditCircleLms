import { useState, useEffect } from 'react';
import { PencilIcon, MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, Typography, Button, CardBody, CardFooter, IconButton, Tooltip, Input, Switch } from "@material-tailwind/react";
import { useSelector, useDispatch } from 'react-redux';
import { setCategories, setCategoryInfo } from '../globalStates/dataSlice';

import AddCategory from '@/components/Category/AddCategory';
import { DELETE_CATEGORY_ROUTE } from '@/utils/ApiRoutes';
import axios from 'axios';


export default function Campaign() {
    const TABLE_HEAD = ["Id", "CategoryName", ""];
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const categories = useSelector((state) => state.data.categories);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const pageSize = 10;

    const [formData, setFormData] = useState({
        categoryName: null,
    });

    const updateFormData = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };


    useEffect(() => {
        if (categories.length > 0) {
            const calculatedTotalPages = Math.ceil(categories.length / pageSize);
            setTotalPages(calculatedTotalPages);
        }
    }, [categories]);

    const handleEdit = (id) => {
        const offersBnr = categories.find((b) => b.id == id);
        dispatch(setCategoryInfo(offersBnr));
        setOpen(!open);
    };


    function handleDelete(id) {
        axios.post(DELETE_CATEGORY_ROUTE, { id: id })
            .then((res) => {

                if (res.data.status) {
                    const update = categories.filter(c => c.id !== id);
                    dispatch(setCategories(update));
                }

            })
            .catch((error) => console.error(error));
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const filteredBanner = categories.filter((b) =>
        b.categoryName && b.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const paginatedRows = filteredBanner.slice(startIndex, endIndex);

    return (
        <Card className="h-full w-full">

            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Category List
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
                        <AddCategory open={open} setOpen={setOpen} updateFormData={updateFormData} formData={formData} categories={categories} setFormData={setFormData} />
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
                        {paginatedRows.map(({ id, categoryName }, index) => {
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
                                                {categoryName}
                                            </Typography>
                                        </td>


                                        <td className={classes}>
                                            <Tooltip content="Edit Banner">
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
