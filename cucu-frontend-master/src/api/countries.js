import axios from 'axios';
import {api} from './api';

export const getCountries = (payload) => {
  const URL = `/countries/`;
  console.log(payload)
  if(payload.lang=="ES"){
    payload.lang="es"
  }else{
    payload.lang="en"
  }
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