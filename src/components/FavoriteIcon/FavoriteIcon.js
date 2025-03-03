// FavoriteIcon.js
import React from 'react';
import { MdOutlineFavorite } from 'react-icons/md';
import { useFavorites } from '../../context/FavoritesContext';

const FavoriteIcon = ({ property, onClick }) => {
    const { favorites, toggleFavorite } = useFavorites();

    const isFavorited = favorites.some((fav) => fav.PropertyID === property.PropertyID);

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        toggleFavorite(property);
    };

    return (
        <MdOutlineFavorite
            className={isFavorited ? 'favoriteIcon favorited' : 'favoriteIcon'}
            onClick={onClick ? onClick : handleToggleFavorite}
            role="button"
            aria-pressed={isFavorited}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        />
    );
};

export default FavoriteIcon;
