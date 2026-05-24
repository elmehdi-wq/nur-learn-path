import { Link } from "@tanstack/react-router";
import { Check, Lock, Play } from "lucide-react";
import type { Lesson } from "@/lib/curriculum";

interface Props {
  lesson: Lesson;
  state: "locked" | "current" | "done";
  index: number;
}

export function LessonNode({ lesson, state, index }: Props) {
  const offset = (index % 4) * 14 - 21; // gentle zig-zag
  const Inner = (
    <div
      className="group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft"
      style={{ marginInlineStart: `${offset}px` }}
    >
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-white shadow-soft ${
          state === "done"
            ? "bg-success"
            : state === "current"
            ? "bg-primary"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {state === "done" ? (
          <Check className="h-5 w-5" />
        ) : state === "locked" ? (
          <Lock className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ms-0.5" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{lesson.minutes} دقائق</span>
          <span>•</span>
          <span className="text-gold-foreground/80">+{lesson.xp} XP</span>
        </div>
        <h4 className="font-semibold text-base truncate">{lesson.title}</h4>
        <p className="text-sm text-muted-foreground truncate">{lesson.summary}</p>
      </div>
      {state !== "locked" && (
        <span className="hidden sm:inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          ابدأ
        </span>
      )}
    </div>
  );

  if (state === "locked") return <div className="opacity-60 cursor-not-allowed">{Inner}</div>;
  return (
    <Link to="/learn/$lessonId" params={{ lessonId: lesson.id }}>
      {Inner}
    </Link>
  );
}
