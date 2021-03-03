import {api} from './api';

export const getNotifications = (token) => {
  const URL = `/notifications/`;
  return api(URL, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': token
    }
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
  });
};

export const readNotifications = (ids, token) => {
  const URL = `/notifications/set-read`;
  return api(URL, {
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
      'Authorization': token
    },
    data:{
      ids: ids
    }
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
  });
};