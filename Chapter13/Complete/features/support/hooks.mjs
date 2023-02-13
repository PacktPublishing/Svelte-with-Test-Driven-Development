import { Before, After } from '@cucumber/cucumber';

Before(async function () {
	await this.launchServer();
	await this.launchBrowser();
});

After(async function () {
	await this.killServer();
	this.closeBrowser();
});
