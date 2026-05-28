// Shared "weak skills" + 7-day review schedule logic.
import { allLessons } from "./curriculum";
import type { Lesson } from "./curriculum";
import type { ProgressState } from "./progress";

export interface WeakSkill {
  lesson: Lesson;
  score: number;
}

export interface ScheduleDay {
  dow: number;
  minutes: number;
  lesson: Lesson | null;
  kind: string;
}

export const WEEKDAYS_AR = [
  "الأحد",
  "الإثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
];

export function getWeakSkills(p: ProgressState, threshold = 85, limit = 6): WeakSkill[] {
  return allLessons
    .filter((l) => p.completed[l.id])
    .map((l) => ({ lesson: l, score: p.completed[l.id].score }))
    .filter((x) => x.score < threshold)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

export function buildSchedule(p: ProgressState, today: Date = new Date()): ScheduleDay[] {
  const weak = allLessons
    .filter((l) => p.completed[l.id] && p.completed[l.id].score < 85)
    .sort((a, b) => p.completed[a.id].score - p.completed[b.id].score);
  const upcoming = allLessons.filter(
    (l) => !p.completed[l.id] || p.completed[l.id].score < 70,
  );

  const queue: Array<{ lesson: Lesson; kind: string }> = [];
  weak.forEach((l) => queue.push({ lesson: l, kind: "مراجعة" }));
  upcoming.forEach((l) => {
    if (!queue.find((q) => q.lesson.id === l.id))
      queue.push({ lesson: l, kind: "درس جديد" });
  });

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    if (dow === 5) return { dow, minutes: 0, lesson: null, kind: "راحة" };
    const item = queue.shift();
    return {
      dow,
      minutes: item ? item.lesson.minutes + 5 : 10,
      lesson: item?.lesson ?? null,
      kind: item?.kind ?? "مراجعة حرة",
    };
  });
}
