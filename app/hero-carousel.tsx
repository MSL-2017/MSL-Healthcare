"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  { src: "/uk-hospital-tour.webp", alt: "A staff member leads a nursing recruitment tour at West Suffolk Hospital in England" },
  { src: "/uk-nursing-discussion.webp", alt: "Participants take part in a nursing recruitment discussion at West Suffolk Hospital" },
  { src: "/uk-clinical-assessment.webp", alt: "Clinicians in scrubs assess a volunteer patient during a training exercise at RAF Lakenheath in Suffolk" },
];
const interval = 2_000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [visible, setVisible] = useState(false);
  const next = (active + 1) % slides.length;
  const nextReady = ready.includes(slides[next].src);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setMotionAllowed(!preference.matches);
    const syncVisibility = () => setVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    preference.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      preference.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!motionAllowed || !visible || hovered || !nextReady) return;
    const timer = window.setTimeout(() => setActive(next), interval);
    return () => window.clearTimeout(timer);
  }, [hovered, motionAllowed, next, nextReady, visible]);

  return (
    <div className="heroVisual">
      <figure
        className="portrait heroCarousel"
        onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => setHovered(false)}
      >
        <div className="heroSlides">
          {slides.map((slide, index) => (
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              aria-hidden={index !== active}
              className="heroSlide"
              data-active={index === active}
              fill
              sizes="(max-width: 700px) 84vw, (max-width: 1384px) 41vw, 562px"
              preload={index === 0}
              onLoad={() => setReady(current => current.includes(slide.src) ? current : [...current, slide.src])}
            />
          ))}
        </div>
        <figcaption><b>24/7</b> Consultant support</figcaption>
      </figure>
    </div>
  );
}
