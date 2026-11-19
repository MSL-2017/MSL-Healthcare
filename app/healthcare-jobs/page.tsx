import Link from "next/link";
import { CandidateContact, journeyMetadata } from "../for-candidates/journey";
import s from "../for-candidates/journey.module.css";

export const metadata = journeyMetadata("Healthcare jobs", "Enquire about UK nursing opportunities in the NHS and private sector, from ad hoc shifts to longer bookings.", "/healthcare-jobs");

export default function HealthcareJobs() {
  return <>
    <section className={s.jobs}><div className="wrap duo">
      <div><p className="overline">Healthcare jobs</p><h1>Find your next nursing shift.</h1><p className="lead">Tell us your specialty. Our consultants can talk through current opportunities across the UK, including shifts in your region.</p></div>
      <form action="/register" method="get"><h2>Start a job enquiry</h2><label htmlFor="specialty">Your nursing specialty</label>
        <select name="specialty" id="specialty" defaultValue="">
          <option value="">All specialties</option>
          <option value="ITU">Intensive care (ITU)</option>
          <option value="A&E">Accident &amp; emergency (A&amp;E)</option>
          {["General nursing","Theatre","ENP / ANP","Paediatric","PICU / NICU","Mental health","Healthcare assistants","Other"].map(role=><option key={role}>{role}</option>)}
        </select>
        <button type="submit" className="btn">Continue to registration</button>
      </form>
    </div></section>
    <section className="wrap section"><div className={s.columns}><div><p className="overline">Planning your next move</p><h2>What would work for you?</h2><p>MSL handles vacancy enquiries directly. Speak to the team for current shifts, locations and pay rates.</p></div>
      <div className={s.rows}><article><h3>Occasional shifts</h3><p>Ask about individual shifts that fit around your other commitments.</p></article>
        <article><h3>Regular work</h3><p>Discuss a longer line of work or a block booking with a healthcare provider.</p></article>
        <article><h3>Local and nationwide opportunities</h3><p>Share your preferred locations and the settings you know best, including NHS hospitals, private hospitals and care homes.</p></article>
        <div className={s.links}><Link className="under" href="/for-candidates">Candidate benefits</Link><Link className="under" href="/candidate-compliance">Registration documents</Link></div>
      </div></div></section>
    <CandidateContact title="Enquire about current vacancies">Call our consultants to discuss your specialty and availability.</CandidateContact>
  </>;
}
