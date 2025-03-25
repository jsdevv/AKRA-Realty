import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddlistingFormData } from '../../../Redux/Slices/addListingsSlice';
import { useFormikContext } from 'formik';
import { mapStyle } from '../../Mapstyles/mapStyles';
import './Stepper3.css';
import { Autocomplete, TextField } from '@mui/material';
import { renderLabel } from '../../AddListings/validationSchema';

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
  const { values, handleChange, setFieldValue, errors, touched, validateForm } = useFormikContext();
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
      setFieldValue('PropertyCity', selectedProject.City, false);
      setFieldValue('PropertyAddress1', selectedProject.Address1, false);
      setFieldValue('PropertyAddress2', selectedProject.Address2, false);
      setFieldValue('PropertyZipCode', selectedProject.ZipCode, false);
      setFieldValue('PropertyLatitude', selectedProject.Latitude, false);
      setFieldValue('PropertyLongitude', selectedProject.Longitude, false);
      setFieldValue('Locality', selectedProject.Locality, false);
  
      if (selectedProject.Latitude && selectedProject.Longitude) {
         const lat = selectedProject.Latitude;
         const lng = selectedProject.Longitude;
        setSelectedLocation( `${lat}, ${lng}`);
        setFieldValue('Geolocation', `${lat}, ${lng}`, false);
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
    }else if(values.PropertyLatitude && values.PropertyLongitude){
      markerPosition.lat = values.PropertyLatitude * 1;
      markerPosition.lng = values.PropertyLongitude * 1;
    }
    setSelectedLocation(`${markerPosition.lat}, ${markerPosition.lng}`);
    setFieldValue('Geolocation', `${markerPosition.lat}, ${markerPosition.lng}`, false);
    const map = new window.google.maps.Map(addlistingmapRef.current, {
      center: markerPosition,
      zoom: 12,
      clickableIcons: false,
      styles: mapStyle,
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.SMALL,
        position: window.google.maps.ControlPosition.TOP_RIGHT,
      }
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
    setFieldValue('Geolocation', `${lat}, ${lng}`);
    dispatch(AddlistingFormData({ PropertyLatitude: lat, PropertyLongitude: lng }));
    getAddressFromGeolocation(lat, lng);
  };

  const getAddressFromGeolocation = async (lat, lng) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const addressComponents = data.results.reduce((max, result) => 
        result.address_components.length > max.address_components.length ? result : max
      ).address_components;
      const address = addressComponents.reduce((acc, component) => {
        if (component.types.includes('street_number')) {
          return { ...acc, street_number: component.long_name };
        }
        if (component.types.includes('route')) {
          return { ...acc, route: component.long_name };
        }
        if (component.types.includes('sublocality_level_1')) {
          return { ...acc, locality: component.long_name };
        }
        if (component.types.includes('locality')) {
          return { ...acc, city: component.long_name };
        }
        if (component.types.includes('sublocality_level_2')) {
          return { ...acc, sublocality: component.long_name };
        }
        if (component.types.includes('administrative_area_level_1')) {
          return { ...acc, state: component.long_name };
        }
        if (component.types.includes('postal_code')) {
          return { ...acc, postal_code: component.long_name };
        }
        if (component.types.includes('administrative_area_level_3')) {
          return { ...acc, district: component.long_name };
        }
        return acc;
      }, {});
      setFieldValue('PropertyCity', address.city || '', false);
      setFieldValue('PropertyZipCode', address.postal_code || '', false);
      setFieldValue('PropertyState', address.state || '', false);
      setFieldValue('Locality', address.locality || '', false);
      setFieldValue('SubLocality', address.sublocality || '', false);
      setFieldValue('district', address.district || '', false);
      setTimeout(() => validateForm());
    }
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
    if(value.endsWith('.')){
      setSelectedLocation(value);
      setFieldValue('Geolocation', value);
      return;
    }
    let [lat, lng] = value.split(',').map((val) => parseFloat(val.trim()));
    setSelectedLocation(value);
    setFieldValue('Geolocation', value);
    if(lat){
      handleChange({ target: { name: 'PropertyLatitude', value: lat.toString() } });
    }
    if(lng){
      handleChange({ target: { name: 'PropertyLongitude', value: lng.toString() } });
    }

    

    if (lat && lng) {
      updateLocationFields(lat, lng);
      // Dispatch the updated geolocation to Redux store
      dispatch(AddlistingFormData({ PropertyLatitude: lat, PropertyLongitude: lng }));
    } 
    
    if( !lat || !lng){
      lat = 17.411939407890586;
      lng = 78.46773935732759;
    }
    moveMarker(lat, lng, marker.current?.getMap());
  };

  return (
    <div className="stepper3-content">
      <div className="stepper3-form-container">

        <div className="stepper3-form-group">
          {renderLabel("PropertyAddress1", "Address1", values, 3)}
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="PropertyAddress1"
              placeholder='Address1'
              name="PropertyAddress1"
              value={values.PropertyAddress1} // Formik's value
              onChange={handleChange} // Using Formik's handleChange
              error={Boolean(errors.PropertyAddress1)}
            />
            {errors.PropertyAddress1 && (
              <div className="step1error-message">{errors.PropertyAddress1}</div>
            )}
          </div>

          <label htmlFor="PropertyAddress2">Address2:</label>
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="PropertyAddress2"
              placeholder='Address2'
              type="text"
              name="PropertyAddress2"
              value={values.PropertyAddress2} // Formik's value
              onChange={handleChange} // Using Formik's handleChange
            />
          </div>
        </div>

        <div className="stepper3-form-group">
          {renderLabel("PropertyZipCode", "Zip Code", values, 3)}
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="PropertyZipCode"
              placeholder='ZipCode'
              type="number"
              name="PropertyZipCode"
              value={values.PropertyZipCode} 
              onChange={handleChange}
              error={Boolean(errors.PropertyZipCode)}
            />
            {errors.PropertyZipCode && (
              <div className="step1error-message">{errors.PropertyZipCode}</div>
            )}
          </div>

          {renderLabel("PropertyCity", "City", values, 3)}
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="PropertyCity"
              placeholder='City'
              type="text"
              name="PropertyCity"
              value={values.PropertyCity} 
              onChange={handleChange} 
              error={errors.PropertyCity}
            />
            {errors.PropertyCity && (
              <div className="step1error-message">{errors.PropertyCity}</div>
            )}
          </div>
        </div>

        <div className="stepper3-form-group">
          {renderLabel("PropertyState", "State", values, 3)}
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="PropertyState"
              placeholder='State'
              type="text"
              name="PropertyState"
              value={values.PropertyState} // Formik's value
              onChange={handleChange} // Using Formik's handleChange
              error={Boolean(errors.PropertyState)}
              required
            />
             {errors.PropertyState && (
              <div className="step1error-message">{errors.PropertyState}</div>
            )}
          </div>

          {renderLabel("district", "District", values, 3)}
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="district"
              placeholder='district'
              type="text"
              name="district"
              value={values.district}
              onChange={handleChange}
              error={Boolean(errors.district)}
            />
            {errors.district && (
              <div className="step1error-message">{errors.district}</div>
            )}
          </div>
        </div>

        <div className="stepper3-form-group">
          {renderLabel("Locality", "Locality", values, 3)}
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="Locality"
              placeholder='Locality'
              type="text"
              name="Locality"
              value={values.Locality}
              onChange={handleChange}
              error={Boolean(errors.Locality)}
            />
            {errors.Locality && (
              <div className="step1error-message">{errors.Locality}</div>
            )}
          </div>

          {renderLabel("SubLocality", "Sub Locality", values, 3)}
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="SubLocality"
              placeholder='SubLocality'
              type="text"
              name="SubLocality"
              value={values.SubLocality}
              onChange={handleChange}
              error={Boolean(errors.SubLocality)}
            />
            {errors.SubLocality && (
              <div className="step1error-message">{errors.SubLocality}</div>
            )}
          </div>
        </div>

        <div className="stepper3-form-group">
          <label htmlFor="PropertyLandmark">Location:  </label>
          <div className='custom-textfield3'>
            <Autocomplete
              className="form-field-w-100"
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
          </div>

          <label htmlFor="Geolocation">Geolocation:</label>
          <div className='custom-textfield3'>
            <TextField
              className="form-field-w-100"
              id="Geolocation"
              placeholder="Enter Latitude, Longitude"
              type="text"
              name="Geolocation"
              value={values.Geolocation}  // Combine latitude and longitude as a string
              onChange={handleGeolocationInputChange}
              helperText={touched.Geolocation && errors.Geolocation}
              error={Boolean(errors.Geolocation)}
            />
            {errors.Geolocation && (
              <div className="step1error-message">{errors.Geolocation}</div>
            )}
          </div>
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
          {/* {
            <pre>
              {JSON.stringify(values, null, 2)}
            </pre>
          } */}
        </div>
      </div>
    </div>
  );
};

export default Stepper3;
