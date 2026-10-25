import {
  afterEach,
  beforeEach,
  describe,
  expect,
  mock,
  setSystemTime,
  spyOn,
  test,
} from "bun:test";
import nodemailer, { type SendMailOptions } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { formatISO } from "date-fns";
import {
  buildContactEmailHtml,
  buildContactEmailText,
} from "@/lib/email-template";
import { sendContactEmail } from "@/lib/mail";
import type { ContactForm } from "@/lib/types";

interface ResendPayload {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
  reply_to: string;
}

const environment = process.env;
const receivedAt = new Date("2026-10-24T14:32:09Z");
const form: ContactForm = {
  name: "Amira Ben Salem",
  email: "amira+project@example.test",
  message: "Hello Daly,\n\nI would love to discuss a project with you.",
};
let smtpPayloads: SendMailOptions[];
let resendPayloads: ResendPayload[];
let smtpError: Error | null;
let resendResponse: () => Response;

beforeEach(() => {
  process.env = {
    NODE_ENV: "production",
    NEXT_PUBLIC_APP_URL: "https://portfolio.example.test",
    CONTACT_EMAIL: "owner@example.test",
    GMAIL_USER: "portfolio@example.test",
    GMAIL_APP_PASSWORD: "test-only-gmail-password",
    RESEND_API_KEY: "re_test_only_not_a_real_key",
  };
  setSystemTime(receivedAt);
  smtpPayloads = [];
  resendPayloads = [];
  smtpError = null;
  resendResponse = () => Response.json({ id: "resend-intercepted" });

  // Constructing a transport does not connect. Intercept sendMail before sending.
  const transport = nodemailer.createTransport({
    host: "never-connect.invalid",
  });
  spyOn(transport, "sendMail").mockImplementation(
    async (
      payload: SendMailOptions,
    ): Promise<SMTPTransport.SentMessageInfo> => {
      smtpPayloads.push(payload);
      if (smtpError) throw smtpError;
      return {
        messageId: "smtp-intercepted",
        envelope: {
          from: "portfolio@example.test",
          to: ["owner@example.test"],
        },
        accepted: ["owner@example.test"],
        rejected: [],
        pending: [],
        response: "250 queued locally",
        envelopeTime: 0,
        messageTime: 0,
        messageSize: 0,
      };
    },
  );
  spyOn(nodemailer, "createTransport").mockReturnValue(transport);
  spyOn(globalThis, "fetch").mockImplementation(
    Object.assign(
      (_input: string | URL | Request, init?: RequestInit) => {
        if (typeof init?.body !== "string")
          throw new Error("Expected a serialized Resend payload");
        resendPayloads.push(JSON.parse(init.body) as ResendPayload);
        return Promise.resolve(resendResponse());
      },
      { preconnect: () => {} },
    ),
  );
});

afterEach(() => {
  mock.restore();
  process.env = environment;
  setSystemTime();
});

describe("contact provider payloads", () => {
  test.each(["mailhog", "gmail", "resend"] as const)(
    "%s sends both alternatives to the owner with the visitor as Reply-To",
    async (provider) => {
      process.env.EMAIL_PROVIDER = provider;
      const result = await sendContactEmail(form);
      const payload =
        provider === "resend" ? resendPayloads[0] : smtpPayloads[0];
      expect(result.id).toBe(
        provider === "resend" ? "resend-intercepted" : "smtp-intercepted",
      );
      expect(payload).toBeDefined();
      expect(payload.subject).toBe(`Portfolio Contact: ${form.name}`);
      expect(payload.text).toBe(buildContactEmailText(form, { receivedAt }));
      expect(payload.html).toBe(buildContactEmailHtml(form, { receivedAt }));
      expect(payload.text).toContain(form.message);
      expect(payload.html).toContain("#38450f");
      if (provider === "resend") {
        expect(resendPayloads[0].to).toEqual(["owner@example.test"]);
        expect(resendPayloads[0].reply_to).toBe(form.email);
        expect(resendPayloads[0].from).toBe("Portfolio <contact@dev-daly.tn>");
        expect(smtpPayloads).toHaveLength(0);
      } else {
        expect(smtpPayloads[0].to).toBe("owner@example.test");
        expect(smtpPayloads[0].replyTo).toBe(form.email);
        expect(resendPayloads).toHaveLength(0);
      }
    },
  );

  test("all providers receive identical subject, HTML, plain text and reply address", async () => {
    for (const provider of ["mailhog", "gmail", "resend"]) {
      process.env.EMAIL_PROVIDER = provider;
      await sendContactEmail(form);
    }
    expect(smtpPayloads[0].subject).toBe(resendPayloads[0].subject);
    expect(smtpPayloads[1].subject).toBe(resendPayloads[0].subject);
    expect(smtpPayloads[0].html).toBe(resendPayloads[0].html);
    expect(smtpPayloads[1].html).toBe(resendPayloads[0].html);
    expect(smtpPayloads[0].text).toBe(resendPayloads[0].text);
    expect(smtpPayloads[1].text).toBe(resendPayloads[0].text);
    expect(smtpPayloads[0].replyTo).toBe(resendPayloads[0].reply_to);
    expect(smtpPayloads[1].replyTo).toBe(resendPayloads[0].reply_to);
  });

  test.each(["mailhog", "gmail", "resend"] as const)(
    "%s shares one receipt time even when the clock advances while rendering",
    async (provider) => {
      process.env.EMAIL_PROVIDER = provider;
      const submission: ContactForm = {
        ...form,
        get message() {
          setSystemTime(new Date("2026-10-24T14:33:10Z"));
          return form.message;
        },
      };
      await sendContactEmail(submission);
      const payload =
        provider === "resend" ? resendPayloads[0] : smtpPayloads[0];
      expect(payload.text).toContain(formatISO(receivedAt));
      expect(payload.html).toContain(formatISO(receivedAt));
    },
  );

  test("MailHog uses a structured sender address so quoted display names remain a single sender", async () => {
    const submission = { ...form, name: 'Amira "AJ", Engineering' };
    await sendContactEmail(submission);
    expect(smtpPayloads[0].from).toEqual({
      name: submission.name,
      address: submission.email,
    });
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "localhost",
        port: 1025,
        secure: false,
      }),
    );
  });

  test("Gmail retains the authenticated sender and transport settings", async () => {
    process.env.EMAIL_PROVIDER = "gmail";
    await sendContactEmail(form);
    expect(smtpPayloads[0].from).toBe("portfolio@example.test");
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: "portfolio@example.test",
        pass: "test-only-gmail-password",
      },
    });
  });

  test("MailHog retains configured host, port and optional credentials", async () => {
    Object.assign(process.env, {
      MAILHOG_HOST: "mailhog.internal",
      MAILHOG_PORT: "2025",
      MAILHOG_USER: "local-user",
      MAILHOG_PASS: "test-only-local-password",
    });
    await sendContactEmail(form);
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "mailhog.internal",
        port: 2025,
        secure: false,
        auth: { user: "local-user", pass: "test-only-local-password" },
      }),
    );
  });
});

describe("provider failures", () => {
  test.each(["mailhog", "gmail"])(
    "%s preserves SMTP delivery errors",
    async (provider) => {
      process.env.EMAIL_PROVIDER = provider;
      smtpError = new Error("SMTP fixture rejected delivery");
      await expect(sendContactEmail(form)).rejects.toThrow(
        "SMTP fixture rejected delivery",
      );
      expect(resendPayloads).toHaveLength(0);
    },
  );

  test("Resend rejects provider API errors", async () => {
    process.env.EMAIL_PROVIDER = "resend";
    resendResponse = () =>
      Response.json(
        { name: "validation_error", message: "Fixture domain not verified" },
        { status: 422 },
      );
    await expect(sendContactEmail(form)).rejects.toThrow(
      "Resend error: Fixture domain not verified",
    );
    expect(smtpPayloads).toHaveLength(0);
  });

  test("Resend without a configured key stops before an external request", async () => {
    process.env.EMAIL_PROVIDER = "resend";
    delete process.env.RESEND_API_KEY;
    await expect(sendContactEmail(form)).rejects.toThrow(
      "RESEND_API_KEY environment variable is not set",
    );
    expect(resendPayloads).toHaveLength(0);
    expect(smtpPayloads).toHaveLength(0);
  });

  test("an unsupported provider stops before opening a transport", async () => {
    process.env.EMAIL_PROVIDER = "invalid-test-provider";
    await expect(sendContactEmail(form)).rejects.toThrow(
      "Unknown EMAIL_PROVIDER",
    );
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
    expect(resendPayloads).toHaveLength(0);
  });
});
