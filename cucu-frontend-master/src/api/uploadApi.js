import axios from 'axios';
import { url } from '../utils/constants';

const uploadApi = axios.create({
  baseURL: `${url}`,
  timeout: 600000
});

export {uploadApi}