import { expect, test } from '@playwright/test';

test('creating and reading a birthday', async ({
	request
}) => {
	const newBirthday = await request.post(
		'/api/birthdays',
		{
			data: {
				name: 'Nyx',
				dob: '1993-02-04'
			}
		}
	);
	expect(newBirthday.ok()).toBeTruthy();

	const birthdays = await request.get(
		'/api/birthdays'
	);
	expect(birthdays.ok()).toBeTruthy();
	expect(await birthdays.json()).toEqual({
		birthdays: expect.arrayContaining([
			{
				name: 'Nyx',
				dob: '1993-02-04',
				id: expect.anything()
			}
		])
	});
});

test('updating a birthday', async ({ request }) => {
	const newBirthday = await request.post(
		'/api/birthdays',
		{
			data: {
				name: 'Nyx',
				dob: '1993-02-04'
			}
		}
	);
	expect(newBirthday.ok()).toBeTruthy();

	const { id } = await newBirthday.json();

	const birthdays = await request.put(
		`/api/birthday/${id}`,
		{
			data: {
				name: 'Nyxx',
				dob: '1992-01-03'
			}
		}
	);
	expect(birthdays.ok()).toBeTruthy();

	const updatedBirthdays = await request.get(
		'/api/birthdays'
	);
	expect(await updatedBirthdays.json()).toEqual({
		birthdays: expect.arrayContaining([
			{
				name: 'Nyxx',
				dob: '1992-01-03',
				id
			}
		])
	});
});
