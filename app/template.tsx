import type { ReactNode } from "react";

export default function PageTemplate({ children }: { children: ReactNode }) {
  // Give the App Router one scroll target at the start of the page.
  return <div className="route-page">{children}</div>;
}
