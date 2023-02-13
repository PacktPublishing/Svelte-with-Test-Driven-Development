import {
	describe,
	it,
	expect,
	beforeEach
} from 'vitest';
import { createBirthday } from 'src/factories/birthday.js';
import {
	addNew,
	clear,
	getAll,
	replace
} from './birthdayRepository.js';

describe('birthdayRepository', () => {
	beforeEach(clear);

	const storedId = () => getAll()[0].id;

	describe('addNew', () => {
		it('is initially empty', () => {
			expect(getAll()).toHaveLength(0);
		});

		it('adds a new birthday into the list', () => {
			addNew(createBirthday('Zeus', '2009-02-02'));
			expect(getAll()).toContainEqual(
				expect.objectContaining({
					name: 'Zeus',
					dob: '2009-02-02'
				})
			);
		});

		it('saves unique ids onto each new birthday', () => {
			const birthday = createBirthday(
				'Zeus',
				'2009-02-02'
			);
			addNew(birthday);
			addNew(birthday);

			expect(getAll()[0].id).not.toEqual(
				getAll()[1].id
			);
		});

		it('returns the added birthday with its id', () => {
			expect(
				addNew(createBirthday('Zeus', '2009-02-02'))
			).toEqual({
				id: storedId(),
				name: 'Zeus',
				dob: '2009-02-02'
			});
		});

		describe('validation errors', () => {
			describe('when the name is not provided', () => {
				let result;

				beforeEach(() => {
					result = addNew(
						createBirthday('', '1991-05-06')
					);
				});

				it('does not save the birthday', () => {
					expect(getAll()).toHaveLength(0);
				});

				it('returns an error', () => {
					expect(result).toEqual({
						error: 'Please provide a name.'
					});
				});
			});

			describe('when the date of birth is in the wrong format', () => {
				let result;

				beforeEach(() => {
					result = addNew(
						createBirthday('Hercules', 'unknown')
					);
				});

				it('does not save the birthday', () => {
					expect(getAll()).toHaveLength(0);
				});

				it('returns an error', () => {
					expect(result).toEqual({
						error:
							'Please provide a date of birth in the YYYY-MM-DD format.'
					});
				});
			});
		});
	});

	describe('replace', () => {
		beforeEach(() =>
			addNew(createBirthday('Hercules', '1991-05-06'))
		);

		it('updates an entry that shares the same id', () => {
			replace(
				storedId(),
				createBirthday('Zeus Ex', '2007-02-02')
			);
			expect(getAll()).toHaveLength(1);
			expect(getAll()).toContainEqual({
				id: storedId(),
				name: 'Zeus Ex',
				dob: '2007-02-02'
			});
		});

		it('returns the updated birthday', () => {
			expect(
				replace(
					storedId(),
					createBirthday('Zeus Ex', '2007-02-02')
				)
			).toEqual({
				id: storedId(),
				name: 'Zeus Ex',
				dob: '2007-02-02'
			});
		});

		describe('validation errors', () => {
			describe('when the name is not provided', () => {
				let result;

				beforeEach(() => {
					result = replace(
						storedId(),
						createBirthday('', '1991-05-06')
					);
				});

				it('does not update the birthday', () => {
					expect(getAll()[0].name).toEqual(
						'Hercules'
					);
				});

				it('returns an error', () => {
					expect(result).toEqual({
						error: 'Please provide a name.'
					});
				});
			});

			describe('when the date of birth is in the wrong format', () => {
				let result;

				beforeEach(() => {
					result = replace(
						storedId(),
						createBirthday('Hercules', 'unknown')
					);
				});

				it('does not update the birthday', () => {
					expect(getAll()[0].dob).toEqual(
						'1991-05-06'
					);
				});

				it('returns an error', () => {
					expect(result).toEqual({
						error:
							'Please provide a date of birth in the YYYY-MM-DD format.'
					});
				});
			});

			it('requires an id of a birthday that exists in the store', () => {
				expect(
					replace(
						'234',
						createBirthday('Hercules', '2009-01-02')
					)
				).toEqual({
					error: 'An unknown ID was provided.'
				});
			});
		});
	});
});
