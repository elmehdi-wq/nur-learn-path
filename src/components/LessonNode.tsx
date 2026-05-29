import { Link } from "@tanstack/react-router";
import {
  Check,
  Lock,
  Play,
  Dumbbell,
  ClipboardCheck,
  Trophy,
  Crown,
} from "lucide-react";
import type { Lesson, LessonKind } from "@/lib/curriculum";

interface Props {
  lesson: Lesson;
  state: "locked" | "current" | "done";
  index: number;
}

const kindMeta: Record<
  LessonKind,
  { label: string; Icon: typeof Play; tone: string; ring: string }
> = {
  video: {
    label: "فيديو",
    Icon: Play,
    tone: "bg-primary text-primary-foreground",
    ring: "ring-primary/20",
  },
  exercise: {
    label: "تمرين",
    Icon: Dumbbell,
    tone: "bg-accent text-accent-foreground",
    ring: "ring-accent/30",
  },
  "section-quiz": {
    label: "اختبار قسم",
    Icon: ClipboardCheck,
    tone: "bg-gold text-gold-foreground",
    ring: "ring-gold/30",
  },
  "unit-exam": {
    label: "اختبار الوحدة",
    Icon: Trophy,
    tone: "bg-success text-white",
    ring: "ring-success/30",
  },
  "level-exam": {
    label: "اختبار المستوى",
    Icon: Crown,
    tone: "bg-foreground text-background",
    ring: "ring-foreground/30",
  },
};

export function LessonNode({ lesson, state, index }: Props) {
  const offset = (index % 4) * 14 - 21;
  const kind = (lesson.kind ?? "exercise") as LessonKind;
  const meta = kindMeta[kind];
  const KindIcon = meta.Icon;
  const isExam = kind === "unit-exam" || kind === "level-exam";

  const Inner = (
    <div
      className={`group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-soft ${
        isExam ? "ring-2 " + meta.ring : ""
      }`}
      style={{ marginInlineStart: `${offset}px` }}
    >
      <div
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-full shadow-soft ${
          state === "done"
            ? "bg-success text-white"
            : state === "current"
            ? meta.tone
            : "bg-muted text-muted-foreground"
        }`}
      >
        {state === "done" ? (
          <Check className="h-5 w-5" />
        ) : state === "locked" ? (
          <Lock className="h-4 w-4" />
        ) : (
          <KindIcon className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.tone}`}
          >
            {meta.label}
          </span>
          <span>{lesson.minutes} د</span>
          <span>•</span>
          <span className="text-gold-foreground/80">+{lesson.xp} XP</span>
        </div>
        <h4 className="font-semibold text-base truncate mt-1">{lesson.title}</h4>
        <p className="text-sm text-muted-foreground truncate">{lesson.summary}</p>
      </div>
      {state !== "locked" && (
        <span className="hidden sm:inline-flex rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {isExam ? "ابدأ الاختبار" : "ابدأ"}
        </span>
      )}
    </div>
  );

  if (state === "locked")
    return <div className="opacity-60 cursor-not-allowed">{Inner}</div>;
  return (
    <Link to="/learn/$lessonId" params={{ lessonId: lesson.id }}>
      {Inner}
    </Link>
  );
}
