import { addNew } from '$lib/server/birthdayRepository.js';

if (import.meta.env.MODE === 'development') {
	addNew({ name: 'Hercules', dob: '1994-02-02' });
	addNew({ name: 'Athena', dob: '1989-01-01' });
}
