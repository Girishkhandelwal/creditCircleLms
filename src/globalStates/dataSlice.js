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
    campaignInfo: null,
    offerList: []
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

    setOfferList: (state, action) => {
      state.offerList = action.payload;
    },
  },
});

export const { setLeads, setCurrentPage, setIsLogin, setCampaigns, setLoanTypes, setColumnNames, setUtmSources, setCampaignInfo, setOfferList } = dataSlice.actions;


export default dataSlice.reducer;
