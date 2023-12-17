import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import _ from 'lodash';

const center = [51.505, -0.09];
const zoom = 13;

function DisplayPosition({ map }) {
  const [position, setPosition] = useState(() => map.getCenter());

  const onClick = useCallback(() => {
    map.setView(center, zoom);
  }, [map]);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    map.on('move', onMove);
    return () => {
      map.off('move', onMove);
    };
  }, [map, onMove]);

  return (
    <p>
      latitude: {position.lat.toFixed(4)}, longitude: {position.lng.toFixed(4)}{' '}
      <button onClick={onClick}>reset</button>
    </p>
  );
}

const ChangeView = ({ center, zoom }) => {
  const map = useMap();

  // Call the handleBoundsChange function when the map view changes
  map.setView(center, zoom);
  return null;
};

export default function ExternalStateExample({
  center = [-6.903732, 107.618933],
  zoom = 17,
  onMoveHandler, // Function to handle 'something' (e.g. maybe fetch api) on map move
}) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    // Handling map empty, when init render
    if (!map) {
      return;
    } else {
      const onMoveDebounced = _.debounce(() => {
        if (onMoveHandler) onMoveHandler(map);
      }, 500); // Adjust the debounce delay as needed

      map.on('move', onMoveDebounced);

      return () => {
        map.off('move', onMoveDebounced);
      };
    }
  }, [map]);

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        ref={setMap}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    [center]
  );

  return (
    <>
      {/* {map ? <DisplayPosition map={map} /> : null} */}
      {displayMap}
    </>
  );
}
