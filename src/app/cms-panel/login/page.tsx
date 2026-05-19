import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { title: "CMS Login" };

export default function CmsLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="text-3xl font-bold tracking-tight text-sage-deep">Slpzy</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-ink/45">CMS Control Panel</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper p-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-6 text-center text-[10px] uppercase tracking-widest text-ink/40">
          Internal use only · slpz·y /slēp ˈēzē/
        </p>
      </div>
    </div>
  );
}
