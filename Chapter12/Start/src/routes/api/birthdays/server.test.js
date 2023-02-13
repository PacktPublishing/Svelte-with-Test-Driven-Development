import {
	describe,
	it,
	expect,
	beforeEach
} from 'vitest';
import * as birthdayRepository from '$lib/server/birthdayRepository.js';
import { createBirthday } from './test/factories/birthday.js';
import { createRequest } from './test/factories/request.js';
import { GET, POST } from './+server.js';

const bodyOfResponse = (response) => response.json();

describe('GET', () => {
	it('returns all the birthdays from the store', async () => {
		birthdayRepository.addNew(
			createBirthday('Hercules', '2010-04-05')
		);
		birthdayRepository.addNew(
			createBirthday('Ares', '2008-03-02')
		);
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

describe('POST', () => {
	beforeEach(birthdayRepository.clear);

	it('saves the birthday in the store', async () => {
		await POST({
			request: createRequest(
				createBirthday('Hercules', '2009-03-01')
			)
		});
		expect(birthdayRepository.getAll()).toHaveLength(
			1
		);
		expect(birthdayRepository.getAll()[0]).toContain(
			createBirthday('Hercules', '2009-03-01')
		);
	});

	it('returns a json response with the data', async () => {
		const response = await POST({
			request: createRequest(
				createBirthday('Hercules', '2009-03-01')
			)
		});
		expect(await bodyOfResponse(response)).toContain(
			createBirthday('Hercules', '2009-03-01')
		);
	});

	it('throws an error if the data is invalid', async () => {
		expect.hasAssertions();
		try {
			await POST({
				request: createRequest(
					createBirthday('Ares', '')
				)
			});
		} catch (error) {
			expect(error.status).toEqual(422);
			expect(error.body).toEqual({
				message:
					'Please provide a date of birth in the YYYY-MM-DD format.'
			});
		}
	});
});
