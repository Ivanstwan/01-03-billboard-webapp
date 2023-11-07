import Map from '@/components/custom/map/map';
import Modal from '@/components/custom/modal.jsx/modal';
import { Input } from '@/components/ui/input';
import { FullLayout } from '@/layout';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import data from './dummyResponseData.json';
import Carousel from '@/components/custom/carousel/carousel';

const Listing = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    q: '',
    onlyComputerItems: false,
  });

  const q = searchParams.get('q');
  const onlyComputerItems = searchParams.get('onlyComputerItems') === 'true';

  useEffect(() => {
    console.log(' api call ');
  }, [searchParams]);

  return (
    <FullLayout>
      <div className="flex h-full flex-col-reverse pt-24">
        <section className="h-full">
          {/* <div className="grid-rows-[calc(100% - 4rem)] grid h-full grid-cols-2"> */}
          <div className="grid h-full md:grid-cols-[1fr_375px] 2xl:grid-cols-[1fr_750px]">
            <section className="z-10 hidden md:block">
              {/* <div className="relative z-10"> */}
              <Map center={[-6.903732, 107.618933]} zoom={17} />
              {/* </div> */}
            </section>
            <section className="overflow-y-scroll pt-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-2 px-4">
                {data.response.map((item) => {
                  return (
                    <>
                      <Modal>
                        <div>
                          <Carousel images={item.carouselPhotos.slice(0, 5)} />
                        </div>
                        <div className="p-2">
                          <p className="text-lg font-semibold">
                            {item.titleText}
                          </p>
                          <p className="text-sm">{item.address}</p>
                          <p className="text-xs text-slate-400">
                            {item.brokerName}
                          </p>
                        </div>
                      </Modal>
                    </>
                  );
                })}
              </div>
            </section>
          </div>
        </section>
        <section className="min-h-20 border-b-[1px] border-slate-400 px-5 py-4">
          Search Bar + Filter
          <Input
            onChange={(e) =>
              setSearchParams(
                (prev) => {
                  prev.set('onlyComputerItems', e.target.value);
                  return prev;
                },
                { replace: true }
              )
            }
          />
        </section>
      </div>
    </FullLayout>
  );
};

export default Listing;
