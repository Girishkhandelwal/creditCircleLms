// dataSlice.js

import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    isLogin: false,
    leads: [],  
    currentPage: 1,
    campaigns : [],
    loanTypes : [],
    columnNames: [],
    utmSources: [],
    campaignInfo: null
  },
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },

    setLeads: (state, action) => {
      state.leads = action.payload;
    },

    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },

    setLoanTypes: (state, action) => {
      state.loanTypes = action.payload;
    },

    setColumnNames: (state, action) => {
      state.columnNames = action.payload;
    },

    setUtmSources: (state, action) => {
      state.utmSources = action.payload;
    },

    setCampaignInfo: (state, action) => {
      state.campaignInfo = action.payload;
    },
  },
});

export const { setLeads, setCurrentPage, setIsLogin, setCampaigns, setLoanTypes, setColumnNames, setUtmSources, setCampaignInfo } = dataSlice.actions;
export const selectIsLogin = (state) => state.data.isLogin;
export const selectLeads = (state) => state.data.leads;
export const selectCurrentPage = (state) => state.data.currentPage;
export const selectCampaigns = (state) => state.data.currentPage;
export const selectLoanTypes = (state) => state.data.loanTypes;
export const selectColumnNames = (state) => state.data.columnNames;
export const selectUtmSources = (state) => state.data.utmSources;
export const selectCampaignInfo = (state) => state.data.campaignInfo;

export default dataSlice.reducer;
