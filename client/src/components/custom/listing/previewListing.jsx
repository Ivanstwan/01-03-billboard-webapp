import { advertisementType } from '@/constant/ads';
import { cn } from '@/lib/utils';
import React from 'react';

const PreviewListing = ({ listing }) => {
  const { ads_name, location, size_height, size_length, ads_type_id, url } =
    listing || {};

  const ImageStyled = ({ className, urlSrc }) => {
    // with image OR no image
    return urlSrc ? (
      <button>
        <img
          src={urlSrc}
          alt=""
          className={cn(
            'h-full w-full object-cover transition-all hover:brightness-75',
            className
          )}
        />
      </button>
    ) : (
      <div
        className={cn(
          'grid place-items-center text-2xl text-zinc-500 transition-all hover:brightness-95',
          className
        )}
      >
        No Image
      </div>
    );
  };

  const ImageDisplayConditional = ({ url }) => {
    if (!url) return <></>;

    // 5 image display
    if (url.length > 5) {
      return (
        <div className="relative grid grid-cols-2 gap-2">
          <ImageStyled
            className="max-h-[450px] rounded-l-2xl"
            urlSrc={url[0]}
          />
          <div className="grid max-h-[450px] grid-cols-2 grid-rows-2 gap-2">
            <ImageStyled urlSrc={url[1]} />
            <ImageStyled className="rounded-tr-2xl" urlSrc={url[2]} />
            <ImageStyled urlSrc={url[3]} />
            <ImageStyled className="rounded-br-2xl" urlSrc={url[4]} />
          </div>
          <button className="absolute bottom-0 right-0 mb-4 mr-4 rounded-sm bg-white px-4 py-1 font-semibold transition-all hover:brightness-90">
            See all images ({url.length})
          </button>
        </div>
      );
    }

    // 2 image display
    if (url.length >= 3) {
      return (
        <div className="relative grid grid-cols-2 gap-2">
          <ImageStyled
            className="max-h-[450px] rounded-l-2xl"
            urlSrc={url[0]}
          />
          <ImageStyled
            className="max-h-[450px] rounded-r-2xl"
            urlSrc={url[1]}
          />
          <button className="absolute bottom-0 right-0 mb-4 mr-4 rounded-sm bg-white px-4 py-1 font-semibold transition-all hover:brightness-90">
            See all images ({url.length})
          </button>
        </div>
      );
    }

    // 1 image display
    if (url.length >= 1) {
      return (
        <div className="relative grid gap-2">
          <ImageStyled
            className="max-h-[450px] rounded-l-2xl"
            urlSrc={url[0]}
          />
        </div>
      );
    }

    // no image
    return (
      <div className="relative grid gap-2">
        <ImageStyled className="h-[450px] max-h-[450px] rounded-l-2xl bg-zinc-50" />
      </div>
    );
  };

  return (
    <div className="p-8">
      <ImageDisplayConditional url={url} />
      <div className="flex flex-row gap-4 pt-4">
        <div className="flex-1 basis-full overflow-hidden">
          {ads_name && (
            <p className="break-words text-3xl font-bold">{ads_name}</p>
          )}
          {location && <p className="break-words text-xl">{location}</p>}
          <div className="grid grid-cols-3 grid-rows-2 gap-2 pt-4">
            {ads_type_id && (
              <div className="flex gap-1 bg-zinc-100 px-3 py-2">
                <p className="flex items-center">
                  <i className="icon-billboard pr-2 text-2xl" />
                  {
                    // finding label ads based on ads_id
                    advertisementType.find((item) => item.value === ads_type_id)
                      ?.label
                  }
                </p>
              </div>
            )}
            {size_height && size_length && (
              <div className="flex gap-1 bg-zinc-100 px-3 py-2">
                {size_length > size_length ? (
                  <p className="flex items-center">
                    <i className="icon-rectangle-wide pr-2 text-2xl" />
                    Horizontal
                  </p>
                ) : (
                  <p className="flex items-center">
                    <i className="icon-rectangle-vertical pr-2 text-2xl" />
                    Vertical
                  </p>
                )}
              </div>
            )}
            {size_height && size_length && (
              <div className="flex gap-1 bg-zinc-100 px-3 py-2">
                <div className="flex justify-between gap-4">
                  <span className="flex items-center font-semibold italic">
                    <i className="icon-arrow-left-right pr-2 text-lg" />
                    {size_length}cm
                  </span>
                  <span className="flex items-center font-semibold italic">
                    <i className="icon-arrow-up-down pr-2 text-lg" />
                    {size_height}cm
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-[1_0_25%]">
          <div className="flex flex-col gap-4 rounded-lg border-[1px] border-slate-300 p-4">
            <p className="rounded-md bg-blue-700 p-4 text-center font-bold text-white">
              This is title
            </p>
            <p className="bg-red rounded-md border-[1px] border-blue-400 px-4 py-2 text-center font-bold text-blue-400">
              Maybe contact user
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewListing;
