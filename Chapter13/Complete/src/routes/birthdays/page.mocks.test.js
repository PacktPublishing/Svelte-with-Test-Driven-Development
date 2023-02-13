import {
	describe,
	it,
	expect,
	beforeEach,
	vi
} from 'vitest';
import {
	render,
	screen
} from '@testing-library/svelte';
import { click } from '@testing-library/user-event';
import { createBirthday } from 'test/factories/birthday.js';
import Birthday from './Birthday.svelte';
import BirthdayForm from './BirthdayForm.svelte';
import Page from './+page.svelte';

vi.mock('./Birthday.svelte', async () => ({
	default: componentDouble('Birthday')
}));
vi.mock('./BirthdayForm.svelte', async () => ({
	default: componentDouble('BirthdayForm')
}));

describe('/birthdays', () => {
	beforeEach(Birthday.reset);
	beforeEach(BirthdayForm.reset);

	const birthdays = [
		createBirthday('Hercules', '1994-02-02', {
			id: '123'
		}),
		createBirthday('Athena', '1989-01-01', {
			id: '234'
		})
	];

	it('displays a Birthday component for each birthday', () => {
		render(Page, { data: { birthdays } });
		expect(Birthday).toBeRenderedWithProps({
			name: 'Hercules',
			dob: '1994-02-02'
		});
		expect(Birthday).toBeRenderedWithProps({
			name: 'Athena',
			dob: '1989-01-01'
		});
	});

	it('displays the Birthdays in the same order as the props passed in', () => {
		render(Page, { data: { birthdays } });
		expect(Birthday.propsOfAllInstances()).toEqual([
			expect.objectContaining({ name: 'Hercules' }),
			expect.objectContaining({ name: 'Athena' })
		]);
	});

	const firstEditButton = () =>
		screen.queryAllByRole('button', {
			name: 'Edit'
		})[0];

	it('passes the currently edited birthday to the BirthdayForm component', async () => {
		render(Page, { data: { birthdays } });
		await click(firstEditButton());

		expect(BirthdayForm).toBeRenderedWithProps({
			form: birthdays[0]
		});
	});

	it('cancels editing', async () => {
		render(Page, { data: { birthdays } });
		await click(firstEditButton());

		await BirthdayForm.lastInstance().dispatch(
			'cancel'
		);

		expect(BirthdayForm).not.toBeRenderedWithProps({
			form: birthdays[0]
		});
	});
});
