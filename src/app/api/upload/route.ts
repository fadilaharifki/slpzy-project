import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CMS_COOKIE, expectedToken } from "@/lib/cms-auth";
import { isStorageConfigured, uploadImage } from "@/lib/supabase";

export const runtime = "nodejs";

/** POST /api/upload — multipart { file, section }. CMS-only. */
export async function POST(req: Request) {
  // Auth gate
  const jar = await cookies();
  const token = jar.get(CMS_COOKIE)?.value;
  if (!token || token !== (await expectedToken())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isStorageConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase Storage belum dikonfigurasi di .env.local" },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Body bukan multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  const section = String(form.get("section") || "hero");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "File tidak ditemukan" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "Hanya file gambar yang diizinkan" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: "Ukuran maksimal 8MB" }, { status: 400 });
  }

  try {
    const result = await uploadImage(file, section);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload gagal";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
