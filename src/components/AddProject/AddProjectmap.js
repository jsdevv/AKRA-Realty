import React, { useEffect, useRef, useState } from "react";
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps";
import "./AddProjectmap.css";

const DEFAULT_CENTER = { lat: 17.4431794, lng: 78.461534 };
const DEFAULT_ZOOM = 10;
const INTERACTION_ZOOM = 14; // Zoom in on interactions

const AddProjectmap = ({ formData, setFieldValue, setTouched, inputRef, geolocation, setGeolocation }) => {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapClickedAddress, setMapClickedAddress] = useState(null);
  const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (formData?.Latitude && formData?.Longitude) {
      const lat = parseFloat(formData.Latitude);
      const lng = parseFloat(formData.Longitude);
      const newLocation = { lat, lng };

      if (geolocation.lat !== lat || geolocation.lng !== lng) {
        setGeolocation(newLocation);
        if (mapInstance) {
          mapInstance.panTo(newLocation);
          mapInstance.setZoom(INTERACTION_ZOOM); // Zoom in when form data is set
        }
      }
    } else {
      setGeolocation(DEFAULT_CENTER);
    }
  }, [formData.Latitude, formData.Longitude]);

  

  const updateLocationFields = (lat, lng) => {
    setFieldValue("Latitude", lat.toString());
    setFieldValue("Longitude", lng.toString());
    setTouched?.("Latitude", true);
    setTouched?.("Longitude", true);
  };

  const handleMapClick = (event) => {
    const latLng = event.detail?.latLng;
    if (latLng) {
      const lat = latLng.lat;
      const lng = latLng.lng;
      const newLocation = { lat, lng };

      setGeolocation(newLocation);
      updateLocationFields(lat, lng);
      if (mapInstance) {
        mapInstance.panTo(newLocation);
        mapInstance.setZoom(INTERACTION_ZOOM); // Zoom in on click
      }

      // Reverse Geocode to Update Input Field
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: newLocation }, (results, status) => {
        if (status === "OK" && results[0]) {
          setMapClickedAddress(results[0].formatted_address);
        }
      });
    }
  };

  return (
    <div className="geolocation-container">
      <APIProvider apiKey={API_KEY} libraries={['places']}>
        
        <Map
          defaultCenter={geolocation}
          onClick={handleMapClick}
          onLoad={(map) => {
            setMapInstance(map);
            map.setZoom(DEFAULT_ZOOM); // Initial zoom level
          }}
          style={{ width: "100%", height: "360px" }}
          defaultZoom={DEFAULT_ZOOM}
           gestureHandling="greedy"
           clickableIcons={false}
          options={{
            mapTypeControl: true,
            zoomControl: true,
            streetViewControl: true,
            fullscreenControl: true,
          }}
          mapId="5e34ee2a0a0595d8"
        >
          <Marker position={geolocation} draggable={true} onDragEnd={(event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            handleMapClick({ detail: { latLng: { lat, lng } } });
          }} />
        </Map>
        <SearchAddress address={mapClickedAddress} inputRef={inputRef} onPlaceSelected={(newLocation)=>{
          setGeolocation(newLocation);
          updateLocationFields(newLocation.lat, newLocation.lng);
        }} />
      </APIProvider>
    </div>
  );
};

const SearchAddress = ({address, inputRef, onPlaceSelected}) => {
  const map = useMap();
  const autocompleteRef = useRef(null);
  const localInputRef = useRef(null);
  const [newLocation, setNewLocation] = useState(null);

  useEffect(() => {
    console.log("Map loaded", map);
    if (!map || !newLocation) return;
    map.panTo(newLocation);
    map.setZoom(INTERACTION_ZOOM);
    // do something with the map instance
  }, [map, newLocation]);
  
  useEffect(() => {
    if (address) {
      const inputElement = inputRef?.current || localInputRef.current;
      if (inputElement) {
        inputElement.value = address;
      }
    }
  }, [address]);

  useEffect(() => {
    const inputElement = inputRef?.current || localInputRef.current;
  
    if (window.google?.maps?.places && inputElement) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputElement);
      autocompleteRef.current.addListener("place_changed", handlePlaceSelected);
    }
  
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, []);
  

  const handlePlaceSelected = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const loc = { lat, lng };
      onPlaceSelected(loc);
      setNewLocation(loc);
    }
  };

  return <div className="search-box">
  <input type="text" ref={inputRef || localInputRef} placeholder="Search for places..." className="search-input" />
</div>;
};
export default AddProjectmap;
