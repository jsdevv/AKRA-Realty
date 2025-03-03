import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAddFeedback } from "../../API/api";

// Async thunk to submit feedback
export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async ({ bearerToken, formData }, { rejectWithValue }) => {
    try {
      const data = await fetchAddFeedback(bearerToken, formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    isSubmitting: false,
    success: false,
    error: null,
  },
  reducers: {
    resetFeedbackState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFeedback.pending, (state) => {
        state.isSubmitting = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state) => {
        state.isSubmitting = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

export const { resetFeedbackState } = feedbackSlice.actions;
export default feedbackSlice.reducer;
