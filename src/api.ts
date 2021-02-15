import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import { REACT_APP_API_BASE_URL } from './config';
import { me } from './store/me';

const config: AxiosRequestConfig = {
  baseURL: REACT_APP_API_BASE_URL,
  withCredentials: true,
};

const epAPI = applyCaseMiddleware(axios.create(config));

epAPI.interceptors.response.use(async (response) => response, async (e) => {
  const err = e as AxiosError;
  if (err.response?.config.url === '/me') {
    return Promise.reject(e);
  }
  switch (err.response?.status) {
    case 401:
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
      me.clearMe();
      break;
    default:
  }
  return Promise.reject(e);
});

export default epAPI;
