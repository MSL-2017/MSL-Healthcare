"use client";

import Link from "next/link";
import { createContext, useContext, useRef, useSyncExternalStore, type ReactNode } from "react";
import { readCookiePreference, saveCookiePreference, subscribeToCookiePreference, type CookieDecision } from "./cookie-preferences";
import "./cookie-consent.css";

const Settings = createContext<((trigger: HTMLElement) => void) | null>(null);
const serverPreference = () => undefined;

export function CookieSettingsLink({ className }: { className?: string }) {
  const open = useContext(Settings);
  return (
    <a href="/cookie-policy#cookie-settings" className={className} onClick={event => {
      if (!open || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      open(event.currentTarget);
    }}>
      Cookie settings
    </a>
  );
}

export default function CookieConsent({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(subscribeToCookiePreference, readCookiePreference, serverPreference);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  function openSettings(element: HTMLElement) {
    trigger.current = element;
    if (!dialog.current?.open) dialog.current?.showModal();
  }

  function record(decision: CookieDecision) {
    const restoreMain = document.activeElement?.closest(".cookieBanner") || trigger.current?.closest(".cookieBanner");
    if (restoreMain) trigger.current = null;
    dialog.current?.close();
    saveCookiePreference(decision);
    if (restoreMain) document.getElementById("main")?.focus({ preventScroll: true });
  }

  return (
    <Settings.Provider value={openSettings}>
      {children}
      {preference === null && (
        <section className="cookieBanner" aria-labelledby="cookie-banner-title">
          <div>
            <h2 id="cookie-banner-title">Your privacy matters</h2>
            <p>We use essential cookies to keep our website working. With your permission, we may also use optional cookies to understand and improve your experience.</p>
            <p>No optional cookies are currently in use. <Link className="under" href="/cookie-policy">Cookie Policy</Link></p>
          </div>
          <div className="cookieActions">
            <button type="button" className="btn outline" onClick={() => record("accept-all")}>Accept all</button>
            <button type="button" className="btn outline" onClick={() => record("reject-all")}>Reject all</button>
            <button type="button" className="under cookieManage" aria-haspopup="dialog" onClick={event => openSettings(event.currentTarget)}>Manage cookie preferences</button>
          </div>
        </section>
      )}
      <dialog
        ref={dialog}
        className="cookieDialog"
        aria-labelledby="cookie-dialog-title"
        aria-describedby="cookie-dialog-description"
        onKeyDown={event => {
          if (event.key !== "Tab") return;
          const buttons = event.currentTarget.querySelectorAll("button");
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          const atBoundary = event.shiftKey ? document.activeElement === first : document.activeElement === last;
          if (atBoundary) {
            event.preventDefault();
            (event.shiftKey ? last : first).focus();
          }
        }}
        onClose={() => {
          if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
          trigger.current = null;
        }}
      >
        <div className="cookieDialogHeading">
          <h2 id="cookie-dialog-title">Cookie preferences</h2>
          <button type="button" className="under" onClick={() => dialog.current?.close()}>Close</button>
        </div>
        <p id="cookie-dialog-description">This site currently uses strictly necessary storage only.</p>
        <div className="cookieCategory">
          <h3>Strictly necessary</h3>
          <p>Always active. The site uses a first-party cookie to remember your choice.</p>
        </div>
        <div className="cookieActions">
          <button type="button" className="btn outline" onClick={() => record("save-preferences")}>Save preferences</button>
          <button type="button" className="btn outline" onClick={() => record("reject-all")}>Reject all</button>
        </div>
      </dialog>
    </Settings.Provider>
  );
}
