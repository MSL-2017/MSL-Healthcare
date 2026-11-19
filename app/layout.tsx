import type { Metadata } from "next";
import Header from "./header";
import Footer from "./footer";
import Motion from "./motion";
import { origin } from "./site";
import "./globals.css";
import "./design.css";

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {template:"%s | MSL Healthcare",default:"MSL Healthcare | Medical staffing & nursing jobs"},
  description:"Specialist nursing recruitment for NHS and private providers across the UK."
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en-GB"><body><Header/><main id="main" tabIndex={-1}>{children}</main><Footer/><Motion/></body></html>
}
