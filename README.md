# MSL Healthcare website

The MSL Healthcare recruitment website is built with Next.js App Router, React, TypeScript and Tailwind CSS. The production site runs on [Vercel](https://mslhealthcare.vercel.app/).

## Install and run

Use Node.js 20.9 or later and npm. Install the locked dependencies and start the development server.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No credentials or environment variables are needed for local development. The optional `SITE_URL` setting controls the canonical origin and sitemap links. It defaults to `https://www.mslhealthcare.co.uk`.

## Build and test

```sh
npm run lint
npm run build
npm run typecheck
npm run start
```

The browser suites use Playwright Core and a local Chrome installation. Set `CHROME_PATH` if Chrome is outside the default Windows install location. With the production preview running, use these PowerShell commands.

```powershell
$env:PREVIEW_URL = 'http://localhost:3000'
npm run test:site
npm run test:cookies
node qa/homepage.mjs
node qa/partners.mjs
```

## Content and deployment

- Page routes and shared components are in `app/`. Public assets are in `public/`, with sources and usage terms in [IMAGE-CREDITS.md](IMAGE-CREDITS.md).
- Candidate Compliance uses the three published company policy PDFs listed in `app/candidate-compliance/resources.ts`. Their handoff copies are in `docs/policies/`.
- The cookie preference record is first-party and versioned. Update the policy and increment the consent version when storage purposes change.
- Vercel installs the locked dependencies and runs `npm run build` using the Next.js preset. On the existing project, a push to the original connected repository's `main` branch triggers a production build. Once Vercel reports Ready, smoke-test the homepage, Candidate Compliance, Cookie Policy and enquiry routes. The client repository is a source handoff. Publishing to it does not repoint or redeploy the live site.
