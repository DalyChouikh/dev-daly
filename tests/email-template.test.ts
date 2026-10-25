import {
  afterEach,
  beforeEach,
  describe,
  expect,
  setSystemTime,
  test,
} from "bun:test";
import { formatISO } from "date-fns";
import profile from "@/data/profile.json";
import {
  buildContactEmailHtml,
  buildContactEmailText,
} from "@/lib/email-template";
import type { ContactForm } from "@/lib/types";

const environment = process.env;
const originalIdentity = {
  name: profile.name,
  displayName: profile.displayName,
  title: profile.title,
};
const receivedAt = new Date("2026-10-24T14:32:09Z");
const form: ContactForm = {
  name: "Amira Ben Salem",
  email: "amira+project@example.test",
  message: "Hello Daly,\n\nI would love to discuss a project with you.",
};

beforeEach(() => {
  process.env = {
    NODE_ENV: "test",
    NEXT_PUBLIC_APP_URL: "https://portfolio.example.test",
  };
  setSystemTime(receivedAt);
});

afterEach(() => {
  Object.assign(profile, originalIdentity);
  process.env = environment;
  setSystemTime();
});

describe("contact email identity and content", () => {
  test("uses the Olive identity with email-compatible layout and readable image fallbacks", () => {
    const html = buildContactEmailHtml(form);
    expect(html).toContain("#ecebe7");
    expect(html).toContain("#38450f");
    expect(html).toContain('role="presentation"');
    expect(html).toContain(profile.displayName || profile.name);
    expect(html).toContain("New contact message");
    expect(html).toContain(
      "https://portfolio.example.test/brand/png/daly-wordmark-2040.png",
    );
    expect(html).toContain('alt="Daly"');
    expect(html).not.toMatch(/<svg|@font-face|linear-gradient|<script/i);
  });

  test("uses escaped profile identity and title while preserving original plain text", () => {
    Object.assign(profile, {
      displayName: 'Daly <Studio> & "Team"',
      title: "Software & <AI> Engineer",
    });
    const html = buildContactEmailHtml(form);
    const text = buildContactEmailText(form);
    expect(html).toContain("Daly &lt;Studio&gt; &amp; &quot;Team&quot;");
    expect(html).toContain("Software &amp; &lt;AI&gt; Engineer");
    expect(html).not.toContain("<Studio>");
    expect(text).toContain(profile.displayName);
    expect(text).toContain(profile.title);
  });

  test("uses the full profile name when no display name is set", () => {
    Object.assign(profile, { displayName: "", name: "Full & Formal Name" });
    expect(buildContactEmailHtml(form)).toContain("Full &amp; Formal Name");
    expect(buildContactEmailText(form)).toContain("Full & Formal Name");
  });

  test("keeps section labels readable without uppercase tracked captions", () => {
    const html = buildContactEmailHtml(form);
    expect(html).not.toContain("Portfolio / Contact");
    expect(html).not.toContain("text-transform:uppercase");
    expect(html).not.toContain("letter-spacing:1px");
    expect(html).not.toContain("font-size:11px");
  });

  test("escapes the complete submitted name, email and message", () => {
    const html = buildContactEmailHtml({
      name: "<img src=x onerror=\"alert(1)\"> & 'A'",
      email: 'a" onclick="alert(1)@example.test',
      message: "<script>alert(\"x\")</script> & 'private'",
    });
    expect(html).toContain(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; &#039;A&#039;",
    );
    expect(html).toContain("a&quot; onclick=&quot;alert(1)@example.test");
    expect(html).toContain(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#039;private&#039;",
    );
    expect(html).not.toMatch(/<script|<img src=x|href="mailto:a"/i);
  });

  test("preserves every line and long unbroken message without a fixed-width content table", () => {
    const longText = "word".repeat(1200);
    const html = buildContactEmailHtml({
      ...form,
      message: `First\r\n\r\n${longText}\rLast`,
    });
    expect(html).toContain(`First<br><br>${longText}<br>Last`);
    expect(html).toContain("overflow-wrap:anywhere");
    expect(html).toContain("word-break:break-word");
    expect(html).not.toMatch(/<table[^>]+width="[0-9]+"/i);
  });

  test("accepts a fixed received time and makes its timezone explicit in both alternatives", () => {
    const options = { receivedAt: new Date("2026-03-29T01:59:59Z") };
    const timestamp = formatISO(options.receivedAt);
    expect(buildContactEmailHtml(form, options)).toContain(timestamp);
    expect(buildContactEmailText(form, options)).toContain(timestamp);
  });

  test("plain text includes full original content, identity and the same reply instructions", () => {
    const text = buildContactEmailText(form);
    expect(text).toContain(profile.displayName || profile.name);
    expect(text).toContain("New contact message");
    expect(text).toContain(`From: ${form.name}`);
    expect(text).toContain(`Email: ${form.email}`);
    expect(text).toContain(form.message);
    expect(text).toContain(formatISO(receivedAt));
    expect(text).toContain(
      `Reply directly to this email to reach ${form.email}.`,
    );
    expect(text).not.toContain("&amp;");
    expect(text).not.toContain("<table");
  });

  test("encodes reply addresses so their punctuation cannot add mailto headers", () => {
    const html = buildContactEmailHtml({
      ...form,
      email: "sender?bcc=other@example.test",
    });
    expect(html).toContain('href="mailto:sender%3Fbcc%3Dother%40example.test"');
    expect(html).not.toContain('href="mailto:sender?bcc=');
    expect(html).toContain("Reply directly to this email");
    expect(html).not.toContain("do not reply");
  });

  test("keeps Unicode, punctuation, and the final character of every submitted field", () => {
    const submission = {
      name: `أميرة & Amira ${"a".repeat(200)}終`,
      email: "amira+project&team@example.test",
      message: "Bonjour — مرحبًا 👋\n\nA & B < C.\nFinal line.終",
    };
    const html = buildContactEmailHtml(submission);
    const text = buildContactEmailText(submission);
    expect(html).toContain(`أميرة &amp; Amira ${"a".repeat(200)}終`);
    expect(html).toContain("amira+project&amp;team@example.test");
    expect(html).toContain(
      "Bonjour — مرحبًا 👋<br><br>A &amp; B &lt; C.<br>Final line.終",
    );
    expect(text).toContain(submission.name);
    expect(text).toContain(submission.email);
    expect(text).toContain(submission.message);
  });
});

describe("configured portfolio URL", () => {
  test("normalizes the configured URL to its origin for portfolio and logo links", () => {
    process.env.NEXT_PUBLIC_APP_URL =
      "https://portfolio.example.test/path?source=email#contact";
    const html = buildContactEmailHtml(form);
    expect(html).toContain('href="https://portfolio.example.test"');
    expect(html).toContain(
      'src="https://portfolio.example.test/brand/png/daly-wordmark-2040.png"',
    );
    expect(html).not.toContain("source=email");
    expect(buildContactEmailText(form)).toContain(
      "https://portfolio.example.test",
    );
  });

  test.each([
    'https://portfolio.example.test/" onmouseover="alert(1)',
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "//portfolio.example.test",
    "https://user:password@portfolio.example.test",
    "https://localhost:3000",
    "https://preview.localhost",
    "https://localhost.",
    "https://127.0.0.1:3000",
    "https://[::1]:3000",
    "https://192.168.1.10",
    "http://portfolio.example.test",
    "http://127.0.0.1:3000",
    "https://portfolio.example.test/\nunsafe",
    "https://portfolio.example.test/\\unsafe",
    "not a url",
    "",
  ])(
    "omits unsafe or local configured URL %s without losing the message",
    (siteUrl) => {
      Object.assign(process.env, {
        NODE_ENV: "production",
        NEXT_PUBLIC_APP_URL: siteUrl,
      });
      const html = buildContactEmailHtml(form);
      const text = buildContactEmailText(form);
      expect(html).not.toMatch(
        /(?:href|src)="(?:https?:|javascript:|data:|\/\/)/i,
      );
      expect(html).not.toContain('onmouseover="');
      expect(html).toContain(profile.displayName || profile.name);
      expect(html).toContain("I would love to discuss a project with you.");
      expect(text).not.toContain("localhost");
      expect(text).not.toContain("password");
    },
  );

  test("does not invent a localhost origin when configuration is absent", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    expect(buildContactEmailHtml(form)).not.toContain("localhost");
    expect(buildContactEmailText(form)).not.toContain("localhost");
  });

  test("an explicit renderer origin supports hosted previews without changing environment", () => {
    const options = {
      siteUrl: "https://preview.example.test/sample-email",
      receivedAt,
    };
    expect(buildContactEmailHtml(form, options)).toContain(
      'href="https://preview.example.test"',
    );
    expect(buildContactEmailText(form, options)).toContain(
      "https://preview.example.test",
    );
    expect(buildContactEmailHtml(form, options)).not.toContain(
      "https://portfolio.example.test",
    );
  });
});
