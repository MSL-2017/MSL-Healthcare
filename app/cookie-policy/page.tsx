import { pageMeta } from "../metadata";
import Link from "next/link";
import { CookieSettingsLink } from "../cookie-consent";
import { consentCookie, consentDays } from "../cookie-preferences";

const title = "Cookie policy";
const description = "How MSL Healthcare remembers your cookie choice and how to manage it.";
export const metadata = pageMeta(title, description, "/cookie-policy");

export default function CookiePage() {
  return (
    <>
      <section className="innerHero"><div className="wrap">
        <p className="overline">Website information</p>
        <h1>Cookie policy</h1>
        <p className="lead">This website uses a strictly necessary cookie to remember your choice. We currently use no optional cookies or similar tracking technologies.</p>
      </div></section>
      <section className="wrap section duo">
        <div><h2>Strictly necessary storage</h2>
          <dl className="cookieInventory">
            <dt>Cookie</dt><dd><code>{consentCookie}</code></dd>
            <dt>Provider</dt><dd>MSL Healthcare (first party)</dd>
            <dt>Purpose</dt><dd>Remembers your choice, when you made it and the version of the cookie notice it applies to. The cookie is set when you save a choice.</dd>
            <dt>Expiry</dt><dd>{consentDays} days from your most recent saved choice.</dd>
          </dl>
          <h2>Optional storage</h2>
          <p>We currently do not use analytics, marketing or other optional storage. Links to external sites take you to services with their own cookie policies.</p>
        </div>
        <div id="cookie-settings"><h2>Manage your cookie choice</h2>
          <p><CookieSettingsLink className="under" /> lets you review or change your choice at any time. Select Reject all to withdraw any permission for optional cookies.</p>
          <p>You can remove the preference cookie in your browser’s site-data settings. We’ll prompt you again when your choice expires or the purposes change.</p>
          <p><Link className="under" href="/privacy-policy">Read about enquiry privacy</Link></p>
          <Link className="under" href="/contact">Contact the team</Link>
        </div>
      </section>
    </>
  );
}
