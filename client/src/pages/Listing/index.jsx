import Map from '@/components/custom/map/map';
import Modal from '@/components/custom/modal.jsx/modal';
import { Input } from '@/components/ui/input';
import { FullLayout } from '@/layout';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import data from './dummyResponseData.json';
import Carousel from '@/components/custom/carousel/carousel';
import DisplayMap from './component/displayMap';
import { getListingData } from '@/api/listingApi';
import _ from 'lodash';
import { isMapBoundsValid } from './utils';

const Listing = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    // query searh
    searchQueryState: '',
    // query bound map
    mapBounds: { west: '', east: '', south: '', north: '' },
    onlyComputerItems: false,
  });

  const querySearch = searchParams.get('searchQueryState');
  const queryBound = searchParams.get('mapBounds');
  const onlyComputerItems = searchParams.get('onlyComputerItems') === 'true';

  const [center, setCenter] = useState([-6.903732, 107.618933]);
  const [listing, setListing] = useState([]);

  // (First) - Basically check 'mapBounds' query params, and set the center of map depending on the 'mapBounds' if exist
  useEffect(() => {
    // set center map, if query bound exist
    if (queryBound && isMapBoundsValid(queryBound)) {
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
    }
  }, []);

  // fetch listing
  const fetchData = async () => {
    try {
      const result = await getListingData();
      // setListing(result);
    } catch (error) {
      // setError(error);
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

  // getting map data (on move from map)
  const getMapData = (map) => {
    const getMapBounds = map.getBounds();

    const north = getMapBounds._northEast.lat.toFixed(6);
    const east = getMapBounds._northEast.lng.toFixed(6);
    const south = getMapBounds._southWest.lat.toFixed(6);
    const west = getMapBounds._southWest.lng.toFixed(6);
    const mapBounds = { north, east, south, west };
    const mapBoundsStringify = JSON.stringify(mapBounds);

    setSearchParams(
      (prev) => {
        prev.set('mapBounds', mapBoundsStringify);
        return prev;
      },
      { replace: true }
    );
  };

  return (
    <FullLayout>
      <div className="flex h-full flex-col-reverse pt-24">
        <section className="h-full">
          {/* <div className="grid-rows-[calc(100% - 4rem)] grid h-full grid-cols-2"> */}
          <div className="grid h-full md:grid-cols-[1fr_375px] 2xl:grid-cols-[1fr_750px]">
            <section className="z-10 hidden md:block">
              {/* <div className="relative z-10"> */}
              {/* <Map center={[-6.903732, 107.618933]} zoom={17} /> */}
              <DisplayMap getMapData={getMapData} center={center} />
              {/* </div> */}
            </section>
            <section className="overflow-y-scroll pt-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 px-4">
                {data.response.map((item) => {
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
                })}
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
    </FullLayout>
  );
};

export default Listing;
