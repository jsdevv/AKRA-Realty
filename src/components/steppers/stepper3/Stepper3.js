import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddlistingFormData } from '../../../Redux/Slices/addListingsSlice';
import { useFormikContext } from 'formik';
import { mapStyle } from '../../Mapstyles/mapStyles';
import './Stepper3.css';
import { Autocomplete, TextField } from '@mui/material';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Stepper3 = ({formData}) => {

  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const { ProjectID } = formData; 
  const projectData = useSelector((state) => state.listings.projectData) || [];
  const selectedProject = projectData.find(project => project.ProjectID === ProjectID);
  const dispatch = useDispatch();
  const addlistingmapRef = useRef(null);
  const marker = useRef(null);
  const autocomplete = useRef(null);
  const { values, handleChange,setFieldValue } = useFormikContext();
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (
      selectedProject?.City ||
      selectedProject?.Address1 ||
      selectedProject?.Address2 ||
      selectedProject?.ZipCode ||
      selectedProject?.Latitude ||
      selectedProject?.Longitude ||
      selectedProject?.Locality
    ) {
      setFieldValue('PropertyCity', selectedProject.City);
      setFieldValue('PropertyAddress1', selectedProject.Address1);
      setFieldValue('PropertyAddress2', selectedProject.Address2);
      setFieldValue('PropertyZipCode', selectedProject.ZipCode);
      setFieldValue('PropertyLatitude', selectedProject.Latitude);
      setFieldValue('PropertyLongitude', selectedProject.Longitude);
      setFieldValue('Locality', selectedProject.Locality);
  
      if (selectedProject.Latitude && selectedProject.Longitude) {
         const lat = selectedProject.Latitude;
         const lng = selectedProject.Longitude;
        setSelectedLocation( `${lat}, ${lng}`);
        if (marker.current) {
          marker.current.setPosition({ lat, lng });
          const map = marker.current.getMap();
          map.setCenter({ lat, lng });
          marker.current.setAnimation(window.google.maps.Animation.DROP);
        }
      }
    }
  }, [selectedProject, setFieldValue]);
  
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (mapLoaded || !addlistingmapRef.current) return; // Ensure mapRef is defined and map isn't loaded

    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
    script.async = true;
    script.onerror = (error) => {
      console.error('Error loading Google Maps script:', error);
    };
    document.head.appendChild(script);

    window.initMap = () => {
      setMapLoaded(true);
      initializeMap();
    };

  }, [mapLoaded, dispatch, bearerToken]);

  const initializeMap = useCallback(() => {

    const markerPosition = {
      lat: 17.411939407890586,
      lng: 78.46773935732759
    };
    if(selectedProject?.Latitude && selectedProject?.Longitude){
      markerPosition.lat = selectedProject.Latitude * 1;
      markerPosition.lng = selectedProject.Longitude * 1;
    }
    setSelectedLocation(`${markerPosition.lat}, ${markerPosition.lng}`);
    const map = new window.google.maps.Map(addlistingmapRef.current, {
      center: markerPosition,
      zoom: 12,
      styles: mapStyle,
    });

    marker.current = new window.google.maps.Marker({
      position: map.getCenter(),
      map: map,
      draggable: true,  // Allow marker to be draggable
    });

    map.addListener('mouseover', () => {
      map.getDiv().style.cursor = 'pointer';
    });

    map.addListener('mouseout', () => {
      map.getDiv().style.cursor = 'default';
    });

    window.google.maps.event.addListener(map, 'click', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      updateLocationFields(lat, lng);
      moveMarkerSmoothly(lat, lng, map);
    });

    const input = document.getElementById('address-search');
    autocomplete.current = new window.google.maps.places.Autocomplete(input);
    autocomplete.current.addListener('place_changed', () => {
      const place = autocomplete.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        updateLocationFields(lat, lng);
        moveMarker(lat, lng, map);
      } else {
        console.error('Place has no geometry:', place);
      }
    });

    // Add marker drag end listener
    window.google.maps.event.addListener(marker.current, 'dragend', (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      updateLocationFields(lat, lng);
      moveMarkerSmoothly(lat, lng, map);
    });
  }, []);

  const moveMarker = (lat, lng, map) => {
    if (marker.current) {
      const targetPosition = new window.google.maps.LatLng(lat, lng);
      marker.current.setPosition(targetPosition);
      map.setCenter(targetPosition);  // Center the map on the marker's position
      map.setZoom(12); // Optional: Adjust zoom level
    }
  };

  const moveMarkerSmoothly = (lat, lng, map) => {
    if (marker.current) {
      const targetPosition = new window.google.maps.LatLng(lat, lng);
      marker.current.setPosition(targetPosition);
      map.panTo(targetPosition);  // Smoothly pan the map to the marker's position
      map.setZoom(14); // Optional: Adjust zoom level
    }
  };

  const updateLocationFields = (lat, lng) => {
    handleChange({ target: { name: 'PropertyLatitude', value: lat.toString() } });
    handleChange({ target: { name: 'PropertyLongitude', value: lng.toString() } });
    setSelectedLocation(`${lat}, ${lng}`);
    dispatch(AddlistingFormData({ PropertyLatitude: lat, PropertyLongitude: lng }));
  };

  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    handleChange({ target: { name, value } });

    if ((name === 'PropertyLatitude' || name === 'PropertyLongitude') && values.PropertyLatitude && values.PropertyLongitude) {
      moveMarker(values.PropertyLatitude, values.PropertyLongitude, marker.current?.getMap());
    }
  };

  const handleGeolocationInputChange = (e) => {
    const { value } = e.target;
    const [lat, lng] = value.split(',').map((val) => parseFloat(val.trim()));
    setSelectedLocation(value);
    if(lat){
      handleChange({ target: { name: 'PropertyLatitude', value: lat.toString() } });
    }
    if(lng){
      handleChange({ target: { name: 'PropertyLongitude', value: lng.toString() } });
    }

    if (lat && lng) {
      updateLocationFields(lat, lng);
      moveMarker(lat, lng, marker.current?.getMap());

      // Dispatch the updated geolocation to Redux store
      dispatch(AddlistingFormData({ PropertyLatitude: lat, PropertyLongitude: lng }));
    }
  };

  return (
    <div className="stepper3-content">
      <div className="stepper3-form-container">

        <div className="stepper3-form-group">
          <label htmlFor="PropertyAddress1">Address1:</label>
          <TextField
            className="custom-textfield3"
            id="PropertyAddress1"
            placeholder='Address1'
            name="PropertyAddress1"
            value={values.PropertyAddress1} // Formik's value
            onChange={handleChange} // Using Formik's handleChange

          />

          <label htmlFor="PropertyAddress2">Address2:</label>
          <TextField
            className="custom-textfield3"
            id="PropertyAddress2"
            placeholder='Address2'
            type="text"
            name="PropertyAddress2"
            value={values.PropertyAddress2} // Formik's value
            onChange={handleChange} // Using Formik's handleChange
          />

        </div>

        <div className="stepper3-form-group">
          <label htmlFor="PropertyZipCode">Zip Code:</label>
          <TextField
            className="custom-textfield3"
            id="PropertyZipCode"
            placeholder='ZipCode'
            type="number"
            name="PropertyZipCode"
            value={values.PropertyZipCode} 
            onChange={handleChange}

          />

          <label htmlFor="PropertyCity">City:</label>
          <TextField
            className="custom-textfield3"
            id="PropertyCity"
            placeholder='City'
            type="text"
            name="PropertyCity"
            value={values.PropertyCity} 
            onChange={handleChange} 

          />

        </div>

        <div className="stepper3-form-group">

          <label htmlFor="PropertyState">State: </label>
          <TextField
            className="custom-textfield3"
            id="PropertyState"
            placeholder='State'
            type="text"
            name="PropertyState"
            value={values.PropertyState} // Formik's value
            onChange={handleChange} // Using Formik's handleChange
            required
          />

          <label htmlFor="Locality">District:</label>
          <TextField
            className="custom-textfield3"
            id="district"
            placeholder='district'
            type="text"
            name="district"
            value={values.district}
            onChange={handleChange}

          />

        </div>

        <div className="stepper3-form-group">
          <label htmlFor="Locality">Locality:</label>
          <TextField
            className="custom-textfield3"
            id="Locality"
            placeholder='Locality'
            type="text"
            name="Locality"
            value={values.Locality}
            onChange={handleChange}

          />


          <label htmlFor="SubLocality">Sub Locality:</label>
          <TextField
            className="custom-textfield3"
            id="SubLocality"
            placeholder='SubLocality'
            type="text"
            name="SubLocality"
            value={values.SubLocality}
            onChange={handleChange}

          />
        </div>

        <div className="stepper3-form-group">

          <label htmlFor="PropertyLandmark">Location:  </label>
          <Autocomplete
            className="custom-textfield3"
            id="ShowLocation"
            options={["Yes", "No"]}
            getOptionLabel={(option) => option}
            value={values.ShowLocation || "Yes"} // Default to "Yes" if no value is set
            onChange={(event, newValue) => {
              handleChange({ target: { name: "ShowLocation", value: newValue } });
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Location Available?" />
            )}
          />

          <label htmlFor="Geolocation">Geolocation:</label>
          <TextField
            className="custom-textfield3"
            id="Geolocation"
            placeholder="Enter Latitude, Longitude"
            type="text"
            name="Geolocation"
            value={selectedLocation}  // Combine latitude and longitude as a string
            onChange={handleGeolocationInputChange}
          />
        </div>
      </div>

      <div className="stepper3-map-container">
        <div className='address-search-container'>

          <TextField
            id="address-search"
            placeholder="Enter a location"
            variant="outlined"
            fullWidth
            onChange={handleManualInputChange} // Optional: Handle manual input change
          />
        </div>

        <div className="stepper3-box stepper3-map">
          <div ref={addlistingmapRef} className="stepper3-map-view"></div>
        </div>
      </div>
    </div>
  );
};

export default Stepper3;
