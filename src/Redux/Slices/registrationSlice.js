import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formRegistrationAgentAPI, formRegistrationAPI } from '../../AuthApi/authApi'; // Import the API function

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  roleId:'',
  countryCode:'',
  role:'',
  password:'',
  confirmPassword: '',
  loading: false,
  error: null,
  success: false,
};

// Async thunk for registration API call
export const registerUser = createAsyncThunk(
  'registration/registerUser',
  async ({ firstName, lastName, email, phoneNumber,role,countryCode,Password,ConfirmPassword  }, { rejectWithValue }) => {
    try {
      const response = await formRegistrationAPI(firstName, lastName, email, phoneNumber,role,countryCode,Password,ConfirmPassword );

      // Check for specific error messages and handle accordingly
      if (response.Errors) {
        const emailError = response.Errors.find((error) => error.PropertyName === 'DuplicateEmail');
        if (emailError) {
          return rejectWithValue(emailError.Message);
        }
        const phoneError = response.Errors.find((error) => error.PropertyName === 'DuplicatePhoneNumber');
        if (phoneError) {
          return rejectWithValue(phoneError.Message);
        }
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

export const registeragent = createAsyncThunk(
  'registration/registeragent',
  async ({ firstName, lastName, email, phoneNumber,role,countryCode,Password,ConfirmPassword  }, { rejectWithValue }) => {
    try {
      const response = await formRegistrationAgentAPI(firstName, lastName, email, phoneNumber,role,countryCode,Password,ConfirmPassword );

      // Check for specific error messages and handle accordingly
      if (response.Errors) {
        const emailError = response.Errors.find((error) => error.PropertyName === 'DuplicateEmail');
        if (emailError) {
          return rejectWithValue(emailError.Message);
        }
        const phoneError = response.Errors.find((error) => error.PropertyName === 'DuplicatePhoneNumber');
        if (phoneError) {
          return rejectWithValue(phoneError.Message);
        }
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong');
    }
  }
);

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    resetState: (state) => {
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.phoneNumber = '';
      state.password = '';
      state.confirmPassword = '';
      state.success = false;
      state.error = null;
    },
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registeragent.pending, (state) => {
        state.loading = true;
      })
      .addCase(registeragent.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(registeragent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
      
  },
});

export const { resetState, updateFormField } = registrationSlice.actions;

export default registrationSlice.reducer;
