import type { Metadata } from "next";
import { Hanken_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Ali Chouikh | Software & AI Engineer",
  description:
    "M.Sc. Software Engineering candidate with 2+ years of experience in AI, full-stack, mobile, and backend systems. Specializing in Go, TypeScript, React, NestJS, and AI model fine-tuning.",
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
    url: "https://dev-daly.netlify.app",
    siteName: "Mohamed Ali Chouikh Portfolio",
    title: "Mohamed Ali Chouikh | Software & AI Engineer",
    description:
      "M.Sc. Software Engineering candidate with 2+ years of experience in AI, full-stack, and backend systems.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohamed Ali Chouikh | Software & AI Engineer",
    description:
      "M.Sc. Software Engineering candidate with 2+ years of experience in AI, full-stack, and backend systems.",
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