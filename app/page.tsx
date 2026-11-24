import Link from "next/link";
import Image from "next/image";
import {pageMeta} from "./metadata";
import HeroCarousel from "./hero-carousel";
import StaffingMarquee from "./staffing-marquee";
import "./homepage.css";
export const metadata=pageMeta("Medical staffing & nursing jobs","Connecting healthcare professionals with NHS and private healthcare providers across the UK, 24 hours a day.","/");
const sectors=[
  ["Critical care","ITU nursing for patients who need intensive monitoring and specialist care.","staffing-critical-care.webp","Ventilator monitoring a patient in an intensive care bed"],
  ["Emergency nursing","A&E nurses and practitioners supporting urgent care teams.","staffing-emergency-nursing.webp","Nurses and doctors outside an emergency treatment area"],
  ["General nursing","Registered nurses for wards, care homes and other healthcare settings.","staffing-general-nursing.webp","A ward nurse adjusting an IV drip beside a patient's bed"],
  ["Paediatric nurses","Paediatric nursing support for babies, children and young people.","staffing-paediatric-nurses.webp","A clinician using a stethoscope during a child's check-up","paediatric-nurses"],
  ["Mental health nurses","Nursing support for people receiving mental health care.","staffing-mental-health-nurses.webp","A healthcare professional listening to a person during a conversation","mental-health-nurses"]
] as const;
export default function Home(){
 return <>
 <section className="hero homeHero"><div className="wrap heroGrid"><div className="intro"><p className="overline">UK healthcare recruitment</p>
 <h1>Healthcare staffing, <em>built around people.</em></h1>
 <p className="lead">Connecting healthcare professionals with NHS and private care providers, from individual shifts to longer placements.</p>
 <div className="actions"><Link className="btn" href="/healthcare-jobs">Find work</Link><Link className="btn outline" href="/request-staff">Request staff</Link></div>
 </div><HeroCarousel/></div></section>
 <section className="wrap section"><p className="overline">Working with MSL</p><h2>How can we help you?</h2><div className="audiences">{[
 ["For healthcare professionals","Find work that fits your experience, location and availability.","/register","Register with MSL","/clinician.jpg"],
 ["For healthcare organisations","Discuss cover for your next shift or your longer-term staffing needs.","/request-staff","Request staff","/hospital.jpg"]
 ].map(([title,body,path,action,img])=><article key={path}><figure className="cardPhoto"><Image src={img} fill sizes="(max-width:700px) 89vw, 45vw" alt=""/></figure><div><h3>{title}</h3><p>{body}</p><Link className="under" href={path}>{action}</Link></div></article>)}</div></section>
 <section className="agency" aria-labelledby="staffing-heading"><div className="wrap"><p className="overline">Clinical disciplines</p><h2 id="staffing-heading">Specialist healthcare staffing</h2><StaffingMarquee cards={sectors}/></div></section>
 <section className="wrap section duo story"><div><p className="overline">About MSL Healthcare</p><h2>A personal approach to medical staffing</h2><p>We work with nurses, care teams and healthcare employers across the UK, including NHS hospitals, private hospitals and care homes. Our consultants get to know the people behind each booking, from shift preferences to the needs of the ward.</p><Link className="under" href="/about">About our agency</Link></div>
 <div className="why"><h3>Why choose MSL?</h3><dl><dt>Day and night</dt><dd>Consultants available around the clock, every day of the year.</dd><dt>Local understanding</dt><dd>Dedicated regional contacts for staffing enquiries.</dd><dt>Flexible bookings</dt><dd>Ad hoc shifts, block bookings and longer lines of work.</dd></dl></div></section>
 <section className="process"><div className="wrap duo"><div><p className="overline">For candidates</p><h2>Your route into work</h2></div><ol className="steps"><li><Link href="/register">Introduce yourself</Link><p>Share your discipline, experience and availability.</p></li><li><Link href="/candidate-compliance">Review company policies</Link><p>Read the published policies or contact the compliance team.</p></li><li><Link href="/healthcare-jobs">Discuss opportunities</Link><p>Ask about shifts in the areas where you want to work.</p></li></ol></div></section>
 <section className="wrap section opportunity">
   <div><p className="overline">Clinical opportunities</p><h2>Find a shift that fits</h2><p>Talk to a consultant about current opportunities in your discipline and preferred location, from ad hoc shifts to longer bookings.</p><Link className="btn" href="/healthcare-jobs">Explore healthcare jobs</Link></div>
   <div><p className="overline">Agency careers</p><h2>Work for MSL</h2><p>Interested in the work behind each placement? Get in touch about a career with our healthcare recruitment team.</p><Link className="under" href="/work-for-msl">Explore agency careers</Link></div>
 </section>
 <section className="wrap finalCTA"><h2>Ready to work with MSL Healthcare?</h2><div className="actions"><Link href="/register" className="btn">Register with MSL</Link><Link href="/request-staff" className="btn outline">Request staff</Link></div></section>
 <small className="wrap homePhotoCredit">
   The appearance of U.S. Department of War visual information does not imply or constitute Department of War endorsement.
 </small>
 </>
}
