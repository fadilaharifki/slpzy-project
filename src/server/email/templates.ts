// SLPZY HTML email templates — table-based, inline-styled, email-client safe.
// Brand palette: cream #F8F5F0 · ink #3F3F3F · sage #9DAD8E · sage-deep #7C8E6C

export interface OrderEmailItem {
  productName: string;
  variantLabel: string;
  dimensions?: string | null;
  colorName: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderEmailData {
  code: string;
  createdAt: Date;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  subtotal: number;
  voucherCode: string;
  voucherDiscount: number;
  total: number;
}

const C = {
  cream: "#F8F5F0",
  paper: "#FFFFFF",
  ink: "#3F3F3F",
  ink2: "#5C5C5C",
  soft: "#8A8A8A",
  sage: "#9DAD8E",
  sageDeep: "#7C8E6C",
  line: "#E3DED4",
};

const FONT = "'Poppins','Segoe UI',Helvetica,Arial,sans-serif";

function idr(n: number): string {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function dateID(d: Date): string {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(d);
}

/** Shared shell: cream backdrop, branded header, white card, footer. */
function shell(opts: { preheader: string; eyebrow: string; title: string; body: string }): string {
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>SLPZY</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};font-family:${FONT};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;">

      <!-- Header -->
      <tr><td style="padding:8px 8px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:26px;font-weight:700;letter-spacing:-1px;color:${C.sageDeep};">Slpzy</td>
            <td align="right" style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.soft};">
              /sl&#275;p &#712;&#275;z&#275;/ &middot; sleepeazy
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:${C.paper};border:1px solid ${C.line};border-radius:20px;overflow:hidden;">
        <!-- Card head -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="background:${C.sage};padding:34px 36px;">
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#ffffff;opacity:.85;">${opts.eyebrow}</p>
            <h1 style="margin:10px 0 0;font-size:26px;line-height:1.25;font-weight:600;color:#ffffff;">${opts.title}</h1>
          </td></tr>
        </table>
        <!-- Card body -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:32px 36px;">
            <p style="margin:0 0 24px;font-size:14px;line-height:1.8;font-weight:300;color:${C.ink2};">${opts.body}</p>
            ${"%%CONTENT%%"}
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="padding:28px 12px;text-align:center;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:600;letter-spacing:1px;color:${C.ink};">TENCEL&trade; &middot; Feels so right</p>
        <p style="margin:0;font-size:11px;line-height:1.7;color:${C.soft};">
          SLPZY &middot; Premium TENCEL&trade; Lyocell bedding<br>
          A state of pure comfort &mdash; the art of deep, restorative rest.
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function inject(html: string, content: string): string {
  return html.replace("${\"%%CONTENT%%\"}", content).replace("%%CONTENT%%", content);
}

/** Order line-items table — shared by admin & customer emails. */
function itemsTable(data: OrderEmailData): string {
  const rows = (data as OrderEmailData & { items: OrderEmailItem[] }).items
    .map(
      (it) => `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid ${C.line};">
          <p style="margin:0;font-size:14px;font-weight:500;color:${C.ink};">${it.productName}</p>
          <p style="margin:3px 0 0;font-size:11px;letter-spacing:.5px;text-transform:uppercase;color:${C.soft};">
            ${it.variantLabel}${it.dimensions ? " &middot; " + it.dimensions : ""} &middot; ${it.colorName} &middot; x${it.qty}
          </p>
        </td>
        <td align="right" style="padding:14px 0;border-bottom:1px solid ${C.line};font-size:14px;font-weight:600;color:${C.ink};white-space:nowrap;">
          ${idr(it.lineTotal)}
        </td>
      </tr>`,
    )
    .join("");

  const totalRow = (label: string, value: string, strong = false) => `
    <tr>
      <td style="padding:6px 0;font-size:${strong ? "15px" : "13px"};font-weight:${strong ? "700" : "300"};color:${strong ? C.ink : C.ink2};">${label}</td>
      <td align="right" style="padding:6px 0;font-size:${strong ? "16px" : "13px"};font-weight:${strong ? "700" : "400"};color:${strong ? C.sageDeep : C.ink2};white-space:nowrap;">${value}</td>
    </tr>`;

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;">
    ${totalRow("Subtotal", idr(data.subtotal))}
    ${totalRow(`Shipping &middot; ${data.shippingMethod}`, data.shippingCost ? idr(data.shippingCost) : "Free")}
    ${data.voucherDiscount > 0 ? totalRow(`Voucher &middot; ${data.voucherCode}`, "&minus; " + idr(data.voucherDiscount)) : ""}
    <tr><td colspan="2" style="padding:8px 0;"><div style="border-top:1px solid ${C.line};"></div></td></tr>
    ${totalRow("Total", idr(data.total), true)}
  </table>`;
}

function infoBox(title: string, lines: string[]): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:${C.cream};border-radius:14px;">
    <tr><td style="padding:20px 22px;">
      <p style="margin:0 0 10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.sageDeep};font-weight:600;">${title}</p>
      ${lines.map((l) => `<p style="margin:0 0 4px;font-size:13px;line-height:1.7;color:${C.ink2};">${l}</p>`).join("")}
    </td></tr>
  </table>`;
}

function badge(text: string): string {
  return `<span style="display:inline-block;background:${C.ink};color:#fff;font-size:12px;font-weight:600;letter-spacing:1px;padding:6px 14px;border-radius:999px;">${text}</span>`;
}

// ── Template 1: Admin — new order notification ─────────────────────────────
export function adminOrderTemplate(data: OrderEmailData & { items: OrderEmailItem[] }) {
  const content = `
    <div style="margin-bottom:8px;">${badge("ORDER " + data.code)}</div>
    ${itemsTable(data)}
    ${infoBox("Customer", [
      `<strong style="color:${C.ink};">${data.customerName}</strong>`,
      `${data.customerEmail} &middot; ${data.customerPhone}`,
    ])}
    ${infoBox("Shipping address", [
      data.address,
      `${data.city}, ${data.province} ${data.postalCode}`,
      `Metode: ${data.shippingMethod} &middot; Pembayaran: ${data.paymentMethod}`,
    ])}
    <p style="margin:24px 0 0;font-size:12px;color:${C.soft};">Diterima ${dateID(data.createdAt)}</p>`;

  return {
    subject: `🛏️ Order baru ${data.code} — ${data.customerName}`,
    html: inject(
      shell({
        preheader: `Order baru senilai ${idr(data.total)} dari ${data.customerName}`,
        eyebrow: "New order received",
        title: "Ada orderan masuk.",
        body: `Order baru masuk dari website SLPZY. Berikut detail lengkapnya — segera proses & konfirmasi pembayaran ke pelanggan.`,
      }),
      content,
    ),
  };
}

// ── Template 2: Customer — order invoice ───────────────────────────────────
export function customerInvoiceTemplate(data: OrderEmailData & { items: OrderEmailItem[] }) {
  const content = `
    <div style="margin-bottom:8px;">${badge("INVOICE " + data.code)}</div>
    ${itemsTable(data)}
    ${infoBox("Dikirim ke", [
      `<strong style="color:${C.ink};">${data.customerName}</strong>`,
      data.address,
      `${data.city}, ${data.province} ${data.postalCode}`,
    ])}
    ${infoBox("Langkah selanjutnya", [
      `Selesaikan pembayaran via <strong style="color:${C.ink};">${data.paymentMethod === "qris" ? "QRIS" : "Bank Transfer"}</strong>.`,
      `Tim kami akan mengirim instruksi pembayaran & resi pengiriman ke email ini.`,
      `Ada pertanyaan? Balas email ini atau WhatsApp kami.`,
    ])}
    <p style="margin:24px 0 0;font-size:13px;line-height:1.8;font-weight:300;color:${C.ink2};">
      Terima kasih sudah mempercayakan istirahatmu pada SLPZY. How you start your day depends entirely on how you ended the night before. 🌙
    </p>`;

  return {
    subject: `Invoice pesananmu di SLPZY — ${data.code}`,
    html: inject(
      shell({
        preheader: `Invoice ${data.code} — total ${idr(data.total)}`,
        eyebrow: "Order confirmed",
        title: `Terima kasih, ${data.customerName.split(" ")[0]}.`,
        body: `Pesananmu sudah kami terima. Berikut rincian invoice dan detail order kamu. Simpan email ini sebagai bukti pemesanan.`,
      }),
      content,
    ),
  };
}

// ── Template 3: Newsletter broadcast ───────────────────────────────────────
export interface NewsletterInput {
  eyebrow?: string;
  heading: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

export function newsletterTemplate(input: NewsletterInput) {
  const cta =
    input.ctaLabel && input.ctaUrl
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 4px;">
           <tr><td style="background:${C.ink};border-radius:999px;">
             <a href="${input.ctaUrl}" style="display:inline-block;padding:14px 30px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#fff;text-decoration:none;">${input.ctaLabel}</a>
           </td></tr>
         </table>`
      : "";

  const content = `
    <div style="font-size:14px;line-height:1.85;font-weight:300;color:${C.ink2};">${input.bodyHtml}</div>
    ${cta}`;

  return {
    subject: input.heading,
    html: inject(
      shell({
        preheader: input.heading,
        eyebrow: input.eyebrow || "SLPZY Journal",
        title: input.heading,
        body: "",
      }),
      content,
    ),
  };
}
