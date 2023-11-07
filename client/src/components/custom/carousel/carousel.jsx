import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

const Carousel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute flex h-full w-full justify-between align-middle opacity-0 transition-all hover:opacity-100">
        <button
          onClick={previousImage}
          className="px-4 text-2xl font-bold text-white focus:outline-none"
        >
          <ChevronLeftIcon
            width={30}
            height={30}
            stroke="white"
            strokeWidth={0.7}
          />
        </button>
        <button
          onClick={nextImage}
          className="px-4 text-2xl font-bold text-white focus:outline-none"
        >
          <ChevronRightIcon
            width={30}
            height={30}
            stroke="white"
            strokeWidth={0.7}
          />
        </button>
        <div className="absolute bottom-0 mt-4 flex w-full justify-center">
          <div className="flex pb-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`mx-2 h-2 w-2 rounded-full ${
                  index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <img
        src={images[currentImageIndex].url}
        alt={`Image ${currentImageIndex + 1}`}
        className="max-h-96 w-full max-w-md rounded-lg shadow-lg"
      />
    </div>
  );
};

export default Carousel;
