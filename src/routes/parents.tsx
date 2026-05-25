import { createFileRoute, Link } from "@tanstack/react-router";
import { useProgress } from "@/hooks/use-progress";
import { allLessons, levels, findUnit } from "@/lib/curriculum";
import { masteryPercent } from "@/lib/progress";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CalendarDays,
  Clock,
  Sparkles,
  Flame,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/parents")({
  component: ParentsDashboard,
  head: () => ({
    meta: [
      { title: "لوحة الوالدين — نُخبة" },
      {
        name: "description",
        content:
          "تابع تقدّم طفلك في علوم الحديث، اكتشف المهارات التي يحتاج تقويتها، واطّلع على جدول مراجعة أسبوعي مقترح.",
      },
      { property: "og:title", content: "لوحة الوالدين — نُخبة" },
      {
        property: "og:description",
        content: "تقدّم الطفل، نقاط الضعف، وجدول مراجعة أسبوعي.",
      },
    ],
  }),
});

const WEEKDAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function ParentsDashboard() {
  const p = useProgress();
  const mastery = masteryPercent();
  const completedCount = Object.values(p.completed).filter((c) => c.score >= 70).length;
  const totalXp = p.xp;

  // Weak skills: lessons attempted but score < 85 (mastery threshold for parents view)
  const attempted = allLessons.filter((l) => p.completed[l.id]);
  const weak = attempted
    .map((l) => ({ lesson: l, score: p.completed[l.id].score }))
    .filter((x) => x.score < 85)
    .sort((a, b) => a.score - b.score)
    .slice(0, 6);

  // Time spent (estimate based on lesson minutes for completed lessons)
  const minutesSpent = attempted.reduce((sum, l) => sum + l.lesson_minutes_safe(), 0);
  // helper above doesn't exist; compute inline:
  const totalMinutes = attempted.reduce((sum, l) => sum + l.minutes, 0);

  // Suggested 7-day review schedule
  const today = new Date();
  const schedule = buildSchedule(p, today);

  // Unit-level performance breakdown
  const unitStats = levels.flatMap((lvl) =>
    lvl.units.map((u) => {
      const lessons = u.lessons;
      const done = lessons.filter((l) => (p.completed[l.id]?.score ?? 0) >= 70).length;
      const avgScore =
        lessons.reduce((s, l) => s + (p.completed[l.id]?.score ?? 0), 0) /
        Math.max(lessons.length, 1);
      return {
        unit: u,
        level: lvl,
        done,
        total: lessons.length,
        avg: Math.round(avgScore),
      };
    })
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Users className="h-4 w-4" /> مساحة الوالدين
          </p>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">لوحة متابعة الطفل</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            تابع رحلة طفلك في تعلّم علوم الحديث، وتعرّف على المهارات التي يحتاج إلى تقويتها،
            مع جدول مراجعة أسبوعي مقترح.
          </p>
        </div>
        <Link
          to="/courses"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90"
        >
          عرض المنهج
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<Target className="h-5 w-5" />}
          label="نسبة الإتقان"
          value={`${mastery}٪`}
          tone="primary"
        />
        <Kpi
          icon={<BookOpen className="h-5 w-5" />}
          label="الدروس المُتقَنة"
          value={`${completedCount} / ${allLessons.length}`}
          tone="accent"
        />
        <Kpi
          icon={<Sparkles className="h-5 w-5" />}
          label="مجموع النقاط"
          value={`${totalXp} XP`}
          tone="gold"
        />
        <Kpi
          icon={<Flame className="h-5 w-5" />}
          label="السلسلة اليومية"
          value={`${p.streak} يوم`}
          tone="primary"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Weak skills */}
        <section className="lg:col-span-2 rounded-3xl border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h2 className="font-bold text-lg">المهارات التي تحتاج تقوية</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            الدروس التي لم يصل فيها مستوى الإتقان إلى ٨٥٪، مرتّبة من الأضعف إلى الأقوى.
          </p>

          {weak.length === 0 ? (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary-soft p-4">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-primary">
                ممتاز! لا توجد مهارات ضعيفة حالياً. واصل التشجيع 👏
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3">
              {weak.map(({ lesson, score }) => {
                const unit = findUnit(lesson.unitId);
                const tone =
                  score < 50
                    ? "bg-destructive/10 text-destructive"
                    : score < 70
                      ? "bg-gold/15 text-gold-foreground"
                      : "bg-accent/40 text-foreground";
                return (
                  <li key={lesson.id}>
                    <Link
                      to="/learn/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="group flex items-center gap-4 rounded-2xl border bg-background p-4 transition-all hover:border-primary hover:shadow-soft"
                    >
                      <div
                        className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${tone}`}
                      >
                        {score}٪
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-muted-foreground">
                          {unit?.title ?? "وحدة"}
                        </p>
                        <h3 className="font-bold truncate">{lesson.title}</h3>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-l from-primary to-accent"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                      <span className="hidden sm:inline text-xs font-semibold text-primary">
                        إعادة المراجعة
                      </span>
                      <ArrowLeft className="h-4 w-4 text-primary transition-transform group-hover:-translate-x-1" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Unit performance */}
          <div className="mt-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-bold">الأداء حسب الوحدات</h3>
            </div>
            <div className="mt-4 space-y-4">
              {unitStats.map((s) => (
                <div key={s.unit.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      <span className="me-1">{s.unit.icon}</span>
                      {s.unit.title}
                    </span>
                    <span className="text-muted-foreground">
                      {s.done}/{s.total} • متوسّط {s.avg}٪
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        s.avg >= 85
                          ? "bg-primary"
                          : s.avg >= 60
                            ? "bg-gold"
                            : "bg-destructive"
                      }`}
                      style={{ width: `${Math.max((s.done / s.total) * 100, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Suggested schedule */}
        <aside className="rounded-3xl border bg-card p-6 shadow-card">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-lg">جدول المراجعة المقترح</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            خطّة لأسبوع كامل: ١٠–١٥ دقيقة يومياً.
          </p>

          <ol className="mt-4 space-y-2.5">
            {schedule.map((day, i) => (
              <li
                key={i}
                className={`rounded-2xl border p-3 ${
                  i === 0 ? "border-primary/40 bg-primary-soft" : "bg-background"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold">
                    {i === 0 ? "اليوم" : WEEKDAYS_AR[day.dow]}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {day.minutes} د
                  </span>
                </div>
                {day.lesson ? (
                  <Link
                    to="/learn/$lessonId"
                    params={{ lessonId: day.lesson.id }}
                    className="mt-1.5 block"
                  >
                    <p className="text-[10px] text-muted-foreground">{day.kind}</p>
                    <p className="text-sm font-semibold leading-tight hover:text-primary">
                      {day.lesson.title}
                    </p>
                  </Link>
                ) : (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    يوم راحة — تشجيع وتحفيز فقط 🌟
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-5 rounded-2xl border border-dashed p-3 text-xs text-muted-foreground">
            <p className="font-bold text-foreground mb-1">💡 نصائح للوالدين</p>
            <ul className="list-disc pe-4 space-y-1">
              <li>اجلس مع طفلك خلال أول درس كل يوم.</li>
              <li>كافئ السلسلة اليومية حتى لو كانت قصيرة.</li>
              <li>راجع المهارات الضعيفة مرّة في الأسبوع.</li>
            </ul>
          </div>
        </aside>
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        الوقت التقديري المستثمَر في التعلّم: {totalMinutes} دقيقة
        {minutesSpent ? "" : ""}
      </p>
    </div>
  );
}

function buildSchedule(
  p: ReturnType<typeof useProgress>,
  today: Date
): Array<{ dow: number; minutes: number; lesson: (typeof allLessons)[number] | null; kind: string }> {
  // Build review queue: weak first, then next un-mastered
  const weak = allLessons
    .filter((l) => p.completed[l.id] && p.completed[l.id].score < 85)
    .sort((a, b) => p.completed[a.id].score - p.completed[b.id].score);
  const upcoming = allLessons.filter(
    (l) => !p.completed[l.id] || p.completed[l.id].score < 70
  );

  const queue: Array<{ lesson: (typeof allLessons)[number]; kind: string }> = [];
  weak.forEach((l) => queue.push({ lesson: l, kind: "مراجعة" }));
  upcoming.forEach((l) => {
    if (!queue.find((q) => q.lesson.id === l.id)) queue.push({ lesson: l, kind: "درس جديد" });
  });

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    const isFriday = dow === 5;
    if (isFriday) return { dow, minutes: 0, lesson: null, kind: "راحة" };
    const item = queue.shift();
    return {
      dow,
      minutes: item ? item.lesson.minutes + 5 : 10,
      lesson: item?.lesson ?? null,
      kind: item?.kind ?? "مراجعة حرة",
    };
  });
}

function Kpi({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "accent" | "gold";
}) {
  const toneBg =
    tone === "gold"
      ? "bg-gold/15 text-gold-foreground"
      : tone === "accent"
        ? "bg-accent/40"
        : "bg-primary-soft text-primary";
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneBg}`}>{icon}</div>
      <p className="mt-3 text-xs text-muted-foreground font-medium">{label}</p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
    </div>
  );
}
