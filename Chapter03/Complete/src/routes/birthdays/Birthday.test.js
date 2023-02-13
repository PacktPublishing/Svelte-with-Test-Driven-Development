import { describe, it, expect } from 'vitest';
import {
	render,
	screen
} from '@testing-library/svelte';
import Birthday from './Birthday.svelte';

describe('Birthday', () => {
	const exampleBirthday = {
		name: 'Ares',
		dob: '1996-03-03'
	};

	it('displays the name of the person', () => {
		render(Birthday, {
			...exampleBirthday,
			name: 'Hercules'
		});
		expect(
			screen.queryByText('Hercules')
		).toBeVisible();
	});

	it('displays the name of another person', () => {
		render(Birthday, {
			...exampleBirthday,
			name: 'Athena'
		});
		expect(
			screen.queryByText('Athena')
		).toBeVisible();
	});

	it('displays the date of birth', () => {
		render(Birthday, {
			...exampleBirthday,
			dob: '1994-02-02'
		});
		expect(
			screen.queryByText('1994-02-02')
		).toBeVisible();
	});
});
