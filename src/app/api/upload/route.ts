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
      {
        ok: false,
        error:
          "Supabase Storage belum dikonfigurasi. Pastikan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY ada di .env.local",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (parseErr) {
    console.error("[upload] Failed to parse form data:", parseErr);
    return NextResponse.json({ ok: false, error: "Body bukan multipart/form-data" }, { status: 400 });
  }

  const file = form.get("file");
  const section = String(form.get("section") || "hero");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "File tidak ditemukan dalam request" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, error: `Hanya file gambar yang diizinkan (diterima: ${file.type})` },
      { status: 400 },
    );
  }
  if (file.size > 8 * 1024 * 1024) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return NextResponse.json({ ok: false, error: `Ukuran file terlalu besar (${mb}MB, maks 8MB)` }, { status: 400 });
  }

  try {
    const result = await uploadImage(file, section);
    console.log(`[upload] OK — section=${section} path=${result.path} url=${result.url}`);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload gagal";
    console.error("[upload] Supabase upload error:", message, err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
