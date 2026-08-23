"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { VISUALIZER_DISCLAIMER } from "@/lib/visualizer/brand";
import { readVisualizerResponse } from "@/lib/visualizer/fetch-json";
import {
  getDefaultZonesForTreatment,
  getTreatmentOption,
  isValidTreatmentType,
} from "@/lib/visualizer/treatments";
import type { FaceAnalysis, IntensityPreset, TreatmentType, TreatmentZoneId } from "@/lib/visualizer/types";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { SelfieCapture } from "./SelfieCapture";
import { IntakeForm, TreatmentPicker, TreatmentTypePicker } from "./TreatmentPicker";
import { PhotoConsent } from "./VisualizerDisclaimer";

type Step = "upload" | "treatment" | "generating" | "preview" | "intake" | "contact" | "done";

const PROGRESS: { key: Step; label: string }[] = [
  { key: "upload", label: "Photo" },
  { key: "treatment", label: "Customize" },
  { key: "preview", label: "Preview" },
];

function createSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `viz-${Date.now()}`;
}

function initialTreatmentType(searchParams: ReturnType<typeof useSearchParams>): TreatmentType {
  const param = searchParams.get("treatment");
  if (param === "laser" || param === "laser-pigmentation") return "laser-pigmentation";
  if (param && isValidTreatmentType(param)) return param;
  return "botox";
}

function progressIndex(step: Step): number {
  if (step === "generating") return 1;
  if (step === "intake" || step === "contact" || step === "done") return 2;
  return PROGRESS.findIndex((s) => s.key === step);
}

export function VisualizerWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("upload");
  const [consent, setConsent] = useState(false);
  const [treatmentType, setTreatmentType] = useState<TreatmentType>(() =>
    initialTreatmentType(searchParams)
  );
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [zones, setZones] = useState<TreatmentZoneId[]>(() =>
    getDefaultZonesForTreatment(initialTreatmentType(searchParams))
  );
  const [intensity, setIntensity] = useState<IntensityPreset>("subtle");
  const [sessionId, setSessionId] = useState(createSessionId);
  const [beforeDataUrl, setBeforeDataUrl] = useState<string | null>(null);
  const [afterDataUrl, setAfterDataUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"live" | "demo" | null>(null);
  const [calibrated, setCalibrated] = useState(false);
  const [followUpSubmitted, setFollowUpSubmitted] = useState(false);
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const treatmentOption = useMemo(() => getTreatmentOption(treatmentType), [treatmentType]);
  const bookingHref = useMemo(
    () => resolveBookingHref({ service: treatmentOption.bookingService }),
    [treatmentOption.bookingService]
  );

  const handleTreatmentTypeChange = useCallback((next: TreatmentType) => {
    setTreatmentType(next);
    setZones(getDefaultZonesForTreatment(next));
    setAnalysis(null);
  }, []);

  const runAnalysis = useCallback(
    async (dataUrl: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/visualizer/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl, treatmentType }),
        });
        const data = await readVisualizerResponse<{
          analysis?: FaceAnalysis;
          error?: string;
        }>(res);
        if (!res.ok || !data.analysis) {
          throw new Error(data.analysis?.notes ?? data.error ?? "Photo analysis failed");
        }
        setAnalysis(data.analysis);
        if (data.analysis.zones?.length) {
          setZones(data.analysis.zones.slice(0, 4));
        }
        setStep("treatment");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed");
      } finally {
        setLoading(false);
      }
    },
    [treatmentType]
  );

  const runGenerate = useCallback(async () => {
    if (!imageDataUrl) return;
    setStep("generating");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/visualizer/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageDataUrl,
          treatmentType,
          zones,
          intensity,
          sessionId,
          regions: analysis?.regions,
        }),
      });
      const data = await readVisualizerResponse<{
        beforeDataUrl?: string;
        afterDataUrl?: string;
        sessionId?: string;
        mode?: "live" | "demo";
        calibrated?: boolean;
        error?: string;
      }>(res);
      if (!res.ok || !data.beforeDataUrl || !data.afterDataUrl) {
        throw new Error(data.error ?? "Generation failed");
      }
      setBeforeDataUrl(data.beforeDataUrl);
      setAfterDataUrl(data.afterDataUrl);
      setSessionId(data.sessionId ?? sessionId);
      setMode(data.mode ?? "demo");
      setCalibrated(Boolean(data.calibrated));
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStep("treatment");
    } finally {
      setLoading(false);
    }
  }, [analysis?.regions, imageDataUrl, intensity, sessionId, treatmentType, zones]);

  const submitLead = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/visualizer/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name,
          email: email || undefined,
          phone: phone || undefined,
          treatmentType,
          zones,
          intensity,
          goal: goal || undefined,
          timeline: timeline || undefined,
          budget: budget || undefined,
          consent: true,
        }),
      });
      const data = await readVisualizerResponse<{ error?: string }>(res);
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setFollowUpSubmitted(true);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }, [budget, email, goal, intensity, name, phone, sessionId, timeline, treatmentType, zones]);

  const currentProgress = progressIndex(step);

  return (
    <div className="max-w-lg mx-auto">
      {step !== "generating" && step !== "intake" && step !== "contact" && (
        <div className="flex justify-center gap-8 mb-8 text-[0.625rem] font-bold tracking-[0.15em] uppercase">
          {PROGRESS.map((s, i) => (
            <span key={s.key} className={i <= currentProgress ? "text-rose" : "text-silver-light"}>
              {s.label}
            </span>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-rose-blush border border-rose-light rounded-lg text-sm text-rose-dark text-center">
          {error}
        </div>
      )}

      {step === "upload" && (
        <div className="space-y-6">
          <TreatmentTypePicker
            treatmentType={treatmentType}
            onTreatmentTypeChange={handleTreatmentTypeChange}
          />
          <SelfieCapture
            disabled={loading}
            onCapture={(dataUrl) => {
              setImageDataUrl(dataUrl);
            }}
          />
          <PhotoConsent checked={consent} onChange={setConsent} />
          <div className="flex justify-center">
            <Button
              type="button"
              disabled={!imageDataUrl || !consent || loading}
              onClick={() => imageDataUrl && void runAnalysis(imageDataUrl)}
              className="min-w-[160px]"
            >
              {loading ? "Analyzing…" : "Continue"}
            </Button>
          </div>
        </div>
      )}

      {step === "treatment" && (
        <div className="space-y-6">
          <TreatmentTypePicker
            treatmentType={treatmentType}
            onTreatmentTypeChange={handleTreatmentTypeChange}
            compact
          />
          <TreatmentPicker
            treatmentType={treatmentType}
            selectedZones={zones}
            intensity={intensity}
            onZonesChange={setZones}
            onIntensityChange={setIntensity}
          />
          <div className="flex justify-center gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep("upload")}>
              Back
            </Button>
            <Button type="button" disabled={loading} onClick={() => void runGenerate()}>
              Preview
            </Button>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-rose border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-silver">Creating preview…</p>
        </div>
      )}

      {step === "preview" && beforeDataUrl && afterDataUrl && (
        <div className="space-y-6">
          <BeforeAfterSlider
            beforeSrc={beforeDataUrl}
            afterSrc={afterDataUrl}
            demoEffect={mode === "demo"}
          />
          {calibrated && (
            <p className="text-center text-xs text-silver tracking-wide">
              Calibrated to Rella patient outcomes
            </p>
          )}
          {mode === "demo" && (
            <p className="text-center text-xs text-silver-light tracking-wide">
              Demo preview — add OPENAI_API_KEY on Vercel for live AI results
            </p>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-2">
            <Button type="button" variant="ghost" onClick={() => setStep("treatment")}>
              Adjust
            </Button>
            <Button href={bookingHref}>Book</Button>
            <Button type="button" variant="ghost" onClick={() => setStep("intake")}>
              Follow Up
            </Button>
          </div>
        </div>
      )}

      {step === "intake" && (
        <div className="space-y-6">
          <p className="text-sm text-silver text-center">Optional follow-up</p>
          <IntakeForm
            goal={goal}
            timeline={timeline}
            budget={budget}
            treatmentType={treatmentType}
            onGoalChange={setGoal}
            onTimelineChange={setTimeline}
            onBudgetChange={setBudget}
          />
          <div className="flex justify-center gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep("preview")}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep("contact")}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === "contact" && (
        <div className="space-y-6">
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label htmlFor="viz-name" className="block text-sm font-medium text-silver-dark mb-1">
                Name
              </label>
              <input
                id="viz-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-silver-light rounded px-4 py-3 text-sm text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
              />
            </div>
            <div>
              <label htmlFor="viz-email" className="block text-sm font-medium text-silver-dark mb-1">
                Email
              </label>
              <input
                id="viz-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-silver-light rounded px-4 py-3 text-sm text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
              />
            </div>
            <div>
              <label htmlFor="viz-phone" className="block text-sm font-medium text-silver-dark mb-1">
                Phone
              </label>
              <input
                id="viz-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-silver-light rounded px-4 py-3 text-sm text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
              />
            </div>
          </div>
          <div className="flex justify-center gap-3 flex-wrap">
            <Button type="button" variant="ghost" onClick={() => setStep("intake")}>
              Back
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep("preview")}>
              Skip
            </Button>
            <Button
              type="button"
              disabled={loading || !name || (!email && !phone)}
              onClick={() => void submitLead()}
            >
              {loading ? "Sending…" : "Send"}
            </Button>
          </div>
        </div>
      )}

      {step === "done" && beforeDataUrl && afterDataUrl && (
        <div className="space-y-6 text-center">
          <h2 className="font-bold text-lg tracking-[0.06em] uppercase text-rose-text">
            {followUpSubmitted ? "Thank You" : "Your Preview"}
          </h2>
          <BeforeAfterSlider
            beforeSrc={beforeDataUrl}
            afterSrc={afterDataUrl}
            demoEffect={mode === "demo"}
          />
          <Button href={bookingHref}>Book Consultation</Button>
        </div>
      )}

      <p className="mt-10 text-center text-[0.625rem] text-silver-light leading-relaxed max-w-sm mx-auto">
        {VISUALIZER_DISCLAIMER}
      </p>
    </div>
  );
}
