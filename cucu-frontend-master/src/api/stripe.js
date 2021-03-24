import {api} from './api';

export const getPaymentIntent = (token, payload) => {
  const URL = `/stripe/payment-intent`;
  //console.log(payload)
  return api(URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json', // whatever you want
      'Authorization': token
    },
    data: {
        ...payload
    }
  })
    .then(response => response.data)
    .catch(error => {
      throw error;
    });
};
