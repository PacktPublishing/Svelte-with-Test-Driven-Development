import { expect, test } from '@playwright/test';
import { BirthdayListPage } from './BirthdayListPage.js';

test('lists all birthday', async ({ page }) => {
	await page.goto('/birthdays');
	await expect(
		page.getByText('Hercules')
	).toBeVisible();
	await expect(
		page.getByText('Athena')
	).toBeVisible();
});

test('saves a new birthday', async ({ page }) => {
	await page.goto('/birthdays');
	await page.getByLabel('Name').fill('Persephone');
	await page
		.getByLabel('Date of birth')
		.fill('1985-01-01');
	await page
		.getByRole('button', { name: 'Save' })
		.click();
	await expect(
		page.getByText('Persephone')
	).toBeVisible();
});

test('does not save a birthday if there are validation errors', async ({
	page
}) => {
	await page.goto('/birthdays');
	await page.getByLabel('Name').fill('Demeter');
	await page
		.getByLabel('Date of birth')
		.fill('invalid');
	await page
		.getByRole('button', { name: 'Save' })
		.click();
	await expect(
		page.getByText('Demeter')
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
