import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { allLessons, findLesson, findLevelOfLesson, findUnit } from "@/lib/curriculum";
import {
  applyOverride,
  findMergedLesson,
  getMergedLessonsFlat,
} from "@/lib/admin-store";
import { completeLesson, isUnlocked } from "@/lib/progress";
import { Quiz } from "@/components/Quiz";
import { ArrowLeft, BookOpen, CheckCircle2, Play, Sparkles } from "lucide-react";

export const Route = createFileRoute("/learn/$lessonId")({
  component: LessonPage,
  head: ({ params }) => {
    const l = findLesson(params.lessonId);
    return {
      meta: [
        { title: l ? `${l.title} — نُخبة` : "درس — نُخبة" },
        { name: "description", content: l?.summary ?? "درس تفاعلي في علوم الحديث" },
      ],
    };
  },
});

type Phase = "intro" | "quiz" | "done";

function LessonPage() {
  const { lessonId } = Route.useParams();
  const navigate = useNavigate();
  const baseLesson = findLesson(lessonId);
  const [lesson, setLesson] = useState(baseLesson);
  useEffect(() => {
    // On client, prefer merged lesson (with custom content + overrides)
    const merged = findMergedLesson(lessonId);
    if (merged) setLesson(applyOverride(merged));
    else if (baseLesson) setLesson(applyOverride(baseLesson));
  }, [lessonId, baseLesson]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [score, setScore] = useState(0);

  if (!lesson) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">الدرس غير موجود</h1>
        <Link to="/courses" className="mt-4 inline-block text-primary font-semibold">
          العودة إلى المسار
        </Link>
      </div>
    );
  }

  if (!isUnlocked(lesson.id)) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">الدرس مغلق 🔒</h1>
        <p className="mt-2 text-muted-foreground">أكمل الدرس السابق بنسبة ٧٠٪ فأكثر لفتح هذا الدرس.</p>
        <Link to="/courses" className="mt-4 inline-block text-primary font-semibold">
          العودة إلى المسار
        </Link>
      </div>
    );
  }

  const unit = findUnit(lesson.unitId);
  const level = findLevelOfLesson(lesson.id);
  const mergedFlat = getMergedLessonsFlat();
  const flat = mergedFlat.length ? mergedFlat : allLessons;
  const idx = flat.findIndex((l) => l.id === lesson.id);
  const next = flat[idx + 1];

  const handleDone = (s: number) => {
    setScore(s);
    completeLesson(lesson.id, s, lesson.xp);
    setPhase("done");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {/* breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/courses" className="hover:text-primary">المسار</Link>
        <span>‹</span>
        <span>المستوى {level?.number}</span>
        <span>‹</span>
        <span>{unit?.title}</span>
      </nav>

      {phase === "intro" && (
        <div className="space-y-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-bold text-gold-foreground">
              <Sparkles className="h-3 w-3" /> +{lesson.xp} XP عند الإتقان
            </span>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight text-balance">
              {lesson.title}
            </h1>
            <p className="mt-2 text-muted-foreground text-lg">{lesson.summary}</p>
          </div>

          {lesson.videoEmbed ? (
            <div className="relative aspect-video overflow-hidden rounded-3xl border bg-black shadow-card">
              <iframe
                src={lesson.videoEmbed}
                title={lesson.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-accent/30 to-gold/15 shadow-card">
              <div className="absolute inset-0 bg-arabesque opacity-30" />
              <div className="relative flex h-full flex-col items-center justify-center gap-3 text-center px-6">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
                  <Play className="h-6 w-6 ms-1" />
                </div>
                <p className="text-sm text-muted-foreground">فيديو الدرس ({lesson.minutes} دقائق)</p>
                <p className="text-xs text-muted-foreground/80">أضف رابط الفيديو من لوحة الإدارة</p>
              </div>
            </div>
          )}

          <div className="rounded-3xl border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-lg">النقاط الرئيسية</h2>
            </div>
            <ul className="space-y-3">
              {lesson.keyPoints.map((k, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-primary text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{k}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setPhase("quiz")}
            className="w-full rounded-2xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-soft transition-all hover:shadow-glow"
          >
            ابدأ التمارين ←
          </button>
        </div>
      )}

      {phase === "quiz" && <Quiz exercises={lesson.exercises} onDone={handleDone} />}

      {phase === "done" && (
        <div className="rounded-3xl border bg-card p-8 sm:p-10 text-center shadow-card">
          {score >= 70 ? (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold">أحسنت! 🎉</h2>
              <p className="mt-2 text-muted-foreground">
                لقد أتقنت هذا الدرس بنسبة <span className="font-bold text-foreground">{score}%</span>
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-sm font-bold text-gold-foreground">
                <Sparkles className="h-4 w-4" /> +{lesson.xp} XP
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {next ? (
                  <button
                    onClick={() => {
                      setPhase("intro");
                      setScore(0);
                      navigate({ to: "/learn/$lessonId", params: { lessonId: next.id } });
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-glow"
                  >
                    الدرس التالي <ArrowLeft className="h-4 w-4" />
                  </button>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-glow"
                  >
                    لوحة التقدّم
                  </Link>
                )}
                <Link
                  to="/courses"
                  className="inline-flex items-center rounded-2xl border-2 border-border px-6 py-3 text-sm font-bold hover:bg-primary-soft"
                >
                  العودة للمسار
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent/40 text-3xl">
                🌱
              </div>
              <h2 className="mt-4 text-2xl font-extrabold">تحتاج مراجعة بسيطة</h2>
              <p className="mt-2 text-muted-foreground">
                نتيجتك <span className="font-bold text-foreground">{score}%</span> — أعد المحاولة بعد مراجعة النقاط الرئيسية.
              </p>
              <button
                onClick={() => {
                  setPhase("intro");
                  setScore(0);
                }}
                className="mt-6 inline-flex rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-soft"
              >
                إعادة الدرس
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
