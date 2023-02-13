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
import Page from './+page.svelte';

describe('/birthdays', () => {
	const birthdays = [
		{
			id: '123',
			name: 'Hercules',
			dob: '1994-02-02'
		},
		{
			id: '234',
			name: 'Athena',
			dob: '1989-01-01'
		}
	];

	it('displays all the birthdays passed to it', () => {
		render(Page, { data: { birthdays } });
		expect(
			screen.queryByText('Hercules')
		).toBeVisible();
		expect(
			screen.queryByText('Athena')
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
					{
						id: '123',
						name: 'Hercules',
						dob: '1994-02-02'
					}
				]
			},
			form: {
				id: '123',
				name: 'Hercules',
				dob: 'bad dob',
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
