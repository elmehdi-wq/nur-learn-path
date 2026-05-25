import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProgress } from "@/hooks/use-progress";
import { Flame, Sparkles } from "lucide-react";

export function SiteHeader() {
  const p = useProgress();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft transition-transform group-hover:scale-105">
            <span className="text-lg font-bold">ن</span>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-base">نُخبة</span>
            <span className="text-[10px] text-muted-foreground">تعلّم علوم الحديث</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {[
            { to: "/", label: "الرئيسية" },
            { to: "/courses", label: "المسار" },
            { to: "/dashboard", label: "لوحتي" },
            { to: "/parents", label: "الوالدين" },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: true }}
              className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-primary-soft hover:text-primary data-[status=active]:bg-primary-soft data-[status=active]:text-primary data-[status=active]:font-semibold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 text-xs font-semibold text-gold-foreground">
            <Sparkles className="h-3.5 w-3.5" style={{ color: "var(--color-gold)" }} />
            <span>{p.xp} XP</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary">
            <Flame className="h-3.5 w-3.5" />
            <span>{p.streak} يوم</span>
          </div>
        </div>
      </div>
    </header>
  );
}
