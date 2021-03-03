import axios from 'axios';
import { api } from './api';

export const getLanguages = (lang) => {
    const URL = `/languages/`;
    if(lang=="ES"){
        lang="es"
    }else{
        lang="en"
    }
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