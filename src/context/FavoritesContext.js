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
        

         // Toggle favorite property
    const toggleFavorite = (property) => {
    
        setFavorites((prevFavorites) => {
            const isFavorite = prevFavorites.some((fav) => fav.PropertyID === property.PropertyID);
            const updatedFavorites = isFavorite
                ? prevFavorites.filter((fav) => fav.PropertyID !== property.PropertyID)
                : [...prevFavorites, property];

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
        setFavorites((prevFavorites) =>
            prevFavorites.map((property) =>
                property.PropertyID === propertyID
                    ? { ...property, shortlisted: !property.shortlisted }
                    : property
            )
        );
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, removeFavorite,toggleShortlist }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
