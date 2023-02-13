import * as childProcess from 'child_process';
import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium, request } from '@playwright/test';
import config from '../../playwright.config.js';

class PlaywrightWorld {
	async launchServer() {
		console.log('launching server');
		this.serverProcess = childProcess.spawn(
			config.webServer.command,
			[],
			{ shell: true, detached: true }
		);
		this.serverProcess.stderr.on('data', (data) => {
			const trimmed = String(data).trim();
			if (trimmed !== '') {
				console.log(trimmed);
			}
		});
		this.baseUrl = await new Promise((resolve) => {
			this.serverProcess.stdout.on('data', (data) => {
				if (data.includes('Local:')) {
					resolve(`${data}`.split(': ')[1].trim());
				}
			});
		});
		console.log(`started at ${this.baseUrl}`);
	}

	killServer() {
		process.kill(-this.serverProcess.pid);
	}

	async launchBrowser() {
		this.browser = await chromium.launch();
		this.context = await this.browser.newContext({
			baseURL: this.baseUrl
		});
		this.request = await request.newContext({
			baseURL: `${this.baseUrl}api/`
		});
		this.page = await this.context.newPage();
	}

	async closeBrowser() {
		await this.browser.close();
	}

	async goto(url) {
		await this.page.goto(url);
	}
}

setWorldConstructor(PlaywrightWorld);
