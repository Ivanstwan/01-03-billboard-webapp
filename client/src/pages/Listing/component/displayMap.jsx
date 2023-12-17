import ExternalStateExample from '@/components/custom/mapTest/mapTest';
import React, { useState } from 'react';

const DisplayMap = ({ getMapData, center }) => {
  const [bound, setBound] = useState();

  // const handleFetchApi = (map) => {
  //   console.log('fetch api', map);
  //   console.log('fetch api bounds', map.getBounds());
  // };

  return (
    <>
      <ExternalStateExample onMoveHandler={getMapData} center={center} />
    </>
  );
};

export default DisplayMap;
