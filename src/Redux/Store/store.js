import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Slices/authSlice';
import propertiesReducer from '../Slices/propertySlice';
import listingsReducer from '../Slices/addListingsSlice';
import agentFilterReducer from '../Slices/agentFilterSlice'; 
import agentPropertyReducer from '../Slices/agentPropertySlice';
import agentPriceReducer from '../Slices/agentPriceSlice';
import alertReducer from '../Slices/alertSlice';
import scheduleTourReducer from '../Slices/scheduleTourSlice'; 
import requestInfoReducer from '../Slices/requestInfoSlice';
import forgotPasswordReducer from '../Slices/forgotPasswordSlice';
import registrationReducer from '../Slices/registrationSlice';
import resetPasswordReducer from '../Slices/resetPasswordSlice';
import imageUploadReducer from '../Slices/imageUploadSlice'; 
import videosReducer from '../Slices/videosSlice'; 
import authPopupReducer from '../Slices/authPopupSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authPopup: authPopupReducer,
    properties: propertiesReducer,
    listings: listingsReducer,
    agentProperties: agentPropertyReducer,
    agentFilter: agentFilterReducer,
    agentPrice: agentPriceReducer,
    alerts: alertReducer,
    scheduleTour: scheduleTourReducer,
    requestInfo: requestInfoReducer,
    forgotPassword: forgotPasswordReducer,
    registration: registrationReducer, 
    resetPassword: resetPasswordReducer,
    imageUpload: imageUploadReducer,
    videos: videosReducer,

  },
});
