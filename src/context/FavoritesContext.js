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
                if (property?.propertyID) {
                    property.PropertyID = property.propertyID;
                }
                if (property?.projectID) {
                    property.ProjectID = property.projectID;
                }
            
                setFavorites((prevFavorites) => {
                    const isFavorite = prevFavorites.some((fav) =>
                        (fav.PropertyID && fav.PropertyID === property.PropertyID) ||
                        (fav.ProjectID && fav.ProjectID === property.ProjectID)
                    );
            
                    let updatedFavorites;
                    if (isFavorite) {
                        updatedFavorites = prevFavorites.filter(
                            (fav) =>
                                (property.PropertyID && fav.PropertyID !== property.PropertyID) &&
                                (property.ProjectID && fav.ProjectID !== property.ProjectID)
                        );
                    } else {
                        updatedFavorites = [
                            ...prevFavorites,
                            {
                                ...(property.PropertyID && { PropertyID: property.PropertyID }),
                                ...(property.ProjectID && { ProjectID: property.ProjectID }),
                            },
                        ];
                    }
            
                    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
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

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite, favoriteColor,updateFavoriteColor  }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
