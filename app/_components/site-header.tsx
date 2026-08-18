import Link from "next/link";
import type { ReactNode } from "react";
import { PRODUCT } from "@/lib/product";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Explore" },
  { href: "/catalog", label: "Catalog" },
  { href: "/sky", label: "Sky" },
] as const;

export function SiteHeader({
  current,
  trailing,
}: {
  readonly current: "explore" | "catalog" | "sky";
  readonly trailing?: ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-white/10 border-b bg-slate-950/70 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-6">
        <Link className="flex items-baseline gap-2" href="/">
          <span className="font-semibold tracking-[0.28em] text-amber-200 text-sm">ORBIT</span>
          <span className="hidden text-slate-400 text-xs sm:inline">{PRODUCT.tagline}</span>
        </Link>
        <nav className="flex items-center gap-1">
          {LINKS.map((link) => {
            const active =
              (current === "explore" && link.href === "/") ||
              (current === "catalog" && link.href === "/catalog") ||
              (current === "sky" && link.href === "/sky");
            return (
              <Link
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  active ? "bg-white/10 text-white" : "text-slate-400 hover:text-white",
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {trailing}
    </header>
  );
}
