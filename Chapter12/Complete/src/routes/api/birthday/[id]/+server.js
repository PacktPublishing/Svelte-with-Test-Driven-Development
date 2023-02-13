import { replace } from '$lib/server/birthdayRepository.js';
import { json, error } from '@sveltejs/kit';

export const PUT = async ({
	request,
	params: { id }
}) => {
	const { name, dob } = await request.json();
	const result = replace(id, { name, dob });
	if (result.error) throw error(422, result.error);

	return json(result);
};
