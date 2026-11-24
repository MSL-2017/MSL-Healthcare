export const consentCookie = "msl_cookie_consent";
export const consentDays = 180;

// Increment the version before introducing an optional technology or changing a purpose.
const version = 1;
const maxAge = consentDays * 24 * 60 * 60;
const changeEvent = "msl-cookie-consent-change";
const decisions = ["accept-all", "reject-all", "save-preferences"] as const;
export type CookieDecision = (typeof decisions)[number];

let sessionPreference: string | null = null;

function storedCookie() {
  try {
    return document.cookie.split("; ").find(cookie => cookie.startsWith(consentCookie + "="))?.slice(consentCookie.length + 1);
  } catch {
    return undefined;
  }
}

export function readCookiePreference(): string | null {
  const value = sessionPreference ?? storedCookie();
  if (!value) return null;
  try {
    const record = JSON.parse(decodeURIComponent(value));
    const age = Date.now() - record.timestamp;
    return record.version === version && decisions.includes(record.decision) &&
      Number.isSafeInteger(record.timestamp) && age >= 0 && age < maxAge * 1000 ? value : null;
  } catch {
    return null;
  }
}

export function saveCookiePreference(decision: CookieDecision) {
  const preference = encodeURIComponent(JSON.stringify({ version, timestamp: Date.now(), decision }));
  try {
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${consentCookie}=${preference}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  } catch {
    // A browser that blocks site cookies can still keep the choice for this page session.
  }
  sessionPreference = storedCookie() === preference ? null : preference;
  window.dispatchEvent(new Event(changeEvent));
}

export function subscribeToCookiePreference(update: () => void) {
  window.addEventListener(changeEvent, update);
  window.addEventListener("focus", update);
  window.addEventListener("pageshow", update);
  document.addEventListener("visibilitychange", update);
  return () => {
    window.removeEventListener(changeEvent, update);
    window.removeEventListener("focus", update);
    window.removeEventListener("pageshow", update);
    document.removeEventListener("visibilitychange", update);
  };
}
