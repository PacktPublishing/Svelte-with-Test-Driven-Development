export const fetchResponseOk = (response = {}) => ({
	status: 'ok',
	json: () => Promise.resolve(response)
});
