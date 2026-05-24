import { createFileRoute, Link } from "@tanstack/react-router";
import { useProgress } from "@/hooks/use-progress";
import { allLessons, levels } from "@/lib/curriculum";
import { masteryPercent, nextRecommended } from "@/lib/progress";
import { Flame, Sparkles, Target, Trophy, ArrowLeft, BookOpen } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "لوحتي — نُخبة" },
      { name: "description", content: "تابع تقدّمك في تعلّم علوم الحديث: النقاط، الإتقان، والسلسلة اليومية." },
    ],
  }),
});

function Dashboard() {
  const p = useProgress();
  const mastery = masteryPercent();
  const next = nextRecommended();
  const completedCount = Object.values(p.completed).filter((c) => c.score >= 70).length;

  const badges = [
    { id: "b1", name: "أول خطوة", emoji: "🌱", earned: completedCount >= 1, desc: "أكمل أول درس" },
    { id: "b2", name: "متعلّم نشيط", emoji: "⚡", earned: completedCount >= 3, desc: "أكمل ٣ دروس" },
    { id: "b3", name: "خبير المبتدئين", emoji: "🏅", earned: completedCount >= 5, desc: "أكمل ٥ دروس" },
    { id: "b4", name: "سلسلة الذهب", emoji: "🔥", earned: p.streak >= 3, desc: "٣ أيام متتالية" },
    { id: "b5", name: "محبّ السنّة", emoji: "📖", earned: p.xp >= 100, desc: "اجمع ١٠٠ XP" },
    { id: "b6", name: "إتقان كامل", emoji: "👑", earned: mastery === 100, desc: "أتقن جميع الدروس" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <p className="text-sm font-semibold text-primary">مرحباً بك مجدّداً 👋</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">لوحة تقدّمي</h1>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Sparkles className="h-5 w-5" />}
          label="مجموع النقاط"
          value={`${p.xp}`}
          suffix="XP"
          tone="gold"
        />
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label="السلسلة اليومية"
          value={`${p.streak}`}
          suffix="يوم"
          tone="primary"
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label="نسبة الإتقان"
          value={`${mastery}`}
          suffix="٪"
          tone="accent"
        />
        <StatCard
          icon={<BookOpen className="h-5 w-5" />}
          label="الدروس المُنجزة"
          value={`${completedCount}`}
          suffix={`/ ${allLessons.length}`}
          tone="primary"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recommended */}
        <div className="lg:col-span-2 rounded-3xl border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-lg">الدرس الموصى به</h2>
            <Link to="/courses" className="text-xs font-semibold text-primary hover:underline">
              عرض كل الدروس
            </Link>
          </div>
          {next ? (
            <Link
              to="/learn/$lessonId"
              params={{ lessonId: next.id }}
              className="mt-4 group flex items-center gap-4 rounded-2xl border bg-background p-5 transition-all hover:border-primary hover:shadow-soft"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{next.minutes} دقائق • +{next.xp} XP</p>
                <h3 className="font-bold truncate">{next.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{next.summary}</p>
              </div>
              <ArrowLeft className="h-5 w-5 text-primary transition-transform group-hover:-translate-x-1" />
            </Link>
          ) : (
            <p className="mt-4 text-muted-foreground">أتقنت كل الدروس المتاحة! 🎉</p>
          )}

          {/* Level progress */}
          <div className="mt-8 space-y-5">
            <h3 className="font-bold">تقدّم المستويات</h3>
            {levels.map((lvl) => {
              const lessonsOfLevel = lvl.units.flatMap((u) => u.lessons);
              const done = lessonsOfLevel.filter((l) => (p.completed[l.id]?.score ?? 0) >= 70).length;
              const pct = Math.round((done / lessonsOfLevel.length) * 100);
              return (
                <div key={lvl.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold">{lvl.title}</span>
                    <span className="text-muted-foreground">{done} / {lessonsOfLevel.length}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-primary to-accent transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges */}
        <div className="rounded-3xl border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold-foreground" style={{ color: "var(--color-gold)" }} />
            <h2 className="font-bold text-lg">الشارات</h2>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {badges.map((b) => (
              <div
                key={b.id}
                title={b.desc}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${
                  b.earned
                    ? "border-gold/40 bg-gold/10"
                    : "border-border bg-muted/40 opacity-50 grayscale"
                }`}
              >
                <span className="text-3xl">{b.emoji}</span>
                <span className="text-[11px] font-bold leading-tight">{b.name}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground text-center">
            أكمل الدروس واحصل على شارات جديدة!
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  tone: "primary" | "accent" | "gold";
}) {
  const toneBg =
    tone === "gold" ? "bg-gold/15 text-gold-foreground" : tone === "accent" ? "bg-accent/40" : "bg-primary-soft text-primary";
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneBg}`}>{icon}</div>
      <p className="mt-3 text-xs text-muted-foreground font-medium">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">
        {value}
        {suffix && <span className="ms-1 text-sm font-semibold text-muted-foreground">{suffix}</span>}
      </p>
    </div>
  );
}
