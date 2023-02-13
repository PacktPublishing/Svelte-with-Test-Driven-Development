import { addNew } from '$lib/server/birthdayRepository.js';
import { SvelteKitAuth } from '@auth/sveltekit';
import { authProviders } from './authProviders.js';

const devMode =
	import.meta.env.MODE === 'development';

if (devMode) {
	addNew({ name: 'Hercules', dob: '1994-02-02' });
	addNew({ name: 'Athena', dob: '1989-01-01' });
}

export const handle = SvelteKitAuth({
	providers: Object.values(authProviders)
});
