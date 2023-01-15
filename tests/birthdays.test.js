import { expect, test } from '@playwright/test';

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
	await page.goto('/birthdays');
	// add a birthday using the form
	await page.getByLabel('Name').fill('Ares');
	await page
		.getByLabel('Date of birth')
		.fill('1985-01-01');
	await page
		.getByRole('button', { name: 'Save' })
		.click();

	// find the Edit button for that person
	await page
		.getByRole('listitem')
		.filter({ hasText: 'Ares' })
		.getByRole('button', { name: 'Edit' })
		.click();

	// find the text box with label Date of Birthday
	// change the date of birth
	await page
		.getByLabel('Date of birth')
		.fill('1995-01-01');

	// click save
	await page
		.getByRole('button', { name: 'Save' })
		.click();

	// check that the original text doesn't appear
	await expect(
		page
			.getByRole('listitem')
			.filter({ hasText: 'Ares' })
	).not.toContainText('1985-01-01');

	// check that the new text does appear
	await expect(
		page
			.getByRole('listitem')
			.filter({ hasText: 'Ares' })
	).toContainText('1995-01-01');
});
