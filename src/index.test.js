import { describe, it, expect } from 'vitest';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});

	it('renders hello into the document', () => {
		document.body.innerHTML =
			'<h1>Hello, world!</h1>';
		expect(document.body).toHaveTextContent(
			'Hello, world!'
		);
	});
});
