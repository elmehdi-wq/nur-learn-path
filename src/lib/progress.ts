// Lightweight client-side progress store (localStorage). Replace with Lovable Cloud later.
import { allLessons } from "./curriculum";

const KEY = "nuhba-progress-v1";

export interface ProgressState {
  completed: Record<string, { score: number; xp: number; at: number }>;
  xp: number;
  streak: number;
  lastDay: string | null;
}

const empty: ProgressState = { completed: {}, xp: 0, streak: 0, lastDay: null };

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function saveProgress(p: ProgressState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("nuhba:progress"));
}

export function completeLesson(lessonId: string, score: number, xp: number) {
  const p = loadProgress();
  const today = new Date().toISOString().slice(0, 10);
  const prev = p.completed[lessonId];
  const bestScore = Math.max(prev?.score ?? 0, score);
  const earned = prev ? 0 : xp; // only first completion earns XP
  p.completed[lessonId] = { score: bestScore, xp: prev?.xp ?? xp, at: Date.now() };
  p.xp += earned;
  if (p.lastDay !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    p.streak = p.lastDay === yesterday ? p.streak + 1 : 1;
    p.lastDay = today;
  }
  saveProgress(p);
  return p;
}

export function isUnlocked(lessonId: string): boolean {
  const idx = allLessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  const prev = allLessons[idx - 1];
  const p = loadProgress();
  return !!p.completed[prev.id] && p.completed[prev.id].score >= 70;
}

export function masteryPercent(): number {
  const p = loadProgress();
  const total = allLessons.length;
  const done = Object.values(p.completed).filter((c) => c.score >= 70).length;
  return Math.round((done / total) * 100);
}

export function nextRecommended() {
  const p = loadProgress();
  return allLessons.find((l) => !p.completed[l.id] || p.completed[l.id].score < 70) ?? null;
}
