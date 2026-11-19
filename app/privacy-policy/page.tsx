import { pageMeta } from "../metadata";
import Link from "next/link";

const title = "Privacy policy";
const description = "How enquiries work on this website preview and where to ask MSL Healthcare about your personal information.";
export const metadata = pageMeta(title, description, "/privacy-policy");

export default function PrivacyPage() {
  return (
    <>
      <section className="innerHero"><div className="wrap">
        <p className="overline">Website information</p>
        <h1>Privacy policy</h1>
        <p className="lead">MSL Healthcare’s full privacy notice for this rebuilt website is awaiting approval.</p>
      </div></section>
      <section className="wrap section duo">
        <div><h2>Your enquiry</h2>
          <p>The forms help you prepare an email to the recruitment team. Review the details in your email application before sending. You decide when the message leaves your email account.</p>
          <p>For an initial enquiry, include only the details needed for a consultant to respond. Ask the team how to provide any identity, health or compliance documents securely.</p>
        </div>
        <div><h2>Questions about your information</h2>
          <p>Contact MSL Healthcare Limited on <a className="under" href="tel:03337332020">0333 733 2020</a> or email <a className="under" href="mailto:info@mslhealthcare.co.uk">info@mslhealthcare.co.uk</a> to ask about the handling of your information.</p>
          <Link className="under" href="/cookie-policy">Read about cookies</Link>
        </div>
      </section>
    </>
  );
}
