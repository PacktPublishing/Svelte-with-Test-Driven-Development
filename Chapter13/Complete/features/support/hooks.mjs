import { Before, After } from '@cucumber/cucumber';

Before(async function () {
	await this.launchServer();
	await this.launchBrowser();
});

After(function () {
	this.killServer();
	this.closeBrowser();
});
