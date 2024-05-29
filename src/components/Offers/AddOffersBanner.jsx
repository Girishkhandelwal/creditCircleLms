import React, { useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Select as MaterialSelect, Option, Switch } from "@material-tailwind/react";
import ReactSelect from 'react-select';
import { ADD_CAMPAIGN_ROUTE, ADD_OFFERS_BANNER_ROUTE, EDIT_CAMPAIGN_ROUTE, EDIT_OFFERS_BANNER_ROUTE, HOST, UPLOAD_IMAGE_ROUTE } from '../../utils/ApiRoutes'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setCampaignInfo, setCampaigns, setOffersBanner, setOffersBannerInfo } from '../../globalStates/dataSlice'
import { useSelector } from 'react-redux'
import Image from "next/image";

export default function AddOffersBanner({ open, setOpen, updateFormData, formData, offersBanner, setFormData }) {

    const dispatch = useDispatch()
    const handleOpen = () => {
        setOpen(!open);
        dispatch(setCampaignInfo(null));
        setFormData({
            altText: null,
            redirectUrl: null,
            isActive: 0,
            bannerImage: null
        }
        )
    }


    const offersBannerInfo = useSelector((state) => state.data.offersBannerInfo);

    const handleInputChange = (field, value) => {
        updateFormData(field, value);
    };

    useEffect(() => {
        if (offersBannerInfo) {
            setFormData({
                altText: offersBannerInfo.altText,
                redirectUrl: offersBannerInfo.redirectUrl,
                isActive: offersBannerInfo.isActive,
                bannerImage: offersBannerInfo.bannerImage
            })
        }

    }, [offersBannerInfo])

    const handleFileUpload = async (event) => {
        const files = event.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            data.append("type", "banner"); // Specify the type as 'campaign'
            const res = await axios.post(UPLOAD_IMAGE_ROUTE, data);
            handleInputChange('bannerImage', res.data.fileName);
        }
    };

  

    async function handelSubmit() {
        try {
            if (!offersBannerInfo) {

                const response = await axios.post(ADD_OFFERS_BANNER_ROUTE, { formData });

                if (response.data.status) {
                    dispatch(setOffersBanner([...offersBanner, response.data.offerBanner]));
                    setOpen(!open)
                }
            } else {

                const response = await axios.post(EDIT_OFFERS_BANNER_ROUTE, { formData, id: offersBannerInfo.id });

                if (response.data.status) {
                    const banner = response.data.offerBanner;
                          
                    const bannerIndex = offersBanner.findIndex(b => b.id === banner.id);
        
                    if (bannerIndex !== -1) {
                        const updatedBanners = [...offersBanner];
                        updatedBanners[bannerIndex] = banner;
                        dispatch(setOffersBanner(updatedBanners));
                    }
                    dispatch(setOffersBannerInfo(null));
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
                {"Add Offer Banner"}
            </Button>
            <Dialog open={open} size="lg" handler={handleOpen}>
                <DialogHeader>{offersBannerInfo ? "Edit Offer Banner" : "Add Offer Banner"}</DialogHeader>
                <DialogBody>

                    <div className="flex gap-5">
                        <Input label="Alt Text" value={formData.altText}
                            onChange={(e) => handleInputChange("altText", e.target.value)} />

                        <Input label="Redirect Url" value={formData.redirectUrl}
                            onChange={(e) => handleInputChange("redirectUrl", e.target.value)} />

                    </div>


                    <div className="my-5 flex gap-5">
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

                        {formData.bannerImage && <div>
                            <Image src={`${HOST}/bannerImage/${formData.bannerImage}`} height={200} width={200} />
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
                        <span>{offersBannerInfo ? "Edit Offer Banner" : "Add Offer Banner"}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}