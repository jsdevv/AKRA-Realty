import React, { useState, useEffect } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { useFavorites } from "../../context/FavoritesContext";
import { 
    fetchAddprojectFavorties,
    fetchAddpropertyFavorties, 
    fetchDeleteProjectFavorties,
    fetchDeletePropertyFavorties 
} from "../../API/api";
import {setShowAuthPopup} from "../../Redux/Slices/authPopupSlice"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./FavoriteIcon.css";
import { checkAuthAndPopup } from "../../utils/authUtils";

const FavoriteIcon = ({ property }) => {
    const dispatch = useDispatch();
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    
    const { Id } = useSelector((state) => state.auth.userDetails || {});
    const { favorites, toggleFavorite, favoriteColor } = useFavorites();
    const [isFavorited, setIsFavorited] = useState(false);

    const isProject = !property?.found || property.found > 1;
    const propertyKey = isProject ? "ProjectID" : "PropertyID";
    const currentID = isProject ? property?.projectID : property?.propertyID;

    useEffect(() => {
        if (!currentID) return;

        const isFav = favorites.some((fav) => fav[propertyKey] === currentID);
        setIsFavorited(isFav);
    }, [favorites, currentID, propertyKey]);

    if (!property || !currentID) return null;
    

    if (!property) return null;

    const handleToggleFavorite = async (e) => {
        e.stopPropagation();
    
        const isAllowed = checkAuthAndPopup({
            token: bearerToken,
            setShowAuthPopup,
            dispatch,
        });
    
        if (!isAllowed) return;
    
        const isSingleProperty = property.found <= 1;
        const isProject = !isSingleProperty;
    
        const payload = isSingleProperty
            ? { PropertyID: property.propertyID }
            : { ProjectID: property.projectID };
    
        try {
            let response;
    
            if (!isFavorited) {
                response = isProject
                    ? await fetchAddprojectFavorties(bearerToken, payload)
                    : await fetchAddpropertyFavorties(bearerToken, payload);
            } else {
                const deletePayload = { ...payload, UserID: Id };
                response = isProject
                    ? await fetchDeleteProjectFavorties(bearerToken, deletePayload)
                    : await fetchDeletePropertyFavorties(bearerToken, deletePayload);
            }
    
            const errorMessage = response?.processMessage?.includes("ERROR")
                ? response.processMessage.replace(/^ERROR:\s*/, "").trim()
                : "An error occurred, please try again.";
    
            if (response?.ProcessCode === 101 || response?.processMessage?.includes("ERROR")) {
                toast.error(errorMessage);
                setIsFavorited((prev) => !prev);
            } else {
                // ✅ Instead of sending full property, send type + ID
                toggleFavorite({
                    id: isSingleProperty ? property.propertyID : property.projectID,
                    type: isSingleProperty ? "property" : "project",
                });
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.processMessage || "Something went wrong. Please try again.";
            toast.error(errorMessage);
            setIsFavorited((prev) => !prev);
        }
    };
    
    

    return (
        <MdOutlineFavorite
            className="favoriteIcon"
            style={{ color: isFavorited ? favoriteColor : "#ffffff" }} 
            onClick={handleToggleFavorite}
            role="button"
            aria-pressed={isFavorited}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        />
    );
};

export default FavoriteIcon;
