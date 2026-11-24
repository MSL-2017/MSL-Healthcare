import { CandidateContact, journeyMetadata } from "../for-candidates/journey";
import s from "../for-candidates/journey.module.css";
import CompliancePortraits from "./portraits";
import { policies } from "./resources";
import "./library.css";

export const metadata = journeyMetadata(
  "Candidate compliance checklist",
  "Prepare your documents for registration with MSL Healthcare, contact the compliance team and read the published company policies.",
  "/candidate-compliance",
);

const requirements = [
  {title:"Identity and eligibility", items:["Evidence of your right to work in the UK and your National Insurance number.", "Two current proofs of address.", "A DBS application or DBS Update Service details.", "An overseas police check, where applicable."]},
  {title:"Experience and registration", items:["Completed application form, including the handbook.", "A CV covering at least ten years of work or education, with any gaps explained.", "Two references.", "NMC Statement of Entry and degree certificate."]},
  {title:"Health and competency", items:["Completed occupational health form with associated blood reports.", "A current life support certificate, such as ALS, BLS or PBLS. Contact us if you need training.", "Annual competency updates."]},
];

export default function Compliance() {
  return <>
    <section className={s.dark} aria-labelledby="compliance-heading">
      <div className="wrap complianceHero">
        <div>
          <p className="overline">Candidate compliance</p>
          <h1 id="compliance-heading">Prepare for registration.</h1>
          <p className="lead">Our compliance team can help you gather your evidence and explain which checks apply to your role.</p>
          <div className="complianceContact">
            <p>Connect with our compliance team</p>
            <address>
              <a href="mailto:info@mslhealthcare.co.uk">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" />
                </svg>
                info@mslhealthcare.co.uk
              </a>
              <a href="tel:+443337332020">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 3H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3l-5-2-1.5 2a13 13 0 0 1-7.5-7.5L9 8 7 3Z" />
                </svg>
                0333 733 2020
              </a>
            </address>
          </div>
        </div>
        <CompliancePortraits />
      </div>
    </section>
    <section id="checklist" className="wrap section"><p className="overline">Before you start</p><h2>Your compliance checklist</h2>
      <div className={s.checklists}>{requirements.map(group=><article key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div>
      <p>Ask your consultant how to provide completed forms, identification and health records securely.</p>
    </section>
    <section id="company-policies" className="agency" aria-labelledby="company-policies-heading">
      <div className="wrap compliancePolicies">
        <h2 id="company-policies-heading">Company Policies</h2>
        <ul>
          {policies.map(({ title, description, href }) => (
            <li className="compliancePolicy" key={title}>
              <div><h3>{title}</h3><p>{description}</p></div>
              <a className="under" href={href} aria-label={`Open ${title} PDF`}>Open PDF</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
    <CandidateContact title="Need a hand with your documents?">Speak to the compliance team about your registration, certificates or training.</CandidateContact>
  </>;
}
