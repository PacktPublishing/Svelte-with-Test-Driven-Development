import {
	addNew,
	getAll
} from '$lib/server/birthdayRepository.js';
import { json, error } from '@sveltejs/kit';

export const GET = () =>
	json({ birthdays: getAll() });
