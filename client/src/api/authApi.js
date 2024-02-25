import axios from './axios/axios';
import {
  registerEndpoint as _registerEndpoint,
  registerUserEndpoint as _registerUserEndpoint,
  loginEndpoint as _loginEndpoint,
  checkAccessTokenEndpoint as _checkAccessTokenEndpoint,
  getNewAccessTokenEndpoint as _getNewAccessTokenEndpoint,
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

// login
export const login = async (email, password) => {
  try {
    const res = await axios.post(_loginEndpoint, {
      email: email,
      password: password,
    });
    return res;
  } catch (error) {
    return error;
  }
};

// Check Access Token
export const checkAuthToken = async (accessToken) => {
  try {
    const res = await axios.get(_checkAccessTokenEndpoint, {
      withCredentials: true,
      headers: { authorization: `Bearer ${accessToken}` },
    });
    return res;
  } catch (error) {
    return error;
  }
};

export const getNewAccessToken = async () => {
  try {
    const res = await axios.get(_getNewAccessTokenEndpoint, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    return error;
  }
};
