import { expect, test } from '@playwright/test';
import { BirthdayListPage } from './BirthdayListPage.js';

const addBirthday = async (
	request,
	{ name, dob }
) => {
	await request.post('/api/birthdays', {
		data: { name, dob }
	});
};

test('lists all birthday', async ({
	page,
	request
}) => {
	await addBirthday(request, {
		name: 'Hercules',
		dob: '1995-02-03'
	});
	await addBirthday(request, {
		name: 'Athena',
		dob: '1995-02-03'
	});
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

test('edits a birthday', async ({
	page,
	request
}) => {
	await addBirthday(request, {
		name: 'Ares',
		dob: '1985-01-01'
	});
	const birthdayListPage = new BirthdayListPage(page);
	await birthdayListPage.goto();
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
