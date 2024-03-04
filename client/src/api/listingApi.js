import axios from './axios/axios';
import {
  allListing as _allListing,
  singleListing as _singleListing,
  addListing as _addListing,
  editListing as _editListing,
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

export const addListing = async (listingData, accessToken) => {
  try {
    const res = await axios.post(_addListing, listingData, {
      headers: { authorization: `Bearer ${accessToken}` },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const editListing = async (listingData, accessToken) => {
  try {
    const res = await axios.post(
      `${_editListing}/${listingData.id}`,
      listingData,
      {
        headers: { authorization: `Bearer ${accessToken}` },
      }
    );
    return res;
  } catch (error) {
    return error;
  }
};
