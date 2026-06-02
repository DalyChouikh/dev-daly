import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mohamed Ali Chouikh | Software & AI Engineer",
  description:
    "Portfolio of Mohamed Ali Chouikh — M.Sc. Software Engineering candidate specializing in AI, full-stack, and backend systems.",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface text-on-surface">
      <h1 className="font-display text-5xl font-extrabold tracking-tight text-on-surface">
        Mohamed Ali Chouikh
      </h1>
      <p className="mt-4 max-w-md text-center text-lg text-on-surface-variant">
        Software & AI Engineer — Portfolio coming soon.
      </p>
    </main>
  );
}