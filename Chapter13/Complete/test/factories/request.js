export const createRequest = (json) => ({
	json: () => Promise.resolve(json)
});
