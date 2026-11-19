import Link from "next/link";
import { ClinicalPhoto, EditorialIntro, EnquiryBand, editorialMeta } from "../for-clients/editorial";

export const metadata = editorialMeta(
  "/staffing-solutions", "Staffing solutions",
  "Explore ad hoc shifts, block bookings and longer-term temporary staffing with MSL Healthcare."
);

export default function StaffingPage() {
  return <>
    <section className="ed-hero"><div className="wrap ed-mast">
      <EditorialIntro label="Staffing solutions" title="Cover for a shift or a run of weeks">
        <p className="lead">NHS hospitals, private providers and care homes can approach MSL for temporary staff. The starting point is your rota and the experience needed on the floor.</p>
      </EditorialIntro>
    </div></section>
    <section className="wrap section ed-directory">
      <aside><ClinicalPhoto src="/clinical-care.jpg" alt="A clinician holding a stethoscope" sizes="(max-width:800px) 89vw, 32vw" /></aside>
      <div><p className="overline">Booking options</p><h2>Match the booking to the need</h2>
        <dl className="ed-rows">
          <div><dt>Ad hoc shifts</dt><dd>Ask about a single shift or a gap in a particular department. Let the consultant know the time, location and clinical experience required.</dd></div>
          <div><dt>Block bookings</dt><dd>If you have a sequence of shifts to cover, share the dates together so your consultant can discuss availability across the booking.</dd></div>
          <div><dt>Longer lines of work</dt><dd>For a continuing requirement, discuss the working pattern, the expected duration and how much flexibility your team has.</dd></div>
        </dl>
        <Link className="under" href="/healthcare-specialisms">Explore the disciplines we cover</Link>
      </div>
    </section>
    <EnquiryBand title="Have your rota to hand?">Let us know which shifts need staffing and how to reach your booking team.</EnquiryBand>
  </>;
}
