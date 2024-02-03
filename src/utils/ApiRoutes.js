export const API_URL = 'http://localhost:5001';

export const MAIN_ROUTE = `${API_URL}/api`

export const AUTH_ROUTE = `${MAIN_ROUTE}/auth`

//Auth
export const LOGIN_ROUTE = `${AUTH_ROUTE}/login`

//OtherRoutes

export const GET_ALL_CAMPAIGNS_ROUTE = `${MAIN_ROUTE}/getAllCampaigns`
export const GET_ALL_LOAN_TYPES_ROUTE = `${MAIN_ROUTE}/getAllLoanTypes`
export const GET_LEADS_ROUTE = `${MAIN_ROUTE}/getLeads`
export const GET_TOTAL_LEADS_COUNT_ROUTE = `${MAIN_ROUTE}/getTotalLeadsCount`
export const GET_LEADS_DAILY_ROUTE = `${MAIN_ROUTE}/getLeadsDaily`
export const GET_LEADS_WEEKLY_ROUTE = `${MAIN_ROUTE}/getLeadsWeekly`
export const GET_LEADS_MONTHLY_ROUTE = `${MAIN_ROUTE}/getLeadsMonthly`
export const GET_LEADS_YEARLY_ROUTE = `${MAIN_ROUTE}/getLeadsYearly`
export const GET_LEADS_COUNT_BY_LOANTYPE = `${MAIN_ROUTE}/getTotalLeadsByLoanType`
export const GET_EXPORT_LEADS_ROUTE = `${MAIN_ROUTE}/exportLeads`
export const GET_UTM_SOURCE_ROUTE = `${MAIN_ROUTE}/getUtmSources`
export const GET_LEAD_COLUMN_ROUTE = `${MAIN_ROUTE}/getLeadColumnNames`
export const ADD_CAMPAIGN_ROUTE = `${MAIN_ROUTE}/createCampaign`
export const EDIT_CAMPAIGN_ROUTE = `${MAIN_ROUTE}/editCampaign`

