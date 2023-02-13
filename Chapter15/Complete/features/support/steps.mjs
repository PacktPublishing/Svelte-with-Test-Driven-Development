import {
	Given,
	When,
	Then
} from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { BirthdayListPage } from '../../tests/BirthdayListPage.js';

// set up a world
//
//const response = await this.server?.get('facts');
//expect(response).toBeDefined();

Given(
	'An existing birthday for {string} on {string}',
	async function (name, dob) {
		await this.request.post('birthdays', {
			data: { name, dob },
			failOnStatusCode: true
		});
	}
);

When(
	'I navigate to the {string} page',
	async function (url) {
		await this.page.goto(url);
	}
);

When('I log in', async function () {
	await this.page
		.getByRole('button', { name: /credentials/i })
		.click();
	await this.page.getByRole('textbox').fill('api');

	await this.page
		.getByRole('button', { name: /credentials/i })
		.click();
});

When(
	'I edit the birthday for {string} to be {string}',
	async function (name, dob) {
		const birthdayListPage = new BirthdayListPage(
			this.page
		);
		await birthdayListPage.beginEditingFor(name);
		await birthdayListPage
			.dateOfBirthField()
			.fill(dob);
		await birthdayListPage.saveButton().click();
	}
);

Then(
	'the birthday for {string} should show {string}',
	async function (name, dob) {
		const birthdayListPage = new BirthdayListPage(
			this.page
		);
		await expect(
			birthdayListPage.entryFor(name)
		).toContainText(dob);
	}
);

Then(
	'the text {string} should not appear on the page',
	async function (text) {
		await expect(
			this.page.getByText(text)
		).not.toBeVisible();
	}
);
