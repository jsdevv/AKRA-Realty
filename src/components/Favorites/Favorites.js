import './Favorites.css';
import React, { useCallback, useState } from 'react';
import Favoritescompare from '../Favorites/Favoritescompare/Favoritescompare';
import { useFavorites } from '../../context/FavoritesContext';
import { FiTrash } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa'; // Star icon
import { clearSelectedProperty, setSelectedProperty } from '../../Redux/Slices/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import ListingModal from '../ListingModal/ListingModal';
import defaultimg1 from "../../images/Apartment102.jpeg"
import defaultimg2 from "../../images/Apartment103.jpeg"
import Slider from 'react-slick/lib/slider';

const Favorites = () => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { favorites, removeFavorite, toggleShortlist } = useFavorites(); // Add updateFavorite
    const { selectedProperty } = useSelector((state) => state.properties);
    const [selectedFavoritecompare, setSelectedFavoritescompare] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();

    // Reorder favorites based on shortlist status
    const sortedFavorites = [...favorites].sort((a, b) => b.shortlisted - a.shortlisted);

    const propertyUrls = sortedFavorites?.ProjectImageUrls || sortedFavorites?.PropertyImageUrls;
    const imageUrls = propertyUrls ? propertyUrls.split(',').map(url => url.trim()).filter(Boolean) : [];
    const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg1, defaultimg2];

console.log(imagesToShow);


    console.log(sortedFavorites,"sortedFavorites");

    const handleCompareSelect = (propertyID) => {
        setSelectedFavoritescompare((prev) =>
            prev.includes(propertyID)
                ? prev.filter((id) => id !== propertyID)
                : [...prev, propertyID]
        );
    };

    const openComparisonModal = () => {
        if (selectedFavoritecompare.length < 2) {
            alert('Please select at least two properties to compare.');
            return;
        }
        setIsModalOpen(true);
    };

    const closeComparisonModal = () => {
        setIsModalOpen(false);
        setSelectedFavoritescompare([]);
    };

    const handlePopupopen = useCallback(
        (property) => {
            dispatch(setSelectedProperty(property));
        },
        [dispatch]
    );

    const handleCloseModal = useCallback(() => {
        dispatch(clearSelectedProperty());
    }, [dispatch]);

    const settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
      };

    return (
        <>
            <div className="favorites-container">
                <h2 className="favorites-header">My Favorites</h2>
                {sortedFavorites.length === 0 ? (
                    <p className="favorites-empty">You haven't saved any homes yet.</p>
                ) : (
                    <div>
                        <div className="favorites-grid">
                            {sortedFavorites.map((property) => {
                                    const propertyUrls = property.ProjectImageUrls || property.PropertyImageUrls;
                                    const imageUrls = propertyUrls ? propertyUrls.split(',').map(url => url.trim()).filter(Boolean) : [];
                                    const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg1, defaultimg2];
                                return (
                                    <div key={property.PropertyID} className="favorites-card">
                                     

                                        <div className="favorites-image-container">
                                            <Slider {...settings}>
                                                                       {imagesToShow.map((url, index) => (
                                                                         <div key={index} 
                                                                    >
                                                                           <img
                                                                             src={url}
                                                                             alt={`Slide ${index + 1}`}
                                                                             className="favorites-image"
                                                                             loading="lazy"
                                                                             style={{
                                                                               maxWidth: "100%",
                                                                               maxHeight: "200px",
                                                                               objectFit: "cover",
                                                                             }}
                                                                           />
                                                                         </div>
                                                                       ))}
                                                                       
                                                                     </Slider>
                                        </div>
                                        <div className="favorites-details">
                                            <div className="favoritestop-container">
                                                <div className="favorites-title">
                                                    {property.PropertyName}
                                                </div>
                                                <div className="favcompare-checkbox">
                                                    <label>
                                                        Compare
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedFavoritecompare.includes(property.PropertyID)}
                                                            onChange={() => handleCompareSelect(property.PropertyID)}
                                                            aria-label="Select for comparison"
                                                        />
                                                    </label>
                                                    <button
                                                        className="favorites-remove-button"
                                                        onClick={() => removeFavorite(property.PropertyID)}
                                                        aria-label="Remove from favorites"
                                                    >
                                                        <FiTrash />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="favorites-address-container">
                                                <div className="favorites-address">
                                                    {property.PropertyType} | {property.PropertyBedrooms} |{' '}
                                                    {property.SqFt}<br />
                                                    {property.PropertyArea} | {property.PropertyCity}
                                                </div>
                                                <button
                                                    className="details-button"
                                                    onClick={() => handlePopupopen(property)}
                                                    aria-label="View property details"
                                                >
                                                    Details
                                                </button>
                                            </div>
                                            {/* Shortlist Button */}
                                            <div className="shortlist-button-container">
                                                <button
                                                    className={`shortlist-button ${
                                                        property.shortlisted ? 'shortlisted' : ''
                                                    }`}
                                                    onClick={() => toggleShortlist(property.PropertyID)}
                                                    aria-label="Shortlist property"
                                                >
                                                    <FaStar
                                                        className={`shortlist-icon ${
                                                            property.shortlisted ? 'highlighted' : ''
                                                        }`}
                                                    />
                                
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            {selectedFavoritecompare.length >= 2 && (
                <div className="favcompare-button-container">
                    <p>{selectedFavoritecompare.length} favorite properties to compare</p>
                    <button
                        className="favcompare-button"
                        onClick={openComparisonModal}
                        aria-label="Compare selected favorites"
                    >
                        Compare
                    </button>
                </div>
            )}
            {isModalOpen && (
                <Favoritescompare
                    properties={favorites.filter((property) =>
                        selectedFavoritecompare.includes(property.PropertyID)
                    )}
                    onClose={closeComparisonModal}
                />
            )}
            {selectedProperty && (
                <ListingModal
                    selectedProperty={selectedProperty}
                    onClose={handleCloseModal}
                    bearerToken={bearerToken}
                />
            )}
        </>
    );
};

export default Favorites;
