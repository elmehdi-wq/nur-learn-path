import { createFileRoute, Link } from "@tanstack/react-router";
import { levels } from "@/lib/curriculum";
import { BookOpen, Sparkles, Target, Trophy, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "نُخبة — تعلّم علوم الحديث بأسلوب ممتع" },
      {
        name: "description",
        content: "منصّة تفاعلية لتعليم الأطفال علوم الحديث الشريف من سن السابعة، بدروس قصيرة وتمارين ممتعة.",
      },
    ],
  }),
});

function Index() {
  const totalLessons = levels.reduce(
    (a, l) => a + l.units.reduce((b, u) => b + u.lessons.length, 0),
    0,
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-arabesque opacity-40" />
        <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-10 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                منصّة تعليمية للأطفال من سن ٧ سنوات
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-balance">
                تعلّم <span className="text-primary">علوم الحديث</span> بأسلوب
                <br className="hidden sm:block" /> ممتع وبسيط.
              </h1>
              <p className="mt-5 text-lg text-muted-foreground text-balance max-w-xl leading-relaxed">
                دروس قصيرة، تمارين تفاعلية، ونظام إتقان متدرّج — تجربة تعلّم مستوحاة
                من خان أكاديمي ومصمّمة خصّيصاً لأطفالنا.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-soft transition-all hover:shadow-glow hover:-translate-y-0.5"
                >
                  ابدأ التعلّم الآن
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-background px-6 py-3.5 text-sm font-bold transition-colors hover:bg-primary-soft hover:border-primary"
                >
                  لوحة التقدّم
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
                <Stat icon={<BookOpen className="h-4 w-4" />} label={`${totalLessons} درساً`} />
                <Stat icon={<Target className="h-4 w-4" />} label="٢ مستوى" />
                <Stat icon={<Trophy className="h-4 w-4" />} label="نظام إتقان" />
              </div>
            </div>

            {/* Decorative lesson card */}
            <div className="relative">
              <div className="absolute inset-0 -m-4 rounded-[2rem] bg-gradient-to-br from-primary/15 via-accent/30 to-gold/15 blur-2xl" />
              <div className="relative rounded-3xl border bg-card p-6 shadow-glow">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-primary">المستوى الأول • الوحدة ١</div>
                  <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] font-bold text-gold-foreground">+٢٠ XP</span>
                </div>
                <h3 className="mt-2 text-2xl font-bold">ما هو الحديث الشريف؟</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  درس قصير يشرح معنى الحديث وكيف وصل إلينا كلام النبي ﷺ.
                </p>
                <div className="mt-5 space-y-2">
                  {["شاهد الفيديو", "اقرأ النقاط الرئيسية", "حل التمارين", "افتح الدرس التالي"].map(
                    (s, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                          {i + 1}
                        </span>
                        <span className="text-sm font-medium">{s}</span>
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-l from-primary to-accent" />
                  </div>
                  <span className="text-xs font-bold text-primary">٧٥٪</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary text-xl">
                {f.emoji}
              </div>
              <h3 className="mt-3 font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels preview */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold">المسار التعليمي</h2>
            <p className="mt-1 text-muted-foreground">مستويان متدرّجان — تتفتّح كل وحدة بعد إتقان السابقة.</p>
          </div>
          <Link
            to="/courses"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            استعراض الكل <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {levels.map((lvl) => (
            <Link
              key={lvl.id}
              to="/courses"
              className="group relative overflow-hidden rounded-3xl border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl transition-all group-hover:bg-primary/20" />
              <div className="relative">
                <span className="inline-flex rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-bold">
                  المستوى {lvl.number}
                </span>
                <h3 className="mt-3 text-2xl font-bold">{lvl.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{lvl.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {lvl.units.map((u) => (
                    <span
                      key={u.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold"
                    >
                      <span>{u.icon}</span>
                      {u.title}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-soft text-primary">{icon}</span>
      <span className="font-semibold">{label}</span>
    </div>
  );
}

const features = [
  { emoji: "🎬", title: "دروس قصيرة", desc: "فيديوهات ٢-٥ دقائق بأسلوب بصري سهل الفهم." },
  { emoji: "🧩", title: "تمارين تفاعلية", desc: "أسئلة متنوّعة، ترتيب، اختيار، وسحب وإفلات." },
  { emoji: "🎯", title: "نظام الإتقان", desc: "لا ينتقل الطفل للدرس التالي إلا بعد فهمه السابق." },
  { emoji: "🏆", title: "تحفيز ممتع", desc: "نقاط XP، سلسلة يومية، وشارات تشجيعية." },
];
