import { Router } from "express";
import { getAllCampaigns, getAllLoanTypes, getLeads, getLeadsDaily,  getLeadsWeekly, getLeadsMonthly,  getLeadsYearly, getTotalLeadsByLoanType, exportLeads, getUtmSources, getLeadColumnNames, createCampaign, editCampaign } from "../controllers/AdminController.js";

const router = Router();

router.get("/getAllCampaigns", getAllCampaigns);
router.get("/getAllLoanTypes", getAllLoanTypes);
router.post("/getLeads", getLeads);
router.get("/getLeadsDaily", getLeadsDaily);
router.get("/getLeadsWeekly", getLeadsWeekly);
router.get("/getLeadsMonthly", getLeadsMonthly);
router.get("/getLeadsYearly", getLeadsYearly);
router.get("/getTotalLeadsByLoanType", getTotalLeadsByLoanType);
router.post("/exportLeads", exportLeads);
router.get("/getUtmSources", getUtmSources);
router.get("/getLeadColumnNames", getLeadColumnNames);
router.post("/createCampaign", createCampaign);
router.post("/editCampaign", editCampaign);



export default router;
