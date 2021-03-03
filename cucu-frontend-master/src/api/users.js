import axios from 'axios';
import {api} from './api';
import {uploadApi} from './uploadApi';

export const getUser = (payload, id) => {
  const URL = `/users/`+id;
  console.log(payload)
  return api(URL, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
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

export const createUser = (payload) => {
  const URL = `/users/`;
  console.log(payload)
  return api(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
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


export const updateUser = (payload, token) => {
  const URL = `/users/`;
  console.log(payload)
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

export const updatePassword = (payload, token) => {
  const URL = `/users/password`;
  console.log(payload)
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

export const disableUser = (token) => {
  const URL = `/users/disable`;
  return api(URL, {
    method: 'PUT',
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

export const saveFile = (file) => {
  const URL = `/users/file`;
  console.log(file)

  var formdata = new FormData();
  formdata.append("files", file);

  return uploadApi(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    data: formdata
    
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};

export const getTranslators = (payload, id) => {
  const URL = `/users/translators`;
  console.log(payload)
  return api(URL, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
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

export const getUnavailabilities = (token, payload) => {
  const URL = `/unavailabilities/user`;
  console.log(payload)
  return api(URL, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': token
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
