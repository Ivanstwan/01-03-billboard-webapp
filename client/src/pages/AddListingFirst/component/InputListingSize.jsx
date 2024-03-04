import React, { useState } from 'react';

import { Input } from '@/components/ui/input';

const InputListingSize = ({
  config,
  handleInput,
  currListing,
  errorMessage = [],
}) => {
  const handleSizeDisplay = (orientation) => {
    if (orientation === 'x') {
      if (currListing.size_length >= currListing.size_height) {
        return '100%';
      } else {
        return `${(currListing.size_length / currListing.size_height) * 100}%`;
      }
    } else if (orientation === 'y') {
      if (currListing.size_height >= currListing.size_length) {
        return '100%';
      } else {
        return `${(currListing.size_height / currListing.size_length) * 100}%`;
      }
    }
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
                    onChange={(e) =>
                      handleInput(parseInt(e.target.value), item)
                    }
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
        {!isNaN(currListing.size_height) &&
          !isNaN(currListing.size_length) &&
          currListing.size_height !== 0 &&
          currListing.size_length !== 0 &&
          currListing.size_height &&
          currListing.size_length && (
            <div className="min-w-96 relative h-96 w-96 border-2 border-green-100">
              <div
                style={{
                  width: handleSizeDisplay('x'),
                  height: handleSizeDisplay('y'),
                }}
                className={`after absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] border-2 border-dashed border-green-700 transition-all before:absolute before:right-0 before:top-[50%] before:translate-y-[-50%] before:content-[attr(dynamic-before)] after:absolute after:bottom-0 after:right-[50%] after:translate-x-[50%] after:content-[attr(dynamic-after)]`}
                dynamic-after={`${currListing.size_length} cm`}
                dynamic-before={`${currListing.size_height} cm`}
              ></div>
            </div>
          )}
      </div>
    </>
  );
};

export default InputListingSize;
