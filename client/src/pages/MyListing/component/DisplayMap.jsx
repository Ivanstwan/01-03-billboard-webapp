import React, { useEffect, useState } from 'react';

import Map from './Map';

const DisplayMap = ({ center, zoom, listing }) => {
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
      {convertedCenter.length > 0 && (
        <Map center={convertedCenter} zoom={zoom} listing={sortedListing} />
      )}
    </>
  );
};

export default DisplayMap;
