import nodemailer from "nodemailer";
import { Resend } from "resend";
import type { ContactForm } from "./types";

/** Email provider type — switch via EMAIL_PROVIDER env var */
export type EmailProvider = "mailhog" | "resend" | "gmail";

/** Gets the configured email provider from env */
function getProvider(): EmailProvider {
  const provider = process.env.EMAIL_PROVIDER ?? "mailhog";
  if (!["mailhog", "resend", "gmail"].includes(provider)) {
    throw new Error(`Unknown EMAIL_PROVIDER: ${provider}. Use mailhog, resend, or gmail.`);
  }
  return provider as EmailProvider;
}

/** MailHog client for local development — sends via SMTP to MailHog's catch-all server */
async function sendViaMailHog(form: ContactForm): Promise<{ id: string }> {
  const host = process.env.MAILHOG_HOST ?? "localhost";
  const port = Number(process.env.MAILHOG_PORT ?? "1025");

  const user = process.env.MAILHOG_USER;
  const pass = process.env.MAILHOG_PASS;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: false, // MailHog does not use TLS
    ...(user && pass ? { auth: { user, pass } } : {}),
    tls: {
      rejectUnauthorized: false,
    },
  });

  const result = await transporter.sendMail({
    from: `"${form.name}" <${form.email}>`,
    to: process.env.CONTACT_EMAIL ?? "chouikhdaly215@gmail.com",
    subject: `Portfolio Contact: ${form.name}`,
    text: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    replyTo: form.email,
  });

  return { id: result.messageId ?? `mailhog-${Date.now()}` };
}

/** Resend client for production */
async function sendViaResend(form: ContactForm): Promise<{ id: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: [process.env.CONTACT_EMAIL ?? "chouikhdaly215@gmail.com"],
    subject: `Portfolio Contact: ${form.name}`,
    text: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    replyTo: form.email,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return { id: data?.id ?? `resend-${Date.now()}` };
}

/** Gmail SMTP via nodemailer */
async function sendViaGmail(form: ContactForm): Promise<{ id: string }> {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const result = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.CONTACT_EMAIL ?? "chouikhdaly215@gmail.com",
    subject: `Portfolio Contact: ${form.name}`,
    text: `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    replyTo: form.email,
  });

  return { id: result.messageId ?? `gmail-${Date.now()}` };
}

/**
 * Sends a contact form email using the configured provider.
 * Provider is selected via EMAIL_PROVIDER env var (default: mailhog).
 */
export async function sendContactEmail(form: ContactForm): Promise<{ id: string }> {
  const provider = getProvider();

  switch (provider) {
    case "mailhog":
      return sendViaMailHog(form);
    case "resend":
      return sendViaResend(form);
    case "gmail":
      return sendViaGmail(form);
  }
}