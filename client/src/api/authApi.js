import axios from 'axios';

import {
  registerEndpoint as _registerEndpoint,
  registerUserEndpoint as _registerUserEndpoint,
} from './urls';

// register - phase 1 - input email, and send unique email to user
export const register = async (email) => {
  try {
    const res = await axios.post(_registerEndpoint, { email: email });
    return res;
  } catch (error) {
    return error;
  }
};

// register - phase 2 - input password, and create user
export const registerUser = async (password, token) => {
  try {
    const res = await axios.post(_registerUserEndpoint, {
      password: password,
      token: token,
    });
    return res;
  } catch (error) {
    return error;
  }
};
