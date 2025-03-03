// src/Redux/Slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bearerToken: localStorage.getItem('bearerToken') || null,
  userDetails: JSON.parse(localStorage.getItem('userDetails')) || {
    UserEmail: "",
    firstName: "",
    lastName: "",
    Id: "",

  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setBearerToken: (state, action) => {
      state.bearerToken = action.payload;
      // Store the token in localStorage for persistence
      localStorage.setItem('bearerToken', action.payload);
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
      localStorage.setItem('userDetails', JSON.stringify(action.payload));
    },
    
    clearBearerToken: (state) => {
      state.bearerToken = null;
      state.userDetails = { UserEmail: "", firstName: "", lastName: "",Id:"" };
      localStorage.removeItem('bearerToken');
      localStorage.removeItem('userDetails');
    },
    
  },
});

export const { setBearerToken,setUserDetails , clearBearerToken } = authSlice.actions;
export default authSlice.reducer;
