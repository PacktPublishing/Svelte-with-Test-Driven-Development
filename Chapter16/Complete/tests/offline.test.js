import { expect, test } from '@playwright/test';

const login = async ({ context, baseURL }) => {
	// goto a page to ensure the origin will match
	// use context.request to ensure that cookies are shared
	const response = await context.request.get(
		'/auth/csrf'
	);
	const { csrfToken } = await response.json();
	const response2 = await context.request.post(
		'/auth/callback/credentials',
		{
			form: {
				username: 'api',
				csrfToken
			},
			headers: {
				origin: baseURL
			}
		}
	);
};

test.beforeEach(login);

const waitForServiceWorkerActivation = (page) =>
	page.evaluate(async () => {
		const registration =
			await window.navigator.serviceWorker.getRegistration();
		if (registration.active?.state === 'activated')
			return;
		await new Promise((res) =>
			window.navigator.serviceWorker.addEventListener(
				'controllerchange',
				res
			)
		);
	});

const disableNetwork = (context) =>
	context.route('**', (route) => route.abort());

test('site is available offline', async ({
	page,
	context,
	browser
}) => {
	await page.goto('/birthdays');

	await waitForServiceWorkerActivation(page);
	await disableNetwork(context);

	await page.goto('/birthdays');

	await expect(
		page.getByText('Birthday list')
	).toBeVisible();
});
