import React, { useEffect, useRef, useCallback } from 'react';
import restaurant from "../../../assets/utensils-solid.svg";
import school from "../../../assets/graduation-cap-solid.svg";


const NearbyPlaceMap = ({ selectedProperty, propertyCardData }) => {
  const mapRef = useRef(null);
  const infoWindowRef = useRef(null);


  const initializeMap = useCallback( async () => {
          await window.google.maps.importLibrary("maps");
      await window.google.maps.importLibrary("marker");
      await window.google.maps.importLibrary("places");
  
      const { Map: GMap } = window.google.maps;
    if (!mapRef.current && window.google && window.google.maps) {
      console.error("Map reference is not available.");
      return;
    }

    const lat = parseFloat(selectedProperty.PropertyLatitude);
    const lng = parseFloat(selectedProperty.PropertyLongitude);

    if (isNaN(lat) || isNaN(lng)) {
      console.warn("Invalid coordinates for property:", selectedProperty);
      return;
    }

    const map = new GMap(mapRef.current, {
      center: { lat: lat, lng: lng },
      zoom: 13,
      mapId: "5e34ee2a0a0595d8",
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_CENTER,
        style: window.google.maps.ZoomControlStyle.SMALL, // Ensures small, consistent controls
      },
      mapTypeControlOptions: {
        style: window.google.maps.MapTypeControlStyle.SMALL,
      },
      styles: [
        {
          featureType: "poi.school",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#ff5722" }],
        },
        {
          featureType: "poi.restaurant",
          elementType: "geometry",
          stylers: [{ visibility: "on" }, { color: "#009688" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text",
          stylers: [{ visibility: "off" }], // Hide labels for other points of interest
        },
      ],
    });
    mapRef.current = map;
    const service = new window.google.maps.places.PlacesService(map);
    const markerContent = document.createElement("div");
    if(propertyCardData.ShowLocation === 'No'){
      markerContent.style.width = "75px";
      markerContent.style.height = "75px";
      markerContent.style.display = "flex";
      markerContent.style.alignItems = "center";
      markerContent.style.justifyContent = "center";
      markerContent.style.borderRadius = "50%";
      markerContent.style.border = "1px solid #078e13e6";
      markerContent.style.backgroundColor = "#01ff173b";
    }
    
  
    const markerElement = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      content: propertyCardData.ShowLocation === 'No' ? markerContent: null,
      position: new window.google.maps.LatLng(lat, lng),
    });

    markerElement.addListener('click', () => {
      showInfoWindow(map, markerElement, selectedProperty);
    });

    addNearbyPlaces(map, { lat, lng });

  }, []);

  useEffect(() => {
    initializeMap();
  }, [initializeMap]);


  const addNearbyPlaces = (map, center) => {
    const service = new window.google.maps.places.PlacesService(map);
  
    const types = ['school', 'restaurant']; // You can also add 'hospital'
  
    types.forEach((type) => {
      const request = {
        location: center,
        radius: 5000,
        type: type
      };
  
      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length) {
          results.forEach((place) => {
            const markerContent = document.createElement("div");
            markerContent.style.width = "24px";
            markerContent.style.height = "24px";
            markerContent.style.display = "flex";
            markerContent.style.alignItems = "center";
            markerContent.style.justifyContent = "center";
            markerContent.style.backgroundImage = `url(${type === "school" ? school : restaurant})`;
            markerContent.style.backgroundRepeat = "no-repeat";
            markerContent.style.backgroundSize = "50%";
            markerContent.style.borderRadius = "50%";
            markerContent.style.border = "1px solid";
            markerContent.style.backgroundPosition = "center";
            markerContent.style.backgroundColor = "white";
  
            const placeLatLng = new window.google.maps.LatLng(
              place.geometry.location.lat(),
              place.geometry.location.lng()
            );
  
            const markerView = new window.google.maps.marker.AdvancedMarkerElement({
              map,
              position: placeLatLng,
              content: markerContent,
              title: place.name,
            });
  
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div class="mappopup-content" style="padding:8px;">
                <button class="mappopup-close-button">X</button>
                <strong>${place.name}</strong><br>${place.vicinity}</div>`,
            });
  
            markerView.addListener('click', () => {
              if (infoWindowRef.current) {
                infoWindowRef.current.close();
              }
              infoWindow.open(map, markerView);
              infoWindowRef.current = infoWindow;
  
              setTimeout(() => {
                const closeButton = document.querySelector('.mappopup-close-button');
                if (closeButton) {
                  closeButton.onclick = () => infoWindow.close();
                }
              }, 500);
            });
          });
        } else {
          console.log(`No nearby places found for ${type}. Status: ${status}`);
        }
      });
    });
  };
  
  const showInfoWindow = (map, marker, property) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const infoWindowContent = ` 
      <div class="mappopup-content" data-property-id="${property.PropertyID}">
        <button class="mappopup-close-button">X</button>
        <div class="mappopup-details">
          <h3 class="mappopup-amount">${property.PropertyName}, ₹${property.Amount}</h3>
          <p class="mappopup-address">${property.PropertyType} | ${property.Bedrooms} Bedrooms | ${property.SqFt} Sqft <br />
          ${property.PropertyArea} | ${property.PropertyCity} | ${property.PropertyZipCode}</p>
        </div>
      </div>
    `;

    const infoWindow = new window.google.maps.InfoWindow({
      content: infoWindowContent,
      disableAutoPan: true,
    });

    infoWindow.open(map, marker);
    infoWindowRef.current = infoWindow;

    setTimeout(() => {
    const closeButton = document.querySelector('.mappopup-close-button');
    if (closeButton) {
      closeButton.onclick = () => infoWindow.close();
    }}, 500);
  };

  

  return (
    <div>
      
      <div id="map" ref={mapRef} className="nearbymap-container" style={{ height: '300px', width: '100%' }}/>
    </div>
  );
};

export default NearbyPlaceMap;
