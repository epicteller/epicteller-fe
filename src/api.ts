import axios, { AxiosRequestConfig } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import { REACT_APP_API_BASE_URL } from './config';

const config: AxiosRequestConfig = {
  baseURL: REACT_APP_API_BASE_URL,
};

const epAPI = applyCaseMiddleware(axios.create(config));

export default epAPI;
