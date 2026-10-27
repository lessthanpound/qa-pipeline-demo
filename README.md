# qa-pipeline-demo

Playwright UI tests for [saucedemo.com](https://www.saucedemo.com) and API tests for
[restful-booker](https://restful-booker.herokuapp.com), run in GitHub Actions.

## Layout (page object model)

```
pages/            UI page objects: locators + actions (login, addToCart, sortBy, ...)
  fixtures.ts     makes page objects available to tests: async ({ loginPage }) => ...
api/              API object: one method per endpoint (createBooking, getToken, ...)
  fixtures.ts     makes bookingApi / token / bookingId available to tests
tests/ui/*.spec.ts   UI specs: call page object methods, then assert
tests/api/*.spec.ts  API specs: call BookingApi methods, then assert
```

Page objects say *how* to do something. Specs say *what* should happen. If a selector
changes, you update one page object instead of every spec.

## Running locally

Requires Node.js 18+ (`node -v` to check). Install it from https://nodejs.org or with `brew install node`.

```bash
npm install                        # install dependencies (creates package-lock.json)
npx playwright install chromium    # download the browser for UI tests (one time)

npm test                           # run everything
npm run test:ui                    # UI tests only
npm run test:api                   # API tests only
npm run test:smoke                 # only tests tagged @smoke (critical paths)
npx playwright test tests/ui/login.spec.ts   # a single file
npx playwright test --headed       # watch the browser
npx playwright test --ui           # interactive test runner
npm run report                     # open the HTML report from the last run
```

## Running in GitHub Actions

The workflow in `.github/workflows/tests.yml` runs on every push to `main`, on every
pull request, and on demand from the Actions tab:

1. **Smoke**: runs the `@smoke`-tagged tests (login, product list, checkout, API ping,
   auth, create booking). If any fail, the pipeline stops here.
2. **Regression**: runs the full UI and API suites as two parallel jobs.

Each job uploads its HTML report as an artifact, which you can download from the
run's summary page.

To mark a test as smoke, add the tag: `test('name', { tag: '@smoke' }, async (...) => { ... })`.

To set it up:

```bash
git init
git add .
git commit -m "Add Playwright tests and CI"
git branch -M main
git remote add origin https://github.com/<you>/qa-pipeline-demo.git   # create an empty repo on GitHub first
git push -u origin main
```

Then open the repo's **Actions** tab to watch the run.
