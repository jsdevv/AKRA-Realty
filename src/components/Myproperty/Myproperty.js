
import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaInfoCircle, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearSelectedProperty,
    setSelectedAgentProperty,
    setSelectedProperty
} from '../../Redux/Slices/propertySlice';
import ListingModal from '../../components/ListingModal/ListingModal';
import './Myproperty.css';
import Dashboardmap from '../Googlemap/Dashboardmap/Dashboardmap';
import { useNavigate } from 'react-router-dom';
import { fetchMyproperty } from '../../API/api';
import Mypropertymodal from './Mypropertymodal/Mypropertymodal';
import Slider from 'react-slick/lib/slider';

const Myproperty = ({ showMap, setShowMap, handleEditClick }) => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [myProperty, setMyproperty] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPropertyForMap, setSelectedPropertyForMap] = useState(null);
    const [showListingModal, setShowListingModal] = useState(false);
    const { selectedProperty, loading, error } = useSelector((state) => state.properties);



    useEffect(() => {
        dispatch(clearSelectedProperty());
        dispatch(setSelectedAgentProperty(null));
        const fetchProperties = async () => {
            try {
                const data = await fetchMyproperty(bearerToken);
                setMyproperty(data); // Assuming setProperties stores the properties in the Redux store
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
    }, [dispatch]);

    const handleViewClick = (property) => {
        dispatch(setSelectedAgentProperty(property));
        navigate('/owner');
    };

    const handleLocationClick = (property) => {

        console.log("Property Data:", property);

        // Ensure valid latitude and longitude values
        const lat = parseFloat(property.PropertyLatitude);
        const lng = parseFloat(property.PropertyLongitude);

        if (isNaN(lat) || isNaN(lng)) {
            console.error("Invalid latitude or longitude:", property.PropertyLatitude, property.PropertyLongitude);
            return;
        }

        // Close both modals if they are open
        setShowListingModal(false);
        setModalOpen(false);

        if (selectedPropertyForMap?.PropertyID === property.PropertyID) {
            setShowMap(false);
            setSelectedPropertyForMap(null);
        } else {
            dispatch(setSelectedAgentProperty(property));
            setShowMap(true);
            setSelectedPropertyForMap({
                ...property,
                Latitude: lat,
                Longitude: lng,
            });
        }
    };


    const handleCloseMap = () => {
        setShowMap(false);
        setSelectedPropertyForMap(null);
    };


    const openModal = (property) => {
        dispatch(setSelectedProperty(property));
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        dispatch(clearSelectedProperty());
    };

    const handleInfoIconClick = (property) => {
        // Close both modals if they are open
        setShowListingModal(false);
        setShowMap(false);
        // Open the Mypropertymodal
        openModal(property);
    };


    const handlePropertyClick = (property) => {

        setShowMap(false);
        dispatch(setSelectedProperty(property));
        setShowListingModal(true);
        setModalOpen(false);
    };

    return (
        <div className={`dashboard-content ${showMap ? 'show-map' : ''}`}>
            <div className="agent-properties-view__table-container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error loading properties: {error.message}</p>
                ) : (
                    myProperty.length > 0 && (
                        <table className="agent-properties-view__table">
                            <thead>
                                <tr>
                                    <th>Listings</th>
                                    <th>Property Name</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>City</th>
                                    <th>Pincode</th>
                                    <th>Area</th>
                                    <th>BedRooms</th>
                                    <th>Location</th>
                                    <th>Facing</th>
                                    <th>Actions</th>
                                    <th>More</th>

                                </tr>
                            </thead>
                            <tbody>
                                {myProperty.map((property) => {

                                    const settings = {
                                        infinite: true,
                                        speed: 500,
                                        slidesToShow: 1,
                                        slidesToScroll: 1,
                                        arrows: false,
                                    };

                                    return (

                                        <tr key={property.PropertyID}>
                                            <td>
                                                <Slider {...settings} className="myslider">
                                                    {property.PropertyImageUrls.split(',').map((image, index) => (
                                                        <div key={index}>
                                                            <img
                                                                src={image.trim()}
                                                                alt={property.PropertyName}
                                                                className="myproperty-table__image"
                                                                loading="lazy"
                                                              
                                                                onClick={() => handlePropertyClick(property)}
                                                            />
                                                        </div>
                                                    ))}
                                                </Slider>
                                            </td>
                                            <td>{property.PropertyName}</td>
                                            <td><FaRupeeSign style={{ fontSize: '9px' }} /> {property.Amount}  {property.PriceUnit}</td>
                                            <td>{property.PropertyType}</td>
                                            <td>{property.PropertyStatus}</td>
                                            <td>{property.PropertyCity}</td>
                                            <td>{property.PropertyZipCode}</td>
                                            <td>{property.SqFt} {property.MeasurementType}</td>
                                            <td>{property.Bedrooms} BHK</td>
                                            <td>{property.SubLocality}</td>
                                            <td>{property.propertymainentrancefacing}</td>

                                            <td>
                                                <div className="agent-property-btn-container">
                                                    <FaEye
                                                        className="agent-property-icon"
                                                        title="View Property"
                                                        onClick={() => handleViewClick(property)}
                                                    />

                                                    <FaMapMarkerAlt
                                                        className="agent-property-icon"
                                                        title="Location"
                                                        onClick={() => handleLocationClick(property)}
                                                    />
                                                    <FaEdit
                                                        className="agent-property-icon"
                                                        title="Edit"
                                                        onClick={() => handleEditClick(property)}
                                                    />

                                                </div>
                                            </td>
                                            <td>
                                                <FaInfoCircle
                                                    className="info-icon"
                                                    title="View Value & Rental Details"
                                                    onClick={() => handleInfoIconClick(property)}
                                                />
                                            </td>

                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )
                )}
            </div>
            {showMap && (
                <div className="dashboard-map-container">
                    {myProperty.length > 0 && <Dashboardmap onClose={handleCloseMap} myProperty={myProperty} />}
                </div>
            )}
            {showListingModal && selectedProperty && (
                <ListingModal
                    propertyType="Property"
                    selectedProperty={selectedProperty}
                    onClose={handleCloseModal}

                />
            )}

            <Mypropertymodal isOpen={modalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Myproperty;
