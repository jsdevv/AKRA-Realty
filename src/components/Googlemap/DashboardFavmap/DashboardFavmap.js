import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APIProvider, Map, InfoWindow, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import { clearSelectedProperty, setSelectedProperty } from "../../../Redux/Slices/propertySlice";
import ListingModal from "../../ListingModal/ListingModal";
import "./DashboardFavmap.css";
import Slider from "react-slick";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const DEFAULT_CENTER = { lat: 17.4065, lng: 78.4772 };

const CircleMarker = ({ position, onClick, propertyType }) => {
  const map = useMap();

  useEffect(() => {
    if (map && position?.lat && position?.lng) {
      map.panTo(position);
      map.setZoom(10);
    }
  }, [map, position]);

  return (
    <AdvancedMarker position={position} onClick={onClick}>
      <div className="fixed-circle-marker" />
    </AdvancedMarker>
  );
};

const DashboardFavmap = ({favData}) => {
  const dispatch = useDispatch();
  const {selectedAgentProperty, selectedProperty } = useSelector((state) => state.properties);

  console.log(selectedAgentProperty,"agent");

  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const mapRef = useRef(null);

  // Handle property selection for modal
     const handlePopupopen = useCallback(
            (property) => {
              console.log(property,"prop");
                dispatch(setSelectedProperty(property));
            },
            [dispatch]
        );

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    dispatch(clearSelectedProperty());
  }, [dispatch]);

    useEffect(() => {
      if (selectedAgentProperty?.PropertyLatitude && selectedAgentProperty?.PropertyLongitude) {
        setInfoWindowPosition({
          lat: parseFloat(selectedAgentProperty.PropertyLatitude),
          lng: parseFloat(selectedAgentProperty.PropertyLongitude),
        });
      }
    }, [selectedAgentProperty]);

  // Marker click event
  const onMarkerClick = useCallback((property) => {
    if (!property?.PropertyLatitude || !property?.PropertyLongitude) return;

    const position = {
      lat: parseFloat(property.PropertyLatitude),
      lng: parseFloat(property.PropertyLongitude),
    };

    setInfoWindowPosition(position);
    
    if (mapRef.current) {
      mapRef.current.panTo(position);
      mapRef.current.setZoom(1);
    }
  }, []);

  if (!API_KEY) {
    console.error("Google Maps API key is missing. Please set the REACT_APP_GOOGLE_MAPS_API_KEY environment variable.");
    return <div>Unable to load the map. API key missing.</div>;
  }

  return (
    <>
      <APIProvider apiKey={API_KEY}>
        <Map
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
          defaultCenter={DEFAULT_CENTER}
          defaultZoom={10}
          gestureHandling="greedy"
          disableDefaultUI={false}
          options={{
            mapTypeControl: true,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          }}
          mapId="5e34ee2a0a0595d8"
        >
         {/* Render all favorite properties as markers if no property is selected */}
         {!selectedAgentProperty &&
            favData?.map((property) => (
              property.PropertyLatitude && property.PropertyLongitude && (
                <CircleMarker
                  key={property.PropertyID}
                  position={{
                    lat: parseFloat(property.PropertyLatitude),
                    lng: parseFloat(property.PropertyLongitude),
                  }}
                  onClick={() => onMarkerClick(property)}
                />
              )
            ))}

          {/* Only render the selected agent property marker */}
          {selectedAgentProperty && (
            <CircleMarker
              key={selectedAgentProperty.PropertyID}
              position={{
                lat: parseFloat(selectedAgentProperty.PropertyLatitude),
                lng: parseFloat(selectedAgentProperty.PropertyLongitude),
              }}
              onClick={() => onMarkerClick(selectedAgentProperty)}
            />
          )}

          {/* Info Window */}
        {/* Info Window */}
{infoWindowPosition && selectedAgentProperty && (
  <InfoWindow position={infoWindowPosition}>
    <div className="dashboard-favmap-popup">
      <button
        className="dashboard-favmap-close-btn"
        onClick={() => setInfoWindowPosition(null)}
      >
        X
      </button>

      {/* Image Slider */}
      {(() => {
        const imageUrls = selectedAgentProperty.PropertyImageUrls
          ? selectedAgentProperty.PropertyImageUrls.split(",").map((url) => url.trim())
          : selectedAgentProperty.ProjectImageUrls
          ? selectedAgentProperty.ProjectImageUrls.split(",").map((url) => url.trim())
          : [];

        const imagesToShow = imageUrls.length > 0 ? imageUrls : ["/images/defaultimg.jpg", "/images/defaultimg1.jpg"];

        const settings = {
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        };

        return (
          <Slider {...settings} className="dashboard-favmap-slider">
            {imagesToShow.map((url, index) => (
              <div key={index} onClick={() => handlePopupopen(selectedAgentProperty)}>
                <img
                  src={url}
                  alt={`Slide ${index + 1}`}
                    className="dashboard-favmap-slider-img"
                  loading="lazy"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "125px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </Slider>
        );
      })()}

<div className="dashboard-favmap-details">
<h3 className="dashboard-favmap-price">
          {selectedAgentProperty.PropertyName}, {selectedAgentProperty.MinPrice ?   ` ₹${selectedAgentProperty.MinPrice} - ₹${selectedAgentProperty.MaxPrice}` : 
    ` ₹${selectedAgentProperty.Amount}`
  }
        </h3>
        <p className="dashboard-favmap-location">
          {selectedAgentProperty.PropertyType} | {selectedAgentProperty.PropertyBedrooms} | {selectedAgentProperty.SqFt}
          {selectedAgentProperty.PropertyArea} | {selectedAgentProperty.PropertyCity} | {selectedAgentProperty.PropertyZipCode}
        </p>
      </div>
    </div>
  </InfoWindow>
)}

        </Map>
      </APIProvider>

      {/* Listing Modal */}
      {selectedProperty && (
        <ListingModal
          selectedProperty={selectedProperty}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default DashboardFavmap;
