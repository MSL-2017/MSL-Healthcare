import Link from "next/link";
import { CandidateContact, journeyMetadata } from "../for-candidates/journey";
import s from "../for-candidates/journey.module.css";

export const metadata = journeyMetadata("Work for MSL", "Enquire about a career in healthcare recruitment with the MSL Healthcare agency team.", "/work-for-msl");

export default function AgencyCareers() {
  return <>
    <section className={s.dark}><div className="wrap"><p className="overline">Agency careers</p><h1>Work in healthcare recruitment.</h1>
      <p className="lead">MSL welcomes enquiries from people with the passion and determination to build a career in recruitment.</p>
      <a className="under" href="mailto:info@mslhealthcare.co.uk?subject=Agency%20careers%20enquiry">Email our team about agency careers</a>
    </div></section>
    <section className="wrap section"><div className={s.columns}><div><p className="overline">Working with MSL</p><h2>Behind every placement</h2></div><div>
      <p>Our consultants bring healthcare professionals and employers together across the UK. They work with NHS hospitals, private hospitals and care homes, taking time to understand the people on both sides of a booking.</p>
      <p>If this sounds like the team you want to join, tell us about your experience and the kind of recruitment role you are looking for.</p>
      <div className={s.links}><Link className="btn" href="/contact">Contact MSL</Link><Link className="under" href="/about">About the agency</Link></div>
      <article className="mt-9 border-t border-slate-300 pt-4"><h3>Looking for clinical work?</h3><p>For nursing shifts and clinical placements, visit <Link className="under" href="/healthcare-jobs">healthcare jobs</Link>.</p></article>
    </div></div></section>
    <CandidateContact title="Discuss your career">Call us about joining the MSL recruitment team.</CandidateContact>
  </>;
}
