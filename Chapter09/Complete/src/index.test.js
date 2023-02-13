import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Hello from './Hello.svelte';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});

	it('renders hello into the document', () => {
		render(Hello, { name: 'world' });
		expect(document.body).toHaveTextContent(
			'Hello, world!'
		);
	});

	it('renders hello, svelte', () => {
		render(Hello, { name: 'Svelte' });
		expect(document.body).toHaveTextContent(
			'Hello, Svelte!'
		);
	});
});
