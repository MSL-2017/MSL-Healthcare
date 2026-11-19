# Migration checklist

This is the production handoff for the local rebuild. DNS changes and publication require a separate instruction from MSL.

## Before cutover

- [ ] Confirm the launch domain, hosting account, TLS, runtime and supported Node version with the technical owner. Build from the dependency lockfile.
- [ ] Archive the current website, downloadable forms, sitemap, inbound-link report and DNS records. Record a rollback owner and the previous deployment target.
- [ ] Complete the [client decisions](CLIENT-APPROVALS.md), including business details, legal wording, REC usage, document distribution and final image/copy sign-off.
- [ ] If an intake service is approved, test validation, spam controls, delivery failure, access restrictions and retention with synthetic data. Test CV handling separately before enabling uploads.
- [ ] If a vacancy feed is approved, test expiry, duplicate entries, contact ownership and application routing.
- [ ] Confirm that existing email service records will be preserved during the website migration.

## Legacy URL mapping for production

Verify case, query strings, host variants and trailing slashes. Configure and test permanent redirects once the hosting plan is approved.

| Published path | Rebuild path |
| --- | --- |
| `/` | `/` |
| `/Candidates` | `/for-candidates` |
| `/clients` | `/for-clients` |
| `/healthcare-jobs` | `/healthcare-jobs` |
| `/send-cv` | `/register` |
| `/compliance` | `/candidate-compliance` |
| `/work-for-msl` | `/work-for-msl` |
| `/about-us` | `/about` |
| `/contact` | `/contact` |

## Release candidate

- [ ] Run lint, type checks, the production build and route tests on the final release. Review every page at desktop, tablet and mobile widths.
- [ ] Repeat keyboard, reduced-motion, heading, image and form validation checks. Verify every email and telephone action on a device with a configured handler.
- [ ] Check direct URL loads and in-app navigation, asset caching, the sitemap, robots directives, canonical host and social previews. Confirm the staging deployment’s indexing policy.
- [ ] Inventory actual cookies, storage, logs and third parties on the chosen host. Align consent controls and published notices with the final implementation.
- [ ] Verify old brochure and compliance download links independently of the page redirects.

## Authorised cutover and follow-up

- [ ] Publish only after the client approves the release candidate. Check TLS and host redirects before pointing public traffic to the new origin.
- [ ] Verify the home, candidate, client, contact and legal journeys from the public domain. Check the old URL mappings, PDF resources, response codes and delivery integrations.
- [ ] Submit the verified sitemap to the search consoles owned by MSL. Monitor 404s, form delivery and asset loading. Use the previous deployment and saved DNS values if rollback is required.
