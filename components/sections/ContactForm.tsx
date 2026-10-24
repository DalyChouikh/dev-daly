"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { z } from "zod";

const ContactResponseSchema = z.object({ success: z.boolean() });
type ContactStatus = "idle" | "sending" | "success" | "error";

/** Sends through the existing contact service and preserves drafts on failure. */
export function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>("idle");
  const pending = useRef<AbortController | null>(null);

  useEffect(() => () => pending.current?.abort(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const controller = new AbortController();
    pending.current = controller;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.get("name"),
          email: values.get("email"),
          message: values.get("message"),
        }),
        signal: controller.signal,
      });
      const result = ContactResponseSchema.safeParse(await response.json());
      if (!response.ok || !result.success || !result.data.success)
        throw new Error("Contact delivery failed");
      form.reset();
      setStatus("success");
    } catch {
      if (!controller.signal.aborted) setStatus("error");
    } finally {
      if (pending.current === controller) pending.current = null;
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={handleSubmit}
      aria-busy={status === "sending"}
    >
      <fieldset disabled={status === "sending"}>
        <div className="field">
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            placeholder="Alex Morgan"
          />
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="alex@company.com"
          />
        </div>
        <div className="field">
          <label htmlFor="contact-message">What do you have in mind?</label>
          <textarea
            id="contact-message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder="A little about the opportunity or project…"
          />
        </div>
        <button className="button send-button" type="submit">
          {status === "sending" ? "Sending…" : "Send message"}
          <span aria-hidden="true">↗</span>
        </button>
      </fieldset>
      {status === "error" ? (
        <p className="form-status form-error" role="alert">
          Your message couldn’t be sent. Please try again or email me directly.
        </p>
      ) : (
        <p className="form-status" role="status" aria-live="polite">
          {status === "success"
            ? "Your message has been sent. Thanks for reaching out."
            : ""}
        </p>
      )}
    </form>
  );
}
