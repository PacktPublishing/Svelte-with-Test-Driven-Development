# birthdays

This is the sample project from the book _Svelte with Test-Driven Development_.

## Running tests

```bash
npm test               # To run the Playwright tests
npm run test:unit      # To run the Vitest tests
npx @cucumber/cucumber # Run the Cucumber tests
```

(Make sure you've run `npm install` first.)

## Building and running

To build a deployable version of this application, and preview it:

```bash
npm run build
npm run preview
```

Or you can simply run the dev version with `npm run dev`.

## Notes on later chapters

### Chapter 13 (Adding Cucumber tests)

If you find that some of the tests are timing out, you can add a call to `setDefaultTimeout` in the file `features/support/hooks.mjs`, increasing the timeout from 5s to 60s:

```js
import { setDefaultTimeout } from '@cucumber/cucumber';

setDefaultTimeout(60 * 1000);
```

### Chapter 14 (Testing authentication)

The sample code uses [Auth.js](https://authjs.dev). The SvelteKit support is experimental and likely to change, so you may need to lean on their documentation to figure out the cause of any issues.

If you want to run the code locally, you'll need to make a copy of `.env.example` and name it `.env`.

If you want to enable the GitHub OAuth authentication support, you'll need to [configure a GitHub OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) and then update the `GITHUB_ID` and `GITHUB_SECRET` values within your `.env` file.

## If you run into issues

Please feel free to create an issue against this repository, or email the author directly at [danielirvine.com](https://danielirvine.com).
