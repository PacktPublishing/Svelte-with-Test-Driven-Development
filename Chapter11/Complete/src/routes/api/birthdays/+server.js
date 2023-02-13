import {
	addNew,
	getAll
} from '$lib/server/birthdayRepository.js';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ request }) => {
	const { name, dob } = await request.json();
	const result = addNew({ name, dob });
	if (result.error) throw error(422, result.error);

	return json(result);
};

export const GET = () =>
	json({ birthdays: getAll() });
