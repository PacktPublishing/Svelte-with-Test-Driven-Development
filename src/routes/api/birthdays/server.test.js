import { describe, it, expect } from 'vitest';
import { GET } from './+server.js';
import { addNew } from '$lib/server/birthdayRepository.js';
import { createBirthday } from 'src/factories/birthday.js';

const bodyOfResponse = (response) => response.json();

describe('GET', () => {
	it('returns all the birthdays from the store', async () => {
		addNew(createBirthday('Hercules', '2010-04-05'));
		addNew(createBirthday('Ares', '2008-03-02'));
		const { birthdays } = await bodyOfResponse(GET());
		expect(birthdays).toEqual([
			expect.objectContaining(
				createBirthday('Hercules', '2010-04-05')
			),
			expect.objectContaining(
				createBirthday('Ares', '2008-03-02')
			)
		]);
	});
});
