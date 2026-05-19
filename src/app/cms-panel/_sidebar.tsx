"use client";
import { Image as ImageIcon, LayoutDashboard, LogOut, Mail, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cmsLogout } from "@/app/actions/cms";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/cms-panel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cms-panel/orders", label: "Orders", icon: ShoppingBag },
  { href: "/cms-panel/products", label: "Products", icon: Package },
  { href: "/cms-panel/content", label: "Content & Banners", icon: ImageIcon },
  { href: "/cms-panel/newsletter", label: "Newsletter", icon: Mail },
];

export function CmsSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await cmsLogout();
    router.push("/cms-panel/login");
    router.refresh();
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-paper">
      <div className="border-b border-line px-6 py-5">
        <p className="text-xl font-bold tracking-tight text-sage-deep">Slpzy</p>
        <p className="text-[9px] uppercase tracking-[0.2em] text-ink/40">CMS Control Panel</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV.map((item) => {
          const active = item.href === "/cms-panel" ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-sage/15 text-sage-deep" : "text-ink/60 hover:bg-cream hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.7} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.7} />
          Logout
        </button>
      </div>
    </aside>
  );
}
