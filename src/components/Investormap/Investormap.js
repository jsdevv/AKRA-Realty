import React, { useRef, useEffect, useState, useCallback } from 'react';
import './Investormap.css';
import { mapStyle } from '../Mapstyles/mapStyles';

const statusStyles = {
  "For Sale": { bgColor: "#A3000B", color: "white" },
  PreLaunch: { bgColor: "#007BFF", color: "white" },
  Rental: { bgColor: "#7A48D6", color: "white" },
  Sold: { bgColor: "#1E5128", color: "white" },
  default: { bgColor: "#7A48D6", color: "white" },
};

const getStatusStyles = (status) => statusStyles[status] || statusStyles.default;

const Investormap = ({ investorData, selectedPropertyDetails, activePropertyId }) => {
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const [map, setMap] = useState(null);

  // Initialize Map
  const initializeMap = useCallback(async () => {
    await window.google.maps.importLibrary("maps");
    await window.google.maps.importLibrary("marker");

    const { Map: GMap } = window.google.maps;

    const googleMap = new GMap(mapContainerRef.current, {
      center: { lat: 17.4065, lng: 78.4772 },
      zoom: 11,
      mapId: "5e34ee2a0a0595d8",
      styles: mapStyle,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
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

  const createMarkers = (property) => {
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

    const lat = parseFloat(property.PropertyLatitude);
    const lng = parseFloat(property.PropertyLongitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Invalid coordinates for property:", property);
      return;
    }

    try {
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map,
        content: markerDiv,
        position: new window.google.maps.LatLng(lat, lng),
      });

      const infoWindowContent = document.createElement("div");
      infoWindowContent.classList.add("investorpopup-content");

      infoWindowContent.innerHTML = `
        <div class="investorpopup-details">
          <button class="investorinfo-close-button">X</button>
          <img src="/placeholder.jpg" alt="${property.PropertyName}" class="investorpopup-image" style="width: 100%; height: 120px; max-width: 350px;" />
          <h3 class="investorpopup-amount">${property.PropertyName}, ₹${property.Amount}</h3>
          <p class="investorpopup-name">${property.PropertyCity} | ${property.PropertyZipCode}</p>
        </div>
      `;

      const infoWindow = new window.google.maps.InfoWindow({
        content: infoWindowContent,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        map.panTo(marker.position);
        map.setZoom(13);
      });

      const closeButton = infoWindowContent.querySelector(".investorinfo-close-button");
      closeButton?.addEventListener("click", () => {
        infoWindow.close();
      });

      markersRef.current.push(marker);
    } catch (error) {
      console.error("Error creating marker:", error);
    }
  };

  // If a specific property is selected
  useEffect(() => {
    if (
      map &&
      selectedPropertyDetails &&
      selectedPropertyDetails.PropertyLatitude &&
      selectedPropertyDetails.PropertyLongitude
    ) {
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];

      createMarkers(selectedPropertyDetails);

      const lat = parseFloat(selectedPropertyDetails.PropertyLatitude);
      const lng = parseFloat(selectedPropertyDetails.PropertyLongitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const position = new window.google.maps.LatLng(lat, lng);
        map.panTo(position);
        map.setZoom(13);
      }
    }
  }, [selectedPropertyDetails, map]);

  // If all investor data needs to be displayed
  useEffect(() => {
    if (map && investorData?.length > 0 && !selectedPropertyDetails) {
      markersRef.current.forEach((marker) => (marker.map = null));
      markersRef.current = [];

      investorData.forEach((property) => {
        createMarkers(property);
      });
    }
  }, [map, investorData, selectedPropertyDetails]);

  return <div ref={mapContainerRef} className="investormap-container" />;
};

export default Investormap;
