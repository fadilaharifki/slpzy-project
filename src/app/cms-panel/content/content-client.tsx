"use client";
import { Eye, EyeOff, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { addMediaAsset, deleteMediaAsset, toggleMediaAsset, updateContentBlock } from "@/app/actions/cms";
import { cn } from "@/lib/cn";
import { CmsCard, cmsInput, CmsLabel } from "../_ui";

const SECTIONS = [
  { key: "hero", label: "Homepage Banner", hint: "Gambar banner utama di halaman depan." },
  { key: "lookbook", label: "Lookbook / Editorial", hint: "Foto editorial untuk halaman About." },
  { key: "marquee", label: "Marquee Strip", hint: "Gambar kecil untuk strip berjalan." },
  { key: "product", label: "Product Gallery", hint: "Foto galeri produk tambahan." },
];

interface Media {
  id: string;
  section: string;
  title: string;
  url: string;
  isActive: boolean;
}
interface Content {
  key: string;
  label: string;
  value: string;
}

export function ContentClient({ media, content }: { media: Media[]; content: Content[] }) {
  return (
    <div className="space-y-8">
      {/* Image sections */}
      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <MediaSection
            key={s.key}
            sectionKey={s.key}
            label={s.label}
            hint={s.hint}
            items={media.filter((m) => m.section === s.key || m.section.startsWith(`${s.key}:`))}
          />
        ))}
      </div>

      {/* Text blocks */}
      <CmsCard>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-ink/70">Text content</h2>
        <p className="mb-5 text-xs text-ink/50">Teks yang tampil di homepage. Perubahan langsung live.</p>
        <div className="space-y-5">
          {content.length === 0 && <p className="text-sm text-ink/40">Belum ada blok teks (jalankan db:seed).</p>}
          {content.map((c) => (
            <TextBlock key={c.key} block={c} />
          ))}
        </div>
      </CmsCard>
    </div>
  );
}

function MediaSection({
  sectionKey,
  label,
  hint,
  items,
}: {
  sectionKey: string;
  label: string;
  hint: string;
  items: Media[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(file: File) {
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("section", sectionKey);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.ok) {
      setError(data.error ?? "Upload gagal");
      setUploading(false);
      return;
    }
    const saved = await addMediaAsset({
      section: sectionKey,
      title: file.name,
      url: data.url,
      storagePath: data.path,
    });
    setUploading(false);
    if (!saved.ok) setError(saved.error ?? "Gagal menyimpan");
    else router.refresh();
  }

  return (
    <CmsCard>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{label}</h3>
          <p className="text-xs text-ink/50">{hint}</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-sage-deep disabled:opacity-40"
        >
          <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {error && <p className="mb-3 text-xs text-rose-600">{error}</p>}

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line py-8 text-center text-xs text-ink/40">
          Belum ada gambar di section ini.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((m) => (
            <MediaTile key={m.id} media={m} />
          ))}
        </div>
      )}
    </CmsCard>
  );
}

function MediaTile({ media }: { media: Media }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await toggleMediaAsset(media.id, !media.isActive);
    setBusy(false);
    router.refresh();
  }
  async function remove() {
    if (!confirm("Hapus gambar ini?")) return;
    setBusy(true);
    await deleteMediaAsset(media.id);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.url}
        alt={media.title}
        className={cn("aspect-[4/5] w-full object-cover transition", !media.isActive && "opacity-35 grayscale")}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-ink/70 px-2 py-1.5 opacity-0 transition group-hover:opacity-100">
        <button onClick={toggle} disabled={busy} className="text-paper/90 hover:text-paper" title="Toggle visibility">
          {media.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>
        <button onClick={remove} disabled={busy} className="text-rose-300 hover:text-rose-200" title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      {!media.isActive && (
        <span className="absolute left-1.5 top-1.5 rounded bg-ink/80 px-1.5 py-0.5 text-[8px] font-semibold uppercase text-paper">
          Hidden
        </span>
      )}
    </div>
  );
}

function TextBlock({ block }: { block: Content }) {
  const router = useRouter();
  const [value, setValue] = useState(block.value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const multiline = block.value.length > 60 || block.value.includes("\n");

  async function save() {
    setSaving(true);
    setSaved(false);
    const res = await updateContentBlock(block.key, value);
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <CmsLabel>{block.label || block.key}</CmsLabel>
        <span className="font-mono-soft text-[9px] text-ink/35">{block.key}</span>
      </div>
      {multiline ? (
        <textarea value={value} onChange={(e) => setValue(e.target.value)} rows={3} className={cmsInput()} />
      ) : (
        <input value={value} onChange={(e) => setValue(e.target.value)} className={cmsInput()} />
      )}
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || value === block.value}
          className="rounded-lg bg-ink px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-paper hover:bg-sage-deep disabled:opacity-30"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        {saved && <span className="text-xs text-sage-deep">Tersimpan ✓</span>}
      </div>
    </div>
  );
}
