import React, { useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input } from "@material-tailwind/react";
import {  ADD_CATEGORY_ROUTE, EDIT_CATEGORY_ROUTE} from '../../utils/ApiRoutes'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setCampaignInfo, setCategories, setCategoryInfo } from '../../globalStates/dataSlice'
import { useSelector } from 'react-redux'


export default function AddCategory({ open, setOpen, updateFormData, formData, categories, setFormData }) {

    const dispatch = useDispatch()
    const handleOpen = () => {
        setOpen(!open);
        dispatch(setCategoryInfo(null));
        setFormData({
            categoryName: null,

        }
        )
    }

    const categoryInfo = useSelector((state) => state.data.categoryInfo);
    const handleInputChange = (field, value) => {
        updateFormData(field, value);
    };

    useEffect(() => {
        if (categoryInfo) {
            setFormData({
                categoryName: categoryInfo.categoryName,
            })
        }

    }, [categoryInfo])


    async function handelSubmit() {
        try {
            if (!categoryInfo) {

                const response = await axios.post(ADD_CATEGORY_ROUTE, { formData });

                if (response.data.status) {
                    dispatch(setCategories([...categories, response.data.categories]));
                    setOpen(!open)
                }

            } else {

                const response = await axios.post(EDIT_CATEGORY_ROUTE, { formData, id: categoryInfo.id });

                if (response.data.status) {
                    const data = response.data.categories;

                    const Index = categories.findIndex(b => b.id === data.id);

                    if (Index !== -1) {
                        const updated = [...categories];
                        updated[Index] = data;
                        dispatch(setCategories(updated));
                    }
                    dispatch(setCategoryInfo(null));
                    setOpen(!open)
                }
            }

        } catch (error) {

            console.error("campaign error:", error);
        }
    }


    return (
        <>

            <Button onClick={handleOpen} variant="gradient">
                {"Add Category"}
            </Button>

            <Dialog open={open} size="lg" handler={handleOpen}>

                <DialogHeader>{categoryInfo ? "Edit Category" : "Add Category"}</DialogHeader>

                <DialogBody>

                    <div className="flex gap-5">
                        <Input label="Category Name" value={formData.categoryName}
                            onChange={(e) => handleInputChange("categoryName", e.target.value)} />

                    </div>

                </DialogBody>

                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancel</span>
                    </Button>
                    <Button variant="gradient" color="green" onClick={handelSubmit}>
                        <span>{categoryInfo ? "Edit Category" : "Add Category"}</span>
                    </Button>
                </DialogFooter>

            </Dialog>
            
        </>
    );
}