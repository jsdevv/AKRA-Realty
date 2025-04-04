import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APIProvider, Map, InfoWindow, useMap, AdvancedMarker } from "@vis.gl/react-google-maps";
import "./Dashboardmap.css";
import { clearSelectedProperty, setSelectedProperty } from "../../../Redux/Slices/propertySlice";
import ListingModal from "../../ListingModal/ListingModal";
import Slider from "react-slick";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const CircleMarker = ({ position, onClick }) => {
  const map = useMap();

  useEffect(() => {
    if (map && position?.lat && position?.lng) {
      map.panTo(position);
      map.setZoom(12);
    }
  }, [map, position]);

  return (
    <AdvancedMarker position={position} onClick={onClick}>
      <div className="fixed-circle-marker " />
    </AdvancedMarker>
  );
};


const Dashboardmap = ({onClose, myProperty = []}) => {
  const dispatch = useDispatch();
  const { selectedAgentProperty, selectedProperty } = useSelector((state) => state.properties);
   console.log(myProperty ,"myProperty ");

  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const mapRef = useRef(null);

  const handlePopupopen = useCallback(
            (property) => {
                dispatch(setSelectedProperty(property));
            },
            [dispatch]
    );
  
  const handleCloseModal = useCallback(() => {
                dispatch(clearSelectedProperty());
  }, [dispatch]);
        
  useEffect(() => {
    if (selectedAgentProperty?.PropertyLatitude && selectedAgentProperty?.PropertyLongitude) {
      const position = {
        lat: parseFloat(selectedAgentProperty.PropertyLatitude),
        lng: parseFloat(selectedAgentProperty.PropertyLongitude),
      };
  
      setInfoWindowPosition(position);
  
      if (mapRef.current && mapRef.current.panTo) {
        mapRef.current.panTo(position);
        mapRef.current.setZoom(14);
      }
    }
  }, [selectedAgentProperty]);
  

  const onMarkerClick = (property) => {
    const position = {
      lat: parseFloat(property.PropertyLatitude),
      lng: parseFloat(property.PropertyLongitude),
    };

    setInfoWindowPosition(position);

    if (mapRef.current) {
      mapRef.current.panTo(position); // Pan the map to the new center
      mapRef.current.setZoom(14); // Zoom in to the marker
    }
  };

  if (!API_KEY) {
    console.error("Google Maps API key is missing. Please set the REACT_APP_GOOGLE_MAPS_API_KEY environment variable.");
    return <div>Unable to load the map. API key missing.</div>;
  }

  return (
    <>
          <APIProvider apiKey={API_KEY}>
      <Map
         ref={(map) => (mapRef.current = map)} 
        style={{ width: "100%", height: "100%" }}
        defaultCenter={{ lat: 17.4065, lng: 78.4772 }}
        defaultZoom={10}
        gestureHandling="greedy"
        disableDefaultUI={false} 
        options={{
          mapTypeControl: true, 
          zoomControl: true,
          streetViewControl: true, 
          fullscreenControl: true,
        }}
        mapId="5e34ee2a0a0595d8"
      >
       {myProperty.map((property, index) => (
          <CircleMarker
          key={index}
          position={{
            lat: parseFloat(property.PropertyLatitude),
            lng: parseFloat(property.PropertyLongitude),
          }}
          onClick={() => onMarkerClick(property)}
            radius={100}
            options={{
              strokeColor: "#6D2323",
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: "#6D2323",
              fillOpacity: 1,
            }}
          />
      ) )}

        {infoWindowPosition && selectedAgentProperty && (
          <InfoWindow position={infoWindowPosition} >
            <div className="mappopup-content" >
              <button
                className="mappopup-close-button"
                onClick={() => setInfoWindowPosition(null)}
              >
                X
              </button>
  
{(() => {
     
     const imageUrls = selectedAgentProperty?.PropertyImageUrls
     ? selectedAgentProperty.PropertyImageUrls.includes(",")
         ? selectedAgentProperty.PropertyImageUrls.split(",").map((url) => url.trim())
         : [selectedAgentProperty.PropertyImageUrls.trim()]
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
              <div className="mappopup-details" onClick={() => handlePopupopen(selectedAgentProperty)}>
                <h3 className="mappopup-amount">
                  {selectedAgentProperty.PropertyName}, ₹{selectedAgentProperty.Amount} {selectedAgentProperty.PriceUnit}
                </h3>
                <p className="mappopup-address">
                  {selectedAgentProperty.PropertyType} | {selectedAgentProperty.PropertyBedrooms} | {selectedAgentProperty.SqFt}
                  <br />
                  {selectedAgentProperty.PropertyArea} | {selectedAgentProperty.PropertyCity} | {selectedAgentProperty.PropertyZipCode}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>

    {selectedProperty && (
                <ListingModal
                    selectedProperty={selectedProperty}
                    onClose={handleCloseModal}

                />
            )}
        <div className="dashboardclosemap" onClick={onClose} >X</div>
    </>

  );
};

export default Dashboardmap;
