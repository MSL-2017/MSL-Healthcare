import Image from "next/image";
import "./partners.css";

const logos = [
  { file: "rec-member.jpg", alt: "Recruitment & Employment Confederation (REC) Member" },
  { file: "nhs-wales.png", alt: "NHS Wales (GIG Cymru)" },
  { file: "nhs-workforce-alliance.png", alt: "NHS Workforce Alliance, Clinical and Healthcare Staffing Approved Supplier" },
  { file: "healthtrust-europe.jpg", alt: "HealthTrust Europe Awarded Supplier" },
  { file: "neuven-consult.png", alt: "Neuven Consult Badge of Excellence for MSL Healthcare Limited" },
];

function LogoSequence({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className="partnersSequence" aria-hidden={duplicate || undefined}>
      {logos.map(({ file, alt }) => (
        <li className="partnersLogo" key={file}>
          <Image
            src={`/affiliations/${file}`}
            alt={duplicate ? "" : alt}
            fill
            sizes="(max-width: 700px) 176px, 228px"
          />
        </li>
      ))}
    </ul>
  );
}

export default function Partners() {
  return (
    <section className="partners" aria-labelledby="partners-heading">
      <div className="wrap">
        <div className="partnersHeading">
          <p className="overline">Working together</p>
          <h2 id="partners-heading">Our Partners &amp; Affiliations</h2>
        </div>
        <div className="partnersViewport">
          <div className="partnersTrack">
            <LogoSequence />
            <LogoSequence duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
