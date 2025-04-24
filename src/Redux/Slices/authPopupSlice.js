// src/redux/authPopupSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showAuthPopup: false,
};

const authPopupSlice = createSlice({
  name: 'authPopup',
  initialState,
  reducers: {
    setShowAuthPopup: (state, action) => {
      state.showAuthPopup = action.payload;
    },
  },
});

export const {  setShowAuthPopup } = authPopupSlice.actions;

export default authPopupSlice.reducer;
