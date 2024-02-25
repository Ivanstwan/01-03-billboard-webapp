import axios from './axios/axios';
import {
  allListing as _allListing,
  singleListing as _singleListing,
  addListing as _addListing,
} from './urls';

// Function accept parameter "listingData" a query (e.g userId=2&query="something")
export const getListingData = async (listingData) => {
  try {
    const res = await axios.get(`${_allListing}?${listingData}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

// Function to get one listing data using "id"
export const getSingleListing = async (listingId) => {
  try {
    const res = await axios.get(`${_singleListing}/${listingId}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const addListing = async (listingData) => {
  try {
    const res = await axios.post(_addListing, listingData);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const editListing = async (listingData) => {
  console.log(listingData, '[listing data]');
  // try {
  //   const res = await axios.post(
  //     `${_addListing}/${listingData.id}`,
  //     {
  //       headers: { authorization: `Bearer ${accessToken}` },
  //     },
  //     listingData
  //   );
  //   return res.data;
  // } catch (error) {
  //   return error;
  // }
};
