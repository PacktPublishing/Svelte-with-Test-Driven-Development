import { authProviders } from '../../authProviders.js';
import { page } from '$app/stores';

export const load = async ({ locals, request }) => ({
	providers: Object.keys(authProviders)
});
