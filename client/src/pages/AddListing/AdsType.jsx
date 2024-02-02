import React from 'react';

import billboardGif from '@/assets/billboard.gif';
import videotronGif from '@/assets/videotron.gif';

const adsTypes = [
  {
    id: 'billboard',
    name: 'ads-type',
    value: 'billboard',
    text: 'Billboard',
    imgSrc: billboardGif,
  },
  {
    id: 'videotron',
    name: 'ads-type',
    value: 'videotron',
    text: 'Videotron',
    imgSrc: videotronGif,
  },
];

const AdsType = ({ onChange, name, errorMessage }) => {
  return (
    <>
      <div className="grid auto-rows-[200px] grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {adsTypes.map((ads) => {
          return (
            <div className="relative" key={ads.id}>
              <input
                type="radio"
                className="peer absolute right-4 top-4 z-10 h-8 w-8 appearance-none rounded-full border-2 border-slate-400 bg-slate-400 transition-all checked:border-lime-700 checked:bg-lime-700"
                name={name}
                value={ads.value}
                id={ads.id}
                onChange={onChange}
              />
              <label
                className="relative z-10 block h-full w-full cursor-pointer rounded-sm border-2 border-slate-400 transition-all peer-checked:border-4 peer-checked:border-lime-700"
                htmlFor={ads.id}
              ></label>
              <p className="absolute left-4 top-4 z-10 text-2xl font-semibold text-slate-900 transition-all peer-checked:left-[50%] peer-checked:top-[50%] peer-checked:translate-x-[-50%] peer-checked:translate-y-[-50%] peer-checked:text-4xl peer-checked:font-bold peer-checked:text-lime-700">
                {ads.text}
              </p>
              {ads.imgSrc && (
                <img
                  src={ads.imgSrc}
                  className="absolute top-0 z-0 h-full w-full opacity-30 peer-checked:opacity-40"
                />
              )}
            </div>
          );
        })}
      </div>
      <p
        className={
          errorMessage ? 'capitalize italic text-red-500' : 'h-0 opacity-0'
        }
      >
        {errorMessage}
      </p>
    </>
  );
};

export default AdsType;
