import config from '@/config/API';

// Listing
export const allListing = config.BASE_URL + '/api/listing';
export const singleListing = config.BASE_URL + '/api/listing';
export const addListing = config.BASE_URL + '/api/listing/add';
export const deleteListing = config.BASE_URL + '/api/listing/delete';
export const addListingImage = config.BASE_URL + '/api/listing/add/image';
export const editListing = config.BASE_URL + '/api/listing/edit/data';
export const deleteListingImage = config.BASE_URL + '/api/listing/delete/image';

// Auth
export const registerEndpoint = config.BASE_URL + '/api/auth/register';
export const registerUserEndpoint =
  config.BASE_URL + '/api/auth/register/createuser';
export const loginEndpoint = config.BASE_URL + '/api/auth/login';
export const checkAccessTokenEndpoint = config.BASE_URL + '/api/auth/checkuser';
export const getNewAccessTokenEndpoint = config.BASE_URL + '/api/auth/token';
