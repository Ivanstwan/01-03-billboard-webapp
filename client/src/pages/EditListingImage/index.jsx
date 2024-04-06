import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Dropzone, { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui';
import { MainLayout } from '@/layout';
import { addListingImage, getSingleListing } from '@/api/listingApi';
import { cn } from '@/lib/utils';
import { useErrorContext } from '@/context/ErrorProvider';
import useAuth from '@/hooks/useAuth';
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
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { errors, addError, removeError } = useErrorContext();

  // logic for drag and drop & file validation (size, format img)
  const onDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter((file) => {
      // Validate file type
      const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/webp'];
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

  // this is logic based on 'react-dropzone', if confused (me either) check the library 'react-dropzone'
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  // handle delete files
  const handleDelete = (fileToDelete) => {
    setFiles(files.filter((file) => file !== fileToDelete));
  };

  // handle submit, basically add the file to formData and attach it in body
  const handleSubmit = async () => {
    try {
      // loading start
      setLoading(true);

      const formData = new FormData();
      console.log(formData, '[formData 1]');
      files.forEach((file) => {
        formData.append('files[]', file);
      });

      // add listing id to formData
      formData.append('listingId', id);
      console.log(formData, '[formData 2]');
      console.log(formData.getAll('files[]'), '[formData 2]');

      // Make POST request using Axios
      const response = await addListingImage(formData, auth.access_token);

      // Handle response if needed
      console.log('Upload successful:', response);

      if (response?.data?.message) {
        if (response?.data?.success) {
          addError({
            title: 'Upload Successful.',
            text: response.data.message,
            variant: 'green',
          });
        } else {
          addError({
            title: 'Upload Failed.',
            text: response.data.message,
            variant: 'red',
          });
        }
      } else {
        addError({
          title: 'Upload Failed.',
          text: 'Sorry we failed to upload the image.',
          variant: 'red',
        });
      }

      // Clear files after successful upload
      setFiles([]);

      // loading stop
      setLoading(false);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  useEffect(() => {
    addError({
      title: 'Unauthorized',
      text: 'You are not allowed to edit listing. (❁´◡`❁)',
      variant: 'red',
    });
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
          <h2 className="pt-12 text-3xl font-semibold">Photos</h2>
          <div>
            <h3 className="pt-4 text-2xl font-semibold">Current Photos</h3>
            <p className="pt-2">Currently you have no photos.</p>
          </div>
          <div>
            <h3 className="pb-4 pt-8 text-2xl font-semibold">Add New Photos</h3>
            <div
              {...getRootProps()}
              className="grid h-48 cursor-pointer place-items-center border-2 border-dashed border-zinc-400 hover:bg-zinc-100"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="grid h-full w-full place-items-center bg-zinc-100 text-xl font-semibold">
                  Drop the files here ...
                </p>
              ) : (
                <div className="grid place-items-center">
                  <p className="text-xl font-semibold">
                    Drop photos here or click to upload.
                  </p>
                  <p className="pt-2 font-medium text-zinc-600">
                    Supported formats: jpg, jpge, webp.
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-5 grid-rows-1 gap-4 gap-y-8 py-8 pt-4">
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
            <AlertDialog>
              <AlertDialogTrigger asChild>
                {loading ? (
                  <Button className="ml-auto flex" disabled>
                    Loading...
                  </Button>
                ) : (
                  <Button className="ml-auto flex">Add Photo</Button>
                )}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
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
      </div>
    </MainLayout>
  );
};

export default EditListingImage;
