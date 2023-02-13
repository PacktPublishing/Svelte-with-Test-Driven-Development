export const fetchResponseOk = (response = {}) => ({
	status: 'ok',
	json: () => Promise.resolve(response)
});

export const fetchResponseError = (errorMessage) => ({
	status: 'error',
	json: () =>
		Promise.resolve({ message: errorMessage })
});
