import React, { useEffect, useState } from 'react';

import ExternalStateExample from '@/components/custom/mapTest/mapTest';

const DisplayMap = ({ center, zoom, listing, currHover }) => {
  const [convertedCenter, setConvertedCenter] = useState([]);
  const [sortedListing, setSortedListing] = useState([]);

  useEffect(() => {
    setConvertedCenter(center.map((value) => parseFloat(value.toFixed(6))));
    setSortedListing(
      listing.filter((obj) => obj.latitude !== null && obj.longitude !== null)
    );
  }, [center, listing, zoom]);

  return (
    <>
      {sortedListing.length > 0 && convertedCenter.length > 0 ? (
        <ExternalStateExample
          center={convertedCenter}
          zoom={zoom}
          listing={sortedListing}
          currHover={currHover}
        />
      ) : (
        <p>No Data</p>
      )}
    </>
  );
};

export default DisplayMap;
