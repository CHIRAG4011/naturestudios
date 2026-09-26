import { Resend } from 'resend';

/**
 * NatureStudios Multi-Mailbox Resend Email Infrastructure
 * Production Domain: naturestudio.in
 *
 * Configurable Mailboxes:
 * - inquiries@naturestudio.in
 * - admin@naturestudio.in
 * - hello@naturestudio.in
 * - support@naturestudio.in
 * - noreply@naturestudio.in
 * - portfolio@naturestudio.in
 */

export const EMAIL_ADDRESSES = {
  get from() {
    return process.env.RESEND_FROM_EMAIL || 'noreply@naturestudio.in';
  },
  get inquiries() {
    return process.env.RESEND_INQUIRIES_EMAIL || 'inquiries@naturestudio.in';
  },
  get admin() {
    return process.env.RESEND_ADMIN_EMAIL || 'admin@naturestudio.in';
  },
  get support() {
    return process.env.RESEND_SUPPORT_EMAIL || 'support@naturestudio.in';
  },
  get noreply() {
    return process.env.RESEND_NOREPLY_EMAIL || 'noreply@naturestudio.in';
  },
  get hello() {
    return process.env.RESEND_HELLO_EMAIL || 'hello@naturestudio.in';
  },
  get portfolio() {
    return process.env.RESEND_PORTFOLIO_EMAIL || 'portfolio@naturestudio.in';
  },
};

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

/**
 * Core email dispatcher using official Resend SDK with safe fallback.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = from || `NatureStudios <${EMAIL_ADDRESSES.noreply}>`;
  const replyToAddress = replyTo || EMAIL_ADDRESSES.inquiries;

  if (!apiKey) {
    console.log('\n=================== [NATURESTUDIOS EMAIL DISPATCH (DEV MOCK)] ===================');
    console.log(`TO:       ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`FROM:     ${fromAddress}`);
    console.log(`REPLY-TO: ${replyToAddress}`);
    console.log(`SUBJECT:  ${subject}`);
    console.log('CONTENT:');
    console.log(text || html.replace(/<[^>]*>?/gm, ' '));
    console.log('===============================================================================\n');
    return { success: true };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      replyTo: replyToAddress,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ' '),
    });

    if (error) {
      console.warn('Resend send warning:', error);
      // Domain verification fallback for unverified sandbox testing
      if (error.message?.includes('domain is not verified') || error.name === 'validation_error') {
        console.log('Retrying with onboarding@resend.dev sandbox domain...');
        const fallback = await resend.emails.send({
          from: `NatureStudios <onboarding@resend.dev>`,
          to: Array.isArray(to) ? to : [to],
          replyTo: replyToAddress,
          subject,
          html,
          text: text || html.replace(/<[^>]*>?/gm, ' '),
        });
        if (fallback.error) {
          console.error('Resend fallback failed:', fallback.error);
          return { success: false, error: fallback.error.message };
        }
        return { success: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Email dispatch exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error during email dispatch',
    };
  }
}

/**
 * Shared email layout wrapper in Burgundy & Warm Beige styling
 */
function wrapEmailTemplate(title: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #030712; color: #F8FAFC; margin: 0; padding: 40px 16px; }
          .container { max-width: 580px; margin: 0 auto; background: #0B132B; border: 1px solid #1E3A8A; border-radius: 14px; padding: 40px; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
          .brand { font-size: 20px; font-weight: 900; letter-spacing: 0.18em; color: #38BDF8; margin-bottom: 24px; text-transform: uppercase; border-bottom: 1px solid #172554; padding-bottom: 16px; }
          .tagline { font-size: 10px; letter-spacing: 0.25em; color: #94A3B8; margin-top: 4px; }
          .title { font-size: 24px; font-weight: 800; color: #F8FAFC; margin-bottom: 16px; letter-spacing: -0.02em; }
          .text { font-size: 15px; color: #7DD3FC; line-height: 1.65; margin-bottom: 20px; }
          .code-box { background: #030712; border: 1px solid #2563EB; border-radius: 8px; padding: 20px; text-align: center; font-size: 36px; font-weight: 900; letter-spacing: 0.3em; color: #38BDF8; margin: 28px 0; font-family: monospace; box-shadow: 0 0 25px rgba(37, 99, 235,0.4); }
          .btn-container { text-align: center; margin: 32px 0; }
          .btn { background: #2563EB; color: #38BDF8; font-weight: 800; padding: 15px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-size: 14px; letter-spacing: 0.15em; text-transform: uppercase; border: 1px solid #38BDF8; }
          .footer { font-size: 12px; color: #64748B; border-top: 1px solid #172554; padding-top: 24px; margin-top: 36px; line-height: 1.5; }
          .highlight { color: #38BDF8; font-weight: 700; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="brand">
            NATURESTUDIOS
            <div class="tagline">ESPORTS • CREATIVE • DIGITAL</div>
          </div>
          <div class="title">${title}</div>
          ${contentHtml}
          <div class="footer">
            © ${new Date().getFullYear()} NatureStudios (https://naturestudio.in).<br>
            The digital wild. High-impact creative technology & esports broadcast studio.
          </div>
        </div>
      </body>
    </html>
  `;
}

// ─── 1. EMAIL VERIFICATION ───────────────────────────────────────────────────
export async function sendVerificationEmail(to: string, code: string, name?: string): Promise<boolean> {
  const subject = `${code} is your NatureStudios verification code`;
  const greeting = name ? `Hello ${name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">Please enter the following 6-digit verification code to complete your NatureStudios account setup. This code will expire in <span class="highlight">10 minutes</span>.</div>
    <div class="code-box">${code}</div>
    <div class="text">If you did not request this verification code, your account remains secure and you can safely ignore this email.</div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Verify your NatureStudios account', content),
    from: `NatureStudios Security <${EMAIL_ADDRESSES.noreply}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}

// ─── 2. LOGIN OTP ────────────────────────────────────────────────────────────
export async function sendLoginOtpEmail(to: string, code: string, name?: string): Promise<boolean> {
  const subject = `${code} is your NatureStudios login code`;
  const greeting = name ? `Hello ${name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">We received a request to log in to your NatureStudios workspace. Use the one-time authentication code below to proceed:</div>
    <div class="code-box">${code}</div>
    <div class="text">This login code is single-use and expires in <span class="highlight">10 minutes</span>. Never share this code with anyone.</div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Your NatureStudios login code', content),
    from: `NatureStudios Security <${EMAIL_ADDRESSES.noreply}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}

// ─── 3. WELCOME EMAIL ────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name?: string): Promise<boolean> {
  const appUrl = process.env.APP_URL || 'https://naturestudio.in';
  const dashboardUrl = `${appUrl}/dashboard`;
  const subject = `Welcome to NatureStudios, ${name || 'Creator'}`;
  const greeting = name ? `Hello ${name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">Welcome to <span class="highlight">NatureStudios</span>. Your creative command center is now active.</div>
    <div class="text">From your dashboard, you can build and publish your professional portfolio on a custom subdomain, submit project briefs for tournament broadcasts, and collaborate directly with our creative directors.</div>
    <div class="btn-container">
      <a href="${dashboardUrl}" class="btn">ENTER CLIENT WORKSPACE</a>
    </div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Welcome to NatureStudios', content),
    from: `NatureStudios <${EMAIL_ADDRESSES.hello}>`,
    replyTo: EMAIL_ADDRESSES.inquiries,
  });
  return result.success;
}

// Google Welcome alias
export const sendGoogleWelcomeEmail = sendWelcomeEmail;

// ─── 4. PASSWORD RESET ───────────────────────────────────────────────────────
export async function sendPasswordResetEmail(to: string, token: string, name?: string): Promise<boolean> {
  const appUrl = process.env.APP_URL || 'https://naturestudio.in';
  const resetUrl = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(to)}`;
  const subject = `Reset your NatureStudios password`;
  const greeting = name ? `Hello ${name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">We received a request to reset the password for your NatureStudios account. Click the button below to establish a new password:</div>
    <div class="btn-container">
      <a href="${resetUrl}" class="btn">RESET PASSWORD</a>
    </div>
    <div class="text">This link is single-use and will expire in <span class="highlight">1 hour</span>.</div>
    <div class="text" style="font-size: 12px; color: #94A3B8; word-break: break-all;">If the button does not work, copy and paste this link:<br>${resetUrl}</div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Reset your NatureStudios password', content),
    from: `NatureStudios Security <${EMAIL_ADDRESSES.noreply}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}

// ─── 5. PROJECT REQUEST RECEIVED ─────────────────────────────────────────────
export async function sendProjectRequestEmail(
  to: string,
  data: { name: string; projectType: string; budget?: string; timeline?: string; message: string }
): Promise<boolean> {
  const subject = `We received your project request — NatureStudios`;

  const content = `
    <div class="text">Hello ${data.name},</div>
    <div class="text">Thank you for submitting your project request. Our studio team has received your brief and is currently reviewing the specifications.</div>
    <div style="background: #030712; border: 1px solid #1E3A8A; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <div class="text" style="margin-bottom: 8px;"><span class="highlight">Project Type:</span> ${data.projectType}</div>
      ${data.budget ? `<div class="text" style="margin-bottom: 8px;"><span class="highlight">Budget:</span> ${data.budget}</div>` : ''}
      ${data.timeline ? `<div class="text" style="margin-bottom: 8px;"><span class="highlight">Timeline:</span> ${data.timeline}</div>` : ''}
      <div class="text" style="margin-bottom: 0;"><span class="highlight">Message:</span><br>${data.message}</div>
    </div>
    <div class="text">Next Steps: A studio producer will reach out within 24 business hours to discuss strategy, milestones, and scope.</div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('We received your project request', content),
    from: `NatureStudios Inquiries <${EMAIL_ADDRESSES.inquiries}>`,
    replyTo: EMAIL_ADDRESSES.inquiries,
  });
  return result.success;
}

// ─── 6. INTERNAL ADMIN NOTIFICATION ──────────────────────────────────────────
export async function sendAdminNotificationEmail(data: {
  clientName: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
}): Promise<boolean> {
  const subject = `[NEW INQUIRY] ${data.projectType} — ${data.clientName}`;

  const content = `
    <div class="text">A new project request was submitted via the NatureStudios portal:</div>
    <div style="background: #030712; border: 1px solid #2563EB; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <div class="text" style="margin-bottom: 8px;"><span class="highlight">Client:</span> ${data.clientName}</div>
      <div class="text" style="margin-bottom: 8px;"><span class="highlight">Email:</span> ${data.email}</div>
      ${data.company ? `<div class="text" style="margin-bottom: 8px;"><span class="highlight">Company:</span> ${data.company}</div>` : ''}
      <div class="text" style="margin-bottom: 8px;"><span class="highlight">Type:</span> ${data.projectType}</div>
      ${data.budget ? `<div class="text" style="margin-bottom: 8px;"><span class="highlight">Budget:</span> ${data.budget}</div>` : ''}
      ${data.timeline ? `<div class="text" style="margin-bottom: 8px;"><span class="highlight">Timeline:</span> ${data.timeline}</div>` : ''}
      <div class="text" style="margin-bottom: 0;"><span class="highlight">Brief:</span><br>${data.message}</div>
    </div>
    <div class="text" style="font-size: 12px; color: #94A3B8;">Timestamp: ${new Date().toISOString()}</div>
  `;

  const result = await sendEmail({
    to: EMAIL_ADDRESSES.admin,
    subject,
    html: wrapEmailTemplate('New Project Request', content),
    from: `NatureStudios Platform <${EMAIL_ADDRESSES.admin}>`,
    replyTo: data.email,
  });
  return result.success;
}

// ─── 7. PORTFOLIO CONTACT MESSAGE ────────────────────────────────────────────
export async function sendPortfolioContactEmail(
  ownerEmail: string,
  data: {
    visitorName: string;
    visitorEmail: string;
    company?: string;
    message: string;
    portfolioUrl: string;
  }
): Promise<boolean> {
  const subject = `New Portfolio Contact Message from ${data.visitorName}`;

  const content = `
    <div class="text">You received a new inquiry on your NatureStudios portfolio (<a href="${data.portfolioUrl}" style="color: #38BDF8;">${data.portfolioUrl}</a>):</div>
    <div style="background: #030712; border: 1px solid #1E3A8A; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <div class="text" style="margin-bottom: 8px;"><span class="highlight">From:</span> ${data.visitorName} (${data.visitorEmail})</div>
      ${data.company ? `<div class="text" style="margin-bottom: 8px;"><span class="highlight">Company:</span> ${data.company}</div>` : ''}
      <div class="text" style="margin-bottom: 0;"><span class="highlight">Message:</span><br>${data.message}</div>
    </div>
    <div class="text">You can reply directly to this email to contact ${data.visitorName}.</div>
  `;

  const result = await sendEmail({
    to: ownerEmail,
    subject,
    html: wrapEmailTemplate('New Portfolio Inquiry', content),
    from: `NatureStudios Portfolio <${EMAIL_ADDRESSES.portfolio}>`,
    replyTo: data.visitorEmail,
  });
  return result.success;
}

// ─── 8. PORTFOLIO PUBLISHED ──────────────────────────────────────────────────
export async function sendPortfolioPublishedEmail(
  to: string,
  portfolioUrl: string,
  name?: string
): Promise<boolean> {
  const subject = `Your NatureStudios portfolio is now LIVE!`;
  const greeting = name ? `Hello ${name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">Congratulations! Your professional portfolio is now published and live on the internet at:</div>
    <div class="code-box" style="font-size: 20px; letter-spacing: 0.05em; padding: 16px;">
      <a href="${portfolioUrl}" style="color: #38BDF8; text-decoration: none;">${portfolioUrl}</a>
    </div>
    <div class="text">Share this link across your socials, resume, and esports profiles. You can update your content or switch themes anytime from your builder.</div>
    <div class="btn-container">
      <a href="${portfolioUrl}" class="btn">VIEW LIVE PORTFOLIO</a>
    </div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Your Portfolio is Live', content),
    from: `NatureStudios Portfolio <${EMAIL_ADDRESSES.portfolio}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}

// ─── 9. PORTFOLIO UNPUBLISHED ────────────────────────────────────────────────
export async function sendPortfolioUnpublishedEmail(to: string, name?: string): Promise<boolean> {
  const subject = `Your NatureStudios portfolio has been unpublished`;
  const greeting = name ? `Hello ${name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">Your portfolio status has been set to <span class="highlight">UNPUBLISHED</span>. The public subdomain URL is no longer accessible to visitors.</div>
    <div class="text">Your project data, skills, and design configurations remain safely preserved. You can republish anytime with one click.</div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Portfolio Unpublished', content),
    from: `NatureStudios Portfolio <${EMAIL_ADDRESSES.portfolio}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}

// ─── 10. ACCOUNT SUSPENDED ──────────────────────────────────────────────────
export async function sendAccountSuspendedEmail(
  to: string,
  params: {
    name?: string;
    reason: string;
    appealUrl?: string;
  }
): Promise<boolean> {
  const subject = `Account Suspension Notice — NatureStudios`;
  const greeting = params.name ? `Hello ${params.name},` : 'Hello,';
  const appealLink = params.appealUrl || 'https://naturestudio.in/dashboard/tickets?type=appeal';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">This is an official notice that your NatureStudios account has been <span class="highlight" style="color: #E63946;">SUSPENDED</span> by platform moderation.</div>
    
    <div style="background: #030712; border-left: 4px solid #E63946; border-radius: 8px; padding: 18px; margin: 24px 0;">
      <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #E63946; margin-bottom: 6px;">Reason for Suspension:</div>
      <div style="font-size: 15px; color: #F8FAFC; font-weight: 600;">${params.reason || 'Violation of platform terms of service or acceptable use policy.'}</div>
    </div>

    <div class="text">While your account is suspended, access to creative project submissions, brief updates, and custom portfolio publishing is restricted.</div>

    <div class="text" style="margin-top: 20px;"><strong>How to Appeal:</strong> If you believe this action was made in error, or if you have resolved the underlying issue, you can appeal this decision directly through our ticket support center:</div>

    <div class="btn-container">
      <a href="${appealLink}" class="btn" style="background: #2563EB; border-color: #38BDF8;">APPEAL AT SUPPORT TICKETS</a>
    </div>

    <div class="text" style="font-size: 13px; color: #94A3B8; text-align: center;">You can also reply to this email or contact our support team at <a href="mailto:${EMAIL_ADDRESSES.support}" style="color: #38BDF8;">${EMAIL_ADDRESSES.support}</a> with your account email and details.</div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Account Suspension Notice', content),
    from: `NatureStudios Moderation <${EMAIL_ADDRESSES.noreply}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}

// ─── 11. ACCOUNT REINSTATED ─────────────────────────────────────────────────
export async function sendAccountReinstatedEmail(to: string, name?: string): Promise<boolean> {
  const subject = `Your NatureStudios Account Has Been Reinstated`;
  const greeting = name ? `Hello ${name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">Good news! Your NatureStudios account has been reviewed and <span class="highlight" style="color: #52B788;">REINSTATED</span>.</div>
    <div class="text">Full access to your workspace, project submissions, briefs, and creator portfolios has been completely restored.</div>
    <div class="btn-container">
      <a href="https://naturestudio.in/dashboard" class="btn">GO TO WORKSPACE</a>
    </div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Account Reinstated', content),
    from: `NatureStudios Moderation <${EMAIL_ADDRESSES.noreply}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}

// ─── 12. TICKET CREATED NOTIFICATION ─────────────────────────────────────────
export async function sendTicketCreatedEmail(
  to: string,
  params: {
    ticketNumber: string;
    subject: string;
    name?: string;
    category?: string;
  }
): Promise<boolean> {
  const subject = `[${params.ticketNumber}] Ticket Received: ${params.subject}`;
  const greeting = params.name ? `Hello ${params.name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">Your support request has been received by our studio operations and moderation team.</div>
    
    <div style="background: #030712; border: 1px solid #2563EB; border-radius: 8px; padding: 18px; margin: 24px 0;">
      <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; color: #38BDF8; margin-bottom: 4px;">Ticket Number:</div>
      <div style="font-size: 20px; font-weight: 900; color: #F8FAFC; font-family: monospace;">${params.ticketNumber}</div>
      <div style="font-size: 13px; color: #94A3B8; margin-top: 8px;"><strong>Subject:</strong> ${params.subject}</div>
      ${params.category ? `<div style="font-size: 13px; color: #94A3B8; margin-top: 4px;"><strong>Category:</strong> ${params.category}</div>` : ''}
    </div>

    <div class="text">Our team reviews tickets actively. You can track progress and add further details through your workspace tickets page:</div>

    <div class="btn-container">
      <a href="https://naturestudio.in/dashboard/tickets" class="btn">VIEW TICKET IN WORKSPACE</a>
    </div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Support Request Received', content),
    from: `NatureStudios Support <${EMAIL_ADDRESSES.support}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}

// ─── 13. TICKET REPLY NOTIFICATION ──────────────────────────────────────────
export async function sendTicketReplyEmail(
  to: string,
  params: {
    ticketNumber: string;
    subject: string;
    name?: string;
    replyMessage: string;
    staffName?: string;
  }
): Promise<boolean> {
  const subject = `[${params.ticketNumber}] New Reply: ${params.subject}`;
  const greeting = params.name ? `Hello ${params.name},` : 'Hello,';

  const content = `
    <div class="text">${greeting}</div>
    <div class="text">Support staff (${params.staffName || 'NatureStudios Team'}) has posted an update to your ticket <span class="highlight font-mono">${params.ticketNumber}</span>:</div>

    <div style="background: #030712; border-left: 4px solid #38BDF8; border-radius: 8px; padding: 18px; margin: 24px 0; color: #F8FAFC; line-height: 1.6; font-size: 14px;">
      ${params.replyMessage.replace(/\n/g, '<br>')}
    </div>

    <div class="btn-container">
      <a href="https://naturestudio.in/dashboard/tickets" class="btn">REPLY IN WORKSPACE</a>
    </div>
  `;

  const result = await sendEmail({
    to,
    subject,
    html: wrapEmailTemplate('Ticket Update', content),
    from: `NatureStudios Support <${EMAIL_ADDRESSES.support}>`,
    replyTo: EMAIL_ADDRESSES.support,
  });
  return result.success;
}
