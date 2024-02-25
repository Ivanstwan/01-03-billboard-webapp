import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import _ from 'lodash';
import circleIcon from '@/assets/circle-dark-red.png';
import './index.css';

// custom icon for marker
const iconCircle = new L.icon({ iconUrl: circleIcon, iconSize: [16, 16] });

export default function Map({
  center = [-6.903732, 107.618933],
  zoom = 17,
  onMoveHandler, // Function to handle 'something' (e.g. maybe fetch api) on map move
  listing = [],
}) {
  const [map, setMap] = useState(null);

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
                icon={iconCircle}
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
    [listing, center, zoom]
  );

  return (
    <>
      {/* {map ? <DisplayPosition map={map} /> : null} */}
      {displayMap}
    </>
  );
}
