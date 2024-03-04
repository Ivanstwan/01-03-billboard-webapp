import React from 'react';

import Map from '@/components/custom/map/map';
import {
  latitudeRegex as _latitudeRegex,
  longitudeRegex as _longitudeRegex,
} from '@/constant/regex';
import { Input } from '@/components/ui/input';

const InputCoordinate = ({
  config,
  handleInput,
  currListing,
  errorMessage = [],
}) => {
  // Validation function for coordinates
  const isValidCoordinates = (lat, lon) => {
    const latRegex = _latitudeRegex;
    const lonRegex = _longitudeRegex;

    return latRegex.test(lat) && lonRegex.test(lon);
  };

  const latLongPosition = () => {
    return currListing.latitude && currListing.longitude
      ? [parseFloat(currListing.latitude), parseFloat(currListing.longitude)]
      : undefined;
  };

  return (
    <>
      <div className="flex gap-8">
        <div className="flex flex-1 flex-col gap-8">
          {config.map((item, idx) => {
            return (
              <div className="flex items-center gap-8" key={item.value}>
                <p
                  className={`flex-shrink-0 flex-grow-0 basis-[250px] ${
                    item.className || ''
                  }`}
                >
                  {item.title}
                </p>
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder={item.placeholder || ''}
                    value={currListing[item.value] || ''}
                    className={`flex-grow-0 ${
                      errorMessage[idx] && 'border-red-500'
                    }`}
                    onChange={(e) => handleInput(e.target.value, item)}
                  />
                  {errorMessage[idx] && (
                    <p className="absolute pl-1 pt-1 text-sm italic text-red-500">
                      <span className="not-italic">⛔ </span>
                      {errorMessage[idx] || 'Input Required / Invalid.'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {isValidCoordinates(
          parseFloat(currListing.latitude),
          parseFloat(currListing.longitude)
        ) && (
          <div className="min-w-96 relative z-10 h-96 w-96 border-2 border-green-100">
            <Map center={latLongPosition()} zoom={17} />
          </div>
        )}
      </div>
    </>
  );
};

export default InputCoordinate;
