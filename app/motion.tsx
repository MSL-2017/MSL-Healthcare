"use client";
import {usePathname} from "next/navigation";
import {useEffect} from "react";

export default function Motion(){
  const path=usePathname();
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        const element=entry.target as HTMLElement;
        if(!media.matches){
          const image=element.matches('figure,.ed-photo');
          element.animate(image ? [{clipPath:'inset(0 0 7% round 16px)',scale:'.985'},{clipPath:'inset(0 round 16px)',scale:'1'}] : [{opacity:.22,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],
            {duration:650,delay:Math.min(Array.from(element.parentElement?.children||[]).indexOf(element),3)*55,easing:'cubic-bezier(.2,.75,.22,1)',fill:'backwards'});
        }
        observer.unobserve(element);
      }
    },{threshold:.06});
    document.querySelectorAll('main h1,main h2,main article,main figure,main section > .lead,main .steps li,main .lead,main .actions,main .rule,main .ed-photo,main .ed-group,main .ed-rows > div,main .ed-sequence li').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[path]);
  return null;
}

