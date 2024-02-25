import React, { useEffect, useState } from 'react';

import Modal from './component/Modal';
import NoImage from '@/assets/no-image.webp';
import DisplayMap from './component/displayMap';

const item = [];

const MapView = ({ listing }) => {
  const [center, setCenter] = useState([]);

  const findCenter = () => {
    console.log('find center', listing);
    const firstObjWithCoordinate = listing.find(
      (obj) => obj.latitude !== null && obj.longitude !== null
    ) || { latitude: -6.903732, longitude: 107.618933 };

    console.log(firstObjWithCoordinate, '[firstObjWithCoordinate]');

    setCenter([
      parseFloat(firstObjWithCoordinate.latitude),
      parseFloat(firstObjWithCoordinate.longitude),
    ]);
    console.log(
      [
        parseFloat(firstObjWithCoordinate.latitude),
        parseFloat(firstObjWithCoordinate.longitude),
      ],
      '[center]'
    );
  };

  useEffect(() => {
    findCenter();
  }, []);

  return (
    <div className="grid h-full min-h-full md:grid-cols-[1fr_375px] 2xl:grid-cols-[1fr_750px]">
      <section className="z-10 hidden md:block">
        {/* <div className="relative z-10"> */}
        {/* <Map center={[-6.903732, 107.618933]} zoom={17} /> */}
        <DisplayMap
          // getMapData={getMapData}
          center={center}
          zoom="17"
          listing={listing}
        />
        {/* </div> */}
      </section>
      <section className="overflow-y-scroll pt-6 shadow-2xl">
        <div className="grid grid-cols-2 gap-3 px-4">
          {listing.length > 0
            ? listing.map((item) => {
                return (
                  <>
                    <Modal>
                      <div className="overflow-hidden shadow-sm">
                        {item.carouselPhotos?.length ? (
                          <Carousel images={item.carouselPhotos.slice(0, 5)} />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <img
                              src={NoImage}
                              alt="no image"
                              className="max-h-96 w-[70%] max-w-md rounded-lg object-contain opacity-70"
                            />
                          </div>
                        )}
                      </div>
                      <div className="overflow-hidden p-2">
                        <p className="overflow-hidden text-ellipsis text-lg font-semibold">
                          {item.ads_name}
                        </p>
                        <p className="overflow-hidden text-ellipsis text-sm">
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
