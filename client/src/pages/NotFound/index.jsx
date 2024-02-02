import React from 'react';
import { Link } from 'react-router-dom';

import OrangeCat from '@/assets/orange-cat.png';

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="relative z-20 text-[25vw] font-bold leading-[30vw]">
        404
      </h1>
      <img
        src={OrangeCat}
        alt="orange cat"
        className="absolute left-[-15%] z-10 w-[70vw] translate-y-[-10vw]"
      />
      {/* <img
        src={OrangeCat}
        alt="orange cat"
        className="absolute right-[-15%] z-10 w-[70vw] translate-y-[-10vw] scale-x-[-1]"
      /> */}
      <p className="text-[3vw]">We can't find what you are looking for.</p>
      <Link
        to={'/'}
        className="mt-12 rounded bg-orange-400 p-4 px-4 py-2 text-[3vw] font-bold text-white transition-all hover:bg-orange-500"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
