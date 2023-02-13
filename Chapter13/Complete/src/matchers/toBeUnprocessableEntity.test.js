import {
	describe,
	it,
	expect,
	beforeAll
} from 'vitest';
import { fail } from '@sveltejs/kit';
import { toBeUnprocessableEntity } from './toBeUnprocessableEntity.js';

describe('toBeUnprocessableEntity', () => {
	beforeAll(() => {
		expect.extend({ toBeUnprocessableEntity });
	});

	it('throws if the status is not 422', () => {
		const response = fail(500);
		expect(() =>
			expect(response).toBeUnprocessableEntity()
		).toThrowError();
	});

	it('does not throw if the status is 422', () => {
		const response = fail(422);
		expect(() =>
			expect(response).toBeUnprocessableEntity()
		).not.toThrowError();
	});

	it('returns a message that includes the actual error code', () => {
		const response = fail(500);
		expect(() =>
			expect(response).toBeUnprocessableEntity()
		).toThrowError(
			'Expected 422 status code but got 500'
		);
	});

	it('throws error if the provided object does not match', () => {
		const response = fail(422, { a: 'b' });
		expect(() =>
			expect(response).toBeUnprocessableEntity({
				c: 'd'
			})
		).toThrowError();
	});

	it('does not throw error if the provided object does match', () => {
		const response = fail(422, { a: 'b' });
		expect(() =>
			expect(response).toBeUnprocessableEntity({
				a: 'b'
			})
		).not.toThrowError();
	});

	it('does not throw error if the provide object is a partial match', () => {
		const response = fail(422, { a: 'b', c: 'd' });
		expect(() =>
			expect(response).toBeUnprocessableEntity({
				a: 'b'
			})
		).not.toThrowError();
	});

	it('returns a message if the provided object does not match', () => {
		const response = fail(422, { a: 'b' });
		expect(() =>
			expect(response).toBeUnprocessableEntity({
				c: 'd'
			})
		).toThrowError(/Response body was not equal/);
	});

	it('includes a diff if the provided object does not match', () => {
		const response = fail(422, { a: 'b' });
		expect(() =>
			expect(response).toBeUnprocessableEntity({
				c: 'd'
			})
		).toThrowError(/-   "c": "d"/);
		expect(() =>
			expect(response).toBeUnprocessableEntity({
				c: 'd'
			})
		).toThrowError(/\+   "a": "b"/);
	});

	describe('not', () => {
		it('returns a message if the status is 422 with the same body', () => {
			const response = fail(422, { a: 'b' });
			expect(() =>
				expect(response).not.toBeUnprocessableEntity({
					a: 'b'
				})
			).toThrowError(
				/Expected non-422 status code but got 422/
			);
		});

		it('includes with the received response body in the message', () => {
			const response = fail(422, { a: 'b' });
			expect(() =>
				expect(response).not.toBeUnprocessableEntity({
					a: 'b'
				})
			).toThrowError(/"a": "b"/);
		});

		it('returns a negated message for a non-422 status with no body', () => {
			const response = fail(422);
			expect(() =>
				expect(response).not.toBeUnprocessableEntity()
			).toThrowError(
				'Expected non-422 status code but got 422'
			);
		});
	});
});
