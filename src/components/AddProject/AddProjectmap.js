import React, {  useEffect, useRef } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import "./AddProjectmap.css";

const AddProjectmap = ({ formData,  setFieldValue, setTouched,inputRef,geolocation, setGeolocation }) => {
  const mapRef = useRef(null);

  const autocompleteRef = useRef(null);
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (formData?.Latitude && formData?.Longitude) {
      setGeolocation({
        lat: formData.Latitude,
        lng: formData.Longitude,
      });
    }
  }, [formData]);

  useEffect(() => {
    if (window.google && inputRef.current) {
      // Initialize Google Places Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
      autocompleteRef.current.addListener('place_changed', handlePlaceSelected);
    }
  }, []);

  const updateLocationFields = (lat, lng) => {
    setFieldValue('Latitude', lat.toString());
    setFieldValue('Longitude', lng.toString());
    setTouched("Latitude", true);
  };

  const handleMapClick = (event) => {

    if (event.detail?.placeId) {
      event.stop(); // Prevent default behavior (e.g., showing Google Maps info)
      return;
    }
    const latLng = event.detail?.latLng;
  
    if (latLng) {
      const { lat, lng } = latLng;
      setGeolocation({ lat, lng });
      updateLocationFields(lat, lng);

      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
      }
    } else {
      console.error("Invalid latLng object in event:", event);
    }
  };

  const handlePlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setGeolocation({ lat, lng });
      updateLocationFields(lat, lng);

      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
      }
    }
  };

  return (
    <div className="geolocation-container">
      <APIProvider apiKey={API_KEY}>
        {/* Search Input for Places */}
        <div className="search-box">
          <input
            type="text"
            ref={inputRef}
            placeholder="Search for places..."
            className="search-input"
          />
        </div>

        {/* Map with Marker */}
        <Map
          center={geolocation}
          onClick={handleMapClick}
          ref={mapRef}
          style={{ width: "100%", height: "460px" }}
          defaultZoom={10}
          gestureHandling="greedy"
          options={{
            mapTypeControl: true,
            zoomControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
          mapId="5e34ee2a0a0595d8"
        >
          <Marker position={geolocation} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default AddProjectmap;
