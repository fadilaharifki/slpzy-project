import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CMS_COOKIE, expectedToken } from "./cms-auth";

/** Server-side: is the current request an authenticated CMS session? */
export async function isCmsAuthed(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(CMS_COOKIE)?.value;
  if (!token) return false;
  return token === (await expectedToken());
}

/** Server-side guard — redirects to the login page when not authed. */
export async function requireCms(): Promise<void> {
  if (!(await isCmsAuthed())) redirect("/cms-panel/login");
}
