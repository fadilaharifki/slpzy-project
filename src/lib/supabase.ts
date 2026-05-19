import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "slpzy-media";

let client: SupabaseClient | null = null;

export function isStorageConfigured(): boolean {
  return Boolean(URL && SERVICE_KEY);
}

function getClient(): SupabaseClient {
  if (!URL || !SERVICE_KEY) {
    throw new Error("Supabase Storage belum dikonfigurasi (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  }
  if (!client) {
    client = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });
  }
  return client;
}

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload an image to Supabase Storage, namespaced by section.
 * Returns the public URL + the storage path (for later deletion).
 */
export async function uploadImage(file: File, section: string): Promise<UploadResult> {
  const supabase = getClient();
  const safeSection = section.replace(/[^a-z0-9:_-]/gi, "-").toLowerCase();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${safeSection}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false,
  });
  if (error) throw new Error(`Upload gagal: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/** Remove an image from the bucket (best-effort — never throws). */
export async function deleteImage(path: string): Promise<void> {
  if (!path || !isStorageConfigured()) return;
  try {
    await getClient().storage.from(BUCKET).remove([path]);
  } catch {
    /* best-effort */
  }
}
