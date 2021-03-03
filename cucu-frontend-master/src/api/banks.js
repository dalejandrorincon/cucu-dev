import axios from 'axios';
import {api} from './api';

export const getBanks = (payload) => {
  const URL = `/banks/all`;
  return api(URL, {
    method: 'GET',
    headers: {
      'content-type': 'application/json', // whatever you want
    },
    params:{
      ...payload
    }
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};