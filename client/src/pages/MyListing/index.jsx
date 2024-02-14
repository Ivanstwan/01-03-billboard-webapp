import React, { useEffect, useState } from 'react';

import { FullLayoutScrollable, MainLayout } from '@/layout';
import Modal from './component/Modal';
import NoImage from '@/assets/no-image.webp';
import TableView from './TableView';
import useAuth from '@/hooks/useAuth';
import { getListingData } from '@/api/listingApi';
import qs from 'qs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const MyListing = () => {
  const { auth, initAuth } = useAuth();

  const [mapView, setMapView] = useState(false);
  const [listing, setListing] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch listing
  const fetchData = async () => {
    try {
      // sending bound as a params/query
      const queryParams = qs.stringify({
        userId: auth.user_id,
      });

      const result = await getListingData(queryParams);
      setListing(result);
    } catch (error) {
      // setError(error);
    } finally {
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    // call api
    fetchData();
  }, []);

  const item = [];

  return (
    <FullLayoutScrollable>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex flex-1 items-center justify-between">
          <h1 className="font-serif text-3xl font-bold">My Advertisement</h1>
          <div className="flex items-center gap-2">
            <Switch
              checked={mapView}
              onCheckedChange={() => setMapView(!mapView)}
              aria-readonly
              id="airplane-mode"
            ></Switch>
            <Label htmlFor="airplane-mode" className="cursor-pointer">
              Map View
            </Label>
          </div>
        </div>
        {mapView ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            <Modal>
              <div className="overflow-hidden shadow-sm">
                {false ? (
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
              <div className="p-2">
                <p className="text-lg font-semibold">
                  {item?.ads_name ?? 'ads name'}
                </p>
                <p className="text-sm">{item?.location ?? 'item location'}</p>
                <p className="text-xs text-slate-400">
                  {item?.user_id ?? 'user id'}
                </p>
              </div>
            </Modal>
            <Modal>Card</Modal>
            <Modal>Card</Modal>
            <Modal>Card</Modal>
            <Modal>Card</Modal>
            <Modal>Card</Modal>
          </div>
        ) : (
          <TableView data={listing} />
        )}
      </div>
    </FullLayoutScrollable>
  );
};

export default MyListing;
