import {
	describe,
	it,
	expect,
	beforeEach
} from 'vitest';
import { createFormDataRequest } from 'test/factories/formDataRequest.js';
import { load, actions } from './+page.server.js';
import * as birthdayRepository from '$lib/server/birthdayRepository.js';

describe('/birthdays - load', () => {
	it('returns a fixture of two items', () => {
		const result = load();
		expect(result.birthdays).toEqual([
			{ name: 'Hercules', dob: '1994-02-02' },
			{ name: 'Athena', dob: '1989-01-01' }
		]);
	});
});

describe('/birthdays - default action', () => {
	beforeEach(birthdayRepository.clear);

	it('adds a new birthday into the list', async () => {
		const request = createFormDataRequest({
			name: 'Zeus',
			dob: '2009-02-02'
		});

		await actions.default({ request });

		expect(
			birthdayRepository.getAll()
		).toContainEqual(
			expect.objectContaining({
				name: 'Zeus',
				dob: '2009-02-02'
			})
		);
	});

	describe('validation errors', () => {
		describe('when the name is not provided', () => {
			let result;

			beforeEach(async () => {
				const request = createFormDataRequest({
					name: '',
					dob: '2009-02-02'
				});

				result = await actions.default({ request });
			});

			it('does not save the birthday', () => {
				expect(load().birthdays).not.toContainEqual(
					expect.objectContaining({
						name: '',
						dob: '2009-02-02'
					})
				);
			});

			it('returns a 422', () => {
				expect(result.status).toEqual(422);
			});

			it('returns a useful message', () => {
				expect(result.data.error).toEqual(
					'Please provide a name.'
				);
			});

			it('returns the other data back', () => {
				expect(result.data).toContain({
					dob: '2009-02-02'
				});
			});
		});

		describe('when the date of birth is in the wrong format', () => {
			let result;

			beforeEach(async () => {
				const request = createFormDataRequest({
					name: 'Hercules',
					dob: 'unknown'
				});

				result = await actions.default({ request });
			});

			it('does not save the birthday', () => {
				expect(load().birthdays).not.toContainEqual(
					expect.objectContaining({
						name: 'Hercules',
						dob: 'unknown'
					})
				);
			});

			it('returns a 422', () => {
				expect(result.status).toEqual(422);
			});

			it('returns a useful message', () => {
				expect(result.data.error).toEqual(
					'Please provide a date of birth in the YYYY-MM-DD format.'
				);
			});

			it('returns all data back, including the incorrect value', () => {
				expect(result.data).toContain({
					name: 'Hercules',
					dob: 'unknown'
				});
			});
		});
	});
});
