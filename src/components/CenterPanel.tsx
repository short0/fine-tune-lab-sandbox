import { useState } from "react";
import { Wand2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SectionLabel } from "./SectionLabel";
import type { LabState } from "@/lib/lab-store";
import { getPreset } from "@/lib/presets";

type Props = {
  state: LabState;
  setState: (next: LabState | ((s: LabState) => LabState)) => void;
};

export function CenterPanel({ state, setState }: Props) {
  const [running, setRunning] = useState(false);
  const preset = state.presetId ? getPreset(state.presetId) : null;

  const runComparison = () => {
    if (!state.customPrompt.trim()) return;
    setRunning(true);
    // Simulated outputs derived from preset patterns.
    setTimeout(() => {
      if (preset) {
        const baseSuffix =
          " (Generic response — try contacting our team or check the documentation.)";
        const tunedSample = preset.tunedOutput;
        setState((s) => ({
          ...s,
          baselineOutput: `Re: "${state.customPrompt}"\n\n${preset.baselineOutput}${baseSuffix}`,
          tunedOutput: `Re: "${state.customPrompt}"\n\n${tunedSample}`,
        }));
      } else {
        setState((s) => ({
          ...s,
          baselineOutput: `Generic response to: ${state.customPrompt}`,
          tunedOutput: `Tuned response (define examples to see improvement) for: ${state.customPrompt}`,
        }));
      }
      setRunning(false);
    }, 450);
  };

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Prompt input */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-soft">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Try a prompt</SectionLabel>
        </div>
        <div className="flex gap-2">
          <Textarea
            value={state.customPrompt}
            onChange={(e) => setState({ ...state, customPrompt: e.target.value })}
            placeholder={
              preset ? "Type a prompt or pick a quick one below…" : "Pick a preset to get started."
            }
            className="min-h-[60px] resize-none text-sm"
          />
          <Button
            onClick={runComparison}
            disabled={running || !state.customPrompt.trim()}
            className="h-auto self-stretch px-3"
          >
            {running ? (
              <Wand2 className="h-4 w-4 animate-pulse" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {preset && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {preset.quickPrompts.map((q) => (
              <button
                key={q}
                onClick={() => setState({ ...state, customPrompt: q })}
                className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground transition hover:border-foreground/20 hover:text-foreground"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Comparison */}
      <div className="grid flex-1 gap-4 lg:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <SectionLabel tone="baseline">Baseline · Prompt-only</SectionLabel>
          </div>
          <pre className="flex-1 whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 font-sans text-sm leading-relaxed text-foreground">
            {state.baselineOutput || "Run a prompt to see the baseline output."}
          </pre>
        </div>
        <div className="flex flex-col rounded-xl border border-success/30 bg-card p-4 shadow-soft">
          <div className="mb-2 flex items-center justify-between">
            <SectionLabel tone="tuned">Fine-tuned · After training</SectionLabel>
          </div>
          <pre className="flex-1 whitespace-pre-wrap break-words rounded-md bg-success/5 p-3 font-sans text-sm leading-relaxed text-foreground">
            {state.tunedOutput || "Run a prompt to see the tuned output."}
          </pre>
        </div>
      </div>
    </div>
  );
}
