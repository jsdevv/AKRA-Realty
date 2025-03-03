import React, { createContext, useContext, useState, useEffect } from 'react';


const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

        // Update localStorage whenever favorites change
        useEffect(() => {
            if (favorites.length > 0) {
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        }, [favorites]);

        useEffect(() => {
            const handleStorageChange = () => {
                const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
                setFavorites(storedFavorites);
            };
        
            window.addEventListener('storage', handleStorageChange);
        
            return () => {
                window.removeEventListener('storage', handleStorageChange);
            };
        }, []);
        

    const toggleFavorite = (property) => {
        const propertyID = property.PropertyID;
        const isFavorite = favorites.some((fav) => fav.PropertyID === propertyID);

        if (isFavorite) {
            const updatedFavorites = favorites.filter((fav) => fav.PropertyID !== propertyID);
            setFavorites(updatedFavorites);
       
        } else {
            const updatedFavorites = [...favorites, property];
            setFavorites(updatedFavorites);
        }
    };

    const removeFavorite = (propertyID) => {
        const updatedFavorites = favorites.filter((fav) => fav.PropertyID !== propertyID);
        setFavorites(updatedFavorites);
    };

    const toggleShortlist = (propertyID) => {
        const updatedFavorites = favorites.map((property) =>
            property.PropertyID === propertyID
                ? { ...property, shortlisted: !property.shortlisted }
                : property
        );
        setFavorites(updatedFavorites);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite,toggleShortlist }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
