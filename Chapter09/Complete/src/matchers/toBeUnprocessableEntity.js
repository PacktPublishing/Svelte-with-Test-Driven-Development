import { expect } from 'vitest';
import { EOL } from 'os';

export function toBeUnprocessableEntity(
	received,
	expected = {}
) {
	if (received.status !== 422) {
		return {
			pass: false,
			message: () =>
				`Expected 422 status code but got ${received.status}`
		};
	}

	if (
		!this.equals(
			received.data,
			expect.objectContaining(expected)
		)
	) {
		return {
			pass: false,
			message: () =>
				`Response body was not equal:` +
				EOL +
				this.utils.diff(expected, received.data)
		};
	}

	if (!received.data) {
		return {
			pass: true,
			message: () =>
				'Expected non-422 status code but got 422'
		};
	}

	return {
		pass: true,
		message: () =>
			`Expected non-422 status code but got 422 with body:` +
			EOL +
			this.utils.stringify(received.data)
	};
}
