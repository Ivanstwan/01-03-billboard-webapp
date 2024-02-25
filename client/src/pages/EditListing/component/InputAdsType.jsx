import React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { advertisementType as _advertisementType } from '@/constant/ads';

const InputAdsType = ({
  config,
  handleInput,
  currListing,
  errorMessage = false,
}) => {
  return (
    <div className="flex items-center gap-8">
      <p className={'flex-shrink-0 flex-grow-0 basis-[250px] font-medium'}>
        {config.title}
      </p>

      <Select
        onValueChange={(e) => {
          handleInput(e, config);
        }}
        defaultValue={
          currListing.ads_type_id
            ? // find the ads_type_id value that match _advertisementType constant
              _advertisementType.find((idx) => {
                return idx.value === currListing.ads_type_id && idx.value;
              }).value
            : ''
        }
      >
        <SelectTrigger
          className={`w-[180px] ${errorMessage && 'border-red-500'}`}
        >
          <SelectValue placeholder="Advertisement Type"></SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Advertisement Type</SelectLabel>
            {_advertisementType.map((type) => (
              <SelectItem value={type.value} key={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default InputAdsType;
