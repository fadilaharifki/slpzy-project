import { getAllMedia, getContentRows } from "@/server/services/content";
import { isStorageConfigured } from "@/lib/supabase";
import { CmsPageHead } from "../_ui";
import { ContentClient } from "./content-client";

export const metadata = { title: "Content · CMS" };

export default async function CmsContentPage() {
  const [media, content] = await Promise.all([getAllMedia(), getContentRows()]);

  return (
    <div>
      <CmsPageHead
        title="Content & Banners"
        desc="Kelola gambar (dikelompokkan per section) dan teks yang tampil di website."
      />
      {!isStorageConfigured() && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          Supabase Storage belum dikonfigurasi — upload gambar dinonaktifkan. Isi <code>SUPABASE_URL</code> &amp;{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> di <code>.env.local</code>.
        </div>
      )}
      <ContentClient
        media={media.map((m) => ({
          id: m.id,
          section: m.section,
          title: m.title,
          url: m.url,
          isActive: m.isActive,
        }))}
        content={content.map((c) => ({ key: c.key, label: c.label, value: c.value }))}
      />
    </div>
  );
}
