import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import "./editorial.css";

export function editorialMeta(path: string, title: string, description: string): Metadata {
  return {
    title, description, alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
  };
}

export function EditorialIntro({ label, title, children }: {
  label: string; title: string; children: ReactNode;
}) {
  return <div className="ed-intro">
    <p className="overline">{label}</p>
    <h1>{title}</h1>
    {children}
  </div>;
}

export function ClinicalPhoto({ src, alt, sizes, preload = false }: {
  src: string; alt: string; sizes: string; preload?: boolean;
}) {
  return <div className="ed-photo">
    <Image src={src} alt={alt} fill sizes={sizes} preload={preload} />
  </div>;
}

export function EnquiryBand({ title, children }: { title: string; children: ReactNode }) {
  return <section className="ed-band"><div className="wrap ed-band-inner">
    <div><h2>{title}</h2><p>{children}</p></div>
    <Link className="btn" href="/request-staff">Request staff</Link>
  </div></section>;
}
