import axios from 'axios';
import { api } from './api';

export const getData = (token) => {
	const URL = `/payment_data/`;
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


export const createData = (payload, token) => {
	const URL = `/payment_data/`;
	//console.log(payload)
	return api(URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
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


export const updateData = (payload, token) => {
	const URL = `/payment_data/`;
	//console.log(payload)
	return api(URL, {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
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
