import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import GridSliderModal from './GridSliderModal';

const MapDisplay = ({ displays }) => {
  const [viewport, setViewport] = useState({
    latitude: 57,
    longitude: 18,
    zoom: 3,
    width: '100%',
    height: '400px',
  });

  const [selectedDisplay, setSelectedDisplay] = useState(null);

  const handleViewportChange = (newViewport) => {
    setViewport(newViewport);
  };

  const handleMarkerClick = (display) => {
    setSelectedDisplay(display);
  };

  const handleCloseModal = () => {
    setSelectedDisplay(null);
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
              offsetLeft={0}
              offsetTop={0}
            >
              <div
                className="cursor-pointer"
                onClick={() => handleMarkerClick(display)}
              >
                📍
              </div>
            </Marker>
          ))}
        
      </Map>

      {selectedDisplay && (
        <GridSliderModal post={selectedDisplay} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MapDisplay;
