import { adminEmail, fromNewsletter, fromOrders, sendMail } from "./client";
import {
  adminOrderTemplate,
  customerInvoiceTemplate,
  newsletterTemplate,
  type NewsletterInput,
  type OrderEmailData,
  type OrderEmailItem,
} from "./templates";

export type OrderEmailPayload = OrderEmailData & { items: OrderEmailItem[] };

/**
 * On a new order: notify the admin AND send the buyer their invoice.
 * Runs both in parallel; never throws.
 */
export async function sendOrderEmails(order: OrderEmailPayload): Promise<{ admin: boolean; customer: boolean }> {
  const adminTpl = adminOrderTemplate(order);
  const customerTpl = customerInvoiceTemplate(order);
  const orderFrom = fromOrders();

  const [admin, customer] = await Promise.all([
    sendMail({
      from: orderFrom,
      to: adminEmail(),
      subject: adminTpl.subject,
      html: adminTpl.html,
      replyTo: order.customerEmail,
    }),
    sendMail({
      from: orderFrom,
      to: order.customerEmail,
      subject: customerTpl.subject,
      html: customerTpl.html,
      replyTo: adminEmail(),
    }),
  ]);

  return { admin: admin.ok, customer: customer.ok };
}

/**
 * Broadcast a newsletter to a list of recipients. Sends sequentially with a
 * small delay to respect Resend rate limits (burst ~10/s on free tier).
 */
export async function sendNewsletterBroadcast(
  recipients: string[],
  input: NewsletterInput,
): Promise<{ sent: number; failed: number }> {
  const tpl = newsletterTemplate(input);
  const from = fromNewsletter();
  let sent = 0;
  let failed = 0;

  for (const to of recipients) {
    const res = await sendMail({ from, to, subject: tpl.subject, html: tpl.html });
    if (res.ok) sent++;
    else failed++;
    // gentle pacing — ~6 emails/sec ceiling
    await new Promise((r) => setTimeout(r, 160));
  }

  return { sent, failed };
}
