import axios, { AxiosRequestConfig } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const config: AxiosRequestConfig = {
  baseURL: 'https://api.epiteller.com/',
};

const epAPI = applyCaseMiddleware(axios.create(config));

export default epAPI;
