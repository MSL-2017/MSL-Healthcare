import Image from "next/image";

const portraits = ["nurse", "doctor", "consultant", "primary-care"];

export default function CompliancePortraits() {
  return (
    <div className="compliancePortraits">
      <div className="compliancePortraitDeck" aria-hidden="true">
        {portraits.map((portrait) => (
          <div className="compliancePortraitCard" key={portrait}>
            <Image
              src={`/compliance-portraits/${portrait}.webp`}
              alt=""
              fill
              sizes="(max-width: 520px) 26vw, (max-width: 900px) 135px, 155px"
              loading="eager"
            />
          </div>
        ))}
      </div>
      <p className="compliancePortraitCredit">
        Illustrative photography, cropped · Simon Davis/DFID (<a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>)
        {" · "}<a href="https://commons.wikimedia.org/wiki/File:Nurse_in_PPE,_in_primary_care_during_the_COVID-19_pandemic.jpg">Whispyhistory</a>
        {" ("}<a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a>)
      </p>
    </div>
  );
}
