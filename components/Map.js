import React, { useState, useEffect } from 'react';
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

  const [isMobile, setIsMobile] = useState(false);
  const [selectedDisplay, setSelectedDisplay] = useState(null);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setViewport({ ...viewport, height: '100vh' }); // Full screen on mobile
      } else {
        setIsMobile(false);
        setViewport({ ...viewport, height: '600px' }); // Larger map on desktop
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

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
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: isMobile ? '100vh' : '600px',
        scrollSnapAlign: isMobile ? 'start' : 'none',
      }}
      className={isMobile ? 'map-container mobile' : 'map-container desktop'}
    >
      <Map
        {...viewport}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_APIKEY}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        onMove={(evt) => handleViewportChange(evt.viewState)}
        dragPan={true}
        scrollZoom={true}
        dragRotate={true}
        attributionControl={false}
      >
        {displays
          .filter((display) => display.location && display.location.lat && display.location.lng)
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
