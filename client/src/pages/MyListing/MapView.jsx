import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';

import Modal from './component/Modal';
import DisplayMap from './component/displayMap';
import Carousel from '@/components/custom/carousel/carousel';

const item = [];

const MapView = ({ listing }) => {
  const [center, setCenter] = useState([]);
  // Handle mouse over card listing
  const [currHover, setCurrHover] = useState();

  const handleMouseOver = useRef(
    _.debounce((id) => {
      setCurrHover(id);
    }, 300) // Adjust the debounce delay as needed
  ).current;

  const findCenter = () => {
    const firstObjWithCoordinate = listing.find(
      (obj) => obj.latitude !== null && obj.longitude !== null
    ) || { latitude: -6.903732, longitude: 107.618933 };

    setCenter([
      parseFloat(firstObjWithCoordinate.latitude),
      parseFloat(firstObjWithCoordinate.longitude),
    ]);
  };

  useEffect(() => {
    findCenter();
  }, []);

  return (
    <div className="grid h-full min-h-full md:grid-cols-[1fr_375px] 2xl:grid-cols-[1fr_750px]">
      <section className="z-10 hidden md:block">
        <DisplayMap
          center={center}
          zoom="17"
          listing={listing}
          currHover={currHover}
        />
      </section>
      <section className="overflow-y-scroll pt-6 shadow-2xl">
        <div className="grid grid-cols-2 gap-3 px-4">
          {listing.length > 0
            ? listing.map((item) => {
                return (
                  <>
                    <Modal
                      currListing={item}
                      onMouseOver={() => handleMouseOver(item.id)}
                      onMouseOut={() => handleMouseOver(false)}
                    >
                      <div className="overflow-hidden shadow-sm">
                        {item.url?.length ? (
                          <Carousel images={item.url.slice(0, 5)} />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
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
                        <p className="line-clamp-2 overflow-hidden text-ellipsis break-words text-lg font-semibold">
                          {item.ads_name}
                        </p>
                        <p className="line-clamp-1 overflow-hidden  text-ellipsis break-words text-sm">
                          {item.location}
                        </p>
                        <p className="overflow-hidden text-ellipsis text-xs text-slate-400">
                          {item.user_id}
                        </p>
                      </div>
                    </Modal>
                  </>
                );
              })
            : 'No Data'}
        </div>
      </section>
    </div>
  );
};

export default MapView;
