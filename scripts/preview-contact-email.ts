import { mkdir, writeFile } from "node:fs/promises";
import { parseISO } from "date-fns";
import {
  buildContactEmailHtml,
  buildContactEmailText,
} from "../lib/email-template";

const sample = {
  name: "Amira Ben Salem",
  email: "amira+project@example.test",
  message:
    "Hello Daly,\n\nI came across your portfolio and would love to discuss a project with you. We are building a small tool to help our team explore research documents.\n\nAre you available for a conversation next week?\n\nBest,\nAmira",
};
const options = {
  receivedAt: parseISO("2026-10-25T09:15:00+01:00"),
  siteUrl: "https://www.dev-daly.tn",
};
const directory = new URL("../public/preview/", import.meta.url);
const notice =
  '<div style="padding:12px 16px;text-align:center;background:#38450f;color:#ecebe7;font:13px/1.5 Arial,sans-serif;">Sample notification · Fictional sender and message · <a href="contact-email.txt" style="color:inherit;text-decoration:underline;">Plain-text version</a></div>';
// A relative logo lets the specimen show the same asset before production promotion.
const html = buildContactEmailHtml(sample, options)
  .replace(
    'src="https://www.dev-daly.tn/brand/png/daly-wordmark-2040.png"',
    'src="/brand/png/daly-wordmark-2040.png"',
  )
  .replace(/(<body\b[^>]*>)/u, "$1" + notice);
await mkdir(directory, { recursive: true });
await writeFile(new URL("contact-email.html", directory), html);
await writeFile(
  new URL("contact-email.txt", directory),
  "SAMPLE NOTIFICATION — fictional content\n\n" +
    buildContactEmailText(sample, options),
);
process.stdout.write(
  "Email specimens written to public/preview/contact-email.html and .txt. No message was sent.\n",
);
