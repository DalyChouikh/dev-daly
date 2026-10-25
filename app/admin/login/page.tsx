"use client";

import { Suspense, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { BrandLogo } from "@/components/brand/BrandLogo";

const AuthResponseSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
});

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const pending = useRef(false);
  const searchParams = useSearchParams();
  const requestedFrom = searchParams.get("from") ?? "/admin";
  const from = /^\/admin(?:\/[A-Za-z0-9_-]+)*\/?$/.test(requestedFrom)
    ? requestedFrom
    : "/admin";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const result = AuthResponseSchema.safeParse(await response.json());
      if (!response.ok || !result.success || !result.data.success) {
        setError(
          result.success
            ? (result.data.error ?? "Authentication failed. Try again.")
            : "Couldn’t sign in. Try again.",
        );
        setLoading(false);
        pending.current = false;
        return;
      }
      // A full navigation discards redirects prefetched before the session cookie was set.
      window.location.assign(new URL(from, window.location.origin).href);
    } catch {
      setError("Couldn’t connect. Please try again.");
      setLoading(false);
      pending.current = false;
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={loading}>
      <div className="admin-field">
        <label className="admin-field-label" htmlFor="password">
          Password
        </label>
        <input
          className="admin-input"
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "login-error" : undefined}
          placeholder="Your admin password"
        />
      </div>
      {error ? (
        <p
          className="admin-feedback admin-feedback--error"
          id="login-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="admin-button admin-button--primary admin-login-submit"
        disabled={loading}
      >
        {loading ? "Authenticating…" : "Login"}
      </button>
    </form>
  );
}

/** Presents the same identity as the portfolio with a focused sign-in form. */
export default function AdminLoginPage() {
  return (
    <main className="admin-login-layout">
      <section className="admin-login-brand">
        <Link href="/" aria-label="Daly portfolio">
          <BrandLogo />
        </Link>
        <p className="admin-login-statement">
          Your work.
          <br />
          Every detail.
        </p>
        <p>Projects, experiences, and the next chapter of your portfolio.</p>
        <Link href="/" className="admin-text-link">
          Back to portfolio ↗
        </Link>
      </section>
      <section
        className="admin-login-form"
        aria-labelledby="admin-login-heading"
      >
        <h1 id="admin-login-heading">Admin panel</h1>
        <p className="admin-page-copy">Sign in to manage your portfolio.</p>
        <Suspense
          fallback={
            <p className="admin-muted" role="status">
              Loading sign-in…
            </p>
          }
        >
          <LoginForm />
        </Suspense>
        <p className="admin-login-note">Your changes publish through GitHub.</p>
      </section>
    </main>
  );
}
