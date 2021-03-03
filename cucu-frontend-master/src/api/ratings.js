import axios from 'axios';
import { api } from './api';

export const createRating = (token, payload) => {
	const URL = `/reviews/`;
	console.log(payload)
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

