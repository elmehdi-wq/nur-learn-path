import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/curriculum";
import { Check, X, RefreshCw } from "lucide-react";

interface Props {
  exercises: Exercise[];
  onDone: (scorePercent: number) => void;
}

export function Quiz({ exercises, onDone }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);

  const ex = exercises[idx];
  const isOrder = ex.type === "order";

  // shuffled options for "order"
  const shuffled = useMemo(() => {
    if (!isOrder) return [];
    const arr = ex.options!.map((_, i) => i);
    return arr.sort(() => Math.random() - 0.5);
  }, [ex.id]);

  const orderRemaining = shuffled.filter((i) => !order.includes(i));

  const submit = () => {
    let ok = false;
    if (isOrder) {
      const ans = ex.answer as number[];
      ok = order.length === ans.length && order.every((v, i) => v === ans[i]);
    } else {
      ok = picked === (ex.answer as number);
    }
    if (ok) setCorrect((c) => c + 1);
    setRevealed(true);
  };

  const next = () => {
    if (idx + 1 >= exercises.length) {
      const score = Math.round(((correct + (isCurrentCorrect() ? 0 : 0)) / exercises.length) * 100);
      // correct already incremented in submit
      onDone(Math.round((correct / exercises.length) * 100));
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
    setOrder([]);
    setRevealed(false);
  };

  const isCurrentCorrect = () => {
    if (isOrder) {
      const ans = ex.answer as number[];
      return order.length === ans.length && order.every((v, i) => v === ans[i]);
    }
    return picked === (ex.answer as number);
  };

  const canSubmit = isOrder ? order.length === ex.options!.length : picked !== null;

  return (
    <div className="rounded-3xl border bg-card p-6 sm:p-8 shadow-card">
      {/* progress dots */}
      <div className="mb-6 flex items-center gap-1.5">
        {exercises.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < idx ? "bg-primary" : i === idx ? "bg-primary/60" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <p className="text-xs font-semibold text-primary mb-2">
        السؤال {idx + 1} من {exercises.length}
      </p>
      <h3 className="text-xl sm:text-2xl font-bold text-balance mb-6 leading-snug">
        {ex.question}
      </h3>

      {!isOrder && (
        <div className="space-y-2.5">
          {ex.options!.map((opt, i) => {
            const isPicked = picked === i;
            const isAnswer = (ex.answer as number) === i;
            let cls = "border-border bg-background hover:border-primary hover:bg-primary-soft/40";
            if (revealed && isAnswer) cls = "border-success bg-success/10";
            else if (revealed && isPicked && !isAnswer) cls = "border-destructive bg-destructive/10";
            else if (isPicked) cls = "border-primary bg-primary-soft";
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setPicked(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-right transition-all ${cls}`}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                  {["أ", "ب", "ج", "د"][i]}
                </span>
                <span className="flex-1 text-sm sm:text-base font-medium">{opt}</span>
                {revealed && isAnswer && <Check className="h-5 w-5 text-success" />}
                {revealed && isPicked && !isAnswer && <X className="h-5 w-5 text-destructive" />}
              </button>
            );
          })}
        </div>
      )}

      {isOrder && (
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-dashed border-border bg-muted/40 p-3 min-h-[64px]">
            <p className="text-xs text-muted-foreground mb-2">ترتيبك:</p>
            <div className="flex flex-wrap gap-2">
              {order.length === 0 && <span className="text-sm text-muted-foreground">اضغط على البطاقات بالترتيب الصحيح</span>}
              {order.map((i, pos) => (
                <button
                  key={pos}
                  onClick={() => !revealed && setOrder(order.filter((_, p) => p !== pos))}
                  className="rounded-xl bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                >
                  {pos + 1}. {ex.options![i]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {orderRemaining.map((i) => (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setOrder([...order, i])}
                className="rounded-xl border-2 border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary hover:bg-primary-soft transition-colors"
              >
                {ex.options![i]}
              </button>
            ))}
          </div>
        </div>
      )}

      {revealed && ex.explanation && (
        <div className="mt-5 rounded-2xl bg-accent/30 p-4 text-sm leading-relaxed">
          <span className="font-semibold">💡 شرح: </span>
          {ex.explanation}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          إجابات صحيحة: <span className="font-bold text-foreground">{correct}</span>
        </div>
        {!revealed ? (
          <button
            disabled={!canSubmit}
            onClick={submit}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:opacity-95 disabled:opacity-40"
          >
            تأكيد الإجابة
          </button>
        ) : (
          <button
            onClick={next}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:opacity-95 flex items-center gap-2"
          >
            {idx + 1 >= exercises.length ? (
              <>
                إنهاء <Check className="h-4 w-4" />
              </>
            ) : (
              <>
                التالي <RefreshCw className="h-4 w-4 rotate-180" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
