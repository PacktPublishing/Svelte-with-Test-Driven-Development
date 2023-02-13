import {
	describe,
	it,
	expect,
	beforeEach,
	vi
} from 'vitest';
import { createFormDataRequest } from 'test/factories/formDataRequest.js';
import { createBirthday } from 'test/factories/birthday.js';
import {
	fetchResponseOk,
	fetchResponseError
} from 'test/factories/fetch.js';
import { load, actions } from './+page.server.js';

describe('/birthdays - load', () => {
	it('calls fetch with /api/birthdays', async () => {
		const fetch = vi.fn();
		fetch.mockResolvedValue(fetchResponseOk());
		const result = await load({ fetch });
		expect(fetch).toBeCalledWith('/api/birthdays');
	});

	it('returns the response body', async () => {
		const birthdays = [
			createBirthday('Hercules', '1994-02-02'),
			createBirthday('Athena', '1989-01-01')
		];
		const fetch = vi.fn();
		fetch.mockResolvedValue(
			fetchResponseOk({ birthdays })
		);
		const result = await load({ fetch });
		expect(result).toEqual({ birthdays });
	});
});

describe('/birthdays - default action', () => {
	let fetch = vi.fn();

	const performFormAction = (formData) =>
		actions.default({
			request: createFormDataRequest(formData),
			fetch
		});

	beforeEach(() => {
		fetch.mockResolvedValue(fetchResponseOk());
	});

	describe('when adding a new birthday', () => {
		it('requests data from POST /api/birthdays', async () => {
			await performFormAction(
				createBirthday('Zeus', '2009-02-02')
			);

			expect(fetch).toBeCalledWith(
				'/api/birthdays',
				expect.objectContaining({ method: 'POST' })
			);
		});

		it('sends the birthday as the request body', async () => {
			await performFormAction(
				createBirthday('Zeus', '2009-02-02')
			);

			expect(fetch).toBeCalledWith(
				expect.anything(),
				expect.objectContaining({
					body: JSON.stringify({
						name: 'Zeus',
						dob: '2009-02-02'
					})
				})
			);
		});

		it('returns a 422 if the POST request returns an error', async () => {
			fetch.mockResolvedValue(
				fetchResponseError('error message')
			);
			const result = await performFormAction(
				createBirthday('Zeus', '2009-02-02')
			);
			expect(result).toBeUnprocessableEntity({
				error: 'error message',
				name: 'Zeus',
				dob: '2009-02-02'
			});
		});
	});

	describe('when replacing an existing birthday', () => {
		it('requests data from PUT /api/birthday/{id}', async () => {
			await performFormAction(
				createBirthday('Zeus', '2009-02-02', {
					id: '123'
				})
			);

			expect(fetch).toBeCalledWith(
				'/api/birthday/123',
				expect.objectContaining({ method: 'PUT' })
			);
		});

		it('sends the birthday as the request body', async () => {
			await performFormAction(
				createBirthday('Zeus', '2009-02-02', {
					id: '123'
				})
			);

			expect(fetch).toBeCalledWith(
				expect.anything(),
				expect.objectContaining({
					body: JSON.stringify({
						name: 'Zeus',
						dob: '2009-02-02'
					})
				})
			);
		});

		it('returns a 422 if the POST request returns an error', async () => {
			fetch.mockResolvedValue(
				fetchResponseError('error message')
			);
			const result = await performFormAction(
				createBirthday('Zeus', '2009-02-02', {
					id: '123'
				})
			);
			expect(result).toBeUnprocessableEntity({
				error: 'error message',
				name: 'Zeus',
				dob: '2009-02-02',
				id: '123'
			});
		});
	});
});
