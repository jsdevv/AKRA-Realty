import React, { useCallback, useEffect, useMemo,  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetAlert } from '../../Redux/Slices/alertSlice';
import { FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";
import './Notification.css';
import { clearSelectedProperty, setSelectedProperty } from '../../Redux/Slices/propertySlice';
import ListingModal from '../../components/ListingModal/ListingModal';
import AlertMapView from '../../components/Googlemap/AlertMap/AlertMapView';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const Notification = () => {
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const { getalerts = [] } = useSelector((state) => state.alerts);
  const { selectedProperty } = useSelector((state) => state.properties);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
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
        acc[id].Properties.push(alert);
        return acc;
      }, {})
    );
  }, [getalerts]);

  const handlePropertyClick = useCallback((prop) => {
    console.log("Clicked property:", prop);
    dispatch(setSelectedProperty(prop));
    setModalOpen(true);
  }, [dispatch]);

  const handleCloseModal = () => {
    setModalOpen(false);
    dispatch(clearSelectedProperty());
  };

  const calculatePropertyCounts = (alert) => {
    const createdAt = new Date(alert.AlertCreatedAt);
    const total = alert.Properties.length;
    const newCount = alert.Properties.filter(
      (prop) => new Date(prop.PropertyCreatedAt) > createdAt
    ).length;
    return { total, new: newCount };
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

  return (
    <div className="alerts-container">
      <h2>My Alerts</h2>

      <table className="alerts-table">
        <thead>
          <tr>
            <th>Alert ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Total Properties</th>
            <th>New Properties</th>
          </tr>
        </thead>
        <tbody>
          {groupedAlerts.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-alerts">No alerts found.</td>
            </tr>
          ) : (
            groupedAlerts.map((alert) => {
              const { total, new: newCount } = calculatePropertyCounts(alert);
              const isSelected = selectedAlertId === alert.AlertId;

              if (selectedAlertId && !isSelected) return null;

              return (
                <React.Fragment key={alert.AlertId}>
                  <tr
                    onClick={() =>
                      setSelectedAlertId(isSelected ? null : alert.AlertId)
                    }
                    className={`alert-row ${isSelected ? 'active-row' : ''}`}
                  >
                    <td>{alert.AlertId}</td>
                    <td>{alert.Locality || 'N/A'}</td>
                    <td>{alert.PropertyStatus || 'N/A'}</td>
                    <td>{total}</td>
                    <td>{newCount}</td>
                  </tr>

                  {isSelected && (
                    <tr className="nested-row">
                      <td colSpan="6">
                        <div className="nested-properties-layout">
                          {/* LEFT: Property Table */}
                          <div className="nested-left">
                            <div className="nested-header">
                              <h4 className="nested-title">Properties in this Alert</h4>
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
                                {alert.Properties.map((prop) => (
                                  <tr
                                    key={prop.PropertyID}
                                    className={
                                      new Date(prop.PropertyCreatedAt) > new Date(alert.AlertCreatedAt)
                                        ? 'new-property-row'
                                        : ''
                                    }
                                  >
                                    <td>{prop.PropertyName}</td>
                                    <td>{prop.PropertyType}</td>
                                    <td><FaRupeeSign style={{ fontSize: '10px' }} /> {prop.Amount}</td>
                                    <td>{prop.PropertyStatus}</td>
                                    <td>{`${prop.Bedrooms} BHK` || "N/A"}</td>
                                    <td>{prop.SqFt}</td>
                                    <td>{prop.Locality}</td>
                                    <td
                                     className='details-link' 
                                    onClick={() => handlePropertyClick(prop)}>
                                      Details
                                    </td>
                                    <td className="map-icon-btn"
                                      onClick={() => {
                                        const lat = Number(prop.PropertyLatitude);
                                        const lng = Number(prop.PropertyLongitude);
                                        if (!isNaN(lat) && !isNaN(lng)) {
                                          setMapCenter({ lat, lng });
                                          setActiveInfoWindow(prop.PropertyID);
                                   
                                        }
                                      }}
                                      title="View on Map">

<FaMapMarkerAlt
  onClick={() => {
    console.log(prop,"rop");
    const lat = parseFloat(prop.PropertyLatitude);
    const lng = parseFloat(prop.PropertyLongitude);

    setMapCenter({ lat, lng });
    setActiveInfoWindow(prop.PropertyID);
  }}
/>

                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* RIGHT: Google Map */}
                          <div className="nested-right">

                            <AlertMapView
                              apiKey={API_KEY}
                              properties={alert.Properties}
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
