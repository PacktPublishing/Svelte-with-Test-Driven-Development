/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command:
			'VITE_ALLOW_CREDENTIALS=true npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests'
};

export default config;
