import React, { useEffect } from "react";
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Select as MaterialSelect, Option, Switch } from "@material-tailwind/react";
import ReactSelect from 'react-select';
import { ADD_CAMPAIGN_ROUTE, EDIT_CAMPAIGN_ROUTE, HOST, UPLOAD_IMAGE_ROUTE } from '../../utils/ApiRoutes'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { setCampaignInfo, setCampaigns } from '../../globalStates/dataSlice'
import { useSelector } from 'react-redux'
import Image from "next/image";

export default function AddCampaign({ open, setOpen, loanTypes, columnNames, updateFormData, formData, campaigns, setFormData }) {

    const dispatch = useDispatch()
    const handleOpen = () => {
        setOpen(!open);
        dispatch(setCampaignInfo(null));
        setFormData({
            CampaignName: null,
            CampaignFields: null,
            isActive: 0,
            LoanTypeId: null,
            CampaignImg: null
        }
        )
    }

    const columns = columnNames.map(column => ({ value: column, label: column }));
    const campaignInfo = useSelector((state) => state.data.campaignInfo);

    const handleInputChange = (field, value) => {
        updateFormData(field, value);
    };

    useEffect(() => {
        if (campaignInfo) {
            setFormData({
                CampaignName: campaignInfo.CampaignName,
                CampaignFields: campaignInfo.CampaignFields,
                isActive: campaignInfo.isActive,
                LoanTypeId: campaignInfo.LoanTypeId,
                CampaignImg: campaignInfo.CampaignImg
            })
        }

    }, [campaignInfo])

    const handleFileUpload = async (event) => {
        const files = event.target?.files;
        if (files?.length > 0) {
            const data = new FormData();
            for (const file of files) {
                data.append("file", file);
            }
            data.append("type", "campaign"); // Specify the type as 'campaign'
            const res = await axios.post(UPLOAD_IMAGE_ROUTE, data);
            handleInputChange('CampaignImg', res.data.fileName);
        }
    };

    console.log(formData)

    async function handelSubmit() {
        try {
            if (!campaignInfo) {

                const response = await axios.post(ADD_CAMPAIGN_ROUTE, { formData });

                if (response.data.status) {
                    dispatch(setCampaigns([...campaigns, response.data.campaign]));
                    setOpen(!open)
                }
            } else {

                const response = await axios.post(EDIT_CAMPAIGN_ROUTE, { formData, id: campaignInfo.id });

                if (response.data.status) {
                    dispatch(setCampaignInfo(null));
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
                {"Add Campaign"}   
            </Button>
             <Dialog open={open} size="lg" handler={handleOpen}>
                <DialogHeader>{campaignInfo ? "Edit Campaign" : "Add Campaign"}</DialogHeader>
                <DialogBody>

                    <div className="flex gap-5">
                        <Input label="Campaign Name" value={formData.CampaignName}
                            onChange={(e) => handleInputChange("CampaignName", e.target.value)} />

                        {loanTypes && loanTypes.length > 0 && <MaterialSelect label="Select LoanType" value={formData.LoanTypeId} onChange={(value) => handleInputChange("LoanTypeId", value)}>
                            {loanTypes.map(loanType => (
                                <Option key={loanType.id} value={loanType.id}>
                                    {loanType.LoanType}
                                </Option>
                            ))}
                        </MaterialSelect>}
                    </div>

                    <div className="my-5">

                        <ReactSelect
                            closeMenuOnSelect={false}
                            defaultValue={
                                campaignInfo && campaignInfo.CampaignFields &&
                                campaignInfo.CampaignFields.split(",").map((field) => ({
                                    label: field,
                                    value: field,
                                }))
                            }
                            isMulti
                            options={columns}
                            placeholder="Select Campaign Fields"
                            onChange={(selectedOptions) =>
                                handleInputChange(
                                    "CampaignFields",
                                    selectedOptions.map((option) => option.value).toString()
                                )}
                        />

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

                        {formData.CampaignImg && <div>
                            <Image src={`${HOST}/assets/campaignImage/${formData.CampaignImg}`} height={200} width={200} />
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
                        <span>{campaignInfo ? "Edit Campaign" : "Add Campaign"}</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}