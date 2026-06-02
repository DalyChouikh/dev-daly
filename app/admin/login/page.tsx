"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error ?? "Authentication failed");
        setLoading(false);
        return;
      }

      // Redirect to the admin page they were trying to access
      window.location.href = from;
    } catch {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-on-surface-variant">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-default border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-on-surface outline-none transition-all duration-200 focus:border-primary focus:ring-1 focus:ring-primary/50"
          placeholder="Enter admin password"
        />
      </div>

      {error && (
        <p className="text-center text-sm text-error">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-on-primary transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? "Authenticating..." : "Login"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-default border border-white/10 bg-white/[0.03] p-8 backdrop-blur-[20px]">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-bold text-primary">
            Daly.
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-on-surface">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter your password to access the admin dashboard.
          </p>
        </div>

        <Suspense fallback={<div className="py-4 text-center text-on-surface-variant">Loading...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-on-surface-variant transition-colors duration-200 hover:text-primary"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}