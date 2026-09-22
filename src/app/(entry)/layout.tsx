import type { Metadata } from "next";
import type { ReactNode } from "react";

import { cjk, latin } from "@/lib/fonts";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://keima.tw"),
  robots: {
    index: false,
    follow: false,
  },
};

export default function EntryLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-TW" className={`${latin.variable} ${cjk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
