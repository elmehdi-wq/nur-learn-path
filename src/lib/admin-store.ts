// Client-side admin content store (localStorage). Augments the base curriculum.
import { useEffect, useState } from "react";
import {
  levels as baseLevels,
  type Exercise,
  type Lesson,
  type Level,
  type Unit,
} from "./curriculum";

const KEY = "nuhba-admin-v1";
const STUDENT_KEY = "nuhba-student-v1";
const EVT = "nuhba:admin";

export interface LessonOverride {
  videoUrl?: string;
  extraExercises?: Exercise[];
}

export interface AdminState {
  overrides: Record<string, LessonOverride>; // by lessonId
  customLessons: Lesson[]; // attached to existing or custom unitId
  customUnits: Unit[]; // attached to existing or custom levelId
  customLevels: Level[];
}

const empty: AdminState = {
  overrides: {},
  customLessons: [],
  customUnits: [],
  customLevels: [],
};

export function loadAdmin(): AdminState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function saveAdmin(s: AdminState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event(EVT));
}

export function getMergedLevels(state?: AdminState): Level[] {
  const s = state ?? loadAdmin();
  // Deep clone base
  const merged: Level[] = baseLevels.map((lvl) => ({
    ...lvl,
    units: lvl.units.map((u) => ({
      ...u,
      lessons: u.lessons.map((l) => ({ ...l })),
    })),
  }));

  // Add custom levels
  for (const lvl of s.customLevels) {
    if (!merged.find((m) => m.id === lvl.id)) {
      merged.push({ ...lvl, units: [...(lvl.units || [])] });
    }
  }

  // Add custom units to their level
  for (const u of s.customUnits) {
    const lvl = merged.find((m) => m.id === u.levelId);
    if (lvl && !lvl.units.find((x) => x.id === u.id)) {
      lvl.units.push({ ...u, lessons: [...(u.lessons || [])] });
    }
  }

  // Add custom lessons to their unit
  for (const l of s.customLessons) {
    for (const lvl of merged) {
      const unit = lvl.units.find((u) => u.id === l.unitId);
      if (unit && !unit.lessons.find((x) => x.id === l.id)) {
        unit.lessons.push({ ...l });
        break;
      }
    }
  }

  return merged;
}

export function getMergedLessonsFlat(state?: AdminState): Lesson[] {
  return getMergedLevels(state).flatMap((l) => l.units.flatMap((u) => u.lessons));
}

export function findMergedLesson(id: string, state?: AdminState): Lesson | undefined {
  return getMergedLessonsFlat(state).find((l) => l.id === id);
}

export function applyOverride(lesson: Lesson, state?: AdminState): Lesson {
  const s = state ?? loadAdmin();
  const o = s.overrides[lesson.id];
  if (!o) return lesson;
  return {
    ...lesson,
    videoEmbed: o.videoUrl ?? lesson.videoEmbed,
    exercises: [...lesson.exercises, ...(o.extraExercises ?? [])],
  };
}

export function useAdmin(): [AdminState, (s: AdminState) => void] {
  const [s, setS] = useState<AdminState>(empty);
  useEffect(() => {
    const update = () => setS(loadAdmin());
    update();
    window.addEventListener(EVT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  const save = (next: AdminState) => {
    saveAdmin(next);
    setS(next);
  };
  return [s, save];
}

// --- Student profile (single local student for now) ---
export interface StudentProfile {
  name: string;
  age?: number;
  createdAt: number;
}

export function loadStudent(): StudentProfile {
  if (typeof window === "undefined") return { name: "طالب", createdAt: Date.now() };
  try {
    const raw = localStorage.getItem(STUDENT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { name: "طالب", createdAt: Date.now() };
}

export function saveStudent(p: StudentProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STUDENT_KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("nuhba:student"));
}

export function resetStudentProgress() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("nuhba-progress-v1");
  window.dispatchEvent(new Event("nuhba:progress"));
}

export const uid = (prefix = "x") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
