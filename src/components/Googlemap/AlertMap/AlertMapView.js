import React, { useCallback, useRef, useState } from "react";
import {
    APIProvider,
    Map,
    InfoWindow,
    AdvancedMarker,
} from "@vis.gl/react-google-maps";
import Slider from "react-slick";
import "./AlertMapView.css"; // Ensure this CSS file exists
import { BLOB_BASE_URL } from "../../../utils/config";
import { clearSelectedProperty, setSelectedProperty } from "../../../Redux/Slices/propertySlice";
import { useDispatch, useSelector } from "react-redux";
import ListingModal from "../../ListingModal/ListingModal";

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const AlertMapView = ({ properties, mapCenter, setMapCenter, activeInfoWindow, setActiveInfoWindow }) => {
    const { selectedProperty } = useSelector((state) => state.properties);
    const dispatch = useDispatch();
    const [mapInstance, setMapInstance] = useState(null);
    const CircleMarker = ({ position, onClick }) => (
        <AdvancedMarker position={position} onClick={onClick}>
            <div className="fixed-circle-marker" />
        </AdvancedMarker>
    );


    const handleMarkerClick = (prop) => {
        const lat = Number(prop.PropertyLatitude);
        const lng = Number(prop.PropertyLongitude);
        const position = { lat, lng };

        setActiveInfoWindow(prop.PropertyID);

        if (mapInstance) {
            mapInstance.panTo(position);
            mapInstance.setZoom(12); // optional: re-zoom on click
        }

        setMapCenter(position); // still update center state
    };

    const handlePopupopen = useCallback(
        (prop) => {
            dispatch(setSelectedProperty(prop));
        },
        [dispatch]
    );
    const handleCloseModal = useCallback(() => {
        dispatch(clearSelectedProperty());
    }, [dispatch]);

    return (
        <>
            <APIProvider apiKey={API_KEY}>
                <div style={{ height: "100%", width: "100%" }}>
                    <Map
                        defaultCenter={mapCenter}
                        defaultZoom={11}
                        style={{ height: "100%", width: "100%" }}
                        disableDefaultUI={false}
                        gestureHandling="greedy" // allows touch scrolling inside the map on mobile
                        onLoad={(map) => setMapInstance(map)}
                        mapId="5e34ee2a0a0595d8"
                        options={{
                            draggable: true,
                            scrollwheel: true,
                            disableDoubleClickZoom: false,
                            fullscreenControl: true,
                            zoomControl: true,
                            mapTypeControl: false,
                            streetViewControl: false,
                        }}
                    >

                        {properties.map((prop) => {
                            const lat = Number(prop.PropertyLatitude);
                            const lng = Number(prop.PropertyLongitude);
                            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;


                            const propertyUrls = prop.ProjectImageUrls ?? prop.PropertyImageUrls;

                            const imageUrls = propertyUrls
                                ? propertyUrls.split(',').map(url => `${BLOB_BASE_URL}${url.trim()}`)
                                : [];


                            const imagesToShow = imageUrls.length > 0
                                ? imageUrls
                                : ["/images/defaultimg.jpg", "/images/defaultimg1.jpg"];

                            const settings = {
                                infinite: true,
                                speed: 500,
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                arrows: true,
                            };

                            return (
                                <React.Fragment key={prop.PropertyID}>

                                    <CircleMarker
                                        position={{ lat, lng }}
                                        title={prop.PropertyName}
                                        onClick={() => handleMarkerClick(prop)}
                                    />
                                    {activeInfoWindow === prop.PropertyID && (
                                        <InfoWindow
                                            position={{ lat, lng }}

                                        >
                                            <div className="custom-info-window" >
                                                <button
                                                    className="dashboard-favmap-close-btn"
                                                    onClick={() => setActiveInfoWindow(null)}
                                                >
                                                    X
                                                </button>
                                                <Slider {...settings} className="info-window-slider">
                                                    {imagesToShow.map((url, index) => (
                                                        <div key={index} onClick={() => handlePopupopen(prop)}>
                                                            <img
                                                                src={url}
                                                                alt={`Slide ${index + 1}`}
                                                                className="info-window-img"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    ))}
                                                </Slider>
                                                <div className="info-window-details" onClick={() => handlePopupopen(prop)}>
                                                    <h3>
                                                        {prop.PropertyName}, ₹{prop.Amount} {prop.PriceUnit}
                                                    </h3>
                                                    <p>
                                                        {prop.PropertyType} | {prop.SqFt}
                                                        <br />
                                                        {prop.PropertyCity} -{" "}{prop.PropertyZipCode}
                                                    </p>
                                                </div>
                                            </div>
                                        </InfoWindow>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Map>
                </div>
            </APIProvider>

            {selectedProperty && (
                <ListingModal
                    selectedProperty={selectedProperty}
                    onClose={handleCloseModal}

                />
            )}
        </>

    );
};

export default AlertMapView;
