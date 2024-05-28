import { Router } from "express";

import { getAllCampaigns, getAllLoanTypes, getLeads, getLeadsDaily,  getLeadsWeekly, getLeadsMonthly,  getLeadsYearly, getTotalLeadsByLoanType,
 exportLeads, getUtmSources, getLeadColumnNames, createCampaign, editCampaign, getUniqueOffersLeads, getStatusWiseOffersList, getWhatsAppLogs,
  getLeadWiseWhatsAppLogs, getLeadPushLogs, getLeadWiseLeadPushLogs, getEmailLogs, getLeadWiseEmailogs, getOfferList, createOffer, editOffer, deleteOffer } from "../controllers/AdminController.js";

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
router.post("/getUniqueOffersLeads", getUniqueOffersLeads);
router.post("/getStatusWiseOffersList", getStatusWiseOffersList);
router.post("/getWhatsAppLogs", getWhatsAppLogs);
router.post("/getLeadWiseWhatsAppLogs", getLeadWiseWhatsAppLogs);
router.post("/getLeadPushLogs", getLeadPushLogs)
router.post("/getLeadWiseLeadPushLogs", getLeadWiseLeadPushLogs)
router.post("/getEmailLogs", getEmailLogs)
router.post("/getLeadWiseEmailogs", getLeadWiseEmailogs)
router.get("/getOfferList", getOfferList)
router.post("/createOffer", createOffer)
router.post("/editOffer", editOffer)
router.post("/deleteOffer", deleteOffer)


export default router;
