import { describe, it, expect } from 'vitest';
import {
	render,
	screen
} from '@testing-library/svelte';
import { createBirthday } from 'src/factories/birthday.js';
import Birthday from './Birthday.svelte';

describe('Birthday', () => {
	it('displays the name of the person', () => {
		render(
			Birthday,
			createBirthday('Hercules', '1996-03-03')
		);
		expect(
			screen.queryByText('Hercules')
		).toBeVisible();
	});

	it('displays the name of another person', () => {
		render(
			Birthday,
			createBirthday('Athena', '1996-03-03')
		);
		expect(
			screen.queryByText('Athena')
		).toBeVisible();
	});

	it('displays the date of birth', () => {
		render(
			Birthday,
			createBirthday('Ares', '1994-02-02')
		);
		expect(
			screen.queryByText('1994-02-02')
		).toBeVisible();
	});
});
