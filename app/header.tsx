"use client";
import Link from "next/link";
import Image from "next/image";
import {useRef} from "react";
import {groups} from "./site";

export function Logo() {
  return <Image unoptimized className="brand" src="/msl-healthcare.webp" width={320} height={115} alt="MSL Healthcare" priority/>;
}
export default function Header() {
  const header = useRef<HTMLElement>(null);
  function closeMenus() {
    header.current?.querySelectorAll('details[open]').forEach(item=>item.removeAttribute('open'));
  }
  return <header className="mast" ref={header} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))closeMenus()}} onKeyDown={event=>{
    if(event.key==='Escape'){const details=(event.target as HTMLElement).closest('details'); if(details){details.open=false;details.querySelector('summary')?.focus()}}
  }}><a className="skip" href="#main">Skip to content</a>
    <div className="wrap bar" onClick={event=>{if((event.target as HTMLElement).closest('a'))closeMenus()}}>
      <Link href="/" aria-label="MSL Healthcare home"><Logo/></Link>
      <nav className="largeNav" aria-label="Primary"><Link href="/">Home</Link>
      {groups.slice(0,2).map(group=><details key={group.title} name="audience"><summary>{group.title}</summary><div className="dropdown">{group.links.map(([name,url])=><Link key={url} href={url}>{name}</Link>)}</div></details>)}
      <Link href="/about">About</Link><Link href="/contact">Contact</Link></nav>
      <Link className="btn quick" href="/register">Quick apply</Link>
      <details className="smallNav"><summary>Menu</summary><nav aria-label="Mobile"><Link href="/">Home</Link>{groups.map(group=><div key={group.title}><strong>{group.title}</strong>{group.links.map(([label,url])=><Link key={url} href={url}>{label}</Link>)}</div>)}</nav></details>
    </div></header>
}
