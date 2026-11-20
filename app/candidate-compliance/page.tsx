import Link from "next/link";
import { CandidateContact, journeyMetadata } from "../for-candidates/journey";
import s from "../for-candidates/journey.module.css";

export const metadata = journeyMetadata("Candidate compliance checklist", "Prepare your employment, professional and health documents for registration with MSL Healthcare and access the agency’s published forms.", "/candidate-compliance");

import { resources } from "./resources";
import "./library.css";

const requirements = [
  {title:"Identity and eligibility", items:["Evidence of your right to work in the UK and your National Insurance number.", "Two current proofs of address.", "A DBS application or DBS Update Service details.", "An overseas police check, where applicable."]},
  {title:"Experience and registration", items:["Completed application form, including the handbook.", "A CV covering at least ten years of work or education, with any gaps explained.", "Two references.", "NMC Statement of Entry and degree certificate."]},
  {title:"Health and competency", items:["Completed occupational health form with associated blood reports.", "A current life support certificate, such as ALS, BLS or PBLS. Contact us if you need training.", "Annual competency updates."]},
];

export default function Compliance() {
  return <>
    <section className={s.dark}><div className="wrap"><p className="overline">Candidate compliance</p><h1>Prepare for registration.</h1>
      <p className="lead">Our compliance team can help you gather your evidence and explain which checks apply to your role.</p>
      <div className={s.links}><a href="#checklist" className="under">Document checklist</a><a href="#forms" className="under">Forms and handbook</a></div>
    </div></section>
    <section id="checklist" className="wrap section"><p className="overline">Before you start</p><h2>Your compliance checklist</h2>
      <div className={s.checklists}>{requirements.map(group=><article key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div>
      <p>Ask your consultant how to provide completed forms, identification and health records securely.</p>
    </section>
    <section id="forms" className="agency">
      <div className="wrap resource-directory">
        <div className="resource-index">
          <p className="overline">Candidate resources</p>
          <h2>Forms, handbook and policies</h2>
          <p>Find the published documents for registration, assignments and company policies.</p>
          <nav aria-label="Resource categories">
            {resources.map(group => <a className="under" href={"#" + group.id} key={group.id}>{group.title}</a>)}
          </nav>
        </div>
        <div>
          {resources.map(group => <section className="resource-group" id={group.id} key={group.id}>
            <h3>{group.title}</h3>
            {group.items.map(item => <article className="resource-entry" key={item.title}>
              <div><h4>{item.title}</h4><p>{item.description}</p></div>
              {item.href
                ? <a className="under" href={item.href} aria-label={"Open " + item.title + " PDF"}>Open PDF</a>
                : <Link className="under" href="/contact">Ask for the form</Link>}
            </article>)}
          </section>)}
        </div>
      </div>
    </section>
    <CandidateContact title="Need a hand with your documents?">Speak to the compliance team about your registration, certificates or training.</CandidateContact>
  </>;
}
