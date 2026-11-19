import { pageMeta } from "../metadata";
import Link from "next/link";

const title = "Cookie policy";
const description = "Cookie information for the MSL Healthcare preview, browser settings and enquiries about the final policy.";
export const metadata = pageMeta(title, description, "/cookie-policy");

export default function CookiePage() {
  return (
    <>
      <section className="innerHero"><div className="wrap">
        <p className="overline">Website information</p>
        <h1>Cookie policy</h1>
        <p className="lead">The final cookie notice for the hosted website is awaiting review and approval by MSL Healthcare.</p>
      </div></section>
      <section className="wrap section duo">
        <div><h2>Cookies in your browser</h2>
          <p>Cookies are small pieces of information a website can ask your browser to keep. You can inspect them in your browser’s privacy or site-data settings.</p>
          <p>Search those settings for the website address to see stored data, remove it or change which cookies your browser accepts.</p>
        </div>
        <div><h2>Website privacy</h2>
          <p>For questions about cookies or the way the recruitment team handles enquiries, contact MSL Healthcare directly.</p>
          <p><Link className="under" href="/privacy-policy">Read about enquiry privacy</Link></p>
          <Link className="under" href="/contact">Contact the team</Link>
        </div>
      </section>
    </>
  );
}
