import {
	describe,
	it,
	expect,
	beforeEach
} from 'vitest';
import { createFormDataRequest } from 'test/factories/formDataRequest.js';
import { createBirthday } from 'test/factories/birthday.js';
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
		await performFormAction(
			createBirthday('Zeus', '2009-02-02')
		);

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
		const request = createBirthday(
			'Zeus',
			'2009-02-02'
		);
		await performFormAction(request);
		await performFormAction(request);

		expect(
			birthdayRepository.getAll()[0].id
		).not.toEqual(birthdayRepository.getAll()[1].id);
	});

	it('updates an entry that shares the same id', async () => {
		await performFormAction(
			createBirthday('Zeus', '2009-02-02')
		);
		await performFormAction(
			createBirthday('Zeus Ex', '2007-02-02', {
				id: storedId()
			})
		);

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
				result = await performFormAction(
					createBirthday('', '2009-02-02')
				);
			});

			it('does not save the birthday', () => {
				expect(load().birthdays).not.toContainEqual(
					expect.objectContaining({
						name: '',
						dob: '2009-02-02'
					})
				);
			});

			it('returns a complete error response', () => {
				expect(result).toBeUnprocessableEntity({
					error: 'Please provide a name.',
					dob: '2009-02-02'
				});
			});
		});

		describe('when the date of birth is in the wrong format', () => {
			let result;

			beforeEach(async () => {
				result = await performFormAction(
					createBirthday('Hercules', 'unknown')
				);
			});

			it('does not save the birthday', () => {
				expect(load().birthdays).not.toContainEqual(
					expect.objectContaining({
						name: 'Hercules',
						dob: 'unknown'
					})
				);
			});

			it('returns a complete error response', () => {
				expect(result).toBeUnprocessableEntity({
					error:
						'Please provide a date of birth in the YYYY-MM-DD format.',
					name: 'Hercules',
					dob: 'unknown'
				});
			});
		});

		describe('when the id is unknown', () => {
			let result;

			beforeEach(async () => {
				result = await performFormAction(
					createBirthday('Hercules', '2009-01-02', {
						id: 'unknown'
					})
				);
			});

			it('does not save the birthday', () => {
				expect(load().birthdays).not.toContainEqual(
					expect.objectContaining({
						name: 'Hercules',
						dob: 'unknown'
					})
				);
			});

			it('returns a complete error response', () => {
				expect(result).toBeUnprocessableEntity({
					error: 'An unknown ID was provided.'
				});
			});
		});
	});

	describe('when replacing an item', () => {
		beforeEach(async () => {
			await performFormAction(
				createBirthday('Hercules', '2009-01-02')
			);
		});

		it('returns the id when an empty name is provided', async () => {
			const result = await performFormAction(
				createBirthday('', '1982-05-01', {
					id: storedId()
				})
			);

			expect(result).toBeUnprocessableEntity({
				id: storedId()
			});
		});

		it('returns the id when an empty date of birth is provided', async () => {
			const result = await performFormAction(
				createBirthday('Hercules', '', {
					id: storedId()
				})
			);

			expect(result).toBeUnprocessableEntity({
				id: storedId()
			});
		});
	});
});
