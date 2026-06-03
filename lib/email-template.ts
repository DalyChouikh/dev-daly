import type { ContactForm } from "./types";

/**
 * Generates a beautiful HTML email template matching the Stardust Professional design system.
 * Uses inline styles and table-based layout for maximum email client compatibility.
 */
export function buildContactEmailHtml(form: ContactForm): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000";
  const portfolioName = "Mohamed Ali Chouikh";
  const portfolioTitle = "Software & AI Engineer";
  const accentColor = "#4be277";
  const bgColor = "#0a0a0f";
  const surfaceColor = "#12121a";
  const borderColor = "rgba(255,255,255,0.06)";
  const textColor = "#e8e8ed";
  const mutedColor = "#9ca3af";
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Contact</title>
</head>
<body style="margin:0;padding:0;background-color:${bgColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${bgColor};">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          
          <!-- Header / Branding -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,${accentColor}22,${accentColor}0a);border:1px solid ${accentColor}33;text-align:center;vertical-align:middle;">
                    <span style="font-size:22px;line-height:48px;">✦</span>
                  </td>
                  <td style="padding-left:16px;vertical-align:middle;">
                    <p style="margin:0;font-size:18px;font-weight:700;color:${textColor};letter-spacing:-0.02em;">${portfolioName}</p>
                    <p style="margin:4px 0 0 0;font-size:13px;color:${mutedColor};">${portfolioTitle}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Green Accent Bar -->
          <tr>
            <td style="height:3px;background:linear-gradient(90deg,${accentColor},${accentColor}66);border-radius:2px;"></td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:28px 0 8px 0;">
              <p style="margin:0;font-size:13px;font-weight:600;color:${accentColor};text-transform:uppercase;letter-spacing:0.08em;">New Message</p>
              <h1 style="margin:8px 0 0 0;font-size:24px;font-weight:700;color:${textColor};letter-spacing:-0.01em;">Portfolio Contact</h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:${mutedColor};">Received on ${timestamp}</p>
            </td>
          </tr>

          <!-- Sender Info Card -->
          <tr>
            <td style="padding:16px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${surfaceColor};border:1px solid ${borderColor};border-radius:12px;">
                <tr>
                  <td style="padding:24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      
                      <!-- Name Row -->
                      <tr>
                        <td style="padding-bottom:16px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width:32px;vertical-align:top;">
                                <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,${accentColor}18,${accentColor}08);border:1px solid ${accentColor}22;text-align:center;line-height:32px;">
                                  <span style="font-size:14px;">👤</span>
                                </div>
                              </td>
                              <td style="padding-left:14px;vertical-align:top;">
                                <p style="margin:0;font-size:11px;font-weight:600;color:${mutedColor};text-transform:uppercase;letter-spacing:0.06em;">From</p>
                                <p style="margin:4px 0 0 0;font-size:16px;font-weight:600;color:${textColor};">${escapeHtml(form.name)}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Email Row -->
                      <tr>
                        <td>
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width:32px;vertical-align:top;">
                                <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,${accentColor}18,${accentColor}08);border:1px solid ${accentColor}22;text-align:center;line-height:32px;">
                                  <span style="font-size:14px;">✉️</span>
                                </div>
                              </td>
                              <td style="padding-left:14px;vertical-align:top;">
                                <p style="margin:0;font-size:11px;font-weight:600;color:${mutedColor};text-transform:uppercase;letter-spacing:0.06em;">Email</p>
                                <p style="margin:4px 0 0 0;font-size:15px;color:${accentColor};">
                                  <a href="mailto:${escapeHtml(form.email)}" style="color:${accentColor};text-decoration:none;">${escapeHtml(form.email)}</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Card -->
          <tr>
            <td style="padding:8px 0 16px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${surfaceColor};border:1px solid ${borderColor};border-radius:12px;">
                <tr>
                  <td style="padding:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="width:32px;vertical-align:top;">
                          <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,${accentColor}18,${accentColor}08);border:1px solid ${accentColor}22;text-align:center;line-height:32px;">
                            <span style="font-size:14px;">💬</span>
                          </div>
                        </td>
                        <td style="padding-left:14px;vertical-align:top;">
                          <p style="margin:0;font-size:11px;font-weight:600;color:${mutedColor};text-transform:uppercase;letter-spacing:0.06em;">Message</p>
                        </td>
                      </tr>
                    </table>
                    <p style="margin:16px 0 0 0;font-size:15px;line-height:1.7;color:${textColor};white-space:pre-wrap;">${escapeHtml(form.message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:8px 0 24px 0;text-align:center;">
              <a href="mailto:${escapeHtml(form.email)}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,${accentColor},${accentColor}cc);color:#0a0a0f;font-size:14px;font-weight:700;text-decoration:none;border-radius:9999px;letter-spacing:-0.01em;">
                Reply to ${escapeHtml(form.name).split(" ")[0]}
              </a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:16px 0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="height:1px;background:${borderColor};"></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:8px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:13px;color:${mutedColor};">
                Sent via <a href="${siteUrl}" style="color:${accentColor};text-decoration:none;font-weight:600;">${portfolioName}</a> portfolio contact form
              </p>
              <p style="margin:8px 0 0 0;font-size:12px;color:${mutedColor};">
                This is an automated notification. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates a plain text fallback for email clients that don't support HTML.
 */
export function buildContactEmailText(form: ContactForm): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000";
  const timestamp = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `New Portfolio Contact
=====================

Received: ${timestamp}

From: ${form.name}
Email: ${form.email}

Message:
--------
${form.message}

-----------------------
Sent via ${siteUrl} portfolio contact form.
Reply to: ${form.email}
`;
}

/** Escapes HTML special characters to prevent XSS in email content. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}