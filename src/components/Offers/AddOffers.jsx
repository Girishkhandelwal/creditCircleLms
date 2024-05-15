import React, { useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Select as MaterialSelect, Option, Switch, Textarea } from "@material-tailwind/react";
import ReactSelect from 'react-select';
import { ADD_CAMPAIGN_ROUTE, ADD_OFFERS_ROUTE, EDIT_CAMPAIGN_ROUTE, EDIT_OFFER_ROUTE } from '../../utils/ApiRoutes'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setCampaignInfo, setCampaigns, setOfferInfo, setOfferList, setOffers } from '../../globalStates/dataSlice'
import { useSelector } from 'react-redux'
import Image from "next/image";

export default function AddOffer({ open, setOpen, loanTypes, updateFormData, formData, offers, setFormData }) {

    const dispatch = useDispatch()


    const handleOpen = () => {
        setOpen(!open);
        dispatch(setOfferInfo(null));
        setFormData({
            loanTypeId: null,
            offerTitle: null,
            offerDescription: null,
            isActive: 0,
            offerImage: null
        }
        )
    }

    // const columns = columnNames.map(column => ({ value: column, label: column }));
    const offerInfo = useSelector((state) => state.data.offerInfo);


    const handleInputChange = (field, value) => {
        updateFormData(field, value);
    };

    useEffect(() => {

        if (offerInfo) {
            setFormData({
                loanTypeId: offerInfo.loanTypeId,
                offerTitle: offerInfo.offerTitle,
                offerDescription: offerInfo.offerDescription,
                isActive: offerInfo.isActive,
                offerImage: offerInfo.offerImage
            })
        }

    }, [offerInfo])


    async function handelSubmit() {
        try {
            if (!offerInfo) {

                const response = await axios.post(ADD_OFFERS_ROUTE, { formData });

                console.log(response.data.status)

                if (response.data.status) {


                    dispatch(setOffers([...offers, response.data.offer]));
                    setOpen(!open)

                }

            } else {
                const response = await axios.post(EDIT_OFFER_ROUTE, { formData, id: offerInfo.id });

                if (response.data.status) {
                    const updatedOffer = response.data.offer;

                    const offerIndex = offers.findIndex(offer => offer.id === offerInfo.id);


                    if (offerIndex !== -1) {
                        const updatedOffers = [...offers];
                        updatedOffers[offerIndex] = updatedOffer;
                        dispatch(setOffers(updatedOffers));
                    }

                    dispatch(setOfferInfo(null));
                    setOpen(!open);
                }
            }

        } catch (error) {

            console.error("Offer error:", error);
        }
    }

    const handleFileUpload = async (event) => {
        const files = event.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            const res = await axios.post("/api/upload", data);



            handleInputChange('offerImage', res.data.fileName)

        }
    };

    console.log(formData)


    return (
        <>
            <Button onClick={handleOpen} variant="gradient">
                {"Add Offer"}
            </Button>
            <Dialog open={open} size="lg" handler={handleOpen}>
                <DialogHeader>{offerInfo ? "Edit Offer" : "Add Offer"}</DialogHeader>
                <DialogBody>

                    <div className="flex gap-5">
                        <Input label="Offer Title" value={formData.offerTitle}
                            onChange={(e) => handleInputChange("offerTitle", e.target.value)} />

                        {loanTypes && loanTypes.length > 0 && <MaterialSelect label="Select LoanType" value={formData.loanTypeId} onChange={(value) => handleInputChange("loanTypeId", value)}>
                            {loanTypes.map(loanType => (
                                <Option key={loanType.id} value={loanType.id}>
                                    {loanType.LoanType}
                                </Option>
                            ))}
                        </MaterialSelect>}
                    </div>

                    <div className="my-5">

                        <Textarea label="Offer Description" value={formData.offerDescription} onChange={(e) => handleInputChange("offerDescription", e.target.value)} />

                    </div>

                    <div className="mb-5 flex gap-5">
                        <div className="w-[50%]">
                            <label for="file-input" class="sr-only">Choose file</label>
                            <input type="file" name="file-input" id="file-input" class="block mb-5 w-full border border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400
                        file:bg-gray-50 file:border-0
                        file:me-4
                        file:py-3 file:px-4
                        dark:file:bg-neutral-700 dark:file:text-neutral-400"
                                onChange={handleFileUpload}
                            />

                            <Switch
                               
                                label="Is Active"
                                checked={formData.isActive === 1}
                                onChange={() => handleInputChange("isActive", formData.isActive === 1 ? 0 : 1)}
                            />

                        </div>

                        {formData.offerImage && <div>
                            <Image src={`/offerImage/${formData.offerImage}`} height={200} width={200} />
                        </div>}
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
                        <span>{offerInfo ? "Edit Offer" : "Add Offer"}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}