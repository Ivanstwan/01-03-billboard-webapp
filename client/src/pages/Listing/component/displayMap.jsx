import ExternalStateExample from '@/components/custom/mapTest/mapTest';
import React, { useEffect, useState } from 'react';

const DisplayMap = ({ getMapData, center, zoom }) => {
  const [convertedCenter, setConvertedCenter] = useState([]);

  useEffect(() => {
    setConvertedCenter(center.map((value) => parseFloat(value.toFixed(6))));
  }, [center]);

  return (
    <>
      {convertedCenter.length > 0 && (
        <ExternalStateExample
          onMoveHandler={getMapData}
          center={convertedCenter}
          zoom={zoom}
        />
      )}
    </>
  );
};

export default DisplayMap;
