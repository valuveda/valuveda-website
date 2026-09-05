import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ValuVeda Wellness | Karela Jamun Powder",
  description: "Discover ValuVeda Wellness Karela Jamun Powder, a 200g herbal wellness formulation with 15+ Ayurvedic herbs.",
  alternates: { canonical: "https://valuveda.com/" },
  openGraph: {
    title: "ValuVeda Wellness | Karela Jamun Powder",
    description: "A thoughtful daily herbal wellness routine from ValuVeda Wellness.",
    url: "https://valuveda.com/",
    siteName: "ValuVeda Wellness",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-IN"><body>{children}</body></html>;
}
