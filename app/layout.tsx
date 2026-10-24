import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { getProfile } from "@/lib/data";
import "./globals.css";

const hankenGrotesk = localFont({
  src: "./fonts/hanken-grotesk-latin.woff2",
  variable: "--font-hanken-grotesk",
  weight: "400 800",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "400 600",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin.woff2",
  variable: "--font-jetbrains-mono",
  weight: "400 500",
  display: "swap",
});

const profile = getProfile();
const title = `${profile.name} | ${profile.title}`;
const description = profile.introduction ?? profile.summary;

export const viewport: Viewport = { themeColor: "#ecebe7" };

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://www.dev-daly.tn",
  ),
  title,
  description,
  keywords: [
    "Mohamed Ali Chouikh",
    "Software Engineer",
    "AI Engineer",
    "Full Stack Developer",
    "Go",
    "TypeScript",
    "React",
    "NestJS",
    "Next.js",
    "Portfolio",
  ],
  authors: [{ name: "Mohamed Ali Chouikh" }],
  creator: "Mohamed Ali Chouikh",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: `${profile.displayName ?? profile.name} — Portfolio`,
    title,
    description,
    images: [
      {
        url: "/brand/social-card.png",
        width: 1200,
        height: 630,
        alt: "Daly Chouikh — Software & AI Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/brand/social-card.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-background font-body text-on-surface antialiased">
        {children}
      </body>
    </html>
  );
}
