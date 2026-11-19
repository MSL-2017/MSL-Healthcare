import Link from "next/link";
import { CandidateContact, journeyMetadata } from "../for-candidates/journey";
import s from "../for-candidates/journey.module.css";

export const metadata = journeyMetadata("Candidate compliance checklist", "Prepare your employment, professional and health documents for registration with MSL Healthcare and access the agency’s published forms.", "/candidate-compliance");

const requirements = [
  {title:"Identity and eligibility", items:["Evidence of your right to work in the UK and your National Insurance number.", "Two current proofs of address.", "A DBS application or DBS Update Service details.", "An overseas police check, where applicable."]},
  {title:"Experience and registration", items:["Completed application form, including the handbook.", "A CV covering at least ten years of work or education, with any gaps explained.", "Two references.", "NMC Statement of Entry and degree certificate."]},
  {title:"Health and competency", items:["Completed occupational health form with associated blood reports.", "A current life support certificate, such as ALS, BLS or PBLS. Contact us if you need training.", "Annual competency updates."]},
];

const forms = "https://irp-cdn.multiscreensite.com/c1b34cb1/files/uploaded/";
const policies = "https://irp.cdn-website.com/c1b34cb1/files/uploaded/";
const documents = [
  ["Nursing and ODP application form", forms + "MSL%20Application%20form%20November%202018%20Nurse%26ODP.PDF"],
  ["Candidate handbook", forms + "Handbook.pdf"],
  ["Annual health questionnaire", forms + "Annual%20Health%20Questionnaire.pdf"],
  ["DBS acceptable ID documents", forms + "DBS%20ID%20Acceptable%20documents%20.pdf"],
  ["Degree disclaimer", forms + "Degree%20disclaimer.pdf"],
  ["Reference form", forms + "Reference%20form.pdf"],
  ["Timesheet", forms + "Timesheet.pdf"],
  ["Modern slavery and human trafficking policy", policies + "Policy%2001%20-%20ANTI%20SLAVERY%20AND%20HUMAN%20TRAFFICKING.pdf"],
  ["Modern slavery statement", policies + "MSL%20Modern%20Slavery%20Statement.pdf"],
  ["Carbon reduction plan", policies + "New_PDF_Doc.PDF"],
];

export default function Compliance() {
  return <>
    <section className={s.dark}><div className="wrap"><p className="overline">Candidate compliance</p><h1>Prepare for registration.</h1>
      <p className="lead">Our compliance team can help you gather your evidence and explain which checks apply to your role.</p>
      <div className={s.links}><a href="#checklist" className="under">Document checklist</a><a href="#forms" className="under">Forms and handbook</a></div>
    </div></section>
    <section id="checklist" className="wrap section scroll-mt-28"><p className="overline">Before you start</p><h2>Your compliance checklist</h2>
      <div className={s.checklists}>{requirements.map(group=><article key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div>
      <p>Ask your consultant how to provide completed forms, identification and health records securely.</p>
    </section>
    <section id="forms" className="agency scroll-mt-28"><div className="wrap"><p className="overline">Candidate resources</p><h2>Forms, handbook and policies</h2>
      <div className={s.documents}>{documents.map(([title, href])=><a key={href} href={href}>{title}<small>PDF</small></a>)}</div>
      <p className="mt-6">For the professional indemnity self-declaration form, <Link href="/contact" className="under">contact the compliance team</Link>.</p>
    </div></section>
    <CandidateContact title="Need a hand with your documents?">Speak to the compliance team about your registration, certificates or training.</CandidateContact>
  </>;
}
