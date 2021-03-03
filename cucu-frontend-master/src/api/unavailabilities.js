import {api} from './api';

export const createUnavailability = (payload, token) => {
    const URL = `/unavailabilities/`;
    return api(URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': token
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

export const allUserUnavailabilities = (token, userId) => {
  const URL = `/unavailabilities/user-all/`+userId;
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
  

export const updateUnavailability = (payload, token, id) => {
    const URL = `/unavailabilities/`+id;
    return api(URL, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'Authorization': token
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
  
export const deleteUnavailability = (token, id) => {
  const URL = `/unavailabilities/`+id;
  return api(URL, {
    method: 'DELETE',
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
