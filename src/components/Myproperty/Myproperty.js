
import React, { useEffect, useState } from 'react';
import { FaEdit, FaEye, FaInfoCircle, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearSelectedProperty,
    setSelectedAgentProperty,
    setSelectedProperty
} from '../../Redux/Slices/propertySlice';
import {setSelectedEditProperty } from '../../Redux/Slices/addListingsSlice';
import ListingModal from '../../components/ListingModal/ListingModal';
import './Myproperty.css';
import Dashboardmap from '../Googlemap/Dashboardmap/Dashboardmap';
import { useNavigate } from 'react-router-dom';
import { fetchMyproperty } from '../../API/api';
import Mypropertymodal from './Mypropertymodal/Mypropertymodal';

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
        // Close both modals if they are open
        setShowListingModal(false);
        setModalOpen(false);

        if (selectedPropertyForMap?.PropertyID === property.PropertyID) {
            // If the same property is clicked again, close the map
            setShowMap(false);
            setSelectedPropertyForMap(null);
        } else {
            // Otherwise, show the map for the new property
            dispatch(setSelectedAgentProperty(property));
            setShowMap(true);
            setSelectedPropertyForMap(property);
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
        // Close any open map first before opening ListingModal
        setShowMap(false);
        dispatch(setSelectedProperty(property));
        setShowListingModal(true);
        setModalOpen(false); // Close Mypropertymodal if open
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
                                    
                                    return (
                                           
                                    <tr key={property.PropertyID}>
                                        <td>
                                            <img
                                                 src={property.ImageUrls.split(',')[0]} 
                                                alt={property.PropertyName}
                                                className="agent-property-table__image"
                                                onClick={() => handlePropertyClick(property)} 
                                            />
                                        </td>
                                        <td>{property.PropertyName}</td>
                                        <td><FaRupeeSign style={{ fontSize: '9px' }}  /> {property.Amount}  {property.PriceUnit}</td>
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
)})}
                            </tbody>
                        </table>
                    )
                )}
            </div>
            {showMap && (
                <div className="dashboard-map-container">
                    <Dashboardmap onClose={handleCloseMap} />
                </div>
            )}
            { showListingModal  && selectedProperty && (
                <ListingModal
                    selectedProperty={selectedProperty}
                    onClose={handleCloseModal}

                />
            )}

            <Mypropertymodal isOpen={modalOpen} onClose={handleCloseModal} />
        </div>
    );
};

export default Myproperty;
