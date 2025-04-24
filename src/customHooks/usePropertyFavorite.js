import { toast } from "react-toastify";
import { fetchAddpropertyFavorties, fetchDeletePropertyFavorties } from "../API/api"; // update path

export const usePropertyFavorite = (favorites, toggleFavorite, bearerToken, Id, setLocalFavorites) => {
  const handleToggleFavorite = async (property) => {
    console.log(property, "toggle");
    console.log(favorites, "fav");
    const payload = { PropertyID: property.PropertyID };
    const isFavorited = favorites.some(fav => fav.PropertyID === property.PropertyID);

    try {
      // Optimistically update the UI by toggling the favorite state before the API call
      toggleFavorite(property);
      // Update local favorites list optimistically
      setLocalFavorites(prev => {
        if (isFavorited) {
          return prev.filter(fav => fav.PropertyID !== property.PropertyID);
        } else {
          return [...prev, property];
        }
      });

      const response = isFavorited
        ? await fetchDeletePropertyFavorties(bearerToken, { ...payload, UserID: Id })
        : await fetchAddpropertyFavorties(bearerToken, payload);

      const isError = response?.ProcessCode === 101 || response?.processMessage?.includes("ERROR");
      const errorMsg = response?.processMessage?.replace(/^ERROR:\s*/, "").trim() || "An error occurred. Please try again.";

      if (isError) {
        toast.error(errorMsg);
        // If the API call fails, revert the optimistic UI change
        setLocalFavorites(prev => {
          if (isFavorited) {
            return [...prev, property]; // Revert removal
          } else {
            return prev.filter(fav => fav.PropertyID !== property.PropertyID); // Revert addition
          }
        });
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.processMessage || "Something went wrong. Please try again.";
      toast.error(errorMsg);
      // If an error occurs, revert the optimistic UI change
      setLocalFavorites(prev => {
        if (isFavorited) {
          return [...prev, property]; // Revert removal
        } else {
          return prev.filter(fav => fav.PropertyID !== property.PropertyID); 
        }
      });
    }
  };

  return handleToggleFavorite;
};
