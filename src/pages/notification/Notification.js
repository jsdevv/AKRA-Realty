import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAlertSeen, fetchGetAlert } from '../../Redux/Slices/alertSlice';
import { FaHeart, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import { clearSelectedProperty, setSelectedProperty } from '../../Redux/Slices/propertySlice';
import ListingModal from '../../components/ListingModal/ListingModal';
import AlertMapView from '../../components/Googlemap/AlertMap/AlertMapView';
import { useFavorites } from '../../context/FavoritesContext';
import { usePropertyFavorite } from '../../customHooks/usePropertyFavorite';
import './Notification.css';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Notification = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const { Id } = useSelector((state) => state.auth.userDetails || {});
  const { getalerts = [] } = useSelector((state) => state.alerts);
  const { selectedProperty } = useSelector((state) => state.properties);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const [filteredType, setFilteredType] = useState("Total");
  const { favorites, favoriteColor, toggleFavorite } = useFavorites();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 17.385044, lng: 78.486671 });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGetAlert(bearerToken));
  }, [dispatch, bearerToken]);

  const groupedAlerts = useMemo(() => {
    return Object.values(
      getalerts.reduce((acc, alert) => {
        const id = alert.AlertId;
        if (!acc[id]) {
          acc[id] = {
            ...alert,
            Properties: [],
          };
        }
  
        // Only include properties with valid PropertyID
        if (alert.PropertyID) {
          acc[id].Properties.push(alert);
        }
  
        return acc;
      }, {})
    );
  }, [getalerts]);
  

  const handlePropertyClick = useCallback((prop) => {
    dispatch(setSelectedProperty(prop));
    setModalOpen(true);
  }, [dispatch]);

  const handleCloseModal = () => {
    setModalOpen(false);
    dispatch(clearSelectedProperty());
  };

  const calculatePropertyCounts = (alert) => {
    const validProperties = alert.Properties.filter(prop => prop.PropertyID);
    const total = validProperties.length;
    const newCount = validProperties.filter((prop) => !prop.Seen).length;
    const oldCount = validProperties.filter((prop) => prop.Seen).length;
  
    return { total, new: newCount, old: oldCount };
  };
  


  useEffect(() => {
    if (!selectedAlertId || !groupedAlerts.length) return;

    const selectedAlert = groupedAlerts.find(
      (alert) => alert.AlertId === selectedAlertId
    );

    if (selectedAlert && selectedAlert.Properties.length) {
      const firstValidProperty = selectedAlert.Properties.find((prop) => {
        const lat = Number(prop.PropertyLatitude);
        const lng = Number(prop.PropertyLongitude);
        return !isNaN(lat) && !isNaN(lng);
      });

      if (firstValidProperty) {
        const lat = Number(firstValidProperty.PropertyLatitude);
        const lng = Number(firstValidProperty.PropertyLongitude);
        setMapCenter({ lat, lng }); // 👈 Update center
      }
    }
  }, [selectedAlertId, groupedAlerts]);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2)} Cr`;  // Convert to Crores
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(2)} L`;  // Convert to Lakhs
    } else {
      return price.toLocaleString();  // Keep as is for amounts less than 1 Lakh
    }
  };

  // Function to format the price range
  const formatPriceRange = (priceRange) => {
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);
    const minFormatted = formatPrice(minPrice);
    const maxFormatted = formatPrice(maxPrice);
    return `${minFormatted} - ${maxFormatted}`;
  };

  const calculateBedrooms = (properties) => {
    const bedroomCounts = properties
      .map((prop) => prop.Bedrooms)
      .filter((bedroom) => bedroom !== undefined && bedroom !== null);

    if (bedroomCounts.length === 0) return "N/A";

    const minBedrooms = Math.min(...bedroomCounts);
    const maxBedrooms = Math.max(...bedroomCounts);

    return minBedrooms === maxBedrooms ? `${minBedrooms}` : `${minBedrooms}-${maxBedrooms}`;
  };


  const filteredProperties = useMemo(() => {
    if (!selectedAlertId) return [];  // Return empty if no alert is selected

    const selectedAlert = groupedAlerts.find(alert => alert.AlertId === selectedAlertId);

    if (!selectedAlert || !selectedAlert.Properties || !Array.isArray(selectedAlert.Properties)) {
      return []; // Ensure Properties exists and is an array
    }

    return selectedAlert.Properties.filter((prop) => {
      const isSeen = prop.Seen === true;

      // Filter based on the selected type
      if (filteredType === "New") {
        return !isSeen; // Only "new" properties that are unseen
      }

      if (filteredType === "Viewed") {
        return isSeen; // Only "old" properties that are seen
      }

      return true; // "all" type shows all properties

    });
  }, [selectedAlertId, groupedAlerts, filteredType]);  // Recalculate when these change
  
  const handleToggleFavorite = usePropertyFavorite(favorites, toggleFavorite, bearerToken, Id);

  return (
    <div className="alerts-container">
      <h2>My Alerts</h2>

      <table className="alerts-table">
        <thead>
          <tr>
            <th>Alert ID</th>
            <th>PropertyType</th>
            <th>With In 50KM's Of Location</th>
            <th>Status</th>
            <th>Bedrooms</th>
            <th>Price Range</th>
            <th>New Properties</th>
            <th>Viewed Properties</th>
            <th>Total Properties</th>
          </tr>
        </thead>
        <tbody>
          {groupedAlerts.length === 0 ? (
            <tr>
              <td colSpan="9" className="no-alerts">No alerts found.</td>
            </tr>
          ) : (
            groupedAlerts.map((alert) => {
              const { total, new: newCount, old: oldCount } = calculatePropertyCounts(alert);
              const isSelected = selectedAlertId === alert.AlertId;
              const priceRangeFormatted = formatPriceRange(alert.AlertPriceRange);

              if (selectedAlertId && !isSelected) return null;
              // Remove duplicate property types
              let uniquePropertyTypes = "";

              if (alert.Properties && alert.Properties.length > 0) {
                // Extract and deduplicate from alert.Properties
                uniquePropertyTypes = [
                  ...new Set(alert.Properties.map((prop) => prop.AlertPropertyType)),
                ]
                  .filter(Boolean) // Remove null/undefined
                  .join(", ");
              } else if (alert.AlertPropertyType) {
                // Fallback to main AlertPropertyType string, split by commas, remove duplicates
                const typesArray = alert.AlertPropertyType
                  .split(",")
                  .map((type) => type.trim())
                  .filter(Boolean);
              
                const uniqueTypes = [...new Set(typesArray)];
                uniquePropertyTypes = uniqueTypes.join(", ");
              }
              
              console.log(alert,"unique")

              const bedroomRange = calculateBedrooms(alert.Properties);

              return (
                <React.Fragment key={alert.AlertId}>
                  <tr
                    className={`alert-row ${isSelected ? 'active-row' : ''}`}
                  >
                    <td>{alert.AlertId}</td>
                    <td> {uniquePropertyTypes || "N/A"}</td>
                    <td>{alert.AlertSearchLocation || 'N/A'}</td>
                    <td>{alert.AlertPropertyStatus || 'N/A'}</td>

                    <td>{bedroomRange}</td>

                    <td>
                      <FaRupeeSign style={{ fontSize: '10px', marginRight: '5px' }} />
                      {priceRangeFormatted}
                    </td>

                    <td
                      className={`clickable-cell ${filteredType === 'New' ? 'active-filter' : ''}`}
                      onClick={() => {
                        setSelectedAlertId(isSelected ? null : alert.AlertId);
                        setFilteredType("New");
                        const payload = { AlertId: alert.AlertId, UserId: Id };
                        dispatch(fetchAlertSeen({ bearerToken, payload }));

                      }}
                    >{newCount}</td>
                    <td
                      className={`clickable-cell ${filteredType === 'Viewed' ? 'active-filter' : ''}`}
                      onClick={() => {
                        setSelectedAlertId(isSelected ? null : alert.AlertId);
                        setFilteredType("Viewed");
                      }}
                    >{oldCount}</td>
                    <td
                      className={`clickable-cell ${filteredType === 'Total' ? 'active-filter' : ''}`}
                      onClick={() => {
                        setSelectedAlertId(isSelected ? null : alert.AlertId);
                        setFilteredType("Total");
                      }}
                    >{total}</td>
                  </tr>

                  {isSelected && (
                    <tr className="nested-row">
                      <td colSpan="9">
                        <div className="nested-properties-layout">
                          {/* LEFT: Property Table */}
                          <div className="nested-left">
                            <div className="nested-header">
                              <h4 className="nested-title">{filteredType} Properties in this Alert</h4>
                              <button
                                className="alertclose-btn"
                                onClick={() => setSelectedAlertId(null)}
                              >
                                ✕
                              </button>
                            </div>
                            <table className="nested-table">
                              <thead>
                                <tr>
                                  <th>Property Name</th>
                                  <th>Property Type</th>
                                  <th>Amount</th>
                                  <th>Status</th>
                                  <th>BHK</th>
                                  <th>Area</th>
                                  <th>Location</th>
                                  <th>Details</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredProperties && Array.isArray(filteredProperties) && filteredProperties.length > 0 ? (
                                  filteredProperties.map((prop) => {
                                    const isFavorited = favorites.some(fav => fav.PropertyID === prop.PropertyID);
                                    return (
                                      <tr
                                        key={prop.PropertyID}
                                        className={
                                          new Date(prop.PropertyCreatedAt) > new Date(alert.AlertCreatedAt)
                                            ? 'new-property-row'
                                            : ''
                                        }
                                      >
                                        <td>{prop.PropertyName || "N/A"}</td>
                                        <td>{prop.PropertyType || "N/A"}</td>
                                        <td><FaRupeeSign style={{ fontSize: '10px' }} /> {prop.Amount || "N/A"}</td>
                                        <td>{prop.PropertyStatus || "N/A"}</td>
                                        <td>{`${prop.Bedrooms || "N/A"} BHK`}</td>
                                        <td>{prop.SqFt || "N/A"}</td>
                                        <td>{prop.Locality || "N/A"}</td>
                                        <td
                                          className='details-link'
                                          onClick={() => handlePropertyClick(prop)}
                                        >
                                          Details
                                        </td>
                                        <td  >
                                          <FaHeart
                                            // className="action-icon"
                                            style={{ color: isFavorited ? favoriteColor : "#bbb", cursor: "pointer", marginRight: "5px" }}
                                            onClick={() => handleToggleFavorite(prop)}
                                          />

                                          <FaMapMarkerAlt
                                            className="map-icon-btn"
                                            onClick={() => {
                                              const lat = Number(prop.PropertyLatitude);
                                              const lng = Number(prop.PropertyLongitude);
                                              if (!isNaN(lat) && !isNaN(lng)) {
                                                setMapCenter({ lat, lng });
                                                setActiveInfoWindow(prop.PropertyID);
                                              }
                                            }}
                                            title="View on Map"
                                          />
                                        </td>
                                      </tr>
                                    )
                                  }

                                  ))
                                  : (
                                    <tr>
                                      <td colSpan="9">No data available</td>
                                    </tr>
                                  )}

                              </tbody>
                            </table>
                          </div>

                          {/* RIGHT: Google Map */}
                          <div className="nested-right">

                            <AlertMapView
                              apiKey={API_KEY}
                              properties={filteredProperties}
                              mapCenter={mapCenter}
                              setMapCenter={setMapCenter}
                              activeInfoWindow={activeInfoWindow}
                              setActiveInfoWindow={setActiveInfoWindow}
                            />

                          </div>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
      {modalOpen && selectedProperty && (
        <ListingModal
          propertyType="Property"
          selectedProperty={selectedProperty}
          onClose={handleCloseModal}
          bearerToken={bearerToken}
        />
      )}

    </div>
  );
};

export default Notification;
