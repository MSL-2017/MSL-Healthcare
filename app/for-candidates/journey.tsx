import Link from "next/link";
import styles from "./journey.module.css";

export { pageMeta as journeyMetadata } from "../metadata";

export function CandidateContact({title, children}: {title: string; children: React.ReactNode}) {
  return <section className={styles.callout}>
    <div className="wrap duo">
      <div><h2>{title}</h2><p>{children}</p></div>
      <div><a className={styles.phone} href="tel:03337332020">0333 733 2020</a>
        <Link className="under" href="/contact">Contact our team</Link></div>
    </div>
  </section>;
}
