import { advertisementType } from '@/constant/ads';
import { cn } from '@/lib/utils';
import React from 'react';

const SmallCardDetail = ({ className, title, text }) => {
  return (
    <div className="flex items-center gap-1 rounded-sm border-2 border-slate-600 px-4 py-3">
      <i className={cn('pr-2 text-3xl', className)} />
      <div>
        {title && <p className="flex items-center leading-4">{title}</p>}
        <p className="flex items-center font-bold">{text || '-'}</p>
      </div>
    </div>
  );
};

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
          {location && <p className="break-words pt-4 text-xl">{location}</p>}
          <div className="grid grid-cols-3 grid-rows-2 gap-2 pt-4">
            {ads_type_id && (
              <SmallCardDetail
                className="icon-billboard"
                title="Billboard Type"
                text={
                  advertisementType.find((item) => item.value === ads_type_id)
                    ?.label
                }
              />
            )}
            {size_height && size_length && size_length > size_length ? (
              <SmallCardDetail
                className="icon-rectangle-wide"
                title="Orientation"
                text="Horizontal"
              />
            ) : (
              <SmallCardDetail
                className="icon-rectangle-vertical"
                title="Orientation"
                text="Vertical"
              />
            )}
            {size_height && size_length && (
              <SmallCardDetail
                className="icon-arrow-left-right"
                title="Size"
                text={`${size_length} cm x ${size_height} cm`}
              />
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
