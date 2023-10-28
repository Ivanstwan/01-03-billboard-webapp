import React from 'react';

const SizeDisplay = ({ x = 0, y = 0 }) => {
  const handleSizeDisplay = (orientation) => {
    const parseX = parseInt(x);
    const parseY = parseInt(y);

    if (orientation === 'x') {
      if (parseX >= parseY) {
        return '100%';
      } else {
        return `${(parseX / parseY) * 100}%`;
      }
    } else if (orientation === 'y') {
      if (parseY >= parseX) {
        return '100%';
      } else {
        return `${(parseY / parseX) * 100}%`;
      }
    }
  };

  return (
    <div className="min-w-96 relative h-96 w-96 border-2 border-green-100">
      <div
        style={{
          width: handleSizeDisplay('x'),
          height: handleSizeDisplay('y'),
        }}
        className={`after absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] border-2 border-dashed border-green-700 transition-all before:absolute before:right-0 before:top-[50%] before:translate-y-[-50%] before:content-[attr(dynamic-before)] after:absolute after:bottom-0 after:right-[50%] after:translate-x-[50%] after:content-[attr(dynamic-after)]`}
        dynamic-after={x === 0 || isNaN(x) ? '' : `${x} cm`}
        dynamic-before={y === 0 || isNaN(y) ? '' : `${y} cm`}
      ></div>
    </div>
  );
};

export default SizeDisplay;
