"use client";

import { useMemo, useState } from "react";
import {
  bookingFieldLabel,
  bookingInput,
  bookingChoice,
} from "@/components/booking/booking-styles";
import { Button } from "@/components/ui/Button";

const VT = {
  TEXT: "TEXT",
  BOOLEAN: "BOOLEAN",
  INTEGER: "INTEGER",
  FLOAT: "FLOAT",
  DATETIME: "DATETIME",
  SELECT: "SELECT",
  MULTISELECT: "MULTISELECT",
} as const;

function questionLabel(q: { label?: string; name?: string }): string {
  return q.label || q.name || "Question";
}

function isAnswered(q: {
  valueType?: string;
  answer?: unknown;
}): boolean {
  const a = q.answer as { __typename?: string; textValue?: string } | undefined;
  if (!a) return false;
  const t = a.__typename || "";
  if (t.includes("Text") && "textValue" in a) {
    return Boolean(a.textValue?.trim());
  }
  if (t.includes("Boolean")) return true;
  if (t.includes("Integer") || t.includes("Float")) return true;
  if (t.includes("Select") || t.includes("Multi")) return true;
  if (t.includes("Datetime")) return true;
  return true;
}

export function needsIntakeStep(cart: {
  bookingQuestions?: Array<{ required?: boolean; answer?: unknown }>;
} | null): boolean {
  const qs = cart?.bookingQuestions;
  if (!qs?.length) return false;
  return qs.some((q) => q.required !== false && !isAnswered(q));
}

export type IntakeAnswer = { questionId: string; value: unknown };

interface BookingQuestionsFormProps {
  busy: boolean;
  /** Unanswered required questions from latest cart */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[];
  onContinue: (answers: IntakeAnswer[]) => Promise<void>;
  onBack: () => void;
}

export function BookingQuestionsForm({
  busy,
  questions,
  onContinue,
  onBack,
}: BookingQuestionsFormProps) {
  const [local, setLocal] = useState<
    Record<string, string | boolean | string[]>
  >({});

  async function handleContinue() {
    const ordered: IntakeAnswer[] = [];

    for (const q of questions) {
      const id = q.id as string;
      const vt = q.valueType as string;

      if (vt === VT.BOOLEAN) {
        if (typeof local[id] !== "boolean") return;
        ordered.push({ questionId: id, value: local[id] });
        continue;
      }
      if (vt === VT.TEXT) {
        const s = ((local[id] as string) ?? "").trim();
        if (!s) return;
        ordered.push({ questionId: id, value: s });
        continue;
      }
      if (vt === VT.INTEGER) {
        const n = parseInt(String(local[id] ?? ""), 10);
        if (Number.isNaN(n)) return;
        ordered.push({ questionId: id, value: n });
        continue;
      }
      if (vt === VT.FLOAT) {
        const n = parseFloat(String(local[id] ?? ""));
        if (Number.isNaN(n)) return;
        ordered.push({ questionId: id, value: n });
        continue;
      }
      if (vt === VT.DATETIME) {
        const s = (local[id] as string) ?? "";
        if (!s) return;
        ordered.push({ questionId: id, value: s });
        continue;
      }
      if (vt === VT.SELECT) {
        const optId = local[id] as string;
        if (!optId) return;
        const opt = (q.options ?? []).find((o: { id: string }) => o.id === optId);
        if (!opt) return;
        ordered.push({ questionId: id, value: opt });
        continue;
      }
      if (vt === VT.MULTISELECT) {
        const ids = (local[id] as string[]) ?? [];
        const opts = (q.options ?? []).filter((o: { id: string }) =>
          ids.includes(o.id)
        );
        if (!opts.length) return;
        ordered.push({ questionId: id, value: opts });
      }
    }

    if (ordered.length !== questions.length) return;

    await onContinue(ordered);
  }

  const canSubmit =
    questions.length > 0 &&
    questions.every((q: { id: string; valueType?: string }) => {
      const id = q.id;
      const vt = q.valueType as string;
      if (vt === VT.BOOLEAN) return typeof local[id] === "boolean";
      if (vt === VT.TEXT || vt === VT.DATETIME)
        return Boolean((local[id] as string)?.toString().trim());
      if (vt === VT.INTEGER || vt === VT.FLOAT)
        return local[id] !== undefined && String(local[id]).length > 0;
      if (vt === VT.SELECT) return Boolean(local[id]);
      if (vt === VT.MULTISELECT)
        return Array.isArray(local[id]) && (local[id] as string[]).length > 0;
      return false;
    });

  if (!questions.length) {
    return (
      <p className="text-sm text-silver">
        No additional questions for this booking.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map(
        (q: {
          id: string;
          valueType?: string;
          options?: Array<{ id: string; name?: string; label?: string }>;
        }) => {
          const id = q.id;
          const vt = q.valueType as string;
          const label = questionLabel(
          q as { label?: string; name?: string }
        );

          if (vt === VT.BOOLEAN) {
            return (
              <div key={id}>
                <p className={bookingFieldLabel}>{label}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className={`${bookingChoice} flex-1 ${local[id] === true ? "border-rose bg-rose-blush" : ""}`}
                    onClick={() => setLocal((s) => ({ ...s, [id]: true }))}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`${bookingChoice} flex-1 ${local[id] === false ? "border-rose bg-rose-blush" : ""}`}
                    onClick={() => setLocal((s) => ({ ...s, [id]: false }))}
                  >
                    No
                  </button>
                </div>
              </div>
            );
          }

          if (vt === VT.SELECT && q.options?.length) {
            return (
              <div key={id}>
                <p className={bookingFieldLabel}>{label}</p>
                <div className="space-y-2">
                  {q.options.map(
                    (opt: { id: string; name?: string; label?: string }) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`${bookingChoice} ${local[id] === opt.id ? "border-rose bg-rose-blush" : ""}`}
                        onClick={() => setLocal((s) => ({ ...s, [id]: opt.id }))}
                      >
                        {opt.name || opt.label || opt.id}
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          }

          if (vt === VT.MULTISELECT && q.options?.length) {
            const selected = (local[id] as string[]) ?? [];
            const toggle = (oid: string) => {
              setLocal((s) => {
                const cur = new Set((s[id] as string[]) ?? []);
                if (cur.has(oid)) cur.delete(oid);
                else cur.add(oid);
                return { ...s, [id]: [...cur] };
              });
            };
            return (
              <div key={id}>
                <p className={bookingFieldLabel}>{label}</p>
                <div className="space-y-2">
                  {q.options.map((opt: { id: string; name?: string }) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`${bookingChoice} ${selected.includes(opt.id) ? "border-rose bg-rose-blush" : ""}`}
                      onClick={() => toggle(opt.id)}
                    >
                      {selected.includes(opt.id) ? "✓ " : ""}
                      {opt.name || opt.id}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          if (vt === VT.TEXT) {
            return (
              <div key={id}>
                <label className={bookingFieldLabel} htmlFor={id}>
                  {label}
                </label>
                <textarea
                  id={id}
                  className={`${bookingInput} min-h-[100px]`}
                  value={(local[id] as string) ?? ""}
                  onChange={(e) =>
                    setLocal((s) => ({ ...s, [id]: e.target.value }))
                  }
                  rows={4}
                />
              </div>
            );
          }

          if (vt === VT.INTEGER || vt === VT.FLOAT) {
            return (
              <div key={id}>
                <label className={bookingFieldLabel} htmlFor={id}>
                  {label}
                </label>
                <input
                  id={id}
                  type="number"
                  className={bookingInput}
                  value={(local[id] as string) ?? ""}
                  onChange={(e) =>
                    setLocal((s) => ({ ...s, [id]: e.target.value }))
                  }
                />
              </div>
            );
          }

          if (vt === VT.DATETIME) {
            return (
              <div key={id}>
                <label className={bookingFieldLabel} htmlFor={id}>
                  {label}
                </label>
                <input
                  id={id}
                  type="datetime-local"
                  className={bookingInput}
                  value={(local[id] as string) ?? ""}
                  onChange={(e) =>
                    setLocal((s) => ({ ...s, [id]: e.target.value }))
                  }
                />
              </div>
            );
          }

          return null;
        }
      )}

      <div className="flex flex-wrap gap-4 pt-2">
        <Button
          type="button"
          disabled={busy || !canSubmit}
          onClick={() => void handleContinue()}
        >
          Continue
        </Button>
        <button
          type="button"
          className="text-sm text-silver underline"
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}

export function useUnansweredQuestions(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cart: any
) {
  return useMemo(() => {
    const qs = cart?.bookingQuestions ?? [];
    return qs.filter((q: { required?: boolean; answer?: unknown }) => {
      if (q.required === false) return false;
      return !isAnswered(q);
    });
  }, [cart]);
}
