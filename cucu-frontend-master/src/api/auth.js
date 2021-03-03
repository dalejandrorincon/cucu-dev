import {api} from './api';

export const login = (payload) => {
  const URL = `/auth/login/`;
  return api(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', // whatever you want
    },
    data:{
      ...payload
    }
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const logout = (token) => {
  const URL = `/auth/logout/`;
  return api(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': token
    },
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};



export const checkToken = (payload) => {
  const URL = `/auth/check-recovery-token/`;
  return api(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', // whatever you want
    },
    data:{
      ...payload
    }
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};