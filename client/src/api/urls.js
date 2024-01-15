import config from '@/config/API';

// Listing
export const allListing = config.BASE_URL + '/api/listing';
export const addListing = config.BASE_URL + '/api/listing/add';

// Auth
export const registerEndpoint = config.BASE_URL + '/api/auth/register';
export const registerUserEndpoint =
  config.BASE_URL + '/api/auth/register/createuser';
export const loginEndpoint = config.BASE_URL + '/api/auth/login';
