import config from '@/config/API';

// Listing
export const allListing = config.BASE_URL + '/api/listing';
export const singleListing = config.BASE_URL + '/api/listing';
export const addListing = config.BASE_URL + '/api/listing/add';
export const editListing = config.BASE_URL + '/api/listing/edit';

// Auth
export const registerEndpoint = config.BASE_URL + '/api/auth/register';
export const registerUserEndpoint =
  config.BASE_URL + '/api/auth/register/createuser';
export const loginEndpoint = config.BASE_URL + '/api/auth/login';
export const checkAccessTokenEndpoint = config.BASE_URL + '/api/auth/checkuser';
export const getNewAccessTokenEndpoint = config.BASE_URL + '/api/auth/token';
