/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	webServer: {
		command: 'npm run build && npm run preview',
		env: {
			...process.env,
			VITE_ALLOW_CREDENTIALS: true
		},
		port: 4173
	},
	testDir: 'tests'
};

export default config;
