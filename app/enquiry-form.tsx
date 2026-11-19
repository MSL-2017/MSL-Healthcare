"use client";
import {useState,useSyncExternalStore} from "react";
import Link from "next/link";
import {specialties} from "./specialties";
const subscribe = () => () => {};
type Kind="register"|"staff"|"contact";
const subjects={register:"Candidate registration",staff:"Staffing request",contact:"General enquiry"};

export default function EnquiryForm({kind,initialSpecialty=""}:{kind:Kind;initialSpecialty?:string}){
  const ready=useSyncExternalStore(subscribe,()=>true,()=>false);
  const [draft,setDraft]=useState("");
  const [body,setBody]=useState("");
  const [copied,setCopied]=useState(false);
  const [specialty,setSpecialty]=useState(initialSpecialty);
  return <form className="enquiry" onChange={()=>{setDraft("");setCopied(false)}} onSubmit={event=>{
    event.preventDefault();
    const fields=new FormData(event.currentTarget);
    const message=Array.from(fields.entries()).filter(([name])=>name!=="consent").map(([name,value])=>name+": "+String(value).trim()).join("\n\n");
    setBody(message); setDraft("mailto:info@mslhealthcare.co.uk?subject="+encodeURIComponent(subjects[kind])+"&body="+encodeURIComponent(message));
  }}>
    <fieldset disabled={!ready}><h2>{kind==="register"?"Your registration":kind==="staff"?"Your staffing enquiry":"Your message"}</h2>
    <p>Prepare an email to the recruitment team. Fields marked * are required.</p>
    <label>Full name *<input autoComplete="name" name="Name" required maxLength={100} pattern=".*\S.*"/></label>
    <div className="formRow"><label>Email address *<input name="Email" type="email" autoComplete="email" required maxLength={254}/></label>
    <label>Phone number<input name="Phone" type="tel" autoComplete="tel" maxLength={30}/></label></div>
    {kind==="staff"&&<label>Organisation *<input name="Organisation" autoComplete="organization" required maxLength={150}/></label>}
    {kind!=="contact"&&<div className="formRow"><label>Specialism<select name="Specialism" value={specialty} onChange={e=>setSpecialty(e.target.value)}><option value="">Select if known</option>{specialties.map(item=><option key={item}>{item}</option>)}</select></label>
    <label>{kind==="staff"?"Facility location":"Preferred location"}<input name="Location" maxLength={140}/></label></div>}
    <label>{kind==="staff"?"Which shifts or roles do you need?":kind==="register"?"Your experience and availability":"How can we help?"} *<textarea name="Message" required rows={4} maxLength={1800}/></label>
    {kind==="register"&&<p className="note">Ask your consultant for the approved way to share your CV. Please leave identity and health documents out of this enquiry.</p>}
    <label className="check"><input type="checkbox" required name="consent"/> <span>I agree to include these details in my email to MSL Healthcare. <Link href="/privacy-policy" className="under">Privacy information</Link></span></label>
    <noscript><p>Please email info@mslhealthcare.co.uk or call 0333 733 2020 to make this enquiry.</p></noscript>
    <button type="submit" className="btn">Prepare email draft</button>
    {draft&&<div className="draft" role="status"><h3>Your draft is ready to review</h3><p>Open the draft in your email app and press Send there. If you use webmail, copy the message to info@mslhealthcare.co.uk.</p><div className="actions"><a className="btn" href={draft}>Open email draft</a><button type="button" className="under" onClick={async()=>{try{await navigator.clipboard.writeText(body);setCopied(true)}catch{document.querySelector<HTMLTextAreaElement>(".draft textarea")?.select()}}}>{copied?"Copied":"Copy message"}</button></div><label>Draft message<textarea readOnly value={body} rows={5}/></label></div>}
  </fieldset></form>
}



