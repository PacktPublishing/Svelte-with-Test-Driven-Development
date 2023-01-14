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
});
