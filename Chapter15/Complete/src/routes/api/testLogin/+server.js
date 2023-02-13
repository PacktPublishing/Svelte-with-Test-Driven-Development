import { text } from '@sveltejs/kit';

export const POST = async ({ request, fetch }) => {
	const response = await fetch(
		'/auth/callback/credentials',
		{ method: 'POST', body: 'username=api' }
	);

	return text('', {
		headers: {
			'Set-Cookie': response.headers.get('cookies')
		}
	});
};
