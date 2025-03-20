import React, { createContext, useContext, useState, useEffect } from 'react';
import {fetchGetprojectFavorites, fetchGetpropertyFavorites } from '../Redux/Slices/propertySlice';
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
    

    useEffect(() => {
        if (bearerToken && Id) {
            dispatch(fetchGetprojectFavorites(bearerToken));
            dispatch(fetchGetpropertyFavorites(bearerToken));
        }
    }, [bearerToken, Id, dispatch]);
    
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
        setFavorites(storedFavorites);
    }, []);

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
                localStorage.removeItem('favorites'); // Remove if empty
             
            }
        }, [favorites]);
        

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

        useEffect(() => {
            const storedColor = localStorage.getItem("favoriteColor");
            if (storedColor) {
                setFavoriteColor(storedColor);
            }
        }, []);
        
        const updateFavoriteColor = (color) => {
            setFavoriteColor(color);
            localStorage.setItem("favoriteColor", color);
        };
        
        
              // Toggle favorite property
              const toggleFavorite = (property) => {
                setFavorites((prevFavorites) => {
                    const isFavorite = prevFavorites.some((fav) => fav.PropertyID === property.PropertyID);
                    const updatedFavorites = isFavorite
                        ? prevFavorites.filter((fav) => fav.PropertyID !== property.PropertyID) // Remove
                        : [...prevFavorites, property]; // Add
        
                    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Sync with storage
                    return updatedFavorites;
                });
            };

    // Remove a favorite
 const removeFavorite = (propertyID) => {

    setFavorites((prevFavorites) => {
        const updatedFavorites = prevFavorites.filter(item => item.PropertyID !== propertyID);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Ensure localStorage is updated
        return updatedFavorites;
    });
};

const toggleShortlist = (propertyID) => {
    setFavorites((prevFavorites) => {
        const updatedFavorites = prevFavorites.map((property) =>
            property.PropertyID === propertyID
                ? { ...property, shortlisted: !property.shortlisted }
                : property
        );
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Sync with localStorage
        return updatedFavorites;
    });
};



    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite,toggleShortlist, favoriteColor,updateFavoriteColor  }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
