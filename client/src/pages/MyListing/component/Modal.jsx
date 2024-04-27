import PreviewListing from '@/components/custom/listing/previewListing';
import React, { useState } from 'react';

const Modal = ({ children, currListing, onMouseOver, onMouseOut }) => {
  const [open, setOpen] = useState(false);

  const clicker = (e) => {
    console.log(e, '[event]');
    setOpen(!open);
  };

  return (
    <div
      className="grid w-full cursor-pointer rounded-sm shadow-md transition-all hover:shadow-xl hover:outline hover:outline-1 hover:outline-slate-500 2xl:grid-rows-[177px_1fr_auto]"
      onClick={clicker}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {children}
      {open && (
        <div className="absolute left-0 top-0 z-50 flex h-screen w-screen cursor-default items-center justify-center">
          <div className="absolute left-0 top-0 z-10 h-full w-full bg-black opacity-20"></div>
          <div className="relative z-20 h-full w-full max-w-6xl overflow-y-scroll bg-white pt-16">
            <PreviewListing listing={currListing} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
