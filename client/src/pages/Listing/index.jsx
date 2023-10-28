import { MainLayout } from '@/layout';
import React, { useState } from 'react';
import Map from '@/components/custom/map/map';
import FormInput from '@/components/custom/input/formInput';
import SizeDisplay from './SizeDisplay';
import AdsType from './AdsType';
import { Button } from '@/components/ui';

const inputs = [
  {
    id: 1,
    name: 'title',
    type: 'text',
    placeholder: 'E.g. Perempatan Dago / Bridge Pondok Indah Mall',
    errorMessage:
      "Username should be 3-16 characters and shouldn't include any special character!",
    label: 'Title',
    pattern: '^[A-Za-z0-9]{3,16}$',
  },
  {
    id: 2,
    name: 'address',
    type: 'text',
    placeholder:
      'E.g. Jl. Farmasi No.6, RT.6/RW.3, Bendungan Hilir, Tanah Abang, Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10210',
    errorMessage:
      "Username should be 3-16 characters and shouldn't include any special character!",
    label: 'Address / Location Estimation',
    pattern: '^[A-Za-z0-9]{3,16}$',
  },
];

const inputsSize = [
  {
    id: 1,
    name: 'x',
    type: 'number',
    placeholder: 'cm',
    label: 'Horizontal',
  },
  {
    id: 2,
    name: 'y',
    type: 'number',
    placeholder: 'cm',
    label: 'Vertical',
  },
];

const inputsCoordinate = [
  {
    id: 1,
    name: 'latitude',
    type: 'text',
    placeholder: '-8.723816909835',
    errorMessage:
      "Username should be 3-16 characters and shouldn't include any special character!",
    label: 'Latitude',
  },
  {
    id: 2,
    name: 'longitude',
    type: 'text',
    placeholder: '115.17508747874',
    label: 'Longitude',
  },
];

const expectedInput = {
  title: {
    type: 'text',
    required: true,
  },
  address: {
    type: 'text',
    required: true,
  },
  adsType: {
    type: 'text',
    required: true,
  },
  x: {
    type: 'number',
  },
  y: {
    type: 'number',
  },
  latitude: {
    type: 'float',
    pattern: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/,
  },
  longitude: {
    type: 'float',
    pattern: /^-?((1[0-7]|[1-9]?)[0-9]|180)\.{1}\d{1,6}$/,
  },
};

const AddListing = () => {
  const [locationData, setLocationData] = useState({
    title: '',
    address: '',
    adsType: '',
    x: undefined,
    y: undefined,
    latitude: '',
    longitude: '',
  });

  const [error, setError] = useState({});

  const handleInputChange = (e) => {
    setLocationData({
      ...locationData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation function for coordinates
  const isValidCoordinates = (lat, lon) => {
    const latRegex = expectedInput.latitude.pattern;
    const lonRegex = expectedInput.longitude.pattern;

    return latRegex.test(lat) && lonRegex.test(lon);
  };

  const latLongPosition = () => {
    return locationData.latitude && locationData.longitude
      ? [parseFloat(locationData.latitude), parseFloat(locationData.longitude)]
      : undefined;
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <MainLayout>
      <h1 className="pb-4 text-4xl font-bold">Listing Form</h1>
      {inputs.map((input) => {
        return (
          <div className="py-4" key={input.id}>
            <FormInput
              {...input}
              value={locationData[input.name]}
              onChange={handleInputChange}
            />
          </div>
        );
      })}
      <div className="py-4">
        <p className="pb-2 font-semibold">Size (centimeter)</p>
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-4">
            {inputsSize.map((input) => {
              return (
                <div className="py-4" key={input.id}>
                  <FormInput
                    {...input}
                    value={locationData[input.name]}
                    onChange={handleInputChange}
                    className="grid grid-cols-[150px_200px]"
                  />
                </div>
              );
            })}
          </div>
          <SizeDisplay x={locationData.x} y={locationData.y} />
        </div>
      </div>
      <div className="py-4">
        <p className="pb-2 font-semibold">Advertisement Type</p>
        <AdsType onChange={handleInputChange} name="adsType" />
      </div>
      <div className="py-4">
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-4">
            {inputsCoordinate.map((input) => {
              return (
                <div key={input.id} className="w-96">
                  <FormInput
                    {...input}
                    value={locationData[input.name]}
                    onChange={handleInputChange}
                  />
                </div>
              );
            })}
            <span className="font-semibold italic text-slate-500">
              *maximum 6 digit behind comma{' '}
              <span className="not-italic">😉</span>
            </span>
          </div>
          <div className="min-w-96 relative h-96 w-96 border-2 border-green-100">
            {isValidCoordinates(
              locationData.latitude,
              locationData.longitude
            ) && <Map center={latLongPosition()} zoom={17} />}
          </div>
        </div>
      </div>
      <div className="pt-10">
        <Button className="ml-auto p-9 text-xl" onClick={handleSubmit()}>
          Submit Listing 😉
        </Button>
      </div>
    </MainLayout>
  );
};

export default AddListing;
