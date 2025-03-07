import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import "./Listingsmap.css";
import { ClipLoader } from "react-spinners/ClipLoader";
import { useFavorites } from "../../context/FavoritesContext";
import { fetchmapshapealert } from "../../API/api";
import {
  setListingFilters,
  setMapBounds,
  setMapCircleBounds,
  setMapPolygonBounds,
} from "../../Redux/Slices/propertySlice";
import { fetchPropertyViews, fetchProjectViews } from "../../utils/fetchPropertyViews";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import defaultimg from "../../images/Apartment103.jpeg"
import Slider from "react-slick";


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
const { DrawingManager } = await window.google.maps.importLibrary("drawing");

const Listingsmap = ({ handlePropertyClick, bearerToken }) => {
    const {Id } = useSelector((state) => state.auth.userDetails  || {}); 
  const { selectedProperty, visibleProperties, selectedCenterOfMap, groupedProperties } = useSelector(
    (state) => state.properties
  );

  const { favorites } = useFavorites();
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const markersRef = useRef([]);
  const heartsRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [drawingPath, setDrawingPath] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(11);
  const drawnPolygonRef = useRef(null);
  const drawnCircleRef = useRef(null);
  const [loading, setLoading] = useState(false); // Add this state
  const dispatch = useDispatch();
  const propertyMarkerMap = useRef(new Map());
  const propertyMarkerElement = useRef(new Map());
  const [showButton, setShowButton] = useState(false);
  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  const [AlertsuccessMsg, setAlertsuccessMsg] = useState(false);
  const [AlerterrorMsg, setAlerterrorMsg] = useState(null);

  // Initialize Google Map
  const initializeMap = useCallback(() => {
    if (!mapRef.current && window.google && window.google.maps) {
      console.error("Map reference is not available.");
      return;
    }

    const map = new GMap(mapRef.current, {
      center: { lat: 17.4065, lng: 78.4772 },
      zoom: zoomLevel,
      mapId: "5e34ee2a0a0595d8",
      clickableIcons: false,
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
 
    // console.log(position,"position");
   
    mapRef.current = map;

    const drawingManager = new DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ["polygon", "circle"],
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    // Handle polygon completion
    const handlePolygonComplete = (polygon) => {
      deleteDrawnShapes();
      if (drawnPolygonRef.current) {
        drawnPolygonRef.current.setMap(null);
      }
      drawnPolygonRef.current = polygon;
      const path = polygon.getPath().getArray();
      setDrawingPath(path);
      filterPropertiesByPolygon(path);
      drawingManager.setDrawingMode(null);
    };

    // Handle circle completion
    const handleCircleComplete = (circle) => {
      deleteDrawnShapes();
      if (drawnCircleRef.current) {
        drawnCircleRef.current.setMap(null);
      }
      drawnCircleRef.current = circle;
      filterPropertiesByCircle(circle);
      drawingManager.setDrawingMode(null);
      // Assuming `circle` is the drawn circle object and `bearerToken` is available
      circle.addListener('rightclick', (event) => {
        // Show button on right-click with circle position
        const position = event.latLng;
        setCirclePosition({ x: position.lng(), y: position.lat() }); // Assuming `lat()` and `lng()` for position
        setShowButton(true); // Show button when right-clicked
      });
    };

    window.google.maps.event.addListener(
      drawingManager,
      "polygoncomplete",
      handlePolygonComplete
    );
    window.google.maps.event.addListener(
      drawingManager,
      "circlecomplete",
      handleCircleComplete
    );

    const handleZoomChange = () => {
      const newZoomLevel = map.getZoom();
      setZoomLevel(newZoomLevel);

      if (drawnPolygonRef.current) {
        const path = drawnPolygonRef.current.getPath().getArray();
        filterPropertiesByPolygon(path);
      } else if (drawnCircleRef.current) {
        filterPropertiesByCircle(drawnCircleRef.current, newZoomLevel);
      }
      if (newZoomLevel < 12) {
        document.body.classList.remove("show-label-marker");
        document.body.classList.add("show-circle-marker");
      } else {
        document.body.classList.remove("show-circle-marker");
        document.body.classList.add("show-label-marker");
      }
    };
    map.addListener("zoom_changed", handleZoomChange);
    map.addListener("idle", () => {
      const bounds = map.getBounds();
      const southwest = bounds.getSouthWest();
      const northeast = bounds.getNorthEast();
      const boundsData = {
        southwest: {
          lat: southwest.lat(),
          lng: southwest.lng(),
        },
        northeast: {
          lat: northeast.lat(),
          lng: northeast.lng(),
        },
      };
      dispatch(setMapBounds(boundsData));
      dispatch(setListingFilters());
    });

    return () => {
      clearMarkers();
      window.google.maps.event.removeListener(
        drawingManager,
        "polygoncomplete",
        handlePolygonComplete
      );
      window.google.maps.event.removeListener(
        drawingManager,
        "circlecomplete",
        handleCircleComplete
      );
      window.google.maps.event.removeListener(
        map,
        "zoom_changed",
        handleZoomChange
      );
    };
  }, []);
  const rootRefs = {}; 
  const convertToNumber = (value) => {
    let num = parseFloat(value);
    if (value.includes("Cr")) {
      return num * 10000000;
    } else if (value.includes("L")) {
      return num * 100000;
    } else if (value.includes("K")) {
      return num * 1000;
    }
    return num;
  };
  const showInfoWindow = useCallback(
    (map, marker, property, relatedUnits) => {
     console.log(property,"showInfoWindow");
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }

      // Construct the HTML content using template literals
      const imageUrls = property.PropertyImageUrls
      ? property.PropertyImageUrls.split(',').map(url => url.trim())
      : property.ProjectImageUrls
        ? property.ProjectImageUrls.split(',').map(url => url.trim())
        : [];
    

const imagesToShow = imageUrls.length > 0 ? imageUrls : [defaultimg];

      if(!relatedUnits){
        relatedUnits = {
          Amount: [],
          UnitTypeDetails: []
        };
      }
  const minMax = relatedUnits.Amount.reduce(
    (acc, value) => {
      const num = convertToNumber(value);
      if (num < acc.min.value) acc.min = { value: num, original: value };
      if (num > acc.max.value) acc.max = { value: num, original: value };
      return acc;
    },
    {
      min: { value: Infinity, original: null },
      max: { value: -Infinity, original: null },
    }
  );

      const carouselContent = `
      <div class="marker-carousel">
        <div id="carousel-${property.PropertyID}" class="property-carousel">
          <!-- React-Slick carousel will render here -->
        </div>
      </div>
    `;
    
    //<img src="${imageURL}" alt="${property.PropertyName}" class="mappopup-image" />
    const propertyAmount = minMax.min.value !== minMax.max.value ? `₹ ${minMax.min.original} - ₹ ${minMax.max.original}`: `₹ ${property.Amount}`;
    const propertyName = relatedUnits.Amount.length > 1 ? property.PropertyName.split("(")[0] : property.PropertyName;

    const aditionalInfo = relatedUnits.Amount.length > 1 ? '': `| ${property.PropertyBedrooms} | ${property.SqFt}`
      const infoWindowContent = `
      <div class="mappopup-content" data-property-id="${property.PropertyID}">
       <button class="mappopup-close-button">X</button>
        ${carouselContent}
        <div class="mappopup-details">
          <h3 class="mappopup-amount">${propertyName}, ${propertyAmount}</h3>
          <p class="mappopup-address"> ${property.PropertyType} ${aditionalInfo}<br/>
          ${property.PropertyCardLine3}</p>
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
        const carouselContainer = document.querySelector(
          `#carousel-${property.PropertyID}`
        );
        if (carouselContainer) {
          const settings = {
            // dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
          };
  
          const Carousel = () => (
            <Slider {...settings}>
              {imagesToShow.map((url, index) => (
                <div key={index}>
                  <img 
                    src={url}
                    alt={`Slide ${index + 1}`}
                    className="mappopup-image"
                  />
                </div>
              ))}
            </Slider>
          );
  
          // Render React-Slick carousel into the container
          const root = ReactDOM.createRoot(carouselContainer);
          root.render(<Carousel />);
        }
      }, 100);
      setTimeout(() => {
        const closeButton = document.querySelector(".mappopup-close-button");
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            infoWindow.close();
          });
        }
      }, 500);

      const handleInfoWindowClick = (property) => {
        console.log(property,"view");
        if (relatedUnits.Amount.length > 1) {
          fetchProjectViews(dispatch, property.ProjectID, Id, bearerToken);
        } else {
          fetchPropertyViews(dispatch, property.PropertyID, Id, bearerToken);
        }
      }

      // After InfoWindow opens, attach event listeners to the favorite button
      setTimeout(() => {
        const infoWindowContentDiv =
          document.querySelector(`.mappopup-content`);
        if (infoWindowContentDiv) {
          infoWindowContentDiv.addEventListener("click", (e) => {
            if (!e.target.closest(".mappopup-close-button, .slick-arrow, .slick-dots")) {
              setLoading(true);
              handlePropertyClick(property); 
              handleInfoWindowClick(property);
              setLoading(false);
            }
          });
        }
      }, 500); // Small delay to ensure that the InfoWindow content is rendered
    },
    [handlePropertyClick]
  );
 
  
  const renderFavorites = useCallback((favoriteProperties) => {
        const heartOverlays = []; // Store overlays for heart icons
        // Clear existing heart overlays
        heartsRef.current.forEach((overlay) => overlay.setMap(null));
        heartsRef.current = [];
        
  
        favoriteProperties.forEach((property) => {

          const heartDiv = document.createElement('div');
          heartDiv.classList.add('heart-overlay'); // Add CSS class for styling
          heartDiv.innerText = '❤️';

          const heartOverlay = new window.google.maps.OverlayView();
          heartOverlay.onAdd = function () {
            const pane = this.getPanes().overlayMouseTarget;
            pane.appendChild(heartDiv);
          };
          heartOverlay.draw = function () {
            const projection = this.getProjection();
            const position = projection.fromLatLngToDivPixel(
              new window.google.maps.LatLng(
                parseFloat(property.PropertyLatitude),
                parseFloat(property.PropertyLongitude)
              )
            );
            heartDiv.style.left = `${position.x - 12}px`;
            heartDiv.style.top = `${position.y - 28}px`;
          };
          heartOverlay.onRemove = function () {
            if (heartDiv.parentNode) heartDiv.parentNode.removeChild(heartDiv);
          };

          heartOverlay.setMap(mapRef.current);
          heartsRef.current.push(heartOverlay);
          heartOverlays.push(heartOverlay);
      });
  
        // Cleanup
        return () => {
          heartOverlays.forEach((overlay) => overlay.setMap(null));
        };
  }, []);

  // Render property markers on the map
  const renderMarkers = useCallback(
    (map, properties, groupedProperties) => {
      // clearMarkers();

      const heartOverlays = []; // Store overlays for heart icons

      propertyMarkerElement.current.forEach((marker) => {
        marker.classList.add("marker-not-matched");
      });
      
      renderFavorites(properties.filter((property) => favorites.some((fav) => fav.PropertyID === property.PropertyID)));
      properties.forEach((property) => {
        const propertyMarkerRef = propertyMarkerMap.current.get(property.PropertyID);
        if(propertyMarkerRef){
          propertyMarkerElement.current.get(property.PropertyID).classList.remove("marker-not-matched");
          return;
        }

        const { bgColor } = getStatusStyles(property.PropertyStatus);
        const groupKey = `${property.PropertyLatitude}_${property.PropertyLongitude}`;
        const unitCount = groupedProperties[groupKey].PropertyCount;
        const amountText = unitCount > 1 ? `${unitCount} Units`:`₹ ${property.Amount}`;
        

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

        propertyMarkerMap.current.set(property.PropertyID, markerElement);
        propertyMarkerElement.current.set(property.PropertyID, markerDiv);

        markerElement.addListener("click", () => {
          const zoom = map.getZoom();
          if (zoom < 14){
            map.setZoom(14);
            setZoomLevel(14);
          }
          
          map.setCenter(markerElement.position);
          
          showInfoWindow(map, markerElement, property, groupedProperties[groupKey]);
        });

        markersRef.current.push(markerElement);

      });

      // Cleanup
      return () => {
        heartOverlays.forEach((overlay) => overlay.setMap(null));
      };
    },
    [showInfoWindow, renderFavorites, favorites]
  );


  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  

  const filterPropertiesByPolygon = 
    (path) => {
      dispatch(setMapPolygonBounds(path));
      dispatch(setListingFilters());
  }

  const filterPropertiesByCircle = (circle) => {
    const circleCenter = circle.getCenter();
    const circleRadius = circle.getRadius();

    dispatch(setMapCircleBounds({ circleCenter, circleRadius }));
    dispatch(setListingFilters());
    
  };

  const handleButtonClick = () => {
    if (drawnCircleRef.current) {
      fetchmapshapealert(bearerToken, drawnCircleRef.current, Id)
       .then((response) => {
          console.log(response,"response");
          setAlertsuccessMsg(true);
          
          setTimeout(() => {
            setAlertsuccessMsg(false);
            setShowButton(false);  
          }, 3000); 
        })
        .catch((error) => {
          console.error("Error setting alert:", error);
          setLoading(false);  // Stop loading on error
        });
      }

  };

  const deleteDrawnShapes = () => {
    dispatch(setMapCircleBounds(null));
    dispatch(setMapPolygonBounds(null));
    dispatch(setListingFilters());
    setDrawingPath([]); // Reset drawing path immediately
    setShowButton(false);

    if (drawnPolygonRef.current) {
      drawnPolygonRef.current.setMap(null); // Remove polygon from map
      drawnPolygonRef.current = null; // Reset reference
    }
    // Remove circle if it exists
    if (drawnCircleRef.current) {
      drawnCircleRef.current.setMap(null); // Remove circle from map
      drawnCircleRef.current = null; // Reset reference
    }

    // Clear all markers quickly
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = []; // Reset markers

    propertyMarkerMap.current.clear(); // Clear property marker map

  };

  useEffect(() => {
    initializeMap();
    return () => {
      document.body.classList.remove("show-label-marker");
      document.body.classList.add("show-circle-marker");
    };
  }, [initializeMap]);

  useEffect(() => {
    renderMarkers(drawingManagerRef.current.getMap(), visibleProperties, groupedProperties);
  }, [visibleProperties, renderMarkers, groupedProperties]);

  useEffect(() => {
    if (selectedProperty) {
      const marker = propertyMarkerMap.current.get(selectedProperty.PropertyID);
      const relatedUnits = groupedProperties[`${selectedProperty.PropertyLatitude}_${selectedProperty.PropertyLongitude}`];
      // bring marker to center
      mapRef.current.panTo(marker.position);
      showInfoWindow(
        drawingManagerRef.current.getMap(),
        marker,
        selectedProperty,
        relatedUnits
      );
    }
  }, [selectedProperty, showInfoWindow]);

  useEffect(() => {
    if (selectedCenterOfMap) {
      // bring marker to center
      mapRef.current.panTo({
        lat: selectedCenterOfMap.lat,
        lng: selectedCenterOfMap.lng,
      });
    }
  }, [selectedCenterOfMap]);

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      {loading && (
        <div className="spinner-container">
          <ClipLoader color="#000" loading={loading} size={50} />
        </div>
      )}

      <div className="deleteshape">
        <button onClick={deleteDrawnShapes} aria-label="Delete drawn shapes">
          <RiDeleteBin6Line />
        </button>
      </div>
      {showButton && (
            <button className="alert-button" onClick={handleButtonClick}>Set Alert </button>
        
          )}

{AlertsuccessMsg && (
              <div className="AlertsuccessMsg">
                Alert successfully set!
              </div>
            )}

{AlerterrorMsg && <p className="error-msg">{AlerterrorMsg}</p>}

    </>
  );
};

export default Listingsmap;
