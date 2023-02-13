export class BirthdayListPage {
	constructor(page) {
		this.page = page;
	}

	async goto() {
		await this.page.goto('/birthdays');
	}

	saveNameAndDateOfBirth = async (name, dob) => {
		await this.nameField().fill(name);
		await this.dateOfBirthField().fill(dob);
		await this.saveButton().click();
	};

	entryFor = (name) =>
		this.page
			.getByRole('listitem')
			.filter({ hasText: name });

	beginEditingFor = (name) =>
		this.entryFor(name)
			.getByRole('button', { name: 'Edit' })
			.click();

	dateOfBirthField = () =>
		this.page.getByLabel('Date of birth');

	nameField = () => this.page.getByLabel('Name');

	saveButton = () =>
		this.page.getByRole('button', { name: 'Save' });
}
