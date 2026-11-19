import Link from "next/link";
import { EditorialIntro, EnquiryBand, editorialMeta } from "../for-clients/editorial";

export const metadata = editorialMeta(
  "/healthcare-specialisms", "Healthcare specialisms",
  "Explore the general nursing, acute care, advanced practice and healthcare support disciplines supplied by MSL Healthcare."
);

const groups = [
  { title: "General nursing and healthcare support", roles: ["Registered general nurses (RGNs)", "Healthcare assistants (HCAs)"] },
  { title: "Emergency, critical care and theatres", roles: ["Accident and emergency nurses (A&E)", "Intensive therapy unit nurses (ITU)", "Theatre nurses"] },
  { title: "Children and newborns", roles: ["Paediatric nurses", "Paediatric intensive care nurses (PICU)", "Neonatal intensive care nurses (NICU)"] },
  { title: "Mental health and advanced practice", roles: ["Mental health nurses", "Emergency nurse practitioners (ENPs)", "Advanced nurse practitioners (ANPs)"] },
];

export default function SpecialismsPage() {
  return <>
    <section className="ed-hero"><div className="wrap ed-mast">
      <EditorialIntro label="Healthcare specialisms" title="Find your clinical discipline">
        <p className="lead">MSL works with nursing and healthcare teams across the UK. Explore the roles below when making a staffing request or discussing your next shift.</p>
        <div className="actions"><Link className="btn" href="/healthcare-jobs">Enquire about work</Link><Link className="under" href="/request-staff">Request a specialist</Link></div>
      </EditorialIntro>
    </div></section>
    <section className="wrap section ed-groups" aria-label="Clinical disciplines">
      {groups.map(group => <article className="ed-group" key={group.title}>
        <h2>{group.title}</h2><ul>{group.roles.map(role => <li key={role}>{role}</li>)}</ul>
      </article>)}
    </section>
    <EnquiryBand title="Looking for a particular skill mix?">Discuss the clinical experience and setting with your regional staffing consultant.</EnquiryBand>
  </>;
}
