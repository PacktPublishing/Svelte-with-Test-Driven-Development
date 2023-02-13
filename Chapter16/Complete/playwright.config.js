/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		env: {
			PATH: process.env.PATH,
			VITE_ALLOW_CREDENTIALS: true
		},
		port: 4173
	},
	testDir: 'tests'
};

export default config;
