import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchScheduleTour } from '../../API/api';

export const scheduleTour = createAsyncThunk(
    'scheduleTour/submit',
    async ({ bearerToken, payload }, { rejectWithValue }) => {
      try {
        const response = await fetchScheduleTour(bearerToken, payload);
        
        // Log the response for debugging
        console.log('API Response:', response);
  
        // Check the ProcessCode for success
        if (response.ProcessCode !== 0) {
          throw new Error(response.processMessage || 'Failed to schedule tour');
        }
  
        return response; // Return the response directly if successful
      } catch (error) {
        // Log the error for debugging
        console.error('Error in scheduling tour:', error);
        
        // Return the error message
        const errorMessage = error?.message || 'Failed to schedule tour';
        return rejectWithValue(errorMessage);
      }
    }
  );
  
  

  const scheduleTourSlice = createSlice({
    name: 'scheduleTour',
    initialState: {
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(scheduleTour.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(scheduleTour.fulfilled, (state) => {
          state.status = 'succeeded';
          state.error = null;
        })
        .addCase(scheduleTour.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || 'An unknown error occurred during tour scheduling.';
        });
    },
  });
  
export default scheduleTourSlice.reducer;
  
  

