// features/requestInfo/requestInfoSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchRequestinfo } from '../../API/api';

export const fetchRequestInfo = createAsyncThunk(
  'requestInfo/fetchRequestInfo',
  async ({ bearerToken, payload }, { rejectWithValue }) => {
    try {
      return await fetchRequestinfo(bearerToken, payload);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const requestInfoSlice = createSlice({
  name: 'requestInfo',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestInfo.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRequestInfo.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchRequestInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default requestInfoSlice.reducer;
