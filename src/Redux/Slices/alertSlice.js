import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAlertPropertySeen, fetchPropertyAlertAPI,fetchgetmapalert } from '../../API/api';

// Async thunk for fetching property alerts
export const fetchAddAlert = createAsyncThunk(
  'alert/fetchAddAlert',
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

export const fetchAlertSeen = createAsyncThunk(
  'alert/fetchAlertSeen',
  async ({ bearerToken, payload }, { rejectWithValue }) => {
    try {
      const data = await fetchAlertPropertySeen(bearerToken, payload);
      return data;
    } catch (error) {
      console.error("Error fetching property alert:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const fetchGetAlert = createAsyncThunk(
  'alert/fetchGetAlert',
  async (bearerToken, { rejectWithValue }) => {
    try {
      const response = await fetchgetmapalert(bearerToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Slice
const alertSlice = createSlice({
  name: 'alert',
  initialState: {
    alerts: [],
    getalerts:[],
    Seen:[],
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
      .addCase(fetchAddAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchAddAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGetAlert.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGetAlert.fulfilled, (state, action) => {
        state.loading = false;
        state.getalerts = action.payload;
      })
      .addCase(fetchGetAlert.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAlertSeen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlertSeen.fulfilled, (state, action) => {
        state.loading = false;
        state.Seen = action.payload;
      })
      .addCase(fetchAlertSeen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAlerts } = alertSlice.actions;
export default alertSlice.reducer;
