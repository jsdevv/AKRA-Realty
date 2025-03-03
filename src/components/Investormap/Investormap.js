import React, { useRef, useEffect, useState, useCallback } from 'react';
import { FaTimes } from 'react-icons/fa'; // Importing React Icon for close button
import './Investormap.css';
import { mapStyle } from '../Mapstyles/mapStyles';

const statusStyles = {
  "For Sale": { bgColor: "#A3000B", color: "white" },
  PreLaunch: { bgColor: "#007BFF", color: "white" },
  Rental: { bgColor: "#7A48D6", color: "white" },
  Sold: { bgColor: "#1E5128", color: "white" },
  default: { bgColor: "#7A48D6", color: "white" },
};
const getStatusStyles = (status) =>
  statusStyles[status] || statusStyles.default;
const { Map: GMap } = await window.google.maps.importLibrary("maps");
const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
  "marker"
);
const Investormap = ({ viewport, investorData, favorites, activePropertyId }) => {
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const [map, setMap] = useState(null);

  // Global flag to ensure script is loaded only once
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
/*
  // Load Google Maps Script Dynamically with the API Key
  useEffect(() => {
    if (!isScriptLoaded) {
      const loadGoogleMapsScript = () => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places,drawing`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        // Set the script loaded flag
        script.onload = () => {
          setIsScriptLoaded(true);
        };
      };

      loadGoogleMapsScript();
    }

    window.initMap = initMap;

    return () => {
      // Cleanup the Google Maps script if needed
      const script = document.querySelector('script[src^="https://maps.googleapis.com/maps/api/js"]');
      if (script) {
        script.remove();
      }
    };
  }, [isScriptLoaded]);
*/
  // Initialize Google Map
  const initializeMap = useCallback(() => {
    const googleMap = new GMap(mapContainerRef.current, {
      center: { lat: 17.4065, lng: 78.4772 },
      zoom: 11,
      mapId: "5e34ee2a0a0595d8",
      styles: mapStyle,
      zoomControl: true,
      mapTypeControl: false,  // Disable map type selector
      streetViewControl: false,  // Disable street view control
    });

    const handleZoomChange = () => {
      const newZoomLevel = googleMap.getZoom();
      if (newZoomLevel < 12) {
        document.body.classList.remove("show-label-marker");
        document.body.classList.add("show-circle-marker");
      } else {
        document.body.classList.remove("show-circle-marker");
        document.body.classList.add("show-label-marker");
      }
    };
    googleMap.addListener("zoom_changed", handleZoomChange);
    setMap(googleMap);
  }, []);
  useEffect(() => {
    initializeMap();
    return () => {
      document.body.classList.remove("show-label-marker");
      document.body.classList.add("show-circle-marker");
    };
  }, [initializeMap]);
  // Create Markers for the Map
  const createMarkers = (map) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Function to create a custom marker
    const createMarker = (property) => {
      const isFavorite = favorites.some(
        (fav) => fav.PropertyID === property.PropertyID
      );

      /*// Create a custom marker (using a div)
      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(property.PropertyLatitude), lng: parseFloat(property.PropertyLongitude) },
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#A3000B',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 1.2,
          scale: 6,
        },
      });
  */
 
      const { bgColor } = getStatusStyles(property.PropertyStatus);
      const amountText = `₹ ${property.Amount}`;
      

      const markerDiv = document.createElement("div");
      markerDiv.classList.add("property-marker");
      
      switch (property.PropertyStatus) {
        case "For Sale":
          markerDiv.classList.add("for-sale-marker");
          break;
        case "PreLaunch":
          markerDiv.classList.add("pre-launch-marker");
          break;
        case "Rental":
          markerDiv.classList.add("rental-marker");
          break;
        case "Sold":
          markerDiv.classList.add("sold-marker");
          break;
        default:
          markerDiv.classList.add("for-sale-marker");
      }
      markerDiv.style.backgroundColor = bgColor;
      const labelDiv = document.createElement("span");
      labelDiv.innerText = amountText;
      markerDiv.appendChild(labelDiv);
      const markerElement = new AdvancedMarkerElement({
        map,
        content: markerDiv,
        position: new window.google.maps.LatLng(
          parseFloat(property.PropertyLatitude),
          parseFloat(property.PropertyLongitude)
        ),
      });

      //marker.property = property;

      // Create Info Window content with React Icon for close button
      const infoWindowContent = document.createElement('div');
      infoWindowContent.classList.add('investorpopup-content');
      infoWindowContent.innerHTML = `
        <div class="investorpopup-details">
        <button class="investorinfo-close-button">X</button>
          <img src="${require(`../../images/${property.ImageNames}`)}" alt="${property.PropertyName}" class="investorpopup-image" style="width: 100%; height: 120px; max-width: 350px;" />
          <h3 class="investorpopup-amount">${property.PropertyName}, ₹${property.Amount}</h3>
          <p class="investorpopup-name"> ${property.PropertyCity} | ${property.PropertyZipCode}</p>
        </div>
      `;

      // Add React Icon close button to the info window content



      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });

      markerElement.addListener('click', () => {
        infoWindow.open(map, markerElement);
        map.panTo(markerElement.position);
        map.setZoom(13);
      });




      // Add the marker to the markers array for cleanup
      markersRef.current.push(markerElement);

      const closeButton = infoWindowContent.querySelector('.investorinfo-close-button');
      closeButton?.addEventListener('click', () => {
        infoWindow.close();
      });
    };

    // Add markers for all properties, or for the selected property
    if (!activePropertyId) {
      investorData.forEach(createMarker);
    } else {
      const selectedProperty = investorData.find((property) => property.PropertyID === activePropertyId);
      if (selectedProperty) {
        map.panTo({
          lat: parseFloat(selectedProperty.PropertyLatitude),
          lng: parseFloat(selectedProperty.PropertyLongitude),
        });
        map.setZoom(13);
        createMarker(selectedProperty);
      }
    }
  };

  // Watch for changes in the map state (like when it's loaded)
  useEffect(() => {
    if (map) {
      createMarkers(map);
    }
  }, [map, investorData, favorites, activePropertyId]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default Investormap;
