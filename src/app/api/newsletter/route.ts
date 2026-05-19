import { NextResponse } from "next/server";
import { subscribe } from "@/server/services/newsletter";

export const runtime = "nodejs";

/** POST /api/newsletter — public newsletter sign-up. Body: { email } */
export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body.email || "");
  } catch {
    return NextResponse.json({ ok: false, message: "Body tidak valid" }, { status: 400 });
  }

  const result = await subscribe(email);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
