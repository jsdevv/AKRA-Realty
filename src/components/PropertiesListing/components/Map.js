import {
  DrawingManager,
  GoogleMap,
  OverlayView,
  OverlayViewF,
  useGoogleMap,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { memo, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import PropertyMarker from "./Marker";
import { useGeoSearch, useTypesense } from "../context/TypesenseContext";
import Tile from "./Tile";

function MapResults() {
  const map = useGoogleMap();
  const {
    results,
    markedItem,
    updateItemForMarker,
    hitLocation,
  } = useTypesense();

  useEffect(() => {
    if (hitLocation) {
      panMapToHit(hitLocation);
    }
  }, [hitLocation]);

  const panMapToHit = (hit) => {
    if (!map) return;
    map.panTo({ lat: hit.location[0], lng: hit.location[1] });
  };

  
  const handleMarkerClick =async (hit) => {
    updateItemForMarker(null);
    panMapToHit(hit);
    updateItemForMarker(hit.groupKey);
  };


  if (!results.hits || !results.hits.length) return null;
  return (
    <AnimatePresence>
      {results.hits.map((hit, index) => {
        const isSelected = markedItem?.id === hit.id;
        const position = {
          lat: hit.location[0],
          lng: hit.location[1],
        };

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
                  zoom={map.getZoom()}
                  units={hit.found}
                  formattedAmount={hit.formattedAmount}
                />
              </div>

              {isSelected && markedItem && (
                <div style={{ 
                  maxWidth: "250px",
                  position: "absolute", 
                  top: "-230px", 
                  left: "-110px",
                  zIndex: "1",
                  filter: "drop-shadow(0px 2px 5px rgba(0,0,0,0.2))"
                }}>
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
                      zIndex: "1"
                    }}
                  />
                  <button
                    className="mappopup-close-button"
                    onClick={() => updateItemForMarker(null)}>
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

function MapComponent() {
  const [map, setMap] = useState();
  const { updateGeoLocation } = useGeoSearch();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "",
  });

  const performMapRefinement = () => {
    // if (!map || query) return;
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
  };
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
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
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
              mapTypeControl: false,
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
            }}
            onIdle={performMapRefinement}
          >
            <MapResults />
            {/* <DrawingManager
                  onLoad={(drawingManager) => {
                    console.log("Drawing manager loaded", drawingManager);
                  }}
                  options={{
                    drawingControl: true,
                    drawingControlOptions: {
                      position: window.google.maps.ControlPosition.TOP_CENTER,
                      drawingModes: ["polygon", "circle"],
                    },
                    polygonOptions: {
                      fillColor: "#2196F3",
                      strokeWeight: 2,
                      clickable: true,
                      editable: true,
                      zIndex: 1,
                    },
                  }}
                /> */}
          </GoogleMap>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Map = memo(MapComponent);