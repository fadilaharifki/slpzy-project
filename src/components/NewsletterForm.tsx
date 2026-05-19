"use client";
import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("done");
        setMessage(data.message || "Terima kasih.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Gagal mendaftar.");
      }
    } catch {
      setStatus("error");
      setMessage("Gagal mendaftar, coba lagi.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6">
      <div className="flex items-end gap-2 border-b border-ink/30 pb-1">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-transparent text-sm font-light outline-none placeholder:text-ink/40"
          aria-label="Email"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="text-[10px] uppercase tracking-widest text-ink disabled:opacity-40"
        >
          {status === "loading" ? "..." : status === "done" ? "Done ✓" : "Subscribe →"}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-[10px] uppercase tracking-widest ${status === "error" ? "text-rose-600" : "text-sage-deep"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
