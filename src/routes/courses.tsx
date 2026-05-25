import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { levels as baseLevels } from "@/lib/curriculum";
import { getMergedLevels } from "@/lib/admin-store";
import { LessonNode } from "@/components/LessonNode";
import { useProgress } from "@/hooks/use-progress";
import { isUnlocked } from "@/lib/progress";

export const Route = createFileRoute("/courses")({
  component: CoursesPage,
  head: () => ({
    meta: [
      { title: "المسار التعليمي — نُخبة" },
      {
        name: "description",
        content: "استعرض مستويات ووحدات تعلّم علوم الحديث، وافتح الدروس درساً بعد آخر.",
      },
    ],
  }),
});

function CoursesPage() {
  const p = useProgress();
  const [levels, setLevels] = useState(baseLevels);
  useEffect(() => {
    const update = () => setLevels(getMergedLevels());
    update();
    window.addEventListener("nuhba:admin", update);
    return () => window.removeEventListener("nuhba:admin", update);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-10">
        <p className="text-sm font-semibold text-primary">مادّة: علوم الحديث</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">المسار التعليمي</h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          ابدأ من أول درس، وكلّما أتقنته انفتح الدرس التالي. هدفنا فهم عميق لا مجرّد مشاهدة.
        </p>
      </header>

      <div className="space-y-12">
        {levels.map((lvl) => (
          <section key={lvl.id}>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold shadow-soft">
                {lvl.number}
              </span>
              <div>
                <h2 className="text-xl font-bold">{lvl.title}</h2>
                <p className="text-sm text-muted-foreground">{lvl.description}</p>
              </div>
            </div>

            <div className="space-y-8">
              {lvl.units.map((u) => (
                <div key={u.id}>
                  <div className="mb-3 flex items-center gap-2 ps-2">
                    <span className="text-xl">{u.icon}</span>
                    <h3 className="font-bold">{u.title}</h3>
                  </div>
                  <div className="relative space-y-3">
                    {u.lessons.map((lesson, i) => {
                      const done = p.completed[lesson.id]?.score >= 70;
                      const unlocked = isUnlocked(lesson.id);
                      const state: "done" | "current" | "locked" = done
                        ? "done"
                        : unlocked
                        ? "current"
                        : "locked";
                      return <LessonNode key={lesson.id} lesson={lesson} state={state} index={i} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
