import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,          // e.g. smtp.gmail.com (if using app password)
  port: Number(process.env.SMTP_PORT),
  secure: false,                        // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Simple helper
export async function sendVerificationEmail(to: string, code: string) {
  const appName = process.env.APP_NAME || "HMIDI-App";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6">
      <h2>${appName} — Email verification</h2>
      <p>Your verification code is :</p>
      <div style="font-size:24px; font-weight:bold; letter-spacing:4px">${code}</div>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;

  await mailer.sendMail({
    from,
    to,
    subject: `${appName} — Verification code`,
    html
  });
}
