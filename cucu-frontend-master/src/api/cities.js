import axios from 'axios';
import {api} from './api';

export const getCities = (payload) => {
  const URL = `/cities/`;
  console.log(payload)
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