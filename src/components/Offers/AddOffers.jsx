import React, { useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Select as MaterialSelect, Option, Switch, Textarea } from "@material-tailwind/react";
import ReactSelect from 'react-select';
import { ADD_CAMPAIGN_ROUTE, ADD_OFFERS_ROUTE, EDIT_CAMPAIGN_ROUTE, EDIT_OFFER_ROUTE } from '../../utils/ApiRoutes'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setCampaignInfo, setCampaigns, setOfferInfo, setOfferList, setOffers } from '../../globalStates/dataSlice'
import { useSelector } from 'react-redux'

export default function AddCampaign({ open, setOpen, loanTypes, updateFormData, formData, offers, setFormData }) {

    const dispatch = useDispatch()


    const handleOpen = () => {
        setOpen(!open);
        dispatch(setCampaignInfo(null));
        setFormData({
            loanTypeId: null,
            offerTitle: null,
            offerDescription: null,
            isActive: 0,
        }
        )
    }

    // const columns = columnNames.map(column => ({ value: column, label: column }));
    const offerInfo = useSelector((state) => state.data.offerInfo);
    console.log(offerInfo)

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

                    <Switch
                        label="Is Active"
                        checked={formData.isActive === 1}
                        onChange={() => handleInputChange("isActive", formData.isActive === 1 ? 0 : 1)}
                    />
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