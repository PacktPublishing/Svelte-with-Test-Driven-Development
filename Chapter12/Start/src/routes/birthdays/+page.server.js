import { fail } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	const result = await fetch('/api/birthdays');
	return result.json();
};

export const actions = {
	default: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = data.get('id');
		const name = data.get('name');
		const dob = data.get('dob');

		let response;
		if (id) {
			response = await fetch(`/api/birthday/${id}`, {
				method: 'PUT',
				body: JSON.stringify({ name, dob })
			});
		} else {
			response = await fetch('/api/birthdays', {
				method: 'POST',
				body: JSON.stringify({ name, dob })
			});
		}

		if (!response.ok) {
			const { message } = await response.json();
			return fail(422, {
				id,
				name,
				dob,
				error: message
			});
		}
	}
};

const invalidDob = (dob) => isNaN(Date.parse(dob));
