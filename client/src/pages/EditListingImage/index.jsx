import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Dropzone, { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui';
import { MainLayout } from '@/layout';
import { getSingleListing } from '@/api/listingApi';
import { cn } from '@/lib/utils';
import { useErrorContext } from '@/context/ErrorProvider';
import useAuth from '@/hooks/useAuth';

const ListingDetails = () => {
  const ImageStyled = ({ className }) => (
    <button>
      <img
        src="https://photos.zillowstatic.com/fp/8fb6d25e69b4f1d200442217c5a51221-cc_ft_768.webp"
        alt=""
        className={cn('transition-all hover:brightness-75', className)}
      />
    </button>
  );
  return (
    <>
      <div className="p-8">
        <div className="relative grid grid-cols-2 gap-2">
          <ImageStyled className="rounded-l-2xl" />
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <ImageStyled />
            <ImageStyled className="rounded-tr-2xl" />
            <ImageStyled />
            <ImageStyled className="rounded-br-2xl" />
          </div>
          <button className="absolute bottom-0 right-0 mb-4 mr-4 rounded-sm bg-white px-4 py-1 font-semibold transition-all hover:brightness-90">
            See all images
          </button>
        </div>
        <div className="flex flex-row gap-4 pt-4">
          <div className="flex-1 basis-full">
            <p className="text-3xl font-bold">$315,000</p>
            <p className="text-xl">1270 Carrington Way, Berne, IN 46711</p>
            <div className="grid grid-cols-3 grid-rows-2 gap-2 pt-4">
              <div className="flex gap-1 bg-zinc-100 px-3 py-2">
                <span>❤</span>
                <p>Vertical</p>
              </div>
              <div className="flex gap-1 bg-zinc-100 px-3 py-2">
                <span>❤</span>
                <p>150x100cm</p>
              </div>
              <div className="flex gap-1 bg-zinc-100 px-3 py-2">
                <span>❤</span>
                <p>Condominium</p>
              </div>
              <div className="flex gap-1 bg-zinc-100 px-3 py-2">
                <span>❤</span>
                <p>Condominium</p>
              </div>
              <div className="flex gap-1 bg-zinc-100 px-3 py-2">
                <span>❤</span>
                <p>Condominium</p>
              </div>
            </div>
          </div>
          <div className="flex-[1_0_25%]">
            <div className="flex flex-col gap-4 rounded-lg border-[1px] border-slate-300 p-4">
              <p className="rounded-md bg-blue-700 p-4 text-center font-bold text-white">
                This is title
              </p>
              <p className="bg-red rounded-md border-[1px] border-blue-400 px-4 py-2 text-center font-bold text-blue-400">
                Maybe contact user
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EditListingImage = () => {
  // Accessing the id parameter from the URL
  const { id } = useParams();
  const { auth, initAuth } = useAuth();
  const navigate = useNavigate();

  const [currListing, setCurrListing] = useState([]);
  const [files, setFiles] = useState([]);
  const { errors, addError, removeError } = useErrorContext();

  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles, 'onDrop [acceptedFiles]');
    const filteredFiles = acceptedFiles.filter((file) => {
      // Validate file type
      const acceptedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];
      const fileExtension = file.type;
      if (!acceptedTypes.includes(fileExtension)) {
        addError({
          title: 'File format not valid.',
          text: `File '${file.name}' is not a valid image type.`,
          variant: 'red',
        });
        return false;
      }
      // Validate file size
      if (file.size > 200000) {
        // max 600kB in bytes
        addError({
          title: 'File sized above 600kB.',
          text: `File '${file.name}' exceeds the maximum size of 600kB.`,
          variant: 'red',
        });
        return false;
      }
      return true;
    });

    setFiles([
      ...files,
      ...filteredFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      ),
    ]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  // handle delete files
  const handleDelete = (fileToDelete) => {
    setFiles(files.filter((file) => file !== fileToDelete));
  };

  useEffect(() => {
    console.log(files, '[files');
    // console.log(acceptedFiles, '[acceptedFiles');
  }, [files]);

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

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 p-8">
        <div>
          <div className="flex justify-between">
            <Link to={'/listing/edit/' + id}>
              <Button variant="link">
                <div>
                  <span>{'<'} </span>Listing Data (1/2)
                </div>
              </Button>
            </Link>
          </div>
          <h1 className="pt-4 text-center text-4xl font-bold">
            Listing Media (2/2)
          </h1>
          <div>
            <h2 className="pt-4 text-3xl font-semibold">
              Preview Listing Data
            </h2>
            <div>
              <ListingDetails />
            </div>
          </div>
          <h2 className="pb-4 pt-12 text-3xl font-semibold">Photos</h2>
          <div>
            <h3 className="pb-4 text-2xl font-semibold">Current Photos</h3>
            <p className="pb-4">Currently you have no photos.</p>
          </div>
          <div>
            <h3 className="pb-4 text-2xl font-semibold">Add New Photos</h3>
            <div
              {...getRootProps()}
              className="grid h-48 cursor-pointer place-items-center border-2 border-dashed border-zinc-400 hover:bg-zinc-100"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <div className="grid place-items-center">
                  <p className="text-xl font-semibold">
                    Drop photos here or click to upload.
                  </p>
                  <p className="pt-2 font-medium text-zinc-600">
                    Supported formats: jpg, jpge.
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-4 gap-y-8 pt-4">
              {files.map((file, index) => (
                <div key={index} className="relative border-2 border-dashed">
                  <img
                    src={file.preview}
                    alt="Preview"
                    className="h-full max-h-[200px] min-h-[200px] w-full border-2 border-dashed object-cover"
                  />
                  <p className="overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-sm">
                    {file.name}
                  </p>
                  <button
                    onClick={() => handleDelete(file)}
                    className="absolute right-0 top-0 bg-red-800 bg-opacity-50 px-2 py-1 text-white transition-all hover:bg-opacity-75"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditListingImage;
