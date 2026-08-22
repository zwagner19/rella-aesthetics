"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { resolveBookingHref } from "@/lib/booking-routes";
import { RELLA_BRAND, VISUALIZER_INTRO_COPY } from "@/lib/visualizer/brand";
import type { BotoxZone, FaceAnalysis, IntensityPreset } from "@/lib/visualizer/types";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { SelfieCapture } from "./SelfieCapture";
import { IntakeForm, TreatmentPicker } from "./TreatmentPicker";
import { PhotoConsent, VisualizerDisclaimer } from "./VisualizerDisclaimer";

type Step =
  | "intro"
  | "upload"
  | "treatment"
  | "generating"
  | "preview"
  | "intake"
  | "contact"
  | "complete";

const STEP_LABELS: Record<Step, string> = {
  intro: "Welcome",
  upload: "Upload",
  treatment: "Treatment",
  generating: "Generating",
  preview: "Preview",
  intake: "Goals",
  contact: "Contact",
  complete: "Complete",
};

function createSessionId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `viz-${Date.now()}`;
}

export function VisualizerWizard() {
  const [step, setStep] = useState<Step>("intro");
  const [consent, setConsent] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FaceAnalysis | null>(null);
  const [zones, setZones] = useState<BotoxZone[]>(["forehead", "glabella"]);
  const [intensity, setIntensity] = useState<IntensityPreset>("subtle");
  const [sessionId, setSessionId] = useState(createSessionId);
  const [beforeDataUrl, setBeforeDataUrl] = useState<string | null>(null);
  const [afterDataUrl, setAfterDataUrl] = useState<string | null>(null);
  const [mode, setMode] = useState<"live" | "demo" | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [goal, setGoal] = useState("");
  const [timeline, setTimeline] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const bookingHref = useMemo(() => resolveBookingHref({ service: "botox" }), []);

  const runAnalysis = useCallback(async (dataUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/visualizer/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.analysis?.notes ?? data.error ?? "Photo analysis failed");
      }
      setAnalysis(data.analysis);
      if (data.analysis.zones?.length) {
        setZones(data.analysis.zones.slice(0, 3));
      }
      setStep("treatment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, []);

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
          zones,
          intensity,
          sessionId,
          regions: analysis?.regions,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setBeforeDataUrl(data.beforeDataUrl);
      setAfterDataUrl(data.afterDataUrl);
      setSessionId(data.sessionId);
      setMode(data.mode);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
      setStep("treatment");
    } finally {
      setLoading(false);
    }
  }, [analysis?.regions, imageDataUrl, intensity, sessionId, zones]);

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
          zones,
          intensity,
          goal: goal || undefined,
          timeline: timeline || undefined,
          budget: budget || undefined,
          consent: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setUnlocked(true);
      setStep("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }, [budget, email, goal, intensity, name, phone, sessionId, timeline, zones]);

  const progressSteps: Step[] = ["intro", "upload", "treatment", "preview", "intake", "contact", "complete"];
  const progressIndex = progressSteps.indexOf(step === "generating" ? "treatment" : step);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      {step !== "generating" && (
        <div className="flex justify-between mb-10 text-[0.625rem] font-bold tracking-[0.15em] uppercase text-silver-light">
          {progressSteps
            .filter((s) => s !== "generating")
            .map((s, i) => (
              <span
                key={s}
                className={i <= progressIndex ? "text-rose" : undefined}
              >
                {STEP_LABELS[s]}
              </span>
            ))}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-rose-blush border border-rose-light rounded-lg text-sm text-rose-dark">
          {error}
        </div>
      )}

      {step === "intro" && (
        <div className="space-y-6 text-center">
          <p className="text-sm text-silver leading-relaxed max-w-lg mx-auto">
            {VISUALIZER_INTRO_COPY}
          </p>
          <VisualizerDisclaimer />
          <PhotoConsent checked={consent} onChange={setConsent} />
          <Button
            type="button"
            disabled={!consent}
            onClick={() => setStep("upload")}
            className="mx-auto"
          >
            Get Started
          </Button>
        </div>
      )}

      {step === "upload" && (
        <div className="space-y-6">
          <SelfieCapture
            disabled={loading}
            onCapture={(dataUrl) => {
              setImageDataUrl(dataUrl);
            }}
          />
          <div className="flex justify-center gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep("intro")}>
              Back
            </Button>
            <Button
              type="button"
              disabled={!imageDataUrl || loading}
              onClick={() => imageDataUrl && void runAnalysis(imageDataUrl)}
            >
              {loading ? "Analyzing..." : "Continue"}
            </Button>
          </div>
        </div>
      )}

      {step === "treatment" && (
        <div className="space-y-6">
          {analysis?.notes && (
            <p className="text-sm text-silver text-center">{analysis.notes}</p>
          )}
          <TreatmentPicker
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
              Generate Preview
            </Button>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="py-16 text-center space-y-4">
          <div className="w-12 h-12 border-2 border-rose border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-silver">Creating your conservative preview…</p>
          <p className="text-xs text-silver-light">This usually takes 10–20 seconds</p>
        </div>
      )}

      {step === "preview" && beforeDataUrl && afterDataUrl && (
        <div className="space-y-6">
          {mode === "demo" && (
            <p className="text-xs text-center text-silver bg-silver-pale rounded px-3 py-2">
              Demo preview mode — configure OPENAI_API_KEY for live AI edits.
            </p>
          )}
          <BeforeAfterSlider
            beforeSrc={beforeDataUrl}
            afterSrc={afterDataUrl}
            blurred={!unlocked}
          />
          {!unlocked && (
            <p className="text-sm text-silver text-center">
              Complete a short intake to unlock your full-resolution preview and save your results.
            </p>
          )}
          <VisualizerDisclaimer compact />
          <div className="flex justify-center gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep("treatment")}>
              Adjust
            </Button>
            <Button type="button" onClick={() => setStep("intake")}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === "intake" && (
        <div className="space-y-6">
          <IntakeForm
            goal={goal}
            timeline={timeline}
            budget={budget}
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
          <p className="text-sm text-silver text-center">
            Enter your details to unlock your preview and connect with the {RELLA_BRAND.name} team.
          </p>
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <label htmlFor="viz-name" className="block text-sm font-medium text-silver-dark mb-1">
                Full Name
              </label>
              <input
                id="viz-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
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
                className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
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
                className="w-full border border-silver-light rounded px-4 py-3 text-silver-dark bg-white focus:border-rose focus:ring-2 focus:ring-rose/20"
              />
            </div>
            <p className="text-xs text-silver">Email or phone is required.</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button type="button" variant="ghost" onClick={() => setStep("intake")}>
              Back
            </Button>
            <Button
              type="button"
              disabled={loading || !name || (!email && !phone)}
              onClick={() => void submitLead()}
            >
              {loading ? "Saving..." : "Unlock Preview"}
            </Button>
          </div>
        </div>
      )}

      {step === "complete" && beforeDataUrl && afterDataUrl && (
        <div className="space-y-6 text-center">
          <h2 className="font-bold text-xl tracking-[0.06em] uppercase text-rose-text">
            Your Preview Is Ready
          </h2>
          <BeforeAfterSlider beforeSrc={beforeDataUrl} afterSrc={afterDataUrl} />
          <VisualizerDisclaimer compact />
          <p className="text-sm text-silver">
            The {RELLA_BRAND.name} team will follow up shortly. When you&apos;re ready, book a
            consultation at our {RELLA_BRAND.locations} locations to discuss your personalized
            treatment plan.
          </p>
          <Button href={bookingHref}>Book at Rella</Button>
        </div>
      )}
    </div>
  );
}
