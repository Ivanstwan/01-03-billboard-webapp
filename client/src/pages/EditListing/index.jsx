import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { MainLayout } from '@/layout';
import useAuth from '@/hooks/useAuth';
import { getSingleListing } from '@/api/listingApi';
import { useErrorContext } from '@/context/ErrorProvider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import InputAdsType from './component/InputAdsType';
import InputCoordinate from './component/InputCoordinate';
import InputListingSize from './component/InputListingSize';
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
import {
  latitudeRegex as _latitudeRegex,
  longitudeRegex as _longitudeRegex,
} from '@/constant/regex';
import DiffViewer from 'react-diff-viewer-continued';

const getTitleFromValue = (value) => {
  const inputItem = inputConfig.find((item) => item.value === value);
  return inputItem ? inputItem.title : null;
};

const inputConfig = [
  {
    value: 'ads_name',
    title: 'Advertisement Title',
    className: 'font-medium',
    placeholder: 'e.g. Perempatan Dago / Bridge Pondok Indah Mall',
  },
  {
    value: 'location',
    title: 'Location',
    className: 'font-medium',
    placeholder:
      'e.g. Jl. Farmasi No.6, Bendungan Hilir, Tanah Abang, Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10210',
  },
  { value: 'ads_type_id', title: 'Ads Type' },
  { value: 'latitude', title: 'Latitude' },
  { value: 'longitude', title: 'Longitude' },
  {
    value: 'size_length',
    title: 'Length (cm)',
    placeholder: 'e.g. 100 for "100cm or 1meter"',
  },
  {
    value: 'size_height',
    title: 'Height (cm)',
    placeholder: 'e.g. 100 for "100cm or 1meter"',
  },
];

const inputValidationRules = {
  ads_name: { required: true, errorMessage: 'Input Required.' },
  location: { required: true, errorMessage: 'Input Required.' },
  ads_type_id: { required: true, errorMessage: 'Input Required.' },
  latitude: {
    pattern: _latitudeRegex,
    errorMessage: 'False input format. (Also Max decimal 6)',
  },
  longitude: {
    pattern: _longitudeRegex,
    errorMessage: 'False input format. (Also Max decimal 6)',
  },
  size_length: {
    pattern: /^\d{0,7}$/,
    errorMessage: 'False input format. (Max length 7)',
  },
  size_height: {
    pattern: /^\d{0,7}$/,
    errorMessage: 'False input format. (Max length 7)',
  },
};

const NormalInput = ({
  config,
  handleInput,
  currListing,
  errorMessage = false,
}) => {
  return (
    <div className="flex items-center gap-8">
      <p
        className={`flex-shrink-0 flex-grow-0 basis-[250px] text-lg ${
          config.className || ''
        }`}
      >
        {config.title}
      </p>
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={config.placeholder || ''}
          value={currListing[config.value] || ''}
          className={`flex-grow-0 ${errorMessage && 'border-red-500'}`}
          onChange={(e) => handleInput(e.target.value, config)}
        />
        {errorMessage && (
          <p className="absolute pl-1 pt-1 text-sm italic text-red-500">
            <span className="not-italic">⛔ </span>
            {errorMessage || 'Input Required / Invalid.'}
          </p>
        )}
      </div>
    </div>
  );
};

const newStyles = {
  variables: {
    dark: {
      addedBackground: '#f1f5f9',
      addedColor: 'black',
      removedBackground: '#f1f5f9',
      removedColor: 'black',
      wordAddedBackground: '#86d194',
      wordRemovedBackground: '#c77d85',
      emptyLineBackground: '#f1f5f9',
    },
  },
};

const StringDiffViewer = ({ oldString, newString }) => {
  return (
    <DiffViewer
      oldValue={oldString}
      newValue={newString}
      splitView={true}
      hideLineNumbers={true}
      useDarkTheme={true}
      styles={newStyles}
    />
  );
};

const EditListing = () => {
  const { auth, initAuth } = useAuth();
  const { errors, addError, removeError } = useErrorContext();
  const [inputError, setInputError] = useState({});
  const navigate = useNavigate();
  // Accessing the id parameter from the URL
  const { id } = useParams();

  // Old listing data
  const [oldListing, setOldListing] = useState('');
  // New listing data
  const [currListing, setCurrListing] = useState('');
  // Loading when submit
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkIfUserAllowed = async () => {
      try {
        const response = await getSingleListing(id);

        // If user_id and listing user_id not match then, kick out/navigate to my-listing
        if (response[0].user_id !== auth.user_id) {
          addError({
            title: 'Unauthorized',
            text: 'You are not allowed to edit listing. (❁´◡`❁)',
            variant: 'red',
          });
          return navigate('/my-listing');
        }

        // If everything ok (user id match, listing exist), then fetch listing data
        setCurrListing(response[0]);
        setOldListing(response[0]);
      } catch (error) {
        // If no listing with that id
        addError({
          title: 'Error',
          text: 'There are no listing with that id. (❁´◡`❁)',
          variant: 'red',
        });
        return navigate('/my-listing');
      }
    };

    checkIfUserAllowed();
  }, []);

  const handleBeforeSubmit = (e) => {
    let isInputValid = true;
    // Holding error of current input
    let error = {};

    // iterating the key property in currListing
    for (const field in currListing) {
      if (inputValidationRules.hasOwnProperty(field)) {
        const inputValue = currListing[field];
        const rules = inputValidationRules[field];

        // Check for required field
        if (
          rules?.required &&
          (inputValue === undefined || inputValue === '' || inputValue === null)
        ) {
          error = {
            ...error,
            [field]: rules?.errorMessage || 'Input Required / False Format.',
          };
          isInputValid = false; // Validation failed
        }

        // Check against regex pattern
        if (inputValue) {
          if (rules?.pattern && !rules.pattern.test(inputValue)) {
            error = {
              ...error,
              [field]: rules?.errorMessage || 'Input Required / Invalid.',
            };
            isInputValid = false; // Validation failed
          }
        }
      }
    }

    setInputError(error);

    if (!isInputValid) {
      // This, prevent 'modal' component to appear
      e.preventDefault();
      addError({
        title: 'Uhm! Something went wrong.',
        text: 'There were empty or invalid input.',
        variant: 'red',
      });
    }
  };

  const handleInput = (value, config) => {
    setCurrListing({
      ...currListing,
      [config.value]: value,
    });

    setInputError({
      ...inputError,
      [config.value]: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(!loading);

      // Post Data to api
      const editListing = async () => {
        console.log('editlisting', currListing);
        try {
          // const result = await addListing(locationData);
          // if (result?.success) {
          //   addError({
          //     title: 'Success!',
          //     text: 'Adding listing successful.',
          //     variant: 'green',
          //   });
          //   return navigate('/listing');
          // }
          // setListing(result);
        } catch (error) {
          // setError(error);
        } finally {
          // setIsLoading(false);
        }
      };
      editListing();
    }
  };

  useEffect(() => {
    console.log({ currListing, inputError }, '[currListing] !');
  }, [currListing, inputError]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 p-8">
        <h1 className="text-4xl font-bold">Edit Listing</h1>
        {/* Ads Name */}
        <NormalInput
          config={inputConfig[0]}
          handleInput={handleInput}
          currListing={currListing}
          errorMessage={inputError[inputConfig[0].value]}
        />

        {/* Location */}
        <NormalInput
          config={inputConfig[1]}
          handleInput={handleInput}
          currListing={currListing}
          errorMessage={inputError[inputConfig[1].value]}
        />

        <Separator />

        {/* Ads Type */}
        <InputAdsType
          config={inputConfig[2]}
          handleInput={handleInput}
          currListing={currListing}
          errorMessage={inputError[inputConfig[2].value]}
        />

        <Separator />

        {/* Coordinate */}
        <InputCoordinate
          config={[inputConfig[3], inputConfig[4]]}
          handleInput={handleInput}
          currListing={currListing}
          errorMessage={[
            inputError[inputConfig[3].value],
            inputError[inputConfig[4].value],
          ]}
        />

        <Separator />

        {/* Ads Size */}
        <InputListingSize
          config={[inputConfig[5], inputConfig[6]]}
          handleInput={handleInput}
          currListing={currListing}
          errorMessage={[
            inputError[inputConfig[5].value],
            inputError[inputConfig[6].value],
          ]}
        />

        {/* Submit Button & Preview */}
        <AlertDialog>
          <AlertDialogTrigger
            className="ml-auto inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary p-9 text-xl font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            onClick={handleBeforeSubmit}
          >
            Submit Edit
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Please Recheck Your Input</AlertDialogTitle>
              {Object.keys(currListing).map((item, idx) => {
                return currListing[item] !== oldListing[item] ? (
                  <>
                    <p>{getTitleFromValue(item)} Changes</p>
                    <StringDiffViewer
                      oldString={
                        oldListing[item] === null ||
                        oldListing[item] === undefined
                          ? ''
                          : String(oldListing[item])
                      }
                      newString={
                        currListing[item] === null ||
                        currListing[item] === undefined
                          ? ''
                          : String(currListing[item])
                      }
                    />
                  </>
                ) : (
                  <></>
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
    </MainLayout>
  );
};

export default EditListing;
