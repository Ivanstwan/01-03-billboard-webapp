import React, { useEffect, useState } from 'react';

import { FullLayoutFixed, FullLayoutScrollable, MainLayout } from '@/layout';
import TableView from './TableView';
import useAuth from '@/hooks/useAuth';
import { getListingData } from '@/api/listingApi';
import qs from 'qs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import MapView from './MapView';

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

  return mapView ? (
    <FullLayoutFixed>
      <section className="max-h-[calc(100% - 2rem)] flex h-full min-h-full flex-col-reverse gap-8 p-8 pt-[6.5rem]">
        <MapView listing={listing} />
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">My Advertisement</h1>
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
      </section>
    </FullLayoutFixed>
  ) : (
    <FullLayoutScrollable>
      <div className="flex flex-col gap-8 p-8">
        <div className="flex flex-1 items-center justify-between">
          <h1 className="text-4xl font-bold">My Advertisement</h1>
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
        <TableView listing={listing} />
      </div>
    </FullLayoutScrollable>
  );
};

export default MyListing;
