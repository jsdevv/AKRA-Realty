import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchGetprojectFavorites, fetchGetpropertyFavorites } from '../Redux/Slices/propertySlice';
import { useDispatch, useSelector } from 'react-redux';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const dispatch = useDispatch();
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { Id } = useSelector((state) => state.auth.userDetails || {});
    const { Projectfavorites = [], Propertyfavorites = [] } = useSelector((state) => state.properties);

    // Combined favorites state (API + local storage)
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites')) || []);
    const [favoriteColor, setFavoriteColor] = useState(() => localStorage.getItem("favoriteColor") || "#e31b23");

    // Fetch favorites on bearerToken or userId change
    useEffect(() => {
        if (bearerToken && Id) {
            dispatch(fetchGetprojectFavorites(bearerToken));
            dispatch(fetchGetpropertyFavorites(bearerToken));
        }
    }, [bearerToken, Id, dispatch]);

    // Sync API favorites with local storage
    useEffect(() => {
        const combinedFavorites = [...Projectfavorites, ...Propertyfavorites];
        if (combinedFavorites.length > 0) {
            setFavorites(combinedFavorites);
            localStorage.setItem("favorites", JSON.stringify(combinedFavorites));
        } else {
            setFavorites([]); // Clear if empty
            localStorage.removeItem("favorites");
        }
    }, [Projectfavorites, Propertyfavorites]);

    // Update localStorage whenever favorites change
    useEffect(() => {
        if (favorites.length > 0) {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } else {
            localStorage.removeItem('favorites');
        }
    }, [favorites]);

    // Handle storage change from other tabs/windows
    useEffect(() => {
        const handleStorageChange = () => {
            const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
            setFavorites((prevFavorites) =>
                JSON.stringify(prevFavorites) !== JSON.stringify(storedFavorites)
                    ? storedFavorites
                    : prevFavorites
            );
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Load favorite color from local storage
    useEffect(() => {
        const storedColor = localStorage.getItem("favoriteColor");
        if (storedColor) {
            setFavoriteColor(storedColor);
        }
    }, []);

    // Update favorite color
    const updateFavoriteColor = (color) => {
        setFavoriteColor(color);
        localStorage.setItem("favoriteColor", color);
    };

    // Toggle favorite property
    const toggleFavorite = ({ id, type }) => {
        setFavorites((prevFavorites) => {
            const isFavorite = prevFavorites.some((fav) =>
                type === "property" ? fav.PropertyID === id : fav.ProjectID === id
            );

            let updatedFavorites;
            if (isFavorite) {
                updatedFavorites = prevFavorites.filter((fav) =>
                    type === "property" ? fav.PropertyID !== id : fav.ProjectID !== id
                );
            } else {
                updatedFavorites = [
                    ...prevFavorites,
                    type === "property"
                        ? { PropertyID: id }
                        : { ProjectID: id },
                ];
            }

            // Update localStorage and then dispatch API fetch to sync state
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            dispatch(fetchGetprojectFavorites(bearerToken));  // Re-fetch project favorites
            dispatch(fetchGetpropertyFavorites(bearerToken)); // Re-fetch property favorites
            return updatedFavorites;
        });
    };

    // Remove a favorite
    const removeFavorite = (propertyID) => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = prevFavorites.filter(item => item.PropertyID !== propertyID);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Ensure localStorage is updated
            dispatch(fetchGetprojectFavorites(bearerToken));  // Re-fetch project favorites
            dispatch(fetchGetpropertyFavorites(bearerToken)); // Re-fetch property favorites
            return updatedFavorites;
        });
    };

    return (
        <FavoritesContext.Provider value={{
            favorites, toggleFavorite, removeFavorite, favoriteColor, updateFavoriteColor
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
