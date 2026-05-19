// Pure CMS auth helpers — NO `next/headers` import, so this file is safe to use
// from both the Edge middleware and Node server code.

export const CMS_COOKIE = "slpzy_cms";

/** The single shared CMS access code (env-driven, default "sepretencel"). */
export function getAccessCode(): string {
  return process.env.CMS_ACCESS_CODE || "sepretencel";
}

/** Derive a non-guessable session token from a code (SHA-256, hex). */
export async function cmsToken(code: string): Promise<string> {
  const data = new TextEncoder().encode(`slpzy-cms::${code}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Token that a valid CMS session cookie must equal. */
export function expectedToken(): Promise<string> {
  return cmsToken(getAccessCode());
}

/** True when the submitted code matches the configured access code. */
export function verifyCode(input: string): boolean {
  return input.trim() === getAccessCode();
}
