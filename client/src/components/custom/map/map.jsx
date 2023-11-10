import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  // Function to notify the parent component (YourPage) about the bounds change
  const handleBoundsChange = () => {
    console.log(map.getBounds());
    // onBoundsChange(map.getBounds());
  };

  // Call the handleBoundsChange function when the map view changes
  map.on('moveend', handleBoundsChange);

  map.setView(center, zoom);
  return null;
};

const GetMapBounds = () => {
  const map = useMap();
};

const Map = ({
  center,
  popupText = 'Marker',
  zoom = 15,
  markerList,
  onBoundsChange,
}) => {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={false}>
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerList ? (
        markerList.map((item) => {
          <Marker position={item.center}>
            <Popup>{item.popupText}</Popup>
          </Marker>;
        })
      ) : (
        <Marker position={center}>
          <Popup>{popupText}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
