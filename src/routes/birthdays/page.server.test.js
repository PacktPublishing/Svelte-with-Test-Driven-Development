import {
	describe,
	it,
	expect,
	beforeEach
} from 'vitest';
import { createFormDataRequest } from 'src/factories/formDataRequest.js';
import { load, actions } from './+page.server.js';
import * as birthdayRepository from '$lib/server/birthdayRepository.js';

describe('/birthdays - load', () => {
	it('returns a fixture of two items', () => {
		const result = load();
		expect(result.birthdays).toEqual([
			expect.objectContaining({
				name: 'Hercules',
				dob: '1994-02-02'
			}),
			expect.objectContaining({
				name: 'Athena',
				dob: '1989-01-01'
			})
		]);
	});
});

describe('/birthdays - default action', () => {
	beforeEach(birthdayRepository.clear);

	const storedId = () =>
		birthdayRepository.getAll()[0].id;

	const performFormAction = (formData) =>
		actions.default({
			request: createFormDataRequest(formData)
		});

	it('adds a new birthday into the list', async () => {
		await performFormAction({
			name: 'Zeus',
			dob: '2009-02-02'
		});

		expect(
			birthdayRepository.getAll()
		).toContainEqual(
			expect.objectContaining({
				name: 'Zeus',
				dob: '2009-02-02'
			})
		);
	});

	it('saves unique ids onto each new birthday', async () => {
		const request = {
			name: 'Zeus',
			dob: '2009-02-02'
		};

		await performFormAction(request);
		await performFormAction(request);

		expect(
			birthdayRepository.getAll()[0].id
		).not.toEqual(birthdayRepository.getAll()[1].id);
	});

	it('updates an entry that shares the same id', async () => {
		await performFormAction({
			name: 'Zeus',
			dob: '2009-02-02'
		});

		await performFormAction({
			id: storedId(),
			name: 'Zeus Ex',
			dob: '2007-02-02'
		});

		expect(birthdayRepository.getAll()).toHaveLength(
			1
		);
		expect(
			birthdayRepository.getAll()
		).toContainEqual({
			id: storedId(),
			name: 'Zeus Ex',
			dob: '2007-02-02'
		});
	});

	describe('validation errors', () => {
		describe('when the name is not provided', () => {
			let result;

			beforeEach(async () => {
				result = await performFormAction({
					name: '',
					dob: '2009-02-02'
				});
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
				result = await performFormAction({
					name: 'Hercules',
					dob: 'unknown'
				});
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

		describe('when the id is unknown', () => {
			let result;

			beforeEach(async () => {
				result = await performFormAction({
					id: 'unknown',
					name: 'Hercules',
					dob: '2009-01-02'
				});
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
					'An unknown ID was provided.'
				);
			});
		});
	});

	describe('when replacing an item', () => {
		beforeEach(async () => {
			await performFormAction({
				name: 'Zeus',
				dob: '2009-02-02'
			});
		});

		it('returns the id when an empty name is provided', async () => {
			const result = await performFormAction({
				id: storedId(),
				name: '',
				dob: '1982-05-01'
			});

			expect(result.data).toContain({
				id: storedId()
			});
		});

		it('returns the id when an empty date of birth is provided', async () => {
			const result = await performFormAction({
				id: storedId(),
				name: 'Hercules',
				dob: ''
			});

			expect(result.data).toContain({
				id: storedId()
			});
		});
	});
});
