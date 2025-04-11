import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPropertyAlertAPI } from '../../API/api';

// Async thunk for fetching property alerts
export const fetchPropertyAlert = createAsyncThunk(
  'alert/fetchPropertyAlert',
  async ({ bearerToken, payload }, { rejectWithValue }) => {
    try {
      const data = await fetchPropertyAlertAPI(bearerToken, payload);
      return data;
    } catch (error) {
      console.error("Error fetching property alert:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    alerts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAlerts: (state) => {
      state.alerts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchPropertyAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAlerts } = alertSlice.actions;
export default alertSlice.reducer;
