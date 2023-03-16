export const addFilesToCache = async (
	cacheId,
	assets
) => {
	const cache = await caches.open(cacheId);
	await cache.addAll(assets);
};

export const deleteOldCaches = async (cacheId) => {
	for (const key of await caches.keys()) {
		if (key !== cacheId) await caches.delete(key);
	}
};

export const fetchWithCacheOnError = async (
	cacheId,
	request
) => {
	const cache = await caches.open(cacheId);
	try {
		const response = await fetch(request);

		if (response.status === 200) {
			cache.put(request, response.clone());
		}

		return response;
	} catch {
		return cache.match(request);
	}
};
