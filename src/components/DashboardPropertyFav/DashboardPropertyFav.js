import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash } from 'react-icons/fi';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import {
    clearSelectedProperty,
    fetchGetpropertyFavorites,
    setSelectedAgentProperty,
    setSelectedProperty
} from '../../Redux/Slices/propertySlice';
import {  fetchAddpropertyshortlist, fetchDeletePropertyFavorties, fetchDeletePropertyshortlist } from '../../API/api';
import ListingModal from '../../components/ListingModal/ListingModal';
import Favoritescompare from '../../components/Favoritescompare/Favoritescompare';
import { useFavorites } from '../../context/FavoritesContext';
import defaultimg from "../../images/Apartment102.jpeg"
import defaultimg1 from "../../images/Apartment103.jpeg"
import Slider from 'react-slick/lib/slider';
import DashboardFavmap from '../Googlemap/DashboardFavmap/DashboardFavmap';
import "./DashboardPropertyFav.css"

const DashboardPropertyFav = ({ propertyfavtype }) => {
    const dispatch = useDispatch();
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const { Id } = useSelector((state) => state.auth.userDetails || {});
    const {  removeFavorite } = useFavorites();
    const { selectedProperty, Propertyfavorites } = useSelector((state) => state.properties);

    const [selectedCompare, setSelectedCompare] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setSelectedCompare([]);
        dispatch(clearSelectedProperty());
        dispatch(setSelectedAgentProperty(null)); 
        if (bearerToken && Id && propertyfavtype === 'Property') {
            dispatch(fetchGetpropertyFavorites(bearerToken));
        }
    }, [bearerToken, propertyfavtype, Id, dispatch]);

    const handleCompareSelect = (PropertyID) => {
        setSelectedCompare((prev) =>
            prev.includes(PropertyID) ? prev.filter((id) => id !== PropertyID) : [...prev, PropertyID]
        );
    };

    const handleLocationClick = (Property) => {
      
        if (propertyfavtype === 'Property') {
            dispatch(setSelectedAgentProperty(Property));
        }

    };

    const openComparisonModal = () => {
        if (selectedCompare.length < 2) {
            alert('Please select at least two Properties to compare.');
            return;
        }
        setIsModalOpen(true);
    };

    const closeComparisonModal = () => {
        setIsModalOpen(false);
        // setSelectedCompare([]);
    };

    const handlePopupOpen = useCallback(
        (Property) => dispatch(setSelectedProperty(Property)),
        [dispatch]
    );

    const handleCloseModal = useCallback(() => dispatch(clearSelectedProperty()), [dispatch]);

    const handleRemoveFavorite = async (Property) => {
        removeFavorite(Property.PropertyID);
        const payload = { PropertyID: Property.PropertyID, UserID: Id };

        try {
            await fetchDeletePropertyFavorties(bearerToken, payload);
            dispatch(fetchGetpropertyFavorites(bearerToken));
        } catch (error) {
            console.error("Error removing favorite:", error);
        }
    };


    const toggleShortlist = async (Property) => {
        const isShortlisted = Property.ShortlistStatus === "Y";
        const payload = { PropertyID: Property.PropertyID };
    
        try {
            const response = isShortlisted
                ? await fetchDeletePropertyshortlist(bearerToken, { ...payload, UserID: Id })
                : await fetchAddpropertyshortlist(bearerToken, { ...payload, UserID: Id });
    
            console.log('Shortlist Toggle Response:', response);
    
            dispatch(fetchGetpropertyFavorites(bearerToken));

        } catch (error) {
            console.error('Error toggling shortlist:', error);
        }
    };
    

    return (
        <div className="favoritesproject-container">
            <div className='projectfav-box'>
                <div className='projectfavleft-section'>
                    {Propertyfavorites?.length === 0 ? (
                        <p className="dashboard-favorites-empty">You haven't saved any property favorites yet.</p>
                    ) : (
                        <table className="dashboard-favorites-table ">
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Property Name</th>
                                    <th>Price</th>
                                    <th>Location</th>
                                    <th>Details</th>
                                    <th>Shortlist</th>
                                    <th>Compare</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Propertyfavorites.map((Property) => {
                               
                                    const imageUrls = [
                                        ...(Property.ProjectImageUrls ? Property.ProjectImageUrls.split(',').map(url => url.trim()) : []) ,
                                        ...(Property.PropertyImageUrls ? Property.PropertyImageUrls.split(',').map(url => url.trim()) : [])
                                                
                                      ].filter(url => url);


                                    const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg, defaultimg1];
                                    const settings = {
                                        // dots: true,
                                        infinite: true,
                                        speed: 500,
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                        arrows: false,
                                    };
                                    return (
                                        <tr key={Property.PropertyID}>
                                            <td>

                                                <Slider {...settings} className="dashboardslider">
                                                    {imagesToShow.map((url, index) => (
                                                        <div key={index}

                                                            onClick={() => handlePopupOpen(Property)} >
                                                            <img
                                                                src={url}
                                                                alt={`Slide ${index + 1}`}
                                                                className="favproperty-table__image"
                                                                loading="lazy"
                                                           
                                                            />
                                                        </div>
                                                    ))}

                                                </Slider>
                                            </td>
                                            <td>{Property.PropertyName}</td>
                                            <td>₹ {Property.Amount}</td>
                                            <td>{Property.Locality}</td>
                                            <td>
                                                <button className="dashboard-details-button" onClick={() => handlePopupOpen(Property)}>Details</button>
                                            </td>
                                            <td>
                                                <button 
                                
                                                  className={`dashboard-shortlist-button ${Property.ShortlistStatus === "Y" ? 'shortlisted' : ''}`}
                                                  onClick={() => toggleShortlist(Property)}>
                                                    <FaStar className={`dashboard-shortlist-icon  ${Property.ShortlistStatus === "Y" ? 'highlighted' : ''}`} />
                                                    
                                                </button>
                                            </td>
                                            <td>
                                                <input className="dashboard-compare" type="checkbox" checked={selectedCompare.includes(Property.PropertyID)} onChange={() => handleCompareSelect(Property.PropertyID)} />
                                            </td>
                                            <td>
                                                <button className="dashboard-remove-button" onClick={() => handleLocationClick(Property)}>
                                                    <FaMapMarkerAlt />
                                                </button>
                                                <button className="dashboard-remove-button" onClick={() => handleRemoveFavorite(Property)}>
                                                    <FiTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className='projectfavright-section'>
                    <DashboardFavmap favData = {Propertyfavorites} />
                </div>

            </div>

            {selectedCompare.length >= 2 && (
    <div className="dashboard-favcompare-button-container">
        {selectedCompare.length >= 11 ? (
            <p className="error-message">You can compare a maximum of 10 properties only.</p>
        ) : (
            selectedCompare.length <= 11 && <p>{selectedCompare.length} properties selected for comparison</p>
        )}

        {selectedCompare.length <= 10 && (
            <button className="dashboard-favcompare-button" onClick={openComparisonModal}>
                Compare
            </button>
        )}
    </div>
)}



            {isModalOpen && (
                <Favoritescompare propertyType="Property" properties={Propertyfavorites.filter((Property) => selectedCompare.includes(Property.PropertyID))} onClose={closeComparisonModal} />
            )}

            {selectedProperty && (
                <ListingModal propertyType="Property" selectedProperty={selectedProperty} onClose={handleCloseModal} bearerToken={bearerToken} />
            )}
        </div>
    );
};

export default DashboardPropertyFav;
