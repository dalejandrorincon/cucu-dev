import axios from 'axios';
import { url } from '../utils/constants';

const api = axios.create({
  baseURL: `${url}`,
  timeout: 10000
});

export {api}