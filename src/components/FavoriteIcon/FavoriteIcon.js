import React, { useState, useEffect } from "react";
import { MdOutlineFavorite } from "react-icons/md";
import { useFavorites } from "../../context/FavoritesContext";
import { fetchAddprojectFavorties, fetchAddpropertyFavorties, fetchDeleteFavorties } from "../../API/api";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const FavoriteIcon = ({ groupproperty }) => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { Id } = useSelector((state) => state.auth.userDetails || {});

    const { toggleFavorite } = useFavorites();

    // Hooks must be at the top level, so initialize state before any condition
    const [isFavorited, setIsFavorited] = useState(false);

    // Extract property safely
    const property = groupproperty?.UnitTypeDetails?.[0];

    // Effect to reset favorite state when the property changes
    useEffect(() => {
        setIsFavorited(false);
    }, [property]);

    // If property is undefined, don't render the component
    if (!property) return null;

    const handleToggleFavorite = async (e) => {
        e.stopPropagation();

        try {
            const payload = property.ProjectID
                ? { ProjectID: property.ProjectID }
                : { PropertyID: property.PropertyID };

            const response = property.ProjectID
                ? await fetchAddprojectFavorties(bearerToken, payload)
                : await fetchAddpropertyFavorties(bearerToken, payload);

            let cleanMessage = response?.processMessage?.replace(/^(ERROR:|SUCCESS:)\s*/, "").trim() || "Operation completed";

            if (response?.ProcessCode === 101 || response?.processMessage?.includes("ERROR")) {
                // Call fetchDeleteFavorites on error
                try {
                    const deletePayload = { ...payload, UserID: Id };
                    const deleteResponse = await fetchDeleteFavorties(bearerToken, deletePayload);
                    let deleteMessage = deleteResponse?.processMessage?.replace(/^(ERROR:|SUCCESS:)\s*/, "").trim() || "Favorite removal failed.";
                    toast.error(deleteMessage);
                } catch (deleteError) {
                    toast.error(deleteError?.message || "Failed to remove favorite.");
                }
            } else {
                const newFavoritedState = !isFavorited;
                setIsFavorited(newFavoritedState);
                toggleFavorite(property, newFavoritedState);
                toast.success(cleanMessage || (newFavoritedState ? "Added to favorites!" : "Removed from favorites!"));
            }
        } catch (error) {
            console.error("Error updating favorite:", error);
            toast.error(error?.response?.data?.processMessage || "Something went wrong. Please try again.");
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
