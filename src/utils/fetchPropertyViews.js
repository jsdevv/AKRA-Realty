import { sendProjectView, sendPropertyView } from "../Redux/Slices/propertySlice";

export const fetchPropertyViews = (dispatch, propertyID, userID, bearerToken) => {

  if (!propertyID || !userID || !bearerToken) return;
  
  dispatch(sendPropertyView({ PropertyID: Number(propertyID), UserID: userID, bearerToken }));
};


export const fetchProjectViews = (dispatch, ProjectID, userID, bearerToken) => {

    if (!ProjectID || !userID || !bearerToken) return;
    
    dispatch(sendProjectView({ ProjectID: Number(ProjectID), UserID: userID, bearerToken }));
  };
  