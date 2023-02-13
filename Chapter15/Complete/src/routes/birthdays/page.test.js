import {
	describe,
	it,
	expect,
	beforeEach
} from 'vitest';
import {
	render,
	screen
} from '@testing-library/svelte';
import { click } from '@testing-library/user-event';
import { createBirthday } from 'src/factories/birthday.js';
import { birthdays as birthdaysStore } from '../../stores/birthdays.js';
import Page from './+page.svelte';

describe('/birthdays', () => {
	const birthdays = [
		createBirthday('Hercules', '1994-02-02', {
			id: '123'
		}),
		createBirthday('Athena', '1989-01-01', {
			id: '234'
		})
	];

	it('displays all the birthdays passed to it', () => {
		render(Page, { data: { birthdays } });
		expect(
			screen.queryByText('Hercules', {
				selector: 'li *'
			})
		).toBeVisible();
		expect(
			screen.queryByText('Athena', {
				selector: 'li *'
			})
		).toBeVisible();
	});

	it('displays a heading for "Add a new birthday"', () => {
		render(Page, { data: { birthdays } });
		expect(
			screen.queryByRole('heading', {
				name: 'Add a new birthday'
			})
		).toBeVisible();
	});

	it('displays a form for adding new birthdays', () => {
		render(Page, { data: { birthdays } });
		expect(screen.getByRole('form')).toBeVisible();
	});

	it('passes any form information to the BirthdayForm', () => {
		render(Page, {
			data: { birthdays },
			form: { error: 'An error' }
		});
		expect(
			screen.queryByText('An error')
		).toBeVisible();
	});

	it('displays an Edit button for each birthday in the list', () => {
		render(Page, { data: { birthdays } });
		expect(
			screen.queryAllByRole('button', {
				name: 'Edit'
			})
		).toHaveLength(2);
	});

	it('saves the loaded birthdays into the birthdays store', () => {
		let storedBirthdays;
		birthdaysStore.subscribe(
			(value) => (storedBirthdays = value)
		);
		render(Page, { data: { birthdays } });
		expect(storedBirthdays).toEqual(birthdays);
	});

	it('updates the birthdays store when the component props change', async () => {
		let storedBirthdays;
		birthdaysStore.subscribe(
			(value) => (storedBirthdays = value)
		);
		const { component } = render(Page, {
			data: { birthdays }
		});
		await component.$set({ data: { birthdays: [] } });
		expect(storedBirthdays).toEqual([]);
	});

	describe('when editing an existing birthday', () => {
		beforeEach(() =>
			render(Page, { data: { birthdays } })
		);

		const firstEditButton = () =>
			screen.queryAllByRole('button', {
				name: 'Edit'
			})[0];

		it('hides the existing birthday information', async () => {
			await click(firstEditButton());
			expect(
				screen.queryByText('Hercules')
			).toBeNull();
		});

		it('hides the birthday form for adding new birthdays', async () => {
			await click(firstEditButton());
			expect(
				screen.queryByRole('heading', {
					name: 'Add a new birthday'
				})
			).toBeNull();
		});

		it('shows the birthday form for editing', async () => {
			await click(firstEditButton());
			expect(
				screen.getByLabelText('Name')
			).toHaveValue('Hercules');
		});

		it('hides all the Edit buttons', async () => {
			await click(firstEditButton());
			expect(
				screen.queryByRole('button', {
					name: 'Edit'
				})
			).toBeNull();
		});
	});

	it('opens the form in editing mode if a form id is passed in', () => {
		render(Page, {
			data: {
				birthdays: [
					createBirthday('Hercules', '1994-02-02', {
						id: '123'
					})
				]
			},
			form: {
				...createBirthday('Hercules', 'bad dob', {
					id: '123'
				}),
				error: 'An error'
			}
		});
		expect(
			screen.queryByRole('heading', {
				name: 'Add a new birthday'
			})
		).toBeNull();
	});
});
