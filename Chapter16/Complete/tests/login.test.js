import { expect, test } from '@playwright/test';

test('logs in and returns to the application', async ({
	page
}) => {
	await page.goto('/birthdays');

	await page.waitForLoadState('networkidle');

	await page
		.getByRole('button', { name: /credentials/i })
		.click();

	await page.getByRole('textbox').fill('api');

	await page
		.getByRole('button', { name: /credentials/i })
		.click();

	await expect(
		page.getByText('Birthday list')
	).toBeVisible();
});

test('does not log in if log in fails', async ({
	page
}) => {
	await page.goto('/birthdays');

	await expect(
		page.getByText('Please login')
	).toBeVisible();

	await page.waitForLoadState('networkidle');

	await page
		.getByRole('button', { name: /credentials/i })
		.click();

	await page
		.getByRole('textbox')
		.fill('unknown user');

	await page
		.getByRole('button', { name: /credentials/i })
		.click();

	await expect(
		page.getByText(
			'Sign in failed. Check the details you provided are correct.'
		)
	).toBeVisible();
});
