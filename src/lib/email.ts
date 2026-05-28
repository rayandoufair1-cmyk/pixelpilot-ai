import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL || "hello@pixelpilot.ai";

// Only init Resend if API key is present — prevents crash on missing config
function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY not set — emails will not be sent");
    return null;
  }
  return new Resend(key);
}

async function safeSend(payload: Parameters<Resend["emails"]["send"]>[0]) {
  const resend = getResend();
  if (!resend) return; // silently skip if not configured
  try {
    await resend.emails.send(payload);
  } catch (err) {
    // Log but never throw — email failure must never break the main flow
    console.error("[email] send failed:", err);
  }
}

export async function sendWelcomeEmail(
  clientEmail: string,
  clientName: string,
  projectId: string
) {
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://pixelpilot-ai-lac.vercel.app"}/portal/dashboard`;
  await safeSend({
    from: FROM,
    to: clientEmail,
    subject: "Welcome to PixelPilot AI — Your project is starting! 🚀",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 900; color: #0f172a;">✦ PixelPilot <span style="color: #7c3aed;">AI</span></span>
        </div>
        <h1 style="color: #0f172a; font-size: 28px; font-weight: 900; margin-bottom: 8px;">Welcome, ${clientName}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
          Payment confirmed. Our AI is already reviewing your intake and will begin building your website shortly.
          You'll receive another email the moment your first draft is ready — usually within <strong>18–24 hours</strong>.
        </p>
        <a href="${portalUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 32px;">
          View Your Portal →
        </a>
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          Questions? Just reply to this email — a human reads every message.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px;">PixelPilot AI · Automated web design, live in 24 hours</p>
      </div>
    `,
  });
}

export async function sendDesignReadyEmail(
  clientEmail: string,
  clientName: string,
  projectId: string,
  previewUrl: string
) {
  await safeSend({
    from: FROM,
    to: clientEmail,
    subject: "Your website design is ready! 🎉",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 900; color: #0f172a;">✦ PixelPilot <span style="color: #7c3aed;">AI</span></span>
        </div>
        <h1 style="color: #0f172a; font-size: 28px; font-weight: 900; margin-bottom: 8px;">Your design is ready, ${clientName}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
          Our AI has finished your custom website. Log in to preview it, request any changes via chat, or approve it to go live.
        </p>
        <a href="${previewUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 32px;">
          Preview Your Website →
        </a>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.6;">
            <strong>What's next?</strong><br>
            1. Preview your site in the portal<br>
            2. Request changes in the AI chat (plain English, no forms)<br>
            3. Click Approve → Deploy when you're happy
          </p>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px;">PixelPilot AI · Automated web design, live in 24 hours</p>
      </div>
    `,
  });
}

export async function sendGoLiveEmail(
  clientEmail: string,
  clientName: string,
  liveUrl: string
) {
  await safeSend({
    from: FROM,
    to: clientEmail,
    subject: "Your website is LIVE! 🚀",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 24px; font-weight: 900; color: #0f172a;">✦ PixelPilot <span style="color: #7c3aed;">AI</span></span>
        </div>
        <h1 style="color: #0f172a; font-size: 28px; font-weight: 900; margin-bottom: 8px;">You're live, ${clientName}! 🎉</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.7; margin-bottom: 24px;">
          Your new website is now live on the internet and ready to share with the world.
        </p>
        <a href="${liveUrl}" style="display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 24px;">
          Visit Your Website →
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          Share this link: <a href="${liveUrl}" style="color: #7c3aed;">${liveUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px;">PixelPilot AI · Automated web design, live in 24 hours</p>
      </div>
    `,
  });
}

export async function sendLeadNotificationEmail(
  leadEmail: string,
  leadName: string,
  message: string
) {
  const adminTo = process.env.ADMIN_EMAIL || FROM;
  await safeSend({
    from: FROM,
    to: adminTo,
    subject: `💬 New contact: ${leadName}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="color: #0f172a;">New message from website</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 80px;">Name</td><td style="padding: 8px 0; font-size: 14px; font-weight: 600;">${leadName}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0; font-size: 14px;"><a href="mailto:${leadEmail}" style="color: #7c3aed;">${leadEmail}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">Message</td><td style="padding: 8px 0; font-size: 14px;">${message}</td></tr>
        </table>
        <a href="mailto:${leadEmail}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px;">
          Reply to ${leadName} →
        </a>
      </div>
    `,
  });
}
