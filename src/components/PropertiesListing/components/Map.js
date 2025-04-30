import {
  DrawingManager,
  GoogleMap,
  OverlayView,
  OverlayViewF,
  useGoogleMap,
  useLoadScript,
} from "@react-google-maps/api";
import { memo, useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

import PropertyMarker from "./Marker/Marker";
import { useGeoSearch, useTypesense } from "../context/TypesenseContext";
import Tile from "./Tile";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useFavorites } from "../../../context/FavoritesContext";

function MapResults({ zoom }) {
  const map = useGoogleMap();
  const { results, markedItem, updateItemForMarker, hitLocation } = useTypesense();
  const { favorites } = useFavorites();


  const panMapToHit = useCallback(
    (hit) => {
      if (!map) return;
      map.panTo({ lat: hit.location[0], lng: hit.location[1] });
    },
    [map]
  );

  useEffect(() => {
    if (hitLocation) {
      panMapToHit(hitLocation);
    }
  }, [hitLocation, panMapToHit]);

  const handleMarkerClick = async (hit) => {
    updateItemForMarker(null);
    panMapToHit(hit);
    updateItemForMarker(hit.groupKey);
  };

  if (!results.hits || !results.hits.length) return null;
  return (
    <AnimatePresence>
      {results.hits.map((hit, index) => {
       
        const isSelected = markedItem?.projectName === hit.groupKey;
        const position = {
          lat: hit.location[0],
          lng: hit.location[1],
        };
        const isFavorited = favorites.some( fav =>  fav.PropertyID === hit.id && fav.FavoriteStatus === "Y" );
        
        return (
          <OverlayViewF
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            position={position}
            key={`${hit.id}-${index}`}
          >
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              
              <div
                onClick={() => {
                  handleMarkerClick(hit);
                }}
              >
                <PropertyMarker
                  zoom={zoom}
                  units = {hit.found}
                  hit = {hit}
                  isFavorited = {isFavorited}
                  formattedAmount={hit.formattedAmount}
                />
              </div>

              {isSelected && markedItem && (
                <div
                  style={{
                    maxWidth: "250px",
                    position: "absolute",
                    top: "-230px",
                    left: "-110px",
                    zIndex: "1",
                    filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.2))",
                  }}
                >
                  <Tile property={markedItem} small={true} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      left: "49%",
                      transform: "translateX(-50%)",
                      width: "0",
                      height: "0",
                      borderLeft: "10px solid transparent",
                      borderRight: "10px solid transparent",
                      borderTop: "10px solid white", // Match your popup background color
                      zIndex: "1",
                    }}
                  />
                  <button
                    className="mappopup-close-button"
                    onClick={() => updateItemForMarker(null)}
                  >
                    x
                  </button>
                </div>
              )}
            </motion.div>
          </OverlayViewF>
        );
      })}
    </AnimatePresence>
  );
}

const libraries = ["drawing"];
function MapComponent() {
 
  const [map, setMap] = useState();
  const [zoomLevel, setZoomLevel] = useState(11); // Adding zoom level state
  const { updateGeoLocation } = useGeoSearch();
  const drawingManagerRef = useRef(null);
  const polygonRef = useRef(null);
  const circleRef = useRef(null);
  const [activeDrawing, setActiveDrawing] = useState(null);
  const [usingBoundsSearch, setUsingBoundsSearch] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "",
    libraries: libraries,
  });

  const handleZoomChanged = useCallback(() => {
    if (!map) return;
    const newZoom = map.getZoom();
    setZoomLevel(newZoom);
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const zoomListener = map.addListener('zoom_changed', handleZoomChanged);

    return () => {
      if (zoomListener) {
        window.google.maps.event.removeListener(zoomListener);
      }
    };
  }, [map, handleZoomChanged]);

  const deleteDrawnShapes = useCallback(() => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
    setActiveDrawing(null);
  }, []);

  const polygonToFlatCoords = useCallback((path) => {
    const coordinates = [];
    for (let i = 0; i < path.length; i++) {
      coordinates.push(path[i].lat());
      coordinates.push(path[i].lng());
    }

    if (path.length > 0) {
      coordinates.push(path[0].lat());
      coordinates.push(path[0].lng());
    }

    return coordinates;
  }, []);

  const circleToPolygon = useCallback((center, radius, numPoints = 32) => {
    const coordinates = [];
    const centerLat = center.lat();
    const centerLng = center.lng();

    const earthRadius = 6378137;

    const latRadiusInDegrees = (radius / earthRadius) * (180 / Math.PI);

    for (let i = 0; i < numPoints; i++) {
      const angle = (i * 2 * Math.PI) / numPoints;

      const lat = centerLat + latRadiusInDegrees * Math.cos(angle);
      const lng =
        centerLng +
        (latRadiusInDegrees / Math.cos((centerLat * Math.PI) / 180)) *
          Math.sin(angle);

      coordinates.push(lat);
      coordinates.push(lng);
    }

    if (coordinates.length > 0) {
      coordinates.push(coordinates[0]);
      coordinates.push(coordinates[1]);
    }

    return coordinates;
  }, []);

  const performMapRefinement = useCallback(() => {
    if (!map) return;

    const bounds = map.getBounds();
    const center = map.getCenter();
    if (!bounds || !center) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const nw = { lat: ne.lat(), lng: sw.lng() }; // top-left
    const se = { lat: sw.lat(), lng: ne.lng() }; // bottom-right

    // Polygon: NW → NE → SE → SW → NW (to close it)
    const flatCoords = [
      nw.lat,
      nw.lng,
      ne.lat(),
      ne.lng(),
      se.lat,
      se.lng,
      sw.lat(),
      sw.lng(),
      nw.lat,
      nw.lng, // closing the polygon
    ];

    updateGeoLocation(flatCoords);
  }, [map, usingBoundsSearch, updateGeoLocation]);

  const handlePolygonComplete = useCallback(
    (polygon) => {
      deleteDrawnShapes();

      polygonRef.current = polygon;
      setActiveDrawing("polygon");
      setUsingBoundsSearch(false);

      const path = polygon.getPath().getArray();
      const flatCoords = polygonToFlatCoords(path);

      updateGeoLocation(flatCoords);

      window.google.maps.event.addListener(
        polygon.getPath(),
        "set_at",
        function () {
          const newPath = polygon.getPath().getArray();
          const newFlatCoords = polygonToFlatCoords(newPath);
          updateGeoLocation(newFlatCoords);
        }
      );

      window.google.maps.event.addListener(
        polygon.getPath(),
        "insert_at",
        function () {
          const newPath = polygon.getPath().getArray();
          const newFlatCoords = polygonToFlatCoords(newPath);
          updateGeoLocation(newFlatCoords);
        }
      );

      window.google.maps.event.addListener(
        polygon.getPath(),
        "remove_at",
        function () {
          const newPath = polygon.getPath().getArray();
          const newFlatCoords = polygonToFlatCoords(newPath);
          updateGeoLocation(newFlatCoords);
        }
      );

      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
    },
    [deleteDrawnShapes, polygonToFlatCoords, updateGeoLocation]
  );

  const handleCircleComplete = useCallback(
    (circle) => {
      deleteDrawnShapes();

      circleRef.current = circle;
      setActiveDrawing("circle");
      setUsingBoundsSearch(false);

      const center = circle.getCenter();
      const radius = circle.getRadius();
      const flatCoords = circleToPolygon(center, radius);

      updateGeoLocation(flatCoords);

      circle.addListener("radius_changed", () => {
        const newCenter = circle.getCenter();
        const newRadius = circle.getRadius();
        const newFlatCoords = circleToPolygon(newCenter, newRadius);
        updateGeoLocation(newFlatCoords);
      });

      circle.addListener("center_changed", () => {
        const newCenter = circle.getCenter();
        const newRadius = circle.getRadius();
        const newFlatCoords = circleToPolygon(newCenter, newRadius);
        updateGeoLocation(newFlatCoords);
      });

      if (drawingManagerRef.current) {
        drawingManagerRef.current.setDrawingMode(null);
      }
    },
    [deleteDrawnShapes, circleToPolygon, updateGeoLocation]
  );

  const handleResetSearch = useCallback(() => {
    if (polygonRef.current) {
      polygonRef.current.setMap(null);
      polygonRef.current = null;
    }
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }

    setActiveDrawing(null);
    setUsingBoundsSearch(true);

    performMapRefinement();

    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
  }, [performMapRefinement]);

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {!isLoaded ? (
        <motion.div
          key="loading-map"
          className="flex items-center justify-center w-full h-full"
          exit={{ opacity: 0 }}
        >
          Loading map...
        </motion.div>
      ) : (
        <motion.div
          key="map"
          className="w-full h-full relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {activeDrawing && (
            <div className="deleteshape">
                    <button onClick={handleResetSearch} aria-label="Delete drawn shapes">
                      <RiDeleteBin6Line />
                    </button>
                  </div>
          )}

          <GoogleMap
            libraryName="places"
            mapContainerClassName="w-full h-full"
            options={{
              zoomControl: true,
              zoomControlOptions: {
                position: window.google.maps.ControlPosition.RIGHT_CENTER, // Position on the right center
              },
              clickableIcons: false,
              mapId: "5e34ee2a0a0595d8",
              streetViewControl: true,
              fullscreenControl: false,
              mapTypeControl: true,
              draggableCursor: "grab",
              draggingCursor: "grabbing",
              disableDoubleClickZoom: true, // Disable double-click zoom
            }}
            onLoad={(map) => {
              map.setZoom(11);
              map.setCenter({
                lat: 17.4065,
                lng: 78.4772,
              });
              setMap(map);
              setZoomLevel(11); // Initialize zoom state
            }}
            onIdle={() => {
              if (!map || !usingBoundsSearch) return;
              performMapRefinement();
            }}
            onZoomChanged={() => {
              if (map) {
                handleZoomChanged();
              }
            }}
          >
            <MapResults zoom={zoomLevel} />
            <DrawingManager
              onLoad={(drawingManager) => {
                drawingManagerRef.current = drawingManager;
                console.log("Drawing manager loaded");
              }}
              onPolygonComplete={handlePolygonComplete}
              onCircleComplete={handleCircleComplete}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: window.google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: ["polygon", "circle"],
                },
                polygonOptions: {
                  clickable: true,
                  editable: true,
                  zIndex: 1,
                },
                circleOptions: {
                  clickable: true,
                  editable: true,
                  zIndex: 1,
                },
              }}
            />
          </GoogleMap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Map = memo(MapComponent);
