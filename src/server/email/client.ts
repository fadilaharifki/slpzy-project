import { Resend } from "resend";

let resend: Resend | null = null;

function getResend(): Resend {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set.");
    resend = new Resend(key);
  }
  return resend;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function adminEmail(): string {
  return process.env.ADMIN_EMAIL || "sleepeazy.id@gmail.com";
}

/** Newsletter sender — goodmorning@slpzy.co */
export function fromNewsletter(): string {
  return process.env.EMAIL_FROM_NEWSLETTER || "SLPZY <goodmorning@slpzy.co>";
}

/** Order / invoice sender — goodnight@slpzy.co */
export function fromOrders(): string {
  return process.env.EMAIL_FROM_ORDERS || "SLPZY <goodnight@slpzy.co>";
}

export interface MailInput {
  from: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface MailResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

/**
 * Send a single email via Resend. Never throws — returns a result object so
 * callers (order flow, broadcasts) can degrade gracefully when Resend is unset.
 */
export async function sendMail({ from, to, subject, html, replyTo }: MailInput): Promise<MailResult> {
  if (!isEmailConfigured()) {
    console.warn(`[email] Resend not configured — skipped "${subject}" → ${to}`);
    return { ok: false, skipped: true, error: "Resend not configured" };
  }
  try {
    const { error } = await getResend().emails.send({
      from,
      to: [to],
      subject,
      html,
    });
    if (error) {
      console.error(`[email] Resend error "${subject}" → ${to}:`, error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "send failed";
    console.error(`[email] failed "${subject}" → ${to}:`, msg);
    return { ok: false, error: msg };
  }
}
