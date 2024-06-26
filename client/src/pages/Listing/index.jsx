import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import _ from 'lodash';
import qs from 'qs'; // Import qs library for query string manipulation

import Map from '@/components/custom/map/map';
import { Input } from '@/components/ui/input';
import { FullLayoutFixed } from '@/layout';
import Carousel from '@/components/custom/carousel/carousel';
import DisplayMap from './component/displayMap';
import { getListingData } from '@/api/listingApi';
import { isMapBoundsValid } from './utils';
import Modal from './component/Modal';
import PreviewListing from '@/components/custom/listing/previewListing';
import { cn } from '@/lib/utils';

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

  // Handle mouse click on Map Marker
  const [listingSelected, setListingSelected] = useState({});
  const [modalOn, setModalOn] = useState(false);

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

  // need to add another event + Modal, because cannot use Modal in Map Marker, because position style issue
  const clickMapMarker = (listingItem) => {
    setModalOn(true);
    setListingSelected(listingItem);
  };

  return (
    <FullLayoutFixed>
      {/* Modal */}
      <div
        className={cn(
          'absolute left-0 top-0 z-50 flex h-screen w-screen cursor-default items-center justify-center',
          { hidden: !modalOn }
        )}
      >
        <div
          className="absolute left-0 top-0 z-10 h-full w-full bg-black opacity-20"
          onClick={() => setModalOn(false)}
        ></div>
        <div className="relative z-20 h-full w-full max-w-6xl overflow-y-scroll bg-white pt-16">
          <PreviewListing listing={listingSelected} />
        </div>
      </div>
      <div className="flex h-full flex-col-reverse pt-24">
        <section className="h-full min-h-full">
          <div className="grid h-full md:grid-cols-[1fr_375px] 2xl:grid-cols-[1fr_750px]">
            <section className="z-10 hidden md:block">
              <DisplayMap
                getMapData={getMapData}
                center={center}
                zoom={zoom}
                listing={listing}
                currHover={currHover}
                eventClickMarker={clickMapMarker}
              />
            </section>
            <section className="overflow-y-scroll pt-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 px-4">
                {listing.length > 0
                  ? listing.map((item) => {
                      return (
                        <>
                          <Modal
                            // basically if handleMouseOver false, then nothing hovered
                            onMouseOver={() => handleMouseOver(item.id)}
                            onMouseOut={() => handleMouseOver(false)}
                            currListing={item}
                          >
                            <div className="overflow-hidden shadow-sm">
                              {item?.url?.length ? (
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
