"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export default function RecCredential() {
  if (usePathname() !== "/") return null;

  return (
    <div className="wrap credentials">
      <Image src="/rec.jpg" alt="REC" width={94} height={48} />
      <span>Recruitment &amp; Employment Confederation</span>
    </div>
  );
}
