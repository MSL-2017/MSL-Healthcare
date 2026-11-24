"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const targets = [
  "h1", "h2", "article", "figure", ".lead", ".actions", ".steps li",
  ".ed-photo", ".ed-rows > div", ".ed-sequence li", ".story p",
  ".opportunity > div",
].map(selector => "main " + selector).join(",");

export default function Motion() {
  const path = usePathname();
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 940px)").matches;
    const active = new Set<Animation>();
    const stopAnimations = () => {
      for (const animation of active) animation.cancel();
      active.clear();
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (preference.matches) continue;

        const element = entry.target;
        const photo = element.matches("figure,.ed-photo");
        const animated = photo ? element.querySelector("img") ?? element : element;
        const frames = photo
          ? [{ clipPath: "inset(8% 0 8% 0)", scale: ".97" }, { clipPath: "inset(0)", scale: "1" }]
          : [{ opacity: .25, transform: compact ? "translateY(10px)" : "translateY(22px)" }, { opacity: 1, transform: "translateY(0)" }];
        const position = Array.from(element.parentElement?.children ?? []).indexOf(element);
        const animation = animated.animate(frames, {
          duration: compact ? 360 : photo ? 790 : 620,
          delay: Math.min(Math.max(position, 0), 3) * 65,
          easing: "cubic-bezier(.2,.75,.22,1)",
          fill: "backwards",
        });
        active.add(animation);
        animation.onfinish = () => active.delete(animation);
      }
    }, { threshold: .08 });

    const hero = document.querySelector(".route-page > :first-child");
    document.querySelectorAll(targets).forEach(element => {
      if (!hero?.contains(element) && !element.closest(".staffingTrack")) observer.observe(element);
    });
    preference.addEventListener("change", stopAnimations);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stopAnimations);
      stopAnimations();
    };
  }, [path]);
  return null;
}
