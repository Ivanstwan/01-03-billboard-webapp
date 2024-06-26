import React, { useEffect, useState } from 'react';

import ExternalStateExample from '@/components/custom/mapTest/mapTest';

const DisplayMap = ({
  getMapData,
  center,
  zoom,
  listing,
  currHover,
  eventClickMarker,
}) => {
  const [convertedCenter, setConvertedCenter] = useState([]);

  useEffect(() => {
    setConvertedCenter(center.map((value) => parseFloat(value.toFixed(6))));
  }, [center, listing, zoom]);

  return (
    <>
      {convertedCenter.length > 0 && (
        <ExternalStateExample
          onMoveHandler={getMapData}
          onFirstLoadHandler={getMapData}
          center={convertedCenter}
          zoom={zoom}
          listing={listing}
          currHover={currHover}
          eventClickMarker={eventClickMarker}
        />
      )}
    </>
  );
};

export default DisplayMap;
