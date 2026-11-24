"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

type Card = readonly [title: string, description: string, image: string, alt: string, anchor?: string];
const cycleSeconds = 52;

export default function StaffingMarquee({ cards }: { cards: readonly Card[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pendingOffset = useRef(0);
  const focusedLink = useRef<HTMLAnchorElement | null>(null);
  const [manual, setManual] = useState(false);
  const [delay, setDelay] = useState(0);

  useLayoutEffect(() => {
    if (viewport.current) viewport.current.scrollLeft = manual ? pendingOffset.current : 0;
    if (manual) focusedLink.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
    focusedLink.current = null;
  }, [manual]);

  function pause(link?: HTMLAnchorElement) {
    if (manual || !track.current) return;
    const { transform } = getComputedStyle(track.current);
    if (transform === "none") return;
    pendingOffset.current = -new DOMMatrixReadOnly(transform).m41;
    focusedLink.current = link ?? null;
    setManual(true);
  }

  function resume() {
    if (!viewport.current || !track.current?.firstElementChild) return;
    const sequenceWidth = track.current.firstElementChild.getBoundingClientRect().width;
    setDelay(-cycleSeconds * viewport.current.scrollLeft / sequenceWidth);
    setManual(false);
  }

  return (
    <>
      <div className="staffingControls">
        <button type="button" className="under" aria-controls="staffing-gallery" onClick={() => manual ? resume() : pause()}>
          {manual ? "Resume scrolling" : "Pause scrolling"}
        </button>
      </div>
      <div
        className="serviceGallery staffingViewport"
        id="staffing-gallery"
        data-manual={manual}
        ref={viewport}
        onPointerDown={event => {
          if (event.pointerType === "touch" && event.target instanceof Element && !event.target.closest("a")) pause();
        }}
      >
        <div className="staffingTrack" ref={track} style={{ animationDuration: `${cycleSeconds}s`, animationDelay: `${delay}s` }}>
          {[false, true].map(duplicate => (
            <div className="staffingSequence" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              {cards.map(([title, description, image, alt, anchor]) => (
                <article key={title}>
                  <figure className="cardPhoto">
                    <Image src={`/${image}`} alt={duplicate ? "" : alt} fill sizes="(max-width: 700px) 80vw, 352px" />
                  </figure>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <Link
                    className="under"
                    href={anchor ? `/healthcare-specialisms#${anchor}` : "/healthcare-specialisms"}
                    tabIndex={duplicate ? -1 : undefined}
                    onFocus={duplicate ? undefined : event => pause(event.currentTarget)}
                    onMouseDown={duplicate ? event => event.preventDefault() : undefined}
                  >
                    Explore specialisms
                  </Link>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
