import React, { useState } from 'react';

import { Input } from '@/components/ui/input';

const Coordinate = ({ onChange, name }) => {
  const [size, setSize] = useState({ x: 0, y: 0 });

  const handleChange = (e) => {
    // change parent state (x, y)
    onChange(e);

    // change display size
    setSize({
      ...size,
      [e.target.id]: parseInt(e.target.value),
    });
  };

  const handleSizeDisplay = (orientation) => {
    if (orientation === 'x') {
      if (size.x >= size.y) {
        return '100%';
      } else {
        return `${(size.x / size.y) * 100}%`;
      }
    } else if (orientation === 'y') {
      if (size.y >= size.x) {
        return '100%';
      } else {
        return `${(size.y / size.x) * 100}%`;
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-10">
      <div className="flex flex-col gap-4">
        <label htmlFor="" className="grid grid-cols-[150px_200px]">
          Horizontal
          <Input
            type="number"
            name="x"
            id="x"
            placeholder="cm"
            min="0"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="" className="grid grid-cols-[150px_200px]">
          Vertical
          <Input
            type="number"
            name="y"
            id="y"
            placeholder="cm"
            min="0"
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="min-w-96 relative h-96 w-96 border-2 border-green-100">
        <div
          style={{
            width: handleSizeDisplay('x'),
            height: handleSizeDisplay('y'),
          }}
          className={`after absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] border-2 border-dashed border-green-700 transition-all before:absolute before:right-0 before:top-[50%] before:translate-y-[-50%] before:content-[attr(dynamic-before)] after:absolute after:bottom-0 after:right-[50%] after:translate-x-[50%] after:content-[attr(dynamic-after)]`}
          dynamic-after={size.x === 0 || isNaN(size.x) ? '' : `${size.x} cm`}
          dynamic-before={size.y === 0 || isNaN(size.y) ? '' : `${size.y} cm`}
        ></div>
      </div>
    </div>
  );
};

export default Coordinate;
