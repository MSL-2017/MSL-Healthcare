# MSL Healthcare V2 website gap analysis

Reviewed 19 November 2026. The [original site](https://www.mslhealthcare.co.uk/) and [Vercel baseline](https://mslhealthcare.vercel.app/) were compared using their public sitemaps, published page content and page links. All 15 baseline routes and all eight original primary routes returned HTTP 200. The original Quick Apply and candidate referral routes also returned 200. The original sitemap additionally lists 12 shop and product paths that returned 404.

| Original page | Current route | Missing content | Missing functionality | Proposed improvement | Priority |
| --- | --- | --- | --- | --- | --- |
| [Homepage](https://www.mslhealthcare.co.uk/) | / | Dedicated clinical jobs and internal careers features, more context for the staffing offer | Homepage enquiry used a hosted form | Restore the conversion sections and coverage details. Keep registration, staffing and contact on local routes. | High |
| [Candidates](https://www.mslhealthcare.co.uk/Candidates) | /for-candidates | Baseline retains shift types, weekly payroll, clinical guidance and published referral rewards | Referral CTA led to general contact | Match the original referral destination with a local referral page and direct enquiry. | High |
| [Recommend a friend](https://www.mslhealthcare.co.uk/recommend-a-friend) | /recommend-a-friend | Entire linked journey absent | Original referral submission is unavailable through the rebuild | Add scheme information and an enquiry that lets the candidate contact MSL securely. Confirm referral terms and delivery. | High |
| [Clients](https://www.mslhealthcare.co.uk/clients) | /for-clients, /staffing-solutions, /healthcare-specialisms, /request-staff | Baseline retains all original disciplines, regional coverage and short- and long-term cover. Framework claims, historical savings and experience figures require substantiation. | The original hosted contact flow has no approved replacement endpoint | Keep employer enquiry and phone routes. Confirm precise framework coverage and any performance claims. | High |
| [Healthcare jobs](https://www.mslhealthcare.co.uk/healthcare-jobs) | /healthcare-jobs | Both sites are enquiry-led. No verified vacancy feed or individual job records found. | No live listings integration | Keep specialty selection, registration handoff and direct consultant contact. Add a dedicated homepage jobs entry. | High |
| [Quick Apply](https://www.mslhealthcare.co.uk/send-cv) | /register | Original page exposes a CV upload | No approved CV storage, submission endpoint or server-side spam controls in the rebuild | Keep the validated draft and phone fallback. Add secure intake only once MSL approves a submission channel. | High |
| [Compliance](https://www.mslhealthcare.co.uk/compliance) | /candidate-compliance | Baseline had a flat list and an inline note for indemnity | Source indemnity link resolves to a file named Qualification Disclaimer. The correct document remains unconfirmed. | Categorise all 11 entries, preserve ten published PDF links, and provide a specific request action for the indemnity form. | High |
| [Work for MSL](https://www.mslhealthcare.co.uk/work-for-msl) | /work-for-msl | Careers page existed but lacked a dedicated homepage entry | No verified internal recruitment listings or approved application endpoint | Add a separate entry from the homepage, retain career-specific email and phone contact. | Medium |
| [About](https://www.mslhealthcare.co.uk/about-us) | /about | Published legacy claims differ on years of experience and mention unnamed awards | None | Preserve the agency's approach and sectors. Obtain evidence before publishing figures or awards. | Medium |
| [Contact](https://www.mslhealthcare.co.uk/contact) | /contact | Contact details, availability and address carried through | Original hosted submissions, responses and validation have no approved replacement service | Validate required details, reject whitespace-only messages and show accurate draft and copy feedback. | High |
| Footer, REC and [provider terms](https://business.yell.com/legal/trading-terms/) | Global footer, /privacy-policy, /cookie-policy, /terms-of-use | Original footer also lists social profiles, opening hours and Yell trading terms. Local notices describe preview behaviour pending approval. | No client-approved replacement terms for the final host | Restore 24/7 availability and published social destinations. Retain the original logo and static REC strip. Confirm current legal wording, accreditation usage and social ownership. | High |
| Legacy shop sitemap entries | No MSL recruitment route | 12 source entries returned 404 and were not linked from recruitment navigation | Store purpose and ownership unconfirmed | Keep out of the new sitemap and ask Joel if any were intended to be active. | Low |

## Document audit

The 11 source compliance URLs returned HTTP 206 to byte-range requests and each response began with a PDF signature. The rebuild links ten PDFs from the original public CDN. The source’s professional indemnity entry uses a filename beginning with Qualification Disclaimer. A reachable PDF alone does not establish that it is the current, correct form. The library sends users to the compliance team for that entry. Joel should also confirm the current version of the application file labelled November 2018 and approval to retain or migrate the PDFs.

## Enquiry handling

Registration, staffing and contact validate the required inputs and consent. They prepare an email draft in the browser for the user to review and send through their mail client. Copy feedback distinguishes a successful clipboard write from manual copying. The site does not receive submitted records or accept CVs. The referral form preserves the original name, email, phone and message fields and prepares a draft using the contact details the visitor provides. Confirm an approved intake service, CV protection and retention, spam controls, delivery ownership and success/failure responses before enabling server-side submission.

## Joel’s confirmation

- Current referral rules and the approved process for introductions.
- Correct professional indemnity form and current downloadable document versions.
- Approved CV, staffing, contact and referral intake services, if web submissions are required.
- Current REC permissions, NHS framework details, social profile ownership and any claims to publish.
- Legal notices and production canonical hostname at cutover. See [outstanding approvals](CLIENT-APPROVALS.md).
