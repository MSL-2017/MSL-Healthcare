import Link from "next/link";
import Image from "next/image";
import { CandidateContact, journeyMetadata } from "./journey";
import s from "./journey.module.css";

export const metadata = journeyMetadata("For healthcare professionals", "Explore flexible nursing work, weekly payroll, clinical support and registration with MSL Healthcare.", "/for-candidates");

export default function Candidates() {
  return <>
    <section className={s.hero}><div className="wrap duo">
      <div><p className="overline">For candidates</p><h1>Nursing work on your terms.</h1>
        <p className="lead">From an occasional shift close to home to a block booking further afield, tell us where and when you want to work.</p>
        <div className={s.links}><Link className="btn" href="/register">Register with MSL</Link><Link className="under" href="/healthcare-jobs">Explore healthcare jobs</Link></div>
      </div>
      <figure><Image src="/nurse.jpg" alt="Healthcare professional in a white coat with a blue stethoscope" width={1600} height={1186} sizes="(max-width: 750px) 89vw, 42vw" /></figure>
    </div></section>
    <section className="wrap section"><div className={s.columns}><div><p className="overline">Candidate benefits</p><h2>Support throughout your assignments</h2></div>
      <div className={s.rows}>
        <article><h3>A choice of shifts</h3><p>Discuss ad hoc shifts, longer lines of work and block bookings with NHS trusts and private healthcare providers across the UK.</p></article>
        <article><h3>Weekly payroll</h3><p>Your consultant can discuss rates for your specialty and explain how weekly pay works.</p></article>
        <article><h3>Clinical guidance</h3><p>Our Clinical Lead Nurse can advise on training needs, appraisals and preparation for revalidation.</p></article>
        <article><h3>Recommend a friend</h3><p>Earn £50 after your referral completes their first shift and a further £200 once they have worked 100 hours. <Link className="under" href="/recommend-a-friend">See the referral scheme</Link> before making a recommendation.</p></article>
      </div></div></section>
    <section className="agency"><div className="wrap duo"><div><p className="overline">Getting started</p><h2>From registration to your next shift</h2><p>We recruit registered healthcare professionals across disciplines including intensive care, A&amp;E and general nursing.</p><Link className="under" href="/healthcare-specialisms">View healthcare specialisms</Link></div>
      <ol className="steps list-decimal pl-6"><li><h3>Introduce yourself</h3><p><Link className="under" href="/register">Register your interest</Link> and tell us about your experience and availability.</p></li>
        <li><h3>Prepare your documents</h3><p>Use the <Link className="under" href="/candidate-compliance">candidate compliance checklist</Link> to gather the documents for your registration.</p></li>
        <li><h3>Discuss suitable shifts</h3><p>Your consultant can advise on opportunities that match your specialty and preferred location.</p></li></ol>
    </div></section>
    <CandidateContact title="Talk to a consultant">Our team is available around the clock to answer questions about agency work.</CandidateContact>
  </>;
}
