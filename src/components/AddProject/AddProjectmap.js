import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import "./AddProjectmap.css";

const AddProjectmap = ({ formData, setFieldValue, setTouched, inputRef, geolocation, setGeolocation }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const autocompleteRef = useRef(null);
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Update Marker and Map Center based on FormData
  useEffect(() => {
    if (formData?.Latitude && formData?.Longitude) {
      const lat = parseFloat(formData.Latitude);
      const lng = parseFloat(formData.Longitude);
      const newLocation = { lat, lng };

      setGeolocation(newLocation);

      if (mapInstance && formData?.Latitude && formData?.Longitude) {
        mapInstance.panTo(newLocation);
      }
      
    }
  }, [formData.Latitude, formData.Longitude, mapInstance]);

  useEffect(() => {
    if (window.google && inputRef.current) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current);
      autocompleteRef.current.addListener("place_changed", handlePlaceSelected);
    }
  }, [inputRef]);

  const updateLocationFields = (lat, lng) => {
    setFieldValue("Latitude", lat.toString());
    setFieldValue("Longitude", lng.toString());
    setTouched("Latitude", true);
    setTouched("Longitude", true);
  };

  const handleMapClick = (event) => {
    if (event.detail?.placeId) {
      event.stop();
      return;
    }

    const latLng = event.detail?.latLng;
    if (latLng) {
      const { lat, lng } = latLng;
      const newLocation = { lat, lng };

      setGeolocation(newLocation);
      updateLocationFields(lat, lng);

      if (mapInstance) {
        mapInstance.panTo(newLocation);
      }
    }
  };

  const handlePlaceSelected = () => {
    const place = autocompleteRef.current.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const newLocation = { lat, lng };

      setGeolocation(newLocation);
      updateLocationFields(lat, lng);

      if (mapInstance) {
        mapInstance.panTo(newLocation);
      }
    }
  };

  return (
    <div className="geolocation-container">
      <APIProvider apiKey={API_KEY}>
        {/* Search Input for Places */}
        <div className="search-box">
          <input type="text" ref={inputRef} placeholder="Search for places..." className="search-input" />
        </div>

        {/* Map with Marker */}
        <Map
          center={geolocation} // Set the center to geolocation
          onClick={handleMapClick}
          onLoad={(map) => setMapInstance(map)}
          style={{ width: "100%", height: "460px" }}
          zoom={12}
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
