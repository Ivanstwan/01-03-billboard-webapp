import Map from '@/components/custom/map/map';
import { FullLayout } from '@/layout';
import React from 'react';

const Listing = () => {
  return (
    <FullLayout>
      <div className="flex h-full flex-col">
        <section className="border-b-[1px] border-slate-400 px-5">
          Search Bar + Filter
        </section>
        <div className="relative flex flex-1">
          <section className="z-10 hidden flex-1 md:block">
            {/* <div className="relative z-10"> */}
            <Map center={[10.2, 2.3]} zoom={17} />
            {/* </div> */}
          </section>
          <section className="z-20 shadow-2xl md:flex-[0_0_375px] 2xl:flex-[0_0_750px]">
            Map Listing
          </section>
        </div>
      </div>
    </FullLayout>
  );
};

export default Listing;
