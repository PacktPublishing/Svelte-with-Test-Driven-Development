import {
	build,
	files,
	version
} from '$service-worker';
import {
	addFilesToCache,
	deleteOldCaches,
	fetchWithCacheOnError
} from './lib/service-worker.js';

const cacheId = `cache-${version}`;

const appFiles = ['/birthdays'];
const assets = [...build, ...files, ...appFiles];

self.addEventListener('install', (event) => {
	event.waitUntil(addFilesToCache(cacheId, assets));
});

self.addEventListener('activate', (event) => {
	event.waitUntil(deleteOldCaches(cacheId));
	event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	event.respondWith(
		fetchWithCacheOnError(cacheId, event.request)
	);
});
