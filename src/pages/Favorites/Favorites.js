import './Favorites.css';
import React, { useCallback, useEffect, useState } from 'react';
import Favoritescompare from '../../components/Favoritescompare/Favoritescompare';
import { useFavorites } from '../../context/FavoritesContext';
import { FiTrash } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa'; // Star icon
import {
    clearSelectedProperty,
    fetchGetprojectFavorites,
    fetchGetpropertyFavorites,
    setSelectedProperty
} from '../../Redux/Slices/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import defaultimg1 from "../../images/Apartment102.jpeg"
import defaultimg2 from "../../images/Apartment103.jpeg"
import Slider from 'react-slick/lib/slider';
import ListingModal from '../../components/ListingModal/ListingModal';
import { fetchDeleteProjectFavorties, fetchDeletePropertyFavorties } from '../../API/api';

const Favorites = () => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
     const { Id } = useSelector((state) => state.auth.userDetails || {});
    const { favorites, removeFavorite, toggleShortlist } = useFavorites(); // Add updateFavorite
    const { selectedProperty, Projectfavorites, Propertyfavorites } = useSelector((state) => state.properties);
    const [selectedFavoritecompare, setSelectedFavoritescompare] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('Project');
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (bearerToken && Id) {
            const fetchFavorites = activeTab === 'Project' ? fetchGetprojectFavorites : fetchGetpropertyFavorites;
            dispatch(fetchFavorites(bearerToken));
        }
    }, [bearerToken, activeTab,Id, dispatch]);

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
            console.log(property,"property");
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

    const filteredFavorites = activeTab === 'Project' ? Projectfavorites : Propertyfavorites;
    const sortedFavorites = filteredFavorites ? [...filteredFavorites].sort((a, b) => b.shortlisted - a.shortlisted) : [];
    const propertyUrls = sortedFavorites?.ProjectImageUrls || sortedFavorites?.PropertyImageUrls;
    const imageUrls = propertyUrls ? propertyUrls.split(',').map(url => url.trim()).filter(Boolean) : [];
    const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg1, defaultimg2];

    const handleRemoveFavorite = async (property) => {
 

        console.log(favorites,"favorites");
        
        removeFavorite(property.PropertyID ); 
        const payload = activeTab === 'Project' ? { ProjectID: property.ProjectID } : { PropertyID: property.PropertyID };

        try {
            let response;
            if (activeTab === 'Property') {
                response = await fetchDeletePropertyFavorties(bearerToken, { ...payload, UserID: Id });
            } else {
                response = await fetchDeleteProjectFavorties(bearerToken, { ...payload, UserID: Id });
            }
              
        } catch (error) {
            console.error("Error removing favorite:", error);
        }

        if (activeTab === 'Property') {
            dispatch(fetchGetpropertyFavorites(bearerToken));  // Fetch updated favorites list
        } else {
            dispatch(fetchGetprojectFavorites(bearerToken));  // Fetch updated favorites list
        }
    };
    
    return (
        <>
            <div className="favorites-container">
         
            
                    <div className="favorites-tabs">
                        <button
                            className={`favtab-button ${activeTab === 'Project' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('Project');
                                setSelectedFavoritescompare([]); // Clear selected properties for comparison
                            }}
                        >
                            Project Favorites
                        </button>
                        <button
                            className={`favtab-button ${activeTab === 'Property' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab('Property');
                                setSelectedFavoritescompare([]); // Clear selected properties for comparison
                            }}
                        >
                            Property Favorites
                        </button>
                    </div>
     
                {sortedFavorites.length === 0 ? (
                    <p className="favorites-empty">You haven't saved any favorites yet.</p>
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
                                                        onClick={() => handleRemoveFavorite(property)}
                                                        aria-label="Remove from favorites"
                                                    >
                                                        <FiTrash />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="favorites-address-container">
                                                <div className="favorites-address">
                                                    {activeTab === 'Property' ? (
                                                        <span>₹ {property.Amount}</span> // Keep property prices as they are
                                                    ) : (
                                                        <span>
                                                            ₹ {property.MinPrice} - ₹ {property.MaxPrice}
                                                        </span> // Add Rupee symbol for projects
                                                    )} <br />
                                                    {property.PropertyCardLine3}
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
                                                    className={`shortlist-button ${property.shortlisted ? 'shortlisted' : ''
                                                        }`}
                                                    onClick={() => toggleShortlist(property.PropertyID)}
                                                    aria-label="Shortlist property"
                                                >
                                                    <FaStar
                                                        className={`shortlist-icon ${property.shortlisted ? 'highlighted' : ''
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
                    propertyType={activeTab === 'Project' ? 'Project' : 'Property'}
                    selectedProperty={selectedProperty}
                    onClose={handleCloseModal}
                    bearerToken={bearerToken}
                />
            )}
        </>
    );
};

export default Favorites;
