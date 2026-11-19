import Link from "next/link";
import { Logo } from "./header";
import {groups,legal} from "./site";

export default function Footer(){
  return <footer><div className="wrap footerLinks"><div><Link href="/" className="footerLogo"><Logo/></Link><address>24 Bevis Marks House, Bevis Marks<br/>London, EC3A 7JB</address><a href="tel:03337332020">0333 733 2020</a><a href="mailto:info@mslhealthcare.co.uk">info@mslhealthcare.co.uk</a></div>
  {groups.map(group=><nav key={group.title} aria-label={group.title+" footer"}><strong>{group.title}</strong>{group.links.map(([label,path])=><Link href={path} key={path}>{label}</Link>)}</nav>)}</div>
  <div className="wrap fine"><span>© {new Date().getFullYear()} MSL Healthcare</span>{legal.map(([label,path])=><Link key={path} href={path}>{label}</Link>)}</div></footer>
}
