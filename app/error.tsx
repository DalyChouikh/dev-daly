"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

/**
 * Global error boundary for the portfolio app.
 * Catches unexpected errors and renders a themed recovery UI.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      console.error("Global error:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-error/3 blur-[100px]" />

      <div className="relative text-center">
        {/* Error Icon */}
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-full bg-error/10" />
          <div className="flex h-full w-full items-center justify-center">
            <AlertTriangle size={36} className="text-error/60" />
          </div>
        </div>

        {/* Glass Card */}
        <div className="glass-card glass-card-hover mt-6 inline-block px-8 py-6 md:px-12 md:py-8">
          <h1 className="font-display text-2xl font-bold text-on-surface md:text-3xl">
            Something Went Wrong
          </h1>
          <p className="mt-3 max-w-sm text-on-surface-variant">
            An unexpected error occurred. Please try again or return to the homepage.
          </p>

          {error.digest && (
            <p className="mt-2 font-mono text-xs text-on-surface-variant/50">
              Error ID: {error.digest}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all hover:scale-[1.02]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold text-on-surface transition-all hover:border-primary/40 hover:text-primary"
            >
              <Home size={16} />
              Back Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}