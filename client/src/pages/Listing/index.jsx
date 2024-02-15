import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import _ from 'lodash';
import qs from 'qs'; // Import qs library for query string manipulation

import Map from '@/components/custom/map/map';
import Modal from '@/components/custom/modal.jsx/modal';
import { Input } from '@/components/ui/input';
import { FullLayoutFixed } from '@/layout';
import data from './dummyResponseData.json';
import Carousel from '@/components/custom/carousel/carousel';
import DisplayMap from './component/displayMap';
import { getListingData } from '@/api/listingApi';
import { isMapBoundsValid } from './utils';
import NoImage from '@/assets/no-image.webp';

// Check if value is [object Object],
// why? because if query empty (e.g. queryBound, instead of returning value, it return '[object Object])
function isObjectObject(value) {
  return value === '[object Object]';
}

const Listing = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    // query searh
    // query bound map
    mapBounds: { west: '', east: '', south: '', north: '' },
    // zoom
    zoom: 11,
    searchQueryState: '',
    userId: '',
  });

  const querySearch = searchParams.get('searchQueryState');
  const queryBound = searchParams.get('mapBounds');
  const queryZoom = searchParams.get('zoom');
  const queryUserId = searchParams.get('userId');

  const [center, setCenter] = useState([]);
  const [zoom, setZoom] = useState(15);
  const [listing, setListing] = useState([]);

  // Handle mouse over card listing
  const [currHover, setCurrHover] = useState();

  const handleMouseOver = useRef(
    _.debounce((id) => {
      setCurrHover(id);
    }, 300) // Adjust the debounce delay as needed
  ).current;
  // ------------------------------ handle mouse over card END

  // (First) - Basically check 'mapBounds' query params, and set the center of map depending on the 'mapBounds' if exist
  useEffect(() => {
    // set center map, if query bound exist
    if (isObjectObject(queryBound) && isMapBoundsValid(queryBound)) {
      const parseJsonBound = JSON.parse(queryBound);
      const { west, east, north, south } = parseJsonBound;

      // Convert string values to numbers
      const westNumber = parseFloat(west);
      const eastNumber = parseFloat(east);
      const northNumber = parseFloat(north);
      const southNumber = parseFloat(south);

      if (
        !isNaN(westNumber) &&
        !isNaN(eastNumber) &&
        !isNaN(northNumber) &&
        !isNaN(southNumber)
      ) {
        // Check if any of the values are non-empty strings
        if (westNumber || eastNumber || northNumber || southNumber) {
          setCenter([
            (northNumber + southNumber) / 2,
            (westNumber + eastNumber) / 2,
          ]);
        }
      }
    } else {
      // default value for center, if no value exist
      setCenter([-6.903732, 107.618933]);
    }

    if (queryZoom) setZoom(queryZoom);
  }, []);

  // fetch listing
  const fetchData = async () => {
    try {
      let parseBounds;

      if (!isObjectObject(queryBound)) {
        const parseJsonBound = JSON.parse(queryBound);
        const { west, east, north, south } = parseJsonBound;

        const westNumber = parseFloat(west.toFixed(6));
        const eastNumber = parseFloat(east.toFixed(6));
        const northNumber = parseFloat(north.toFixed(6));
        const southNumber = parseFloat(south.toFixed(6));
        parseBounds = {
          west: westNumber,
          east: eastNumber,
          north: northNumber,
          south: southNumber,
        };
      }

      // sending bound as a params/query
      const queryParams = qs.stringify({
        mapBounds: JSON.stringify(parseBounds),
        userId: queryUserId,
      });

      const result = await getListingData(queryParams);

      // Filter value with no latitude or longitude
      setListing(
        result.filter(
          (obj) => (obj.latitude !== null) & (obj.longitude !== null)
        )
      );
    } catch (error) {
      // setError(error);
      console.error(error);
    } finally {
      // setIsLoading(false);
    }
  };

  // Add debounce to fetchData function
  const fetchDataDebounced = _.debounce(fetchData, 500);

  useEffect(() => {
    fetchDataDebounced(); // Call the debounced function

    // Clean up debounce on component unmount
    return () => {
      fetchDataDebounced.cancel();
    };
  }, [searchParams]);

  // getting map data (map bounds, zoom), and put it into url query
  const getMapData = (map) => {
    const getCenter = map.getCenter();
    const parseCenter = [
      parseFloat(getCenter.lat.toFixed(6)),
      parseFloat(getCenter.lng.toFixed(6)),
    ];
    const getZoom = map.getZoom();
    const getMapBounds = map.getBounds();

    // set center and zoom, after move/zoom event
    setCenter(parseCenter);
    setZoom(getZoom);

    const north = getMapBounds._northEast.lat;
    const east = getMapBounds._northEast.lng;
    const south = getMapBounds._southWest.lat;
    const west = getMapBounds._southWest.lng;
    const mapBounds = { north, east, south, west };
    const mapBoundsStringify = JSON.stringify(mapBounds);

    setSearchParams(
      (prev) => {
        prev.set('mapBounds', mapBoundsStringify);
        prev.set('zoom', getZoom);
        return prev;
      },
      { replace: true }
    );
  };

  return (
    <FullLayoutFixed>
      <div className="flex h-full flex-col-reverse pt-24">
        <section className="h-full min-h-full">
          {/* <div className="grid-rows-[calc(100% - 4rem)] grid h-full grid-cols-2"> */}
          <div className="grid h-full md:grid-cols-[1fr_375px] 2xl:grid-cols-[1fr_750px]">
            <section className="z-10 hidden md:block">
              {/* <div className="relative z-10"> */}
              {/* <Map center={[-6.903732, 107.618933]} zoom={17} /> */}
              <DisplayMap
                getMapData={getMapData}
                center={center}
                zoom={zoom}
                listing={listing}
                currHover={currHover}
              />
              {/* </div> */}
            </section>
            <section className="overflow-y-scroll pt-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 px-4">
                {listing.length > 0
                  ? listing.map((item) => {
                      return (
                        <>
                          <Modal onMouseOver={() => handleMouseOver(item.id)}>
                            <div className="overflow-hidden shadow-sm">
                              {item.carouselPhotos?.length ? (
                                <Carousel
                                  images={item.carouselPhotos.slice(0, 5)}
                                />
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
                            <div className="p-2">
                              <p className="text-lg font-semibold">
                                {item.ads_name}
                              </p>
                              <p className="text-sm">{item.location}</p>
                              <p className="text-xs text-slate-400">
                                {item.user_id}
                              </p>
                            </div>
                          </Modal>
                        </>
                      );
                    })
                  : 'No Data'}
                {/* {data.response.map((item) => {
                  return (
                    <>
                      <Modal>
                        <div className="overflow-hidden">
                          {item.carouselPhotos.length ? (
                            <Carousel
                              images={item.carouselPhotos.slice(0, 5)}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <img
                                src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg"
                                alt="no image"
                                className="max-h-96 w-full max-w-md rounded-lg object-contain shadow-lg"
                              />
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-lg font-semibold">
                            {item.titleText}
                          </p>
                          <p className="text-sm">{item.address}</p>
                          <p className="text-xs text-slate-400">
                            {item.brokerName}
                          </p>
                        </div>
                      </Modal>
                    </>
                  );
                })} */}
              </div>
            </section>
          </div>
        </section>
        <section className="min-h-20 border-b-[1px] border-slate-400 px-5 py-4">
          Search Bar + Filter
          <Input
            onChange={(e) =>
              setSearchParams(
                (prev) => {
                  prev.set('searchQueryState', e.target.value);
                  return prev;
                },
                { replace: true }
              )
            }
          />
        </section>
      </div>
    </FullLayoutFixed>
  );
};

export default Listing;
