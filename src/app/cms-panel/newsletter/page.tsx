import { isEmailConfigured } from "@/server/email/client";
import { listSubscribers } from "@/server/services/newsletter";
import { CmsPageHead } from "../_ui";
import { NewsletterClient } from "./newsletter-client";

export const metadata = { title: "Newsletter · CMS" };

export default async function CmsNewsletterPage() {
  const subscribers = await listSubscribers();

  return (
    <div>
      <CmsPageHead title="Newsletter" desc="Daftar subscriber dan kirim broadcast email." />
      {!isEmailConfigured() && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          Resend belum dikonfigurasi — broadcast tidak akan terkirim. Isi <code>RESEND_API_KEY</code> di{" "}
          <code>.env.local</code>.
        </div>
      )}
      <NewsletterClient
        subscribers={subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          isActive: s.isActive,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
