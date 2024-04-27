import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import _ from 'lodash';
import circleIcon from '@/assets/circle-dark-red.png';
import './index.css';

// custom icon for marker
const iconCircle = new L.icon({ iconUrl: circleIcon, iconSize: [16, 16] });
const iconCircleHovered = new L.icon({
  iconUrl: circleIcon,
  iconSize: [16, 16],
  className: 'leaflet-marker--hovered',
});

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
  onFirstLoadHandler, // Function to handle 'something' (e.g. maybe fetch api) on map move
  listing = [],
  currHover = false,
}) {
  const [map, setMap] = useState(null);
  // init load, for first time map loaded (can be used for getting mapBounds and fetching data)
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    // Fetch initial map data when the component mounts
    if (map && !initialLoad) {
      if (onFirstLoadHandler) onFirstLoadHandler(map);
      setInitialLoad(true); // Update initialLoad state to true after the initial fetch
    }
  }, [map, initialLoad]);

  useEffect(() => {
    // Handling map empty, when init render
    if (!map) {
      return;
    } else {
      const onMoveDebounced = _.debounce(() => {
        map.closePopup();
        if (onMoveHandler) onMoveHandler(map);
      }, 400); // Adjust the debounce delay as needed

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
        {/* <ChangeView center={center} zoom={zoom} /> */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {listing.length > 0 &&
          listing.map((item) => {
            return (
              <Marker
                position={[item.latitude, item.longitude]}
                icon={item.id === currHover ? iconCircleHovered : iconCircle}
              >
                <Popup keepInView={true} autoPan={false}>
                  <div className="grid min-w-[300px] max-w-[450px] grid-rows-[177px,1fr,auto] shadow-lg">
                    <div className="h-full">
                      <img
                        src="https://photos.zillowstatic.com/fp/ee03a8da9b3fdf3c0090469d9d6e154f-cc_ft_384.webp"
                        alt=""
                        className="h-0 min-h-full w-full rounded-t-md object-cover"
                      />
                    </div>
                    <div className="overflow-hidden rounded-b-md bg-white p-2 font-sans">
                      <div className="max-h-16 overflow-hidden">
                        <h3 className="break-normal text-2xl font-bold text-neutral-700">
                          {item.ads_name}
                        </h3>
                      </div>
                      <div className="text-neutral-600">
                        height {item.height ?? '--'} | length{' '}
                        {item.length ?? '--'}
                      </div>
                      <div className="pt-2 uppercase tracking-wider text-neutral-600">
                        {item.location}
                      </div>
                      <div className="uppercase text-neutral-600">user</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    ),
    [listing, center, zoom, currHover]
  );

  return (
    <>
      {/* {map ? <DisplayPosition map={map} /> : null} */}
      {displayMap}
    </>
  );
}
