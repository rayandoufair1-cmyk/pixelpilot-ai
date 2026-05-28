import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL || "hello@pixelpilot.ai";

export async function sendWelcomeEmail(
  clientEmail: string,
  clientName: string,
  projectId: string
) {
  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/dashboard`;
  await resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: "Welcome to PixelPilot AI — Your project is starting!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #7c3aed; font-size: 28px; margin-bottom: 8px;">Welcome, ${clientName}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your project has been received and our AI is ready to start building your dream website.
          We'll notify you as soon as your first draft is ready — usually within 24 hours.
        </p>
        <a href="${portalUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0;">
          View Your Project Portal →
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          Have questions? Just reply to this email or use the chat in your portal.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px;">PixelPilot AI · Automated web design for ambitious brands</p>
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
  await resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: "Your website design is ready for review! 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #7c3aed; font-size: 28px; margin-bottom: 8px;">Your design is ready, ${clientName}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Our AI has generated your custom website. Take a look and let us know what you think!
          You can request revisions directly from your portal.
        </p>
        <a href="${previewUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0;">
          View Your Website →
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          Approve it to kick off deployment, or use the feedback chat to request changes.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px;">PixelPilot AI · Automated web design for ambitious brands</p>
      </div>
    `,
  });
}

export async function sendGoLiveEmail(
  clientEmail: string,
  clientName: string,
  liveUrl: string
) {
  await resend.emails.send({
    from: FROM,
    to: clientEmail,
    subject: "Your website is LIVE! 🚀",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #7c3aed; font-size: 28px; margin-bottom: 8px;">You're live, ${clientName}!</h1>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your new website is now live on the internet. Share it with the world!
        </p>
        <a href="${liveUrl}" style="display: inline-block; background: #059669; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 24px 0;">
          Visit Your Website →
        </a>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        <p style="color: #9ca3af; font-size: 12px;">PixelPilot AI · Automated web design for ambitious brands</p>
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
  await resend.emails.send({
    from: FROM,
    to: adminTo,
    subject: `New lead: ${leadName} (${leadEmail})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2>New lead from the website</h2>
        <p><strong>Name:</strong> ${leadName}</p>
        <p><strong>Email:</strong> ${leadEmail}</p>
        <p><strong>Message:</strong> ${message}</p>
      </div>
    `,
  });
}
