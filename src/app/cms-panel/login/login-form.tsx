"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { cmsLogin } from "@/app/actions/cms";
import { cmsInput, CmsLabel } from "../_ui";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/cms-panel";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await cmsLogin(code);
    setLoading(false);
    if (!res.ok) {
      setError(res.error ?? "Login gagal");
      return;
    }
    router.push(from);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <CmsLabel>Access code</CmsLabel>
      <input
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="••••••••••"
        autoFocus
        className={cmsInput()}
      />
      {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !code}
        className="mt-6 w-full rounded-lg bg-ink py-3 text-xs font-semibold uppercase tracking-widest text-paper transition-colors hover:bg-sage-deep disabled:opacity-40"
      >
        {loading ? "Memeriksa..." : "Masuk"}
      </button>
    </form>
  );
}
