import React, { useEffect, useRef, useState } from 'react';
import './Agent.css';
import AgentTable from '../../components/AgentTable/AgentTable';
import Agentsproperties from '../../components/Agentsproperties/Agentsproperties';
import AgentFilter from '../../components/AgentFilter/AgentFilter';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAgentProperties } from '../../Redux/Slices/agentPropertySlice';
import { agents } from '../../constants/AgentsData/AgentsData';
import { mapStyle } from '../../components/Mapstyles/mapStyles';

const Agent = () => {
    const bearerToken = useSelector((state) => state.auth.bearerToken);
  const [showAgentTable, setShowAgentTable] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const dispatch = useDispatch();
  const { agentproperties } = useSelector((state) => state.agentProperties);

  const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // Dynamically load the Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsMapLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      setIsMapLoaded(true);
    }
  }, [GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    dispatch(fetchAgentProperties(bearerToken));
  }, [dispatch, bearerToken]);

  useEffect(() => {
    if (isMapLoaded && showMap && !mapRef.current) {
      const google = window.google;
      const mapInstance = new google.maps.Map(mapContainerRef.current, {
        styles: mapStyle,
        center: { lat: 17.433558276346112, lng: 78.43511918188656 },
        zoom: 11,
      });

      mapRef.current = mapInstance;

      // Add map controls
      mapInstance.setOptions({
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
      });
    }

    return () => {
      if (mapRef.current) {
        // Cleanup markers and map instance
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
        mapRef.current = null;
      }
    };
  }, [isMapLoaded, showMap]);

  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
  
      // Add custom markers for each agent's location
      agents.forEach((agent) => {
        agent.locations.forEach((location) => {
          const bgColor = agent.color || '#007BFF'; // Example background color, customize as needed
  
          const marker = new window.google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: mapRef.current,
            title: 'Agent Location',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#A3000B',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 1.2,
              scale: 6, // Size of the marker
            },
          });
  
          // Add click listener for the marker
          marker.addListener('click', () => {
            mapRef.current.panTo({ lat: location.lat, lng: location.lng });
            mapRef.current.setZoom(14);
          });
  
          // Store the marker reference
          markersRef.current.push(marker);
        });
      });
    }
  }, [isMapLoaded, agents, showMap]);
  

  const flyToAgent = (agent) => {
   
    setShowMap(true); // Show the map if not already shown
    
    // Ensure the map is initialized and there are valid locations
    if (mapRef.current && agent.locations && agent.locations.length > 0) {
      const location = agent.locations[0]; 
      console.log(agent.location,"loca")
      if (location.lat && location.lng) {
        mapRef.current.panTo({ lat: location.lat, lng: location.lng });
        mapRef.current.setZoom(14);
      }
    } else {
      console.error('Invalid location data for agent');
    }
  };
  

  // const handleToggleAgentTable = () => {
  //   setShowAgentTable(!showAgentTable);
  //   setShowMap(false);
  // };

  return (
    <>
      <AgentFilter
        // handleToggleAgentTable={handleToggleAgentTable}
        // showAgentTable={showAgentTable}
      />
      <div className="agent-container">
        <div className="agent-testimonials" style={{ width: showMap ? '60%' : '100%' }}>

       <Agentsproperties agentsproperties={agentproperties} /> 
      

          {/* {showAgentTable ? (
            <Agentsproperties agentsproperties={agentproperties} />
          )
           : (
            <AgentTable agents={agents} onAgentClick={flyToAgent} />
          )} */}
        </div>
        <div className={`agentmap-container ${showMap ? 'visible' : ''}`} ref={mapContainerRef} />
      </div>
    </>
  );
};

export default Agent;
