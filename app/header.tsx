"use client";
import Link from "next/link";
import Image from "next/image";
import {useEffect,useRef} from "react";
import {groups} from "./site";

export function Logo() {
  return <Image unoptimized className="brand" src="/msl-healthcare.webp" width={320} height={115} alt="MSL Healthcare" priority/>;
}
export default function Header() {
  const header = useRef<HTMLElement>(null);
  function closeMenus() {
    header.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(item => {
      item.open = false;
    });
  }
  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) closeMenus();
    }
    document.addEventListener("pointerdown", closeOutside);
    window.addEventListener("popstate", closeMenus);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      window.removeEventListener("popstate", closeMenus);
    };
  }, []);
  return <header className="mast" ref={header} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))closeMenus()}} onKeyDown={event=>{
    if(event.key==='Escape'){const details=(event.target as HTMLElement).closest('details'); if(details){details.open=false;details.querySelector('summary')?.focus()}}
  }}><a className="skip" href="#main">Skip to content</a>
    <div className="wrap bar" onClick={event=>{if((event.target as HTMLElement).closest('a'))closeMenus()}}>
      <Link href="/" aria-label="MSL Healthcare home"><Logo/></Link>
      <nav className="largeNav" aria-label="Primary"><Link href="/">Home</Link>
      {groups.slice(0,2).map(group=><details key={group.title} name="audience"><summary>{group.title}</summary><div className="dropdown">{group.links.map(([name,url])=><Link key={url} href={url}>{name}</Link>)}</div></details>)}
      <Link href="/about">About</Link><Link href="/contact">Contact</Link></nav>
      <Link className="btn quick" href="/register">Quick apply</Link>
      <details className="smallNav">
        <summary><span className="menuIcon" aria-hidden="true"/><span>Menu</span></summary>
        <nav aria-label="Mobile">
          <Link href="/">Home</Link>
          {groups.slice(0,2).map(group => (
            <details className="mobileGroup" key={group.title} name="mobile-audience">
              <summary>{group.title}</summary>
              <div>{group.links.map(([label,url]) => <Link key={url} href={url}>{label}</Link>)}</div>
            </details>
          ))}
          {groups[2].links.map(([label,url]) => <Link key={url} href={url}>{label}</Link>)}
        </nav>
      </details>
    </div></header>
}
