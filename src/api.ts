import axios, { AxiosRequestConfig } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';

const config: AxiosRequestConfig = {
  baseURL: 'http://192.168.50.3:8000/',
};

const epAPI = applyCaseMiddleware(axios.create(config));

export default epAPI;
