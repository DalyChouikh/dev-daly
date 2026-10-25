import { formatISO } from "date-fns";
import profileData from "@/data/profile.json";
import type { ContactForm, Profile } from "./types";

const profile: Pick<Profile, "name" | "displayName" | "title"> = profileData;

/** Optional, shared rendering context for a delivered email or a static specimen. */
export interface ContactEmailOptions {
  receivedAt?: Date;
  siteUrl?: string;
}

/** Escapes submitted text and attribute values without shortening their content. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Returns a public HTTPS origin; malformed, credentialed and local URLs are omitted. */
function getPortfolioOrigin(value: string | undefined): string | null {
  if (!value || /[\u0000-\u0020\u007f<>"'\\]/u.test(value)) return null;

  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/\.$/u, "").toLowerCase();
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (
      !hostname.includes(".") ||
      /\.(localhost|local|internal)$/u.test(hostname)
    )
      return null;
    // Numeric hosts and IP literals are not public portfolio domain names.
    if (/^[\d.]+$/u.test(hostname) || hostname.includes(":")) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** Builds the Olive notification with inline, fluid tables and a visible text identity. */
export function buildContactEmailHtml(
  form: ContactForm,
  options: ContactEmailOptions = {},
): string {
  const siteUrl = getPortfolioOrigin(
    options.siteUrl ?? process.env.NEXT_PUBLIC_APP_URL,
  );
  const timestamp = formatISO(options.receivedAt ?? new Date());
  const identity = escapeHtml(profile.displayName || profile.name);
  const title = escapeHtml(profile.title);
  const name = escapeHtml(form.name);
  const email = escapeHtml(form.email);
  const replyUrl = escapeHtml(`mailto:${encodeURIComponent(form.email)}`);
  const message = escapeHtml(form.message).replace(/\r\n|\r|\n/g, "<br>");
  const brand = siteUrl
    ? `<img src="${escapeHtml(siteUrl)}/brand/png/daly-wordmark-2040.png" width="136" height="58" alt="Daly" style="display:block;width:136px;max-width:100%;height:auto;border:0;color:#38450f;font-size:28px;font-weight:700;">`
    : "";
  const portfolio = siteUrl
    ? `<a href="${escapeHtml(siteUrl)}" style="color:#38450f;text-decoration:underline;">Visit portfolio</a>`
    : "Portfolio contact form";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>New contact message — ${identity}</title>
</head>
<body bgcolor="#ecebe7" style="margin:0;padding:0;background-color:#ecebe7;color:#38450f;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ecebe7" style="width:100%;background-color:#ecebe7;table-layout:fixed;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;table-layout:fixed;color:#38450f;">
          <tr>
            <td style="padding:0 0 24px;border-bottom:2px solid #38450f;">
              ${brand}
              <p style="margin:12px 0 0;font-size:15px;line-height:22px;font-weight:700;color:#38450f;overflow-wrap:anywhere;word-break:break-word;">${identity}</p>
              <p style="margin:2px 0 0;font-size:13px;line-height:20px;color:#61674c;overflow-wrap:anywhere;word-break:break-word;">${title}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 0 24px;">
              <h1 style="margin:0;font-size:32px;line-height:36px;letter-spacing:-1px;font-weight:700;color:#38450f;">New contact message</h1>
              <p style="margin:12px 0 0;font-size:13px;line-height:21px;color:#61674c;overflow-wrap:anywhere;word-break:break-word;">Received: ${timestamp}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0 24px;border-top:1px solid #c8cbbd;">
              <p style="margin:0 0 6px;font-size:13px;line-height:21px;font-weight:700;color:#61674c;">From</p>
              <p style="margin:0;font-size:21px;line-height:28px;font-weight:700;color:#38450f;overflow-wrap:anywhere;word-break:break-word;">${name}</p>
              <p style="margin:5px 0 0;font-size:15px;line-height:24px;overflow-wrap:anywhere;word-break:break-word;"><a href="${replyUrl}" style="color:#38450f;text-decoration:underline;">${email}</a></p>
            </td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f5f2" style="width:100%;background-color:#f6f5f2;border:1px solid #c8cbbd;table-layout:fixed;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 16px;font-size:13px;line-height:21px;font-weight:700;color:#61674c;">Message</p>
                    <p style="margin:0;font-size:16px;line-height:27px;color:#38450f;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;">${message}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 0 28px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td bgcolor="#38450f" style="background-color:#38450f;border:1px solid #38450f;mso-padding-alt:14px 22px;">
                    <a href="${replyUrl}" style="display:inline-block;padding:14px 22px;font-size:15px;line-height:20px;font-weight:700;text-decoration:none;color:#ecebe7;">Reply to message</a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-size:13px;line-height:21px;color:#61674c;overflow-wrap:anywhere;word-break:break-word;">Reply directly to this email to reach ${email}.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 0 0;border-top:1px solid #c8cbbd;">
              <p style="margin:0;font-size:13px;line-height:21px;font-weight:700;color:#38450f;overflow-wrap:anywhere;word-break:break-word;">${identity}</p>
              <p style="margin:4px 0 0;font-size:13px;line-height:21px;color:#61674c;">${portfolio}</p>
              <p style="margin:12px 0 0;font-size:13px;line-height:21px;color:#61674c;">An automated notification from the portfolio contact form.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Builds the plain-text alternative with the same receipt time and reply instructions. */
export function buildContactEmailText(
  form: ContactForm,
  options: ContactEmailOptions = {},
): string {
  const siteUrl = getPortfolioOrigin(
    options.siteUrl ?? process.env.NEXT_PUBLIC_APP_URL,
  );
  const timestamp = formatISO(options.receivedAt ?? new Date());

  return `${profile.displayName || profile.name}
${profile.title}

New contact message
===================

Received: ${timestamp}

From: ${form.name}
Email: ${form.email}

Message:
--------
${form.message}

Reply directly to this email to reach ${form.email}.

-------------------
${siteUrl ? `Portfolio: ${siteUrl}\n` : ""}An automated notification from the portfolio contact form.
`;
}
