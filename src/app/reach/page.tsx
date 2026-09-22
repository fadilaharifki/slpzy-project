"use client";
import { ArrowRight, Instagram, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { RevealGroup, ScrollStage } from "@/components/ScrollStage";

export default function ReachPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
    (e.currentTarget as HTMLFormElement).reset();
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <div className="bg-paper text-ink">
      <ScrollStage>
        <section className="pt-12 pb-8 lg:pt-20 lg:pb-12">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <RevealGroup>
              <p className="text-[11px] font-medium uppercase tracking-widest text-soft" data-reveal>
                Direct Support
              </p>
              <h1 className="mt-4 text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl" data-reveal data-reveal-delay="100">
                Speak with the <span className="font-normal text-sage-deep">studio</span>.
              </h1>
              <p className="mt-3 max-w-xl text-base font-light leading-relaxed text-ink/70" data-reveal data-reveal-delay="160">
                Punya pertanyaan seputar ukuran, kecocokan warna, atau rekomendasi paket tidur? Tim SLPZY siap membantu dengan senang hati.
              </p>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      <ScrollStage>
        <section className="mx-auto grid max-w-[1440px] gap-16 px-6 py-12 lg:grid-cols-12 lg:gap-20 lg:px-12 lg:py-16">
          <RevealGroup className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-widest text-soft" data-reveal>Send a note</p>
            <div className="mt-4 h-px bg-line/80" data-reveal />
            <form onSubmit={onSubmit} className="mt-8 space-y-8" data-reveal data-reveal-delay="120">
              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="First name" name="firstName" required />
                <Field label="Last name" name="lastName" required />
              </div>
              <Field type="email" label="Email" name="email" required />
              <Field as="textarea" label="Message" name="message" required rows={4} />

              <button
                type="submit"
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-8 py-3.5 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
              >
                {sent ? "Sent — thank you." : "Send message"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </RevealGroup>

          <RevealGroup className="lg:col-span-5">
            <div className="rounded-3xl border border-line bg-cream/50 p-8 sm:p-10" data-reveal data-reveal-delay="100">
              <p className="text-[11px] font-medium uppercase tracking-widest text-soft">Direct lines</p>

              <ul className="mt-8 space-y-6">
                <ContactRow icon={MessageCircle} label="WhatsApp" value="+62 812 0000 0000" href="https://wa.me/" />
                <ContactRow icon={Mail} label="Email" value="halo@slpzy.id" href="mailto:halo@slpzy.id" />
                <ContactRow icon={Instagram} label="Instagram" value="@slpzy.id" href="https://instagram.com" />
              </ul>

              <div className="my-8 h-px bg-line/80" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-soft">Response time</p>
                <p className="mt-2 text-xl font-normal text-ink">Within 24 hours.</p>
                <p className="mt-2 text-xs font-light leading-relaxed text-ink/70">
                  Setiap pertanyaan akan dibalas secara personal oleh tim studio kami pada hari kerja.
                </p>
              </div>
            </div>
          </RevealGroup>
        </section>
      </ScrollStage>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  rows?: number;
  as?: "input" | "textarea";
}
function Field({ label, name, type = "text", required, rows, as = "input" }: FieldProps) {
  return (
    <div className="relative">
      <label htmlFor={name} className="text-[10px] font-medium uppercase tracking-widest text-soft">
        {label}
        {required && <span className="ml-1 text-sage-deep">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea id={name} name={name} rows={rows ?? 3} required={required} className="input-underline mt-2 resize-none" />
      ) : (
        <input id={name} name={name} type={type} required={required} className="input-underline mt-2" />
      )}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <li className="border-b border-line/60 pb-5 last:border-0 last:pb-0">
      <a href={href} target="_blank" rel="noreferrer noopener" className="group flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-soft">{label}</p>
          <p className="mt-1 text-lg font-normal text-ink transition-colors group-hover:text-sage-deep">{value}</p>
        </div>
        <Icon className="h-4 w-4 shrink-0 text-soft transition-transform group-hover:translate-x-1 group-hover:text-sage-deep" strokeWidth={1.6} />
      </a>
    </li>
  );
}
