import { api } from './api';

export const transactions = (token, payload) => {
	const URL = `/transactions/`;
	return api(URL, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': token
		},
		params: {
			...payload
		}
	})
		.then(response => response.data)
		.catch(error => {
			throw error;
		});
};



export const userTransactions = (token, payload) => {
	const URL = `/transactions/user/`;
	return api(URL, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': token
		},
		params: {
			...payload
		}
	})
		.then(response => response.data)
		.catch(error => {
			throw error;
		});
};



export const createTransaction = (token, payment_id, service_id) => {
	const URL = `/transactions/`;
	return api(URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Authorization': token
		},
		data: {
			payment_id: payment_id,
			service_id: service_id
		}
	})
		.then(response => response.data)
		.catch(error => {
			throw error;
		});
};


export const updateTransaction = (payload, token, id) => {
	const URL = `/transactions/` + id;
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

export const deleteTransaction = (token, id) => {
	const URL = `/transactions/` + id;
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
