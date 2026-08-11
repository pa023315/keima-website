import { Instrument_Sans, Noto_Sans_TC } from "next/font/google";

export const latin = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

export const cjk = Noto_Sans_TC({
  variable: "--font-cjk",
  display: "swap",
  preload: false,
});
