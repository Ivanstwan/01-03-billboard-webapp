import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Dropzone, { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MainLayout } from '@/layout';
import {
  addListingImage,
  deleteListingImage,
  getSingleListing,
} from '@/api/listingApi';
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
import PreviewListing from '@/components/custom/listing/previewListing';

const EditListingImage = () => {
  // Accessing the id parameter from the URL
  const { id } = useParams();
  const { auth, initAuth } = useAuth();
  const navigate = useNavigate();

  const [currListing, setCurrListing] = useState({});
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

  const handleDeleteListingImage = async (url) => {
    try {
      // loading start
      setLoading(true);

      const response = await deleteListingImage(url, auth.access_token);
      console.log(response, '[response]');

      if (response?.response?.status === 400) {
        // loading stop
        setLoading(false);
        return;
      }

      const refetchListing = await getSingleListing(id);
      setCurrListing(refetchListing[0]);

      // loading stop
      setLoading(false);
    } catch (error) {
      setLoading(false);
      addError({
        title: 'Error',
        text: 'Failed to delete listing image. (❁´◡`❁)',
        variant: 'red',
      });
    }

    const refetchListing = await getSingleListing(id);
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

      const refetchListing = await getSingleListing(id);
      setCurrListing(refetchListing[0]);

      // loading stop
      setLoading(false);
    } catch (error) {
      // loading stop
      setLoading(false);
      addError({
        title: 'Failed.',
        text: response?.data?.message || 'Image failed to upload.',
        variant: 'red',
      });
    }
  };

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
          <div className="flex flex-col">
            <Link to={'/listing/edit/' + id}>
              <Button variant="link">
                <div>
                  <span>{'<'} </span>Listing Data (1/2)
                </div>
              </Button>
            </Link>
            <Link to={'/my-listing'}>
              <Button variant="link">
                <div>
                  <span>{'<'} </span>My Listing
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
              <PreviewListing listing={currListing} />
            </div>
          </div>
          <h2 className="pt-12 text-3xl font-semibold">Photos</h2>
          <div>
            <h3 className="pt-4 text-2xl font-semibold">Current Photos</h3>
            <div className="grid grid-cols-5 grid-rows-1 gap-4 gap-y-8 py-8 pt-4">
              {currListing?.url &&
                currListing.url.map((fileUrl, index) => (
                  <div key={index} className="relative border-2 border-dashed">
                    <img
                      src={fileUrl}
                      alt="Preview"
                      className="h-full max-h-[200px] min-h-[200px] w-full border-2 border-dashed object-cover"
                    />
                    <button
                      onClick={() => handleDeleteListingImage(fileUrl)}
                      disabled={loading}
                      className="absolute right-0 top-0 bg-red-800 bg-opacity-50 px-2 py-1 text-white transition-all hover:bg-opacity-75"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              {currListing?.url &&
                currListing.url.map((fileUrl, index) => (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        key={index}
                        className="relative cursor-pointer border-2 border-dashed"
                      >
                        <img
                          src={fileUrl}
                          alt="Preview"
                          className="h-full max-h-[200px] min-h-[200px] w-full border-2 border-dashed object-cover"
                        />
                        <button className="absolute right-0 top-0 bg-red-800 bg-opacity-50 px-2 py-1 text-white transition-all hover:bg-opacity-75">
                          Remove
                        </button>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Remove Image</DialogTitle>
                        <DialogDescription>
                          Click remove if you're sure.
                        </DialogDescription>
                      </DialogHeader>
                      <img
                        src={fileUrl}
                        alt="Preview"
                        className="h-full max-h-[200px] min-h-[200px] w-full border-2 border-dashed object-cover"
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            onClick={() => handleDeleteListingImage(fileUrl)}
                          >
                            Remove
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ))}
            </div>
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
                    disabled={loading}
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
