import React, { useCallback, useState } from 'react';
import Favoritescompare from '../Favorites/Favoritescompare/Favoritescompare';
import { useFavorites } from '../../context/FavoritesContext';
import { FiTrash } from 'react-icons/fi';
import { FaMapMarkerAlt, FaRupeeSign, FaStar } from 'react-icons/fa'; // Star icon
import { clearSelectedProperty, setSelectedAgentProperty, setSelectedProperty } from '../../Redux/Slices/propertySlice';
import { useDispatch, useSelector } from 'react-redux';
import ListingModal from '../ListingModal/ListingModal';
import './DashboardFavorites.css';
import DashboardFavmap from '../Googlemap/DashboardFavmap/DashboardFavmap';
import defaultimg from "../../images/Akriti1.jpg"
import defaultimg1 from "../../images/Akriti2.jpg"
import Slider from 'react-slick/lib/slider';


const DashboardFavorites = () => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
     const { selectedAgentProperty, selectedProperty } = useSelector((state) => state.properties);
    const { favorites, removeFavorite, toggleShortlist } = useFavorites();
    console.log(favorites, "fav");
    const [selectedFavoritecompare, setSelectedFavoritescompare] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();

    const sortedFavorites = [...favorites].sort((a, b) => b.shortlisted - a.shortlisted);

        const handleLocationClick = (property) => {
            // Close both modals if they are open

                dispatch(setSelectedAgentProperty(property));
        
        };

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

    return (
        <>
            <div className="dashboard-favorites-container">
                <div className="dashboard-favorites-main">
                    {sortedFavorites.length === 0 ? (
                        <div className="dashboard-favorites-table-container">
                        <table className="dashboard-favorites-table">
                            <thead>
                                <tr>
                                    <th>Listings</th>
                                    <th>Property Name</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Area</th>
                                    <th>Details</th>
                                    <th>Shortlist</th>
                                    <th>Compare</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colSpan="10" style={{padding:'10px', fontSize:'12px', textAlign: 'center' }}>No properties available in your favorites.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    ) : (
                        <div className="dashboard-favorites-table-container">
                            <table className="dashboard-favorites-table">
                                <thead>
                                    <tr>
                                        <th>Listings</th>
                                        <th>Property Name</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                        <th>Area</th>
                                        <th>Details</th>
                                        <th>Shortlist</th>
                                        <th>Compare</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedFavorites.map((property) => {
                                                   const imageUrls = property.PropertyImageUrls
                                                   ? property.PropertyImageUrls.split(',').map(url => url.trim())
                                                   : property.ProjectImageUrls
                                                     ? property.ProjectImageUrls.split(',').map(url => url.trim())
                                                     : [];
                                                 
                                   
                                                     const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg,defaultimg1];
                                                const settings = {
                                                  // dots: true,
                                                  infinite: true,
                                                  speed: 500,
                                                  slidesToShow: 1,
                                                  slidesToScroll: 1,
                                                  arrows: true,
                                                };
                                        return(
                                        <tr key={property.PropertyID}>
                                            <td>
                                            

                                                      <Slider {...settings}>
                                                                            {imagesToShow.map((url, index) => (
                                                                              <div key={index} 
                                                                              
                                                    onClick={() => handlePopupopen(property)} >
                                                                                <img
                                                                                  src={url}
                                                                                  alt={`Slide ${index + 1}`}
                                                                                  className="favproperty-table__image"
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
                                            </td>
                                            <td>{property.PropertyName}</td>
                                            <td><FaRupeeSign style={{ fontSize: '9px' }} /> {property.Amount}</td>
                                            <td>{property.PropertyType}</td>
                                            <td>{property.PropertyStatus}</td>
                                            <td>{property.SqFt}</td>


                                            <td>
                                                <button
                                                    className="dashboard-details-button"
                                                    onClick={() => handlePopupopen(property)}
                                                >
                                                    Details
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className={`dashboard-shortlist-button ${property.shortlisted ? 'dashboard-shortlisted' : ''}`}
                                                    onClick={() => toggleShortlist(property.PropertyID)}
                                                >
                                                    <FaStar
                                                        className={`dashboard-shortlist-icon ${property.shortlisted ? 'dashboard-shortlist-highlighted' : ''}`}
                                                    />
                                                </button>
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFavoritecompare.includes(property.PropertyID)}
                                                    onChange={() => handleCompareSelect(property.PropertyID)}
                                                />
                                            </td>
                                            <td>

                                                <div className="agent-property-btn-container">

                                                <FaMapMarkerAlt
                                                        className="agent-property-icon"
                                                        title="Location"
                                                        onClick={() => handleLocationClick(property)}
                                                    />
                                                    <FiTrash className="dashboard-remove-button"
                                                        onClick={() => removeFavorite(property.PropertyID)} />

                                                
                                                </div>


                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="dashboard-favorites-map-container">
                        <DashboardFavmap />
                        {/* <h2>hello</h2> */}
                    </div>
                </div>
            </div>
            {selectedFavoritecompare.length >= 2 && (
                <div className="dashboard-favcompare-button-container">
                    <p>{selectedFavoritecompare.length} favorite properties to compare</p>
                    <button
                        className="dashboard-favcompare-button"
                        onClick={openComparisonModal}
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

export default DashboardFavorites;
