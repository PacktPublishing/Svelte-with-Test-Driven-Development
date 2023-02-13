import { fail } from '@sveltejs/kit';
import {
	addNew,
	getAll,
	replace
} from '$lib/server/birthdayRepository.js';

addNew({ name: 'Hercules', dob: '1994-02-02' });
addNew({ name: 'Athena', dob: '1989-01-01' });

export const load = () => ({
	birthdays: getAll()
});

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');
		const dob = data.get('dob');

		let result;
		if (id) {
			result = replace(id, { name, dob });
		} else {
			result = addNew({ name, dob });
		}

		if (result.error) {
			return fail(422, {
				id,
				name,
				dob,
				error: result.error
			});
		}
	}
};

const invalidDob = (dob) => isNaN(Date.parse(dob));
