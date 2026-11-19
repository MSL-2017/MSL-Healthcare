import Link from "next/link";
import EnquiryForm from "../enquiry-form";
import { pageMeta } from "../metadata";

export const metadata = pageMeta("Recommend a friend", "Ask MSL Healthcare about its published candidate referral scheme.", "/recommend-a-friend");

export default function ReferralPage() {
  return <>
    <section className="innerHero">
      <div className="wrap">
        <p className="overline">Candidate referrals</p>
        <h1>Recommend a friend</h1>
        <p className="lead">Know a healthcare professional looking for agency work? Ask our team about the referral scheme and current eligibility before making an introduction.</p>
        <div className="actions"><a className="btn" href="#referral-enquiry">Ask about a referral</a><Link className="under" href="/for-candidates">Candidate services</Link></div>
      </div>
    </section>
    <section className="wrap section duo">
      <div><p className="overline">Published scheme</p><h2>How the referral reward works</h2><p>The existing MSL candidate page lists the following rewards, subject to terms. Check the current terms with a consultant.</p></div>
      <ol className="steps"><li><h3>£50 after the first shift</h3><p>The first payment follows your referral’s first completed shift.</p></li><li><h3>A further £200 after 100 hours</h3><p>The second payment follows 100 hours worked.</p></li></ol>
    </section>
    <section id="referral-enquiry" className="enquiryShell">
      <div className="wrap enquiryLayout">
        <div><p className="overline">Contact the recruitment team</p><h2>Start a referral enquiry</h2><p>Ask the team to confirm the current rules and the next step for making an introduction.</p></div>
        <EnquiryForm kind="referral"/>
      </div>
    </section>
    <section className="wrap finalCTA">
      <h2>Share the registration page</h2>
      <p>Let your colleague contact MSL directly and mention the referral. Speak to a consultant before sharing anyone else’s details.</p>
      <div className="actions"><Link className="btn" href="/register">Candidate registration</Link><a className="btn outline" href="tel:03337332020">Call the team</a></div>
    </section>
  </>;
}
