import { journeyMetadata } from "../for-candidates/journey";
import s from "../for-candidates/journey.module.css";
import { policies } from "./resources";
import "./library.css";

export const metadata = journeyMetadata(
  "Candidate compliance",
  "Read MSL Healthcare’s published company policies and contact the team with compliance enquiries.",
  "/candidate-compliance",
);

export default function Compliance() {
  return (
    <>
      <section className={s.dark}>
        <div className="wrap">
          <p className="overline">For candidates</p>
          <h1>Candidate compliance</h1>
          <a className="under" href="#company-policies">View company policies</a>
        </div>
      </section>
      <section id="company-policies" className="wrap section">
        <h2>Company Policies</h2>
        <ul className="policyList">
          {policies.map(({ title, description, href }) => (
            <li className="policyEntry" key={title}>
              <div><h3>{title}</h3><p>{description}</p></div>
              <a className="under" href={href} aria-label={`Open ${title} PDF`}>Open PDF</a>
            </li>
          ))}
        </ul>
      </section>
      <section className="agency">
        <div className="wrap">
          <h2>Need help with compliance?</h2>
          <p>If you have any questions regarding compliance requirements or company policies, please contact our team.</p>
          <div className="complianceContacts">
            <a className="under" href="mailto:info@mslhealthcare.co.uk"><span aria-hidden="true">✉</span> info@mslhealthcare.co.uk</a>
            <a className="under" href="tel:03337332020"><span aria-hidden="true">☎</span> 0333 733 2020</a>
          </div>
        </div>
      </section>
    </>
  );
}
