import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import _ from 'lodash';
import circleIcon from '@/assets/circle-dark-red.png';
import './index.css';
import Modal from '@/pages/Listing/component/Modal';
import Carousel from '../carousel/carousel';

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
  eventClickMarker, // Function to handle 'Marker Clicked'
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
                  <div
                    className="grid min-w-[300px] max-w-[450px] cursor-pointer bg-white shadow-lg"
                    onClick={
                      eventClickMarker
                        ? () => {
                            eventClickMarker(item);
                          }
                        : undefined
                    }
                  >
                    <>
                      <div className="overflow-hidden shadow-sm">
                        {item?.url?.length ? (
                          <div className="h-[200px] max-h-[200px]">
                            <Carousel images={item.url.slice(0, 5)} />
                          </div>
                        ) : (
                          <div className="flex h-[200px] max-h-[200px] w-full items-center justify-center">
                            <div
                              className={
                                'grid h-full w-full place-items-center bg-zinc-200 text-2xl text-zinc-500 transition-all hover:brightness-95'
                              }
                            >
                              No Image
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden p-2">
                        <div className="line-clamp-2 overflow-hidden text-ellipsis break-words text-lg font-semibold">
                          {item.ads_name}
                        </div>
                        <div className="line-clamp-1 overflow-hidden  text-ellipsis break-words text-sm">
                          {item.location}
                        </div>
                        <div className="overflow-hidden text-ellipsis text-xs text-slate-400">
                          {item.user_id}
                        </div>
                      </div>
                    </>
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
