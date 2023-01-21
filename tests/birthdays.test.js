import { expect, test } from '@playwright/test';
import { BirthdayListPage } from './BirthdayListPage.js';

test('lists all birthday', async ({ page }) => {
	const birthdayListPage = new BirthdayListPage(page);
	await birthdayListPage.goto();
	await expect(
		birthdayListPage.entryFor('Hercules')
	).toBeVisible();
	await expect(
		birthdayListPage.entryFor('Athena')
	).toBeVisible();
});

test('saves a new birthday', async ({ page }) => {
	const birthdayListPage = new BirthdayListPage(page);
	await birthdayListPage.goto();
	await birthdayListPage.saveNameAndDateOfBirth(
		'Persephone',
		'1985-01-01'
	);
	await expect(
		birthdayListPage.entryFor('Persephone')
	).toBeVisible();
});

test('does not save a birthday if there are validation errors', async ({
	page
}) => {
	const birthdayListPage = new BirthdayListPage(page);
	await birthdayListPage.goto();
	await birthdayListPage.saveNameAndDateOfBirth(
		'Demeter',
		'invalid'
	);
	await expect(
		birthdayListPage.entryFor('Demeter')
	).not.toBeVisible();
	await expect(
		page.getByText(
			'Please provide a date of birth in the YYYY-MM-DD format.'
		)
	).toBeVisible();
});

test('edits a birthday', async ({ page }) => {
	const birthdayListPage = new BirthdayListPage(page);
	await birthdayListPage.goto();
	await birthdayListPage.saveNameAndDateOfBirth(
		'Ares',
		'1985-01-01'
	);
	await birthdayListPage.beginEditingFor('Ares');
	await birthdayListPage.saveNameAndDateOfBirth(
		'Ares',
		'1995-01-01'
	);

	await expect(
		birthdayListPage.entryFor('Ares')
	).not.toContainText('1985-01-01');

	await expect(
		birthdayListPage.entryFor('Ares')
	).toContainText('1995-01-01');
});
