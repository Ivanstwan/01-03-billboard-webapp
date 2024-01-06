import { MainLayout } from '@/layout';
import React, { useState } from 'react';
import Map from '@/components/custom/map/map';
import FormInput from '@/components/custom/input/formInput';
import SizeDisplay from './SizeDisplay';
import AdsType from './AdsType';
import { Button } from '@/components/ui';
import { validateAndTransformState } from '@/lib/formUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { addListing } from '@/api/listingApi';
import { useNavigate } from 'react-router-dom';
import { useErrorContext } from '@/context/ErrorProvider';

const inputValidation = {
  title: {
    required: true,
  },
  address: {
    required: true,
  },
  adsType: {
    required: true,
  },
  latitude: {
    pattern: /^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}$/,
  },
  longitude: {
    pattern: /^-?((1[0-7]|[1-9]?)[0-9]|180)\.{1}\d{1,6}$/,
  },
};

const AddListing = () => {
  const navigate = useNavigate();
  const { errors, addError, removeError } = useErrorContext();
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

  const [loading, setLoading] = useState(false);

  const inputs = [
    {
      id: 1,
      name: 'title',
      type: 'text',
      placeholder: 'E.g. Perempatan Dago / Bridge Pondok Indah Mall',
      label: 'Title',
      pattern: '^[A-Za-z0-9]{3,16}$',
      errorMessage: error?.title,
    },
    {
      id: 2,
      name: 'address',
      type: 'text',
      placeholder:
        'E.g. Jl. Farmasi No.6, RT.6/RW.3, Bendungan Hilir, Tanah Abang, Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10210',
      label: 'Address / Location Estimation',
      pattern: '^[A-Za-z0-9]{3,16}$',
      errorMessage: error?.address,
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
      label: 'Latitude',
      errorMessage: error?.latitude,
    },
    {
      id: 2,
      name: 'longitude',
      type: 'text',
      placeholder: '115.17508747874',
      label: 'Longitude',
      errorMessage: error?.longitude,
    },
  ];

  const handleInputChange = (e) => {
    setLocationData({
      ...locationData,
      [e.target.name]: e.target.value,
    });

    setError({
      ...error,
      [e.target.name]: '',
    });
  };

  // Validation function for coordinates
  const isValidCoordinates = (lat, lon) => {
    const latRegex = inputValidation.latitude.pattern;
    const lonRegex = inputValidation.longitude.pattern;

    return latRegex.test(lat) && lonRegex.test(lon);
  };

  const latLongPosition = () => {
    return locationData.latitude && locationData.longitude
      ? [parseFloat(locationData.latitude), parseFloat(locationData.longitude)]
      : undefined;
  };

  const handleBeforeSubmit = (e) => {
    const responseValidation = validateAndTransformState(
      locationData,
      inputValidation
    );

    if (!responseValidation.isInputValid) {
      // prevent modal
      e.preventDefault();
      setError({ ...responseValidation.error });
      addError({
        title: 'Uhm! Something went wrong.',
        text: 'There were empty or invalid input.',
        variant: 'red',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(!loading);

      // Post Data to api
      const postData = async () => {
        try {
          const result = await addListing(locationData);

          if (result?.success) {
            addError({
              title: 'Success!',
              text: 'Adding listing successful.',
              variant: 'green',
            });
            return navigate('/listing');
          }
          // setListing(result);
        } catch (error) {
          // setError(error);
        } finally {
          // setIsLoading(false);
        }
      };
      postData();
    }
  };

  return (
    <MainLayout>
      <div className="p-10">
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
          <AdsType
            onChange={handleInputChange}
            name="adsType"
            errorMessage={error?.adsType}
          />
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
            <div className="min-w-96 relative z-10 h-96 w-96 border-2 border-green-100">
              {isValidCoordinates(
                locationData.latitude,
                locationData.longitude
              ) && <Map center={latLongPosition()} zoom={17} />}
            </div>
          </div>
        </div>
        <div className="pt-10">
          <AlertDialog>
            <AlertDialogTrigger
              className="ml-auto inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary p-9 text-xl font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              onClick={handleBeforeSubmit}
            >
              Submit Listing 😉
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Please Recheck Your Input</AlertDialogTitle>
                {Object.keys(locationData).map((item) => {
                  return (
                    <AlertDialogDescription key={item}>
                      {item} ={' '}
                      {locationData[item] === undefined ||
                      locationData[item] === ''
                        ? '[empty]'
                        : locationData[item]}
                    </AlertDialogDescription>
                  );
                })}
              </AlertDialogHeader>
              <AlertDialogFooter>
                {!loading && <AlertDialogCancel>Cancel</AlertDialogCancel>}
                <AlertDialogAction onClick={handleSubmit}>
                  {loading ? 'Loading...' : 'Continue'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddListing;
