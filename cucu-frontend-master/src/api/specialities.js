import axios from 'axios';
import { api } from './api';

export const getSpecialities = (lang) => {

    if(lang=="ES"){
        lang="es"
    }else{
        lang="en"
    }

    const URL = `/specialities/`;
    return api(URL, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
        params:{
            lang: lang
        }
    })
    .then(response => response.data)
    .catch(error => {
        throw error;
    });
};