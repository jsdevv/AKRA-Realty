import React, { useState, useEffect } from "react";
import { fetchgetmapshapealert } from "../../API/api";
import { useSelector } from "react-redux";
import { FaRupeeSign, FaTimes } from "react-icons/fa";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "./Notification.css";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Haversine formula for calculating distance between two lat/lon coordinates
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

const Notification = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const { filteredProperties } = useSelector((state) => state.properties);
  // console.log(filteredProperties,"data");
  const [notifications, setNotifications] = useState([]);
  console.log(notifications,"notifications");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRowIndex, setActiveRowIndex] = useState(null); // Track active row index

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await fetchgetmapshapealert(bearerToken);

        const alerts = [];

        data.forEach((alert) => {
          const alertLat = parseFloat(alert.Latitude);
          const alertLon = parseFloat(alert.Longitude);
          const radius = parseFloat(alert.Radius) / 1000; // Convert to km

          let propertiesInAlert = 0;
          let newProperties = 0;
          const properties = [];

          filteredProperties.forEach((property) => {
            const propertyLat = parseFloat(property.PropertyLatitude);
            const propertyLon = parseFloat(property.PropertyLongitude);
            const distance = haversineDistance(alertLat, alertLon, propertyLat, propertyLon);

            // Check if property is within the radius of the alert
            if (distance <= radius) {
              propertiesInAlert++;
              if (property.isNew) { // Assuming there's a flag to check if the property is new
                newProperties++;
              }

              properties.push(property);
            }
          });

          const notification = {
            ...alert,
            totalProperties: propertiesInAlert,
            newProperties,
            properties,
          };

          alerts.push(notification);
        });

        setNotifications(alerts);
      } catch (err) {
        setError("Failed to load notifications. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [bearerToken, filteredProperties]);

  const handleRowClick = (index) => {
    if (activeRowIndex === index) {
      setActiveRowIndex(null); // Close the active row if clicked again
    } else {
      setActiveRowIndex(index); // Set the clicked row as active
    }
  };

  const closePropertyList = () => {
    setActiveRowIndex(null); // Close the property list view
  };

  return (
    <div className="property-notification-container">
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {notifications.length > 0 ? (
        <>
          <div className="property-notification-table-container">
            <table className="property-notification-table">
              <thead>
                <tr>
                  <th>Alert</th>
                  <th>Property Area</th>
                  <th>SqFt</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Total Properties</th>
                  <th>New Properties</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notification, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className={activeRowIndex === index ? "highlighted-row" : ""}
                      onClick={() => handleRowClick(index)} // Click to toggle visibility
                    >
                      <td>{`Alert ${notification.AlertID}`}</td>
                      <td>{notification.Locality}</td>
                      <td>{notification.sqFt}</td>
                      <td>{notification.Amount}</td>
                      <td>{notification.Status}</td>
                      <td>
                        <span className="clickable property-notification-item">
                          {notification.totalProperties}
                        </span>
                      </td>
                      <td>
                        <span className="clickable property-notification-item">
                          {notification.newProperties}
                        </span>
                      </td>
                    </tr>

                    {activeRowIndex === index && (
  <tr>
    <td colSpan="7">
      <div className="property-notifydetails-container">
        <div className="property-notification-listing-header">
          <h2>Properties in Radius</h2>
          <FaTimes onClick={closePropertyList} />
        </div>
        <div className="property-details-content">
          {/* Table (70%) */}
          <div className="property-details-table-container">
            <table className="property-details-table">
              <thead>
                <tr>
                  <th>Property Name</th>
                  <th>Amount</th>
                  <th>Area</th>
                  <th>Location</th>
                 
                 
                  <th>Zipcode</th>
                </tr>
              </thead>
              <tbody>
                {notification.properties.map((property, propIndex) => (
                  <tr key={propIndex}>
                    <td>{property.PropertyName}</td>
                    <td><FaRupeeSign style={{ fontSize: '10px' }} /> {property.Amount}</td>
                    <td>{property.SqFt} </td>
                    <td>{property.Locality}</td>
                   
                   
                    <td>{property.PropertyZipCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Map (30%) */}
          <div className="property-details-map-container">
            <APIProvider apiKey={API_KEY}>
              <Map
                defaultCenter={{
                  lat: parseFloat(notification.Latitude),
                  lng: parseFloat(notification.Longitude),
                }}
                defaultZoom={12}
                style={{ width: "100%", height: "100%" }}
              >
                {notification.properties.map((property, propIndex) => (
                  <Marker
                    key={propIndex}
                    position={{
                      lat: parseFloat(property.PropertyLatitude),
                      lng: parseFloat(property.PropertyLongitude),
                    }}
                  />
                ))}
              </Map>
            </APIProvider>
          </div>
        </div>
      </div>
    </td>
  </tr>
)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="property-notification-empty">No alerts at the moment.</div>
      )}

      
    </div>
  );
};

export default Notification;
