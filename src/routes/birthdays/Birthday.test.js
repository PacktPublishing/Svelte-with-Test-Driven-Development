import { describe, it, expect } from 'vitest';
import {
	render,
	screen
} from '@testing-library/svelte';
import Birthday from './Birthday.svelte';

describe('Birthday', () => {
	it('displays the name of the person', () => {
		render(Birthday, { name: 'Hercules' });
		expect(
			screen.queryByText('Hercules')
		).toBeVisible();
	});

	it('displays the date of birth', () => {
		render(Birthday, { dob: '1994-02-02' });
		expect(
			screen.queryByText('1994-02-02')
		).toBeVisible();
	});
});
