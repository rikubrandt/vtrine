import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl';

const MapDisplay = ({ displays }) => {
  const [viewport, setViewport] = useState({
    latitude: 39.5,
    longitude: -98.35, // Center of the US
    zoom: 3,
    width: '100%',
    height: '400px',
  });

  const handleViewportChange = (newViewport) => {
    setViewport(newViewport);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Map
        {...viewport}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_APIKEY}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        onMove={evt => handleViewportChange(evt.viewState)}
        dragPan={true}
        scrollZoom={true}
        dragRotate={true} 
        attributionControl={false}
      >
        {displays
          .filter(display => display.location && display.location.lat && display.location.lng)
          .map((display) => (
            <Marker
              key={display.id}
              latitude={display.location.lat}
              longitude={display.location.lng}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div>📍</div>
            </Marker>
          ))}
        
      </Map>
    </div>
  );
};

export default MapDisplay;
