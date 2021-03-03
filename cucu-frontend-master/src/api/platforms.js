import axios from 'axios';
import { api } from './api';

export const getPlatforms = () => {
    const URL = `/platforms/`;
    return api(URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
    })
    .then(response => response.data)
    .catch(error => {
        throw error;
    });
};