"use client";
import { ArrowRight, Instagram, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
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
    <>
      <ScrollStage variant="lift">
        <section className="pt-14 lg:pt-20">
          <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
            <RevealGroup>
              <p className="text-xs uppercase tracking-widest text-soft" data-reveal>
                <span className="mr-3 inline-block h-px w-8 align-middle bg-ink/40" />
                Reach us
              </p>
              <h1 className="mt-10 max-w-[18ch] text-[clamp(3rem,7vw,6.5rem)] font-light leading-[0.93]" data-reveal data-reveal-delay="120">
                Speak with the <strong className="font-semibold text-sage-deep">studio</strong>.
              </h1>
              <p className="mt-8 max-w-xl text-base font-light leading-[1.85] text-ink/75" data-reveal data-reveal-delay="220">
                Pertanyaan tentang ukuran, warna, atau pengiriman? Tim SLPZY membaca semua pesan dari studio
                di Indonesia.
              </p>
            </RevealGroup>
          </div>
        </section>
      </ScrollStage>

      <ScrollStage variant="parallax">
        <section className="mx-auto grid max-w-[1480px] gap-16 px-6 py-24 lg:grid-cols-12 lg:gap-24 lg:px-12 lg:py-32">
          <RevealGroup className="lg:col-span-7">
            <p className="text-xs uppercase tracking-widest text-soft" data-reveal>Send a note</p>
            <div className="mt-6 h-px bg-line" data-reveal />
            <form onSubmit={onSubmit} className="mt-10 space-y-10" data-reveal data-reveal-delay="150">
              <div className="grid gap-10 sm:grid-cols-2">
                <Field label="First name" name="firstName" required />
                <Field label="Last name" name="lastName" required />
              </div>
              <Field type="email" label="Email" name="email" required />
              <Field as="textarea" label="Message" name="message" required rows={4} />

              <button
                type="submit"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs font-medium tracking-wider text-paper transition-colors hover:bg-sage-deep"
              >
                {sent ? "Sent — thank you." : "Send message"}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 ease-smooth group-hover:translate-x-1" strokeWidth={1.6} />
              </button>
            </form>
          </RevealGroup>

          <RevealGroup className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl bg-ink2 p-10 text-paper" data-reveal data-reveal-delay="100">
              <Logo className="absolute -right-3 -bottom-3 h-32 opacity-[0.08]" tone="text-paper" />
              <p className="relative text-xs uppercase tracking-widest text-paper/70">Direct lines</p>

              <ul className="relative mt-10 space-y-9">
                <ContactRow icon={MessageCircle} label="WhatsApp" value="+62 812 0000 0000" href="https://wa.me/" />
                <ContactRow icon={Mail} label="Email" value="halo@slpzy.id" href="mailto:halo@slpzy.id" />
                <ContactRow icon={Instagram} label="Instagram" value="@slpzy.id" href="https://instagram.com" />
              </ul>

              <div className="relative mt-10 h-px bg-paper/15" />
              <div className="relative mt-8">
                <p className="text-xs uppercase tracking-widest text-paper/70">Response time</p>
                <p className="mt-3 text-2xl font-medium">Within 24 hours.</p>
                <p className="mt-3 text-sm font-light leading-relaxed text-paper/75">
                  We believe how you start your day depends entirely on how you ended the night before — so we
                  reply when our team is rested, but never late.
                </p>
              </div>
            </div>
          </RevealGroup>
        </section>
      </ScrollStage>
    </>
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
      <label htmlFor={name} className="text-[10px] uppercase tracking-widest text-soft">
        {label}
        {required && <span className="ml-1 text-sage-deep">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea id={name} name={name} rows={rows ?? 3} required={required} className="input-underline mt-3 resize-none" />
      ) : (
        <input id={name} name={name} type={type} required={required} className="input-underline mt-3" />
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
    <li>
      <a href={href} target="_blank" rel="noreferrer noopener" className="group flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-paper/70">{label}</p>
          <p className="mt-2 text-2xl font-medium text-paper transition-colors group-hover:text-sage">{value}</p>
        </div>
        <Icon className="h-4 w-4 shrink-0 text-paper/40 transition-all duration-500 ease-smooth group-hover:translate-x-1 group-hover:text-sage" strokeWidth={1.6} />
      </a>
    </li>
  );
}
