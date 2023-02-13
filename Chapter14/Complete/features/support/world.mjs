import * as childProcess from 'child_process';
import { setWorldConstructor } from '@cucumber/cucumber';
import { chromium, request } from '@playwright/test';
import config from '../../playwright.config.js';
import * as os from 'os';
import kill from 'tree-kill-promise';

const removeAnsiColorCodes = (string) =>
	string.replace(/\x1b\[[0-9;]+m/g, '');

class PlaywrightWorld {
	async launchServer() {
		console.log('launching server');
		this.serverProcess = childProcess.spawn(
			config.webServer.command,
			[],
			{ shell: true, env: config.webServer.env }
		);
		this.serverProcess.stderr.on('data', (data) => {
			const trimmed = String(data).trim();
			if (trimmed !== '') {
				console.log(trimmed);
			}
		});

		this.baseUrl = await new Promise((resolve) => {
			this.serverProcess.stdout.on('data', (data) => {
				let plain = removeAnsiColorCodes(
					String(data)
				);
				let match = plain.match(
					/http[s]?:\/\/[a-z]+:[0-9]+\//
				);
				if (match) {
					resolve(match[0]);
				}
			});
		});

		console.log(`started at ${this.baseUrl}`);
	}

	async killServer() {
		await kill(this.serverProcess.pid);
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
