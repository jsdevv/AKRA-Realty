// src/redux/agentPropertySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchagentproperties } from "../../API/api";

// Async thunk for fetching agent properties
export const fetchAgentProperties = createAsyncThunk(
  'agentProperties/fetchAgentProperties',
  async (bearerToken) => {
    const response = await fetchagentproperties(bearerToken);
    return response; // Assuming the response is already in the required format
  }
);

const agentPropertySlice = createSlice({
  name: 'agentProperties',
  initialState: {
    agentproperties: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAgentProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.agentproperties = action.payload; // Adjust based on your API response
      })
      .addCase(fetchAgentProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default agentPropertySlice.reducer;
