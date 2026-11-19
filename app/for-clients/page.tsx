import Link from "next/link";
import { ClinicalPhoto, EditorialIntro, EnquiryBand, editorialMeta } from "./editorial";

export const metadata = editorialMeta(
  "/for-clients", "For healthcare organisations",
  "Talk to MSL Healthcare about temporary nursing and healthcare staffing for NHS and private services across the UK."
);

export default function ClientsPage() {
  return <>
    <section className="ed-hero"><div className="wrap ed-split">
      <EditorialIntro label="For clients" title="Staffing support for your service">
        <p className="lead">From an uncovered shift to a block of bookings, talk directly to consultants who work with healthcare providers in your region.</p>
        <div className="actions">
          <Link className="btn" href="/request-staff">Request staff</Link>
          <Link className="under" href="/staffing-solutions">Explore staffing solutions</Link>
        </div>
      </EditorialIntro>
      <ClinicalPhoto src="/hospital.jpg" alt="A hospital reception and waiting area" sizes="(max-width:650px) 89vw, 42vw" preload />
    </div></section>

    <section className="wrap section">
      <p className="overline">Working with MSL</p><h2>From shift cover to ongoing planning</h2>
      <ul className="ed-sequence">
        <li><h3>Urgent cover</h3><p>Speak to the agency at any hour about a shift that needs covering. For a time-sensitive request, call <a className="under" href="tel:03337332020">0333 733 2020</a>.</p></li>
        <li><h3>Regional consultants</h3><p>MSL assigns consultants by UK region so you can build a working relationship with people familiar with your service.</p></li>
        <li><h3>Regular bookings</h3><p>Discuss recurring shifts and longer staffing needs alongside your immediate rota with the same regional team.</p></li>
      </ul>
    </section>

    <section className="agency"><div className="wrap ed-directory">
      <aside><p className="overline">Clinical teams</p><h2>Who we supply</h2><Link className="under" href="/healthcare-specialisms">View all healthcare specialisms</Link></aside>
      <dl className="ed-rows">
        <div><dt>Nursing and ward support</dt><dd>Registered general nurses, mental health nurses and healthcare assistants for hospital and care settings.</dd></div>
        <div><dt>Acute and specialist departments</dt><dd>Emergency, intensive care, theatre and paediatric nurses, including nurses for neonatal and paediatric intensive care units.</dd></div>
        <div><dt>Advanced practice</dt><dd>Discuss emergency nurse practitioner and advanced nurse practitioner requirements with a consultant.</dd></div>
      </dl>
    </div></section>
    <EnquiryBand title="Tell us where you need cover">Share the setting, specialism and shift dates with our team.</EnquiryBand>
  </>;
}
