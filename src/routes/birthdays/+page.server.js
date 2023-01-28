import { fail } from '@sveltejs/kit';
import {
	addNew,
	getAll,
	replace,
	has
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

		if (empty(name)) {
			return fail(422, {
				id,
				dob,
				error: 'Please provide a name.'
			});
		}

		if (invalidDob(dob)) {
			return fail(422, {
				id,
				name,
				dob,
				error:
					'Please provide a date of birth in the YYYY-MM-DD format.'
			});
		}

		if (id && !has(id)) {
			return fail(422, {
				error: 'An unknown ID was provided.'
			});
		}

		if (id) {
			replace(id, {
				name,
				dob
			});
		} else {
			addNew({
				name,
				dob
			});
		}
	}
};

const empty = (value) =>
	value === undefined ||
	value === null ||
	value.trim() === '';

const invalidDob = (dob) => isNaN(Date.parse(dob));
