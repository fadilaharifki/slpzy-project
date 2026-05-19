import { NextResponse, type NextRequest } from "next/server";
import { CMS_COOKIE, expectedToken } from "@/lib/cms-auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard the CMS panel; the login page itself stays open.
  if (pathname.startsWith("/cms-panel") && pathname !== "/cms-panel/login") {
    const token = req.cookies.get(CMS_COOKIE)?.value;
    const valid = token && token === (await expectedToken());
    if (!valid) {
      const url = req.nextUrl.clone();
      url.pathname = "/cms-panel/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cms-panel/:path*"],
};
