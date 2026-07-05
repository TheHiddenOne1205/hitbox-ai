import type { Metadata } from "next";
import { Quicksand, VT323 } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Hitbox AI — Game Design Evaluation Suite & Discovery Assistant",
  description: "Evaluate game mechanics, discover player sentiment footprints, crawl competitor forums, and synthesize high-fidelity game design documents dynamically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${vt323.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-light font-sans">
        {children}
      </body>
    </html>
  );
}
