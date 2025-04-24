import { fetchAddAlert } from "../Redux/Slices/alertSlice";
import { toast } from "react-toastify";

export const createPayloadAndSendAlert = (dispatch,bearerToken,payload) => {
  
    const hasEmptyField = Object.values(payload).some(val => val === "");
    if (hasEmptyField) {
      toast.error("Please select Property Type, status, and price filter to set an alert.");
      return;
    }
  
    // Dispatch action to set the alert
    dispatch(fetchAddAlert({ bearerToken, payload }))
      .unwrap()
      .then((response) => {
        if (response?.ProcessCode === 151) {
          toast.error("You can only set a maximum of 5 alerts.");
          return;
        }
        toast.success("Alert set successfully!");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  