import type { Metadata } from "next";
import { isCmsAuthed } from "@/lib/cms-session";
import { CmsSidebar } from "./_sidebar";

export const metadata = { title: "CMS · SLPZY" };

export default async function CmsLayout({ children }: { children: React.ReactNode }) {
  const authed = await isCmsAuthed();

  // Login page (unauthed) renders standalone — middleware guards everything else.
  if (!authed) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-cream text-ink">
      <CmsSidebar />
      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-[1180px] px-8 py-10">{children}</div>
      </div>
    </div>
  );
}
