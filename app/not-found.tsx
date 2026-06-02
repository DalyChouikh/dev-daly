import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata = {
  title: "404 | Page Not Found",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-100 w-100 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/3 blur-[100px]" />

      <div className="relative text-center">
        {/* 404 Number */}
        <div className="relative">
          <span className="font-display text-[120px] font-extrabold leading-none text-on-surface/8 md:text-[180px]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search size={48} className="text-primary/30" />
          </div>
        </div>

        {/* Glass Card */}
        <div className="glass-card glass-card-hover -mt-8 inline-block px-8 py-6 md:-mt-12 md:px-12 md:py-8">
          <h1 className="font-display text-2xl font-bold text-on-surface md:text-3xl">
            Page Not Found
          </h1>
          <p className="mt-3 max-w-sm text-on-surface-variant">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all hover:scale-[1.02]"
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