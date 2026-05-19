"use client";
import { Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { broadcastNewsletter, removeSubscriberAction } from "@/app/actions/cms";
import { CmsCard, cmsInput, CmsLabel } from "../_ui";

interface Subscriber {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export function NewsletterClient({ subscribers }: { subscribers: Subscriber[] }) {
  const router = useRouter();
  const activeCount = subscribers.filter((s) => s.isActive).length;

  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function send() {
    if (!confirm(`Kirim broadcast ke ${activeCount} subscriber aktif?`)) return;
    setSending(true);
    setResult(null);
    // Plain newlines → paragraphs for the HTML email
    const bodyHtml = body
      .split(/\n{2,}/)
      .map((p) => `<p style="margin:0 0 14px;">${p.replace(/\n/g, "<br>")}</p>`)
      .join("");
    const res = await broadcastNewsletter({ heading, bodyHtml, ctaLabel, ctaUrl });
    setSending(false);
    if (!res.ok) {
      setResult(res.error ?? "Gagal mengirim");
      return;
    }
    setResult(`Terkirim ke ${res.sent} subscriber${res.failed ? `, ${res.failed} gagal` : ""}.`);
    setHeading("");
    setBody("");
    setCtaLabel("");
    setCtaUrl("");
  }

  async function remove(id: string) {
    if (!confirm("Hapus subscriber ini?")) return;
    await removeSubscriberAction(id);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      {/* Broadcast composer */}
      <CmsCard>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/70">Compose broadcast</h2>
        <p className="mb-5 mt-1 text-xs text-ink/50">
          Email dikirim memakai template SLPZY ke {activeCount} subscriber aktif.
        </p>

        <div className="space-y-4">
          <div>
            <CmsLabel>Subject / heading</CmsLabel>
            <input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Restock — Forest Sage is back"
              className={cmsInput()}
            />
          </div>
          <div>
            <CmsLabel>Body (pisahkan paragraf dengan baris kosong)</CmsLabel>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={7}
              placeholder={"Halo,\n\nKabar baik untuk kamu yang menunggu..."}
              className={cmsInput()}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <CmsLabel>CTA label (opsional)</CmsLabel>
              <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Shop now" className={cmsInput()} />
            </div>
            <div>
              <CmsLabel>CTA URL (opsional)</CmsLabel>
              <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://slpzy.id/shop" className={cmsInput()} />
            </div>
          </div>

          <button
            onClick={send}
            disabled={sending || !heading.trim() || !body.trim() || activeCount === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-sage-deep disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" /> {sending ? "Mengirim..." : `Broadcast ke ${activeCount}`}
          </button>
          {result && <p className="text-xs text-ink/60">{result}</p>}
        </div>
      </CmsCard>

      {/* Subscribers */}
      <CmsCard>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/70">Subscribers</h2>
          <span className="text-xs text-ink/45">{subscribers.length} total</span>
        </div>
        {subscribers.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/40">Belum ada subscriber.</p>
        ) : (
          <ul className="divide-y divide-line">
            {subscribers.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm">{s.email}</p>
                  <p className="text-[10px] uppercase tracking-wider text-ink/40">
                    {new Date(s.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
                <button onClick={() => remove(s.id)} className="text-ink/35 hover:text-rose-600">
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </CmsCard>
    </div>
  );
}
