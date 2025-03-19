import React, { useState, useEffect } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { useFavorites } from "../../context/FavoritesContext";
import { 
    fetchAddprojectFavorties,
    fetchAddpropertyFavorties, 
    fetchDeleteProjectFavorties,
    fetchDeletePropertyFavorties 
} from "../../API/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const FavoriteIcon = ({ groupproperty }) => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { Id } = useSelector((state) => state.auth.userDetails || {});
    const { favorites, toggleFavorite } = useFavorites();
    const property = groupproperty?.UnitTypeDetails?.[0];
    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        if (property) {
            setIsFavorited(favorites.some((fav) => fav.PropertyID === property.PropertyID));
        }
    }, [favorites, property]);

    if (!property) return null;

    const handleToggleFavorite = async (e) => {
        e.stopPropagation();

        const isSingleProperty = Array.isArray(groupproperty.Amount) && groupproperty.Amount.length === 1;
        const payload = isSingleProperty
            ? { PropertyID: property.PropertyID }
            : { ProjectID: property.ProjectID };

        try {
            let response;
            if (!isFavorited) {
                response = isSingleProperty
                    ? await fetchAddpropertyFavorties(bearerToken, payload)
                    : await fetchAddprojectFavorties(bearerToken, payload);
            } else {
                response = isSingleProperty
                    ? await fetchDeletePropertyFavorties(bearerToken, { ...payload, UserID: Id })
                    : await fetchDeleteProjectFavorties(bearerToken, { ...payload, UserID: Id });
            }

            const successMessage = response?.processMessage?.includes("SUCCESS")
            ? response.processMessage.replace(/^SUCCESS:\s*/, "").trim()
            : "Action completed successfully.";

        const errorMessage = response?.processMessage?.includes("ERROR")
            ? response.processMessage.replace(/^ERROR:\s*/, "").trim()
            : "An error occurred, please try again.";

            if (response?.ProcessCode === 101 || response?.processMessage?.includes("ERROR")) {
                toast.error(errorMessage);
            } else {
                toggleFavorite(property);
                toast.success(successMessage);
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.processMessage || "Something went wrong. Please try again.";
            toast.error(errorMessage);
        }
    };

    return (
        <MdOutlineFavorite
            className={`favoriteIcon ${isFavorited ? "favorited" : ""}`}
            onClick={handleToggleFavorite}
            role="button"
            aria-pressed={isFavorited}
            aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        />
    );
};

export default FavoriteIcon;
