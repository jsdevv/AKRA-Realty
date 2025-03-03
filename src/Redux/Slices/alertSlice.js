// src/slices/alertSlice.js
import { createSlice } from '@reduxjs/toolkit';

const alertSlice = createSlice({
  name: 'alerts',
  initialState: [],
  reducers: {
    // Add a new alert
    addAlert: (state, action) => {
      state.push(action.payload);
    },
    // Clear all alerts (optional)
    clearAlerts: (state) => {
      return [];
    },
  },
});

export const { addAlert, clearAlerts } = alertSlice.actions;
export default alertSlice.reducer;
