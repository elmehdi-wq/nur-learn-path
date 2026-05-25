import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  applyOverride,
  getMergedLevels,
  loadStudent,
  resetStudentProgress,
  saveStudent,
  uid,
  useAdmin,
  type AdminState,
} from "@/lib/admin-store";
import { loadProgress } from "@/lib/progress";
import type { Exercise, Lesson, Unit } from "@/lib/curriculum";
import {
  BookPlus,
  FolderPlus,
  GraduationCap,
  Layers,
  PlayCircle,
  Plus,
  Trash2,
  Users,
  Video,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — نُخبة" },
      { name: "description", content: "إدارة المحتوى التعليمي والطلاب في منصة نُخبة." },
    ],
  }),
});

type Tab = "content" | "lessons" | "videos" | "students";

function AdminPage() {
  const [tab, setTab] = useState<Tab>("content");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold text-primary">المشرف</p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold">لوحة الإدارة</h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          أنشئ المستويات والوحدات والدروس، ارفع روابط الفيديوهات، أضف اختبارات،
          وتابع تقدّم الطلاب.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-border">
        {[
          { id: "content", label: "المستويات والوحدات", icon: Layers },
          { id: "lessons", label: "الدروس والاختبارات", icon: BookPlus },
          { id: "videos", label: "الفيديوهات", icon: Video },
          { id: "students", label: "الطلاب", icon: Users },
        ].map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "content" && <ContentTab />}
      {tab === "lessons" && <LessonsTab />}
      {tab === "videos" && <VideosTab />}
      {tab === "students" && <StudentsTab />}
    </div>
  );
}

/* =================== Content (levels + units) =================== */
function ContentTab() {
  const [state, save] = useAdmin();
  const merged = useMemo(() => getMergedLevels(state), [state]);

  const addLevel = () => {
    const title = prompt("اسم المستوى الجديد:");
    if (!title) return;
    save({
      ...state,
      customLevels: [
        ...state.customLevels,
        {
          id: uid("lvl"),
          number: merged.length + 1,
          title,
          description: "",
          units: [],
        },
      ],
    });
  };

  const addUnit = (levelId: string) => {
    const title = prompt("اسم الوحدة:");
    if (!title) return;
    save({
      ...state,
      customUnits: [
        ...state.customUnits,
        { id: uid("u"), levelId, title, description: "", icon: "📚", lessons: [] },
      ],
    });
  };

  const deleteCustomLevel = (id: string) => {
    if (!confirm("حذف هذا المستوى المخصّص؟")) return;
    save({ ...state, customLevels: state.customLevels.filter((l) => l.id !== id) });
  };

  const deleteCustomUnit = (id: string) => {
    if (!confirm("حذف هذه الوحدة المخصّصة؟")) return;
    save({ ...state, customUnits: state.customUnits.filter((u) => u.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={addLevel}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-soft hover:shadow-glow"
        >
          <Plus className="h-4 w-4" /> مستوى جديد
        </button>
      </div>

      {merged.map((lvl) => {
        const isCustomLevel = state.customLevels.some((c) => c.id === lvl.id);
        return (
          <div key={lvl.id} className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
                  {lvl.number}
                </span>
                <div>
                  <h3 className="font-bold">{lvl.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {lvl.units.length} وحدة
                    {isCustomLevel && (
                      <span className="ms-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                        مخصّص
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addUnit(lvl.id)}
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-bold hover:bg-primary-soft"
                >
                  <FolderPlus className="h-3.5 w-3.5" /> وحدة
                </button>
                {isCustomLevel && (
                  <button
                    onClick={() => deleteCustomLevel(lvl.id)}
                    className="rounded-lg border border-destructive/30 px-2.5 py-1.5 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {lvl.units.map((u) => {
                const isCustomUnit = state.customUnits.some((c) => c.id === u.id);
                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border bg-background px-3 py-2.5 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span>{u.icon}</span>
                      <span className="font-semibold">{u.title}</span>
                      <span className="text-xs text-muted-foreground">
                        · {u.lessons.length} درس
                      </span>
                      {isCustomUnit && (
                        <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold-foreground">
                          مخصّص
                        </span>
                      )}
                    </div>
                    {isCustomUnit && (
                      <button
                        onClick={() => deleteCustomUnit(u.id)}
                        className="text-destructive hover:opacity-80"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =================== Lessons + quizzes =================== */
function LessonsTab() {
  const [state, save] = useAdmin();
  const merged = useMemo(() => getMergedLevels(state), [state]);
  const allUnits = useMemo(
    () => merged.flatMap((l) => l.units.map((u) => ({ ...u, levelNumber: l.number }))),
    [merged],
  );

  const [editing, setEditing] = useState<Lesson | null>(null);
  const [unitId, setUnitId] = useState<string>(allUnits[0]?.id ?? "");

  const newLesson = () => {
    if (!unitId) {
      alert("أنشئ وحدة أولاً.");
      return;
    }
    setEditing({
      id: uid("l"),
      unitId,
      title: "",
      summary: "",
      minutes: 4,
      xp: 20,
      keyPoints: [""],
      exercises: [],
    });
  };

  const persistLesson = (l: Lesson) => {
    const exists = state.customLessons.find((x) => x.id === l.id);
    const customLessons = exists
      ? state.customLessons.map((x) => (x.id === l.id ? l : x))
      : [...state.customLessons, l];
    save({ ...state, customLessons });
    setEditing(null);
  };

  const deleteLesson = (id: string) => {
    if (!confirm("حذف هذا الدرس؟")) return;
    save({ ...state, customLessons: state.customLessons.filter((l) => l.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 rounded-2xl border bg-card p-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold mb-1">الوحدة</label>
          <select
            value={unitId}
            onChange={(e) => setUnitId(e.target.value)}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {allUnits.map((u) => (
              <option key={u.id} value={u.id}>
                مستوى {u.levelNumber} — {u.title}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={newLesson}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-soft"
        >
          <Plus className="h-4 w-4" /> درس جديد
        </button>
      </div>

      {editing && (
        <LessonEditor
          lesson={editing}
          units={allUnits}
          onSave={persistLesson}
          onCancel={() => setEditing(null)}
        />
      )}

      <div className="space-y-3">
        <h3 className="font-bold">الدروس المخصّصة ({state.customLessons.length})</h3>
        {state.customLessons.length === 0 && (
          <p className="text-sm text-muted-foreground rounded-xl border border-dashed p-6 text-center">
            لا توجد دروس مخصّصة بعد. اضغط «درس جديد» للبدء.
          </p>
        )}
        {state.customLessons.map((l) => {
          const u = allUnits.find((x) => x.id === l.unitId);
          return (
            <div
              key={l.id}
              className="flex items-center justify-between rounded-xl border bg-card p-4"
            >
              <div>
                <div className="font-bold">{l.title || "(بدون عنوان)"}</div>
                <div className="text-xs text-muted-foreground">
                  {u?.title} · {l.exercises.length} سؤال · {l.xp} XP
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(l)}
                  className="rounded-lg border px-3 py-1.5 text-xs font-bold hover:bg-primary-soft"
                >
                  تعديل
                </button>
                <button
                  onClick={() => deleteLesson(l.id)}
                  className="rounded-lg border border-destructive/30 px-2.5 py-1.5 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LessonEditor({
  lesson,
  units,
  onSave,
  onCancel,
}: {
  lesson: Lesson;
  units: (Unit & { levelNumber: number })[];
  onSave: (l: Lesson) => void;
  onCancel: () => void;
}) {
  const [l, setL] = useState<Lesson>(lesson);

  const addExercise = () => {
    setL({
      ...l,
      exercises: [
        ...l.exercises,
        {
          id: uid("e"),
          type: "mcq",
          question: "",
          options: ["", "", "", ""],
          answer: 0,
        },
      ],
    });
  };

  const updateExercise = (idx: number, ex: Exercise) => {
    const exercises = [...l.exercises];
    exercises[idx] = ex;
    setL({ ...l, exercises });
  };

  const removeExercise = (idx: number) => {
    setL({ ...l, exercises: l.exercises.filter((_, i) => i !== idx) });
  };

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-card p-5 shadow-card space-y-4">
      <h3 className="font-bold text-lg">محرّر الدرس</h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="عنوان الدرس">
          <input
            value={l.title}
            onChange={(e) => setL({ ...l, title: e.target.value })}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            maxLength={120}
          />
        </Field>
        <Field label="الوحدة">
          <select
            value={l.unitId}
            onChange={(e) => setL({ ...l, unitId: e.target.value })}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {units.map((u) => (
              <option key={u.id} value={u.id}>
                مستوى {u.levelNumber} — {u.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="المدّة (دقيقة)">
          <input
            type="number"
            min={1}
            max={60}
            value={l.minutes}
            onChange={(e) => setL({ ...l, minutes: Number(e.target.value) || 1 })}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </Field>
        <Field label="نقاط الخبرة XP">
          <input
            type="number"
            min={5}
            max={200}
            value={l.xp}
            onChange={(e) => setL({ ...l, xp: Number(e.target.value) || 10 })}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <Field label="ملخّص قصير">
        <textarea
          value={l.summary}
          onChange={(e) => setL({ ...l, summary: e.target.value })}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
          rows={2}
          maxLength={300}
        />
      </Field>

      <Field label="رابط الفيديو (اختياري)">
        <input
          value={l.videoEmbed ?? ""}
          onChange={(e) => setL({ ...l, videoEmbed: e.target.value })}
          placeholder="https://www.youtube.com/embed/..."
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm ltr text-left"
          dir="ltr"
        />
      </Field>

      <div>
        <label className="block text-xs font-bold mb-1">النقاط الرئيسية</label>
        {l.keyPoints.map((k, i) => (
          <div key={i} className="mb-2 flex gap-2">
            <input
              value={k}
              onChange={(e) => {
                const kp = [...l.keyPoints];
                kp[i] = e.target.value;
                setL({ ...l, keyPoints: kp });
              }}
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={() =>
                setL({ ...l, keyPoints: l.keyPoints.filter((_, x) => x !== i) })
              }
              className="rounded-lg border border-destructive/30 px-2 text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          onClick={() => setL({ ...l, keyPoints: [...l.keyPoints, ""] })}
          className="text-xs font-bold text-primary"
        >
          + إضافة نقطة
        </button>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-bold">الأسئلة ({l.exercises.length})</label>
          <button
            onClick={addExercise}
            className="text-xs font-bold text-primary"
          >
            + سؤال
          </button>
        </div>
        <div className="space-y-3">
          {l.exercises.map((ex, i) => (
            <ExerciseEditor
              key={ex.id}
              ex={ex}
              onChange={(next) => updateExercise(i, next)}
              onRemove={() => removeExercise(i)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t">
        <button
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm font-bold hover:bg-muted"
        >
          إلغاء
        </button>
        <button
          onClick={() => {
            if (!l.title.trim()) return alert("أدخل عنوان الدرس.");
            onSave({
              ...l,
              keyPoints: l.keyPoints.filter((k) => k.trim()),
            });
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          حفظ الدرس
        </button>
      </div>
    </div>
  );
}

function ExerciseEditor({
  ex,
  onChange,
  onRemove,
}: {
  ex: Exercise;
  onChange: (e: Exercise) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border bg-background p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <select
          value={ex.type}
          onChange={(e) => {
            const type = e.target.value as Exercise["type"];
            if (type === "truefalse") {
              onChange({ ...ex, type, options: ["صحيح", "خطأ"], answer: 0 });
            } else {
              onChange({ ...ex, type, options: ex.options ?? ["", "", "", ""] });
            }
          }}
          className="rounded-lg border bg-card px-2 py-1 text-xs font-bold"
        >
          <option value="mcq">اختيار من متعدّد</option>
          <option value="truefalse">صحيح / خطأ</option>
          <option value="order">ترتيب</option>
        </select>
        <button onClick={onRemove} className="text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <input
        value={ex.question}
        onChange={(e) => onChange({ ...ex, question: e.target.value })}
        placeholder="نص السؤال"
        className="w-full rounded-lg border bg-card px-3 py-2 text-sm"
      />
      {(ex.options ?? []).map((opt, i) => (
        <div key={i} className="flex items-center gap-2">
          {ex.type !== "order" && (
            <input
              type="radio"
              checked={ex.answer === i}
              onChange={() => onChange({ ...ex, answer: i })}
            />
          )}
          {ex.type === "order" && (
            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
              {i + 1}
            </span>
          )}
          <input
            value={opt}
            onChange={(e) => {
              const options = [...(ex.options ?? [])];
              options[i] = e.target.value;
              onChange({ ...ex, options });
            }}
            placeholder={`خيار ${i + 1}`}
            className="flex-1 rounded-lg border bg-card px-3 py-1.5 text-sm"
          />
          {ex.type === "mcq" && (
            <button
              onClick={() => {
                const options = (ex.options ?? []).filter((_, x) => x !== i);
                onChange({ ...ex, options });
              }}
              className="text-destructive"
            >
              ×
            </button>
          )}
        </div>
      ))}
      {ex.type === "mcq" && (
        <button
          onClick={() =>
            onChange({ ...ex, options: [...(ex.options ?? []), ""] })
          }
          className="text-xs font-bold text-primary"
        >
          + خيار
        </button>
      )}
      {ex.type === "order" && (
        <p className="text-[10px] text-muted-foreground">
          الترتيب الصحيح هو الترتيب الحالي للخيارات من الأعلى للأسفل.
        </p>
      )}
      <input
        value={ex.explanation ?? ""}
        onChange={(e) => onChange({ ...ex, explanation: e.target.value })}
        placeholder="شرح الإجابة (اختياري)"
        className="w-full rounded-lg border bg-card px-3 py-2 text-xs"
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1">{label}</label>
      {children}
    </div>
  );
}

/* =================== Videos =================== */
function VideosTab() {
  const [state, save] = useAdmin();
  const merged = useMemo(() => getMergedLevels(state), [state]);
  const allLessons = useMemo(
    () => merged.flatMap((l) => l.units.flatMap((u) => u.lessons)),
    [merged],
  );

  const setVideo = (lessonId: string, url: string) => {
    const overrides = { ...state.overrides };
    const cur = overrides[lessonId] ?? {};
    overrides[lessonId] = { ...cur, videoUrl: url || undefined };
    save({ ...state, overrides });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        ألصق رابط تضمين الفيديو (YouTube embed أو رابط mp4) لكل درس.
      </p>
      {allLessons.map((l) => {
        const current = applyOverride(l, state).videoEmbed ?? "";
        return (
          <div key={l.id} className="rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <PlayCircle className="h-4 w-4 text-primary" />
              <span className="font-bold">{l.title}</span>
            </div>
            <input
              defaultValue={current}
              onBlur={(e) => setVideo(l.id, e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              dir="ltr"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm ltr text-left"
            />
          </div>
        );
      })}
    </div>
  );
}

/* =================== Students =================== */
function StudentsTab() {
  const [mounted, setMounted] = useState(false);
  const [student, setStudent] = useState(() => loadStudent());
  const [progress, setProgress] = useState(() => loadProgress());
  const [state] = useAdmin();
  const all = useMemo(
    () => getMergedLevels(state).flatMap((l) => l.units.flatMap((u) => u.lessons)),
    [state],
  );

  useEffect(() => {
    setMounted(true);
    setStudent(loadStudent());
    setProgress(loadProgress());
    const onP = () => setProgress(loadProgress());
    window.addEventListener("nuhba:progress", onP);
    return () => window.removeEventListener("nuhba:progress", onP);
  }, []);

  if (!mounted) {
    return <div className="text-sm text-muted-foreground">جاري التحميل…</div>;
  }

  const completed = Object.entries(progress.completed);
  const masteryCount = completed.filter(([, c]) => c.score >= 70).length;
  const avgScore = completed.length
    ? Math.round(
        completed.reduce((s, [, c]) => s + c.score, 0) / completed.length,
      )
    : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">الملف الشخصي للطالب</h3>
            <p className="text-xs text-muted-foreground">
              منذ {new Date(student.createdAt).toLocaleDateString("ar")}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="اسم الطالب">
            <input
              value={student.name}
              onChange={(e) => {
                const next = { ...student, name: e.target.value };
                setStudent(next);
                saveStudent(next);
              }}
              maxLength={50}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </Field>
          <Field label="العمر">
            <input
              type="number"
              min={5}
              max={18}
              value={student.age ?? ""}
              onChange={(e) => {
                const next = { ...student, age: Number(e.target.value) || undefined };
                setStudent(next);
                saveStudent(next);
              }}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </Field>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <Stat label="XP" value={progress.xp} />
          <Stat label="السلسلة" value={`${progress.streak} يوم`} />
          <Stat label="دروس متقَنة" value={`${masteryCount}/${all.length}`} />
          <Stat label="متوسط الدرجات" value={`${avgScore}%`} />
        </div>

        <button
          onClick={() => {
            if (confirm("تصفير تقدّم الطالب بالكامل؟")) {
              resetStudentProgress();
              setProgress(loadProgress());
            }
          }}
          className="mt-4 rounded-lg border border-destructive/30 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
        >
          تصفير التقدّم
        </button>
      </div>

      <div className="rounded-2xl border bg-card p-5 shadow-card">
        <h3 className="font-bold mb-3">سجلّ الدروس</h3>
        {completed.length === 0 ? (
          <p className="text-sm text-muted-foreground">لم يكمل الطالب أي درس بعد.</p>
        ) : (
          <div className="space-y-2">
            {completed
              .sort((a, b) => b[1].at - a[1].at)
              .map(([id, c]) => {
                const l = all.find((x) => x.id === id);
                const ok = c.score >= 70;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-sm"
                  >
                    <span className="font-semibold">{l?.title ?? id}</span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          ok
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {c.score}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.at).toLocaleDateString("ar")}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-background px-3 py-3">
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
