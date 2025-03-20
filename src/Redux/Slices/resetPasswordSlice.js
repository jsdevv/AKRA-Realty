import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formresetpassword } from '../../AuthApi/authApi';

export const resetPassword = createAsyncThunk(
  'resetPassword/resetPassword',
  async ({ password, confirmPassword, email, token }, { rejectWithValue }) => {
    try {
      const response = await formresetpassword(password, confirmPassword, email, token);

      // Handle 204 success response
      if (response.success) {
        return { message: response.message };
      }

      return rejectWithValue(response.message || 'Failed to reset password');
      
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resetPasswordSlice.reducer;
