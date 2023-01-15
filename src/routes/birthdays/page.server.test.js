import { describe, it, expect } from 'vitest';
import { createFormDataRequest } from 'src/factories/formDataRequest.js';
import { load, actions } from './+page.server.js';

describe('/birthdays - load', () => {
	it('returns a fixture of two items', () => {
		const result = load();
		expect(result.birthdays).toEqual([
			{ name: 'Hercules', dob: '1994-02-02' },
			{ name: 'Athena', dob: '1989-01-01' }
		]);
	});
});

describe('/birthdays - default action', () => {
	it.skip('adds a new birthday into the list', async () => {
		const request = createFormDataRequest({
			name: 'Zeus',
			dob: '2009-02-02'
		});

		await actions.default({ request });

		expect(load().birthdays).toContainEqual(
			expect.objectContaining({
				name: 'Zeus',
				dob: '2009-02-02'
			})
		);
	});
});
