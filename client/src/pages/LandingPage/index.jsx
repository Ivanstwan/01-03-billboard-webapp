import { MainLayout } from '@/layout';
import React from 'react';

const LandingPage = () => {
  return (
    <MainLayout>
      <div>
        <section className="border-b-[1px] border-slate-400 px-5">
          Search Bar + Filter
        </section>
        <div>
          <section>Map</section>
          <section>Map Listing</section>
        </div>
      </div>
    </MainLayout>
  );
};

export default LandingPage;
