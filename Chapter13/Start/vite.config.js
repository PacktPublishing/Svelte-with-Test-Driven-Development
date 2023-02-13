import { sveltekit } from '@sveltejs/kit/vite';

const config = {
	plugins: [sveltekit()],
	test: {
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: [
			'./test/cleanupDom.js',
			'./test/registerMatchers.js',
			'./test/registerSvelteComponentDouble.js'
		],
		reporter: 'verbose',
		restoreMocks: true
	}
};

export default config;
