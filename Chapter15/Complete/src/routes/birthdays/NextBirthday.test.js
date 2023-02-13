import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi
} from 'vitest';
import NextBirthday from './NextBirthday.svelte';
import { render } from '@testing-library/svelte';
import { birthdays as birthdaysStore } from '../../stores/birthdays.js';
import { createBirthday } from 'src/factories/birthday.js';

const julyOfYear = (year) => {
	const date = new Date();
	date.setFullYear(year, 6, 1);
	return date;
};

describe('NextBirthday', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(julyOfYear(2056));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('displays a single birthday', () => {
		birthdaysStore.set([
			createBirthday('Hercules', '2023-09-01')
		]);
		render(NextBirthday);
		expect(document.body).toHaveTextContent(
			'Hercules has the next birthday, on 2056-09-01'
		);
	});

	it('displays the earliest of two upcoming birthdays in the same year', () => {
		birthdaysStore.set([
			createBirthday('Hercules', '2023-09-01'),
			createBirthday('Ares', '2023-08-01')
		]);
		render(NextBirthday);
		expect(document.body).toHaveTextContent(
			'Ares has the next birthday, on 2056-08-01'
		);
	});

	it('displays the later birthday if the earlier birthday has already happened this year', () => {
		birthdaysStore.set([
			createBirthday('Hercules', '2023-09-01'),
			createBirthday('Ares', '2023-03-01')
		]);
		render(NextBirthday);
		expect(document.body).toHaveTextContent(
			'Hercules has the next birthday, on 2056-09-01'
		);
	});

	it('updates the displayed data when the store is updated', async () => {
		birthdaysStore.set([
			createBirthday('Hercules', '2023-09-01')
		]);
		render(NextBirthday);
		await birthdaysStore.set([
			createBirthday('Hercules', '2023-09-01'),
			createBirthday('Ares', '2023-08-01')
		]);
		expect(document.body).toHaveTextContent(
			'Ares has the next birthday, on 2056-08-01'
		);
	});
});
