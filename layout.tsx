import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechZone — Futuristic Tech Store",
  description: "Discover curated phones, laptops, gaming gear and everyday tech essentials.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
