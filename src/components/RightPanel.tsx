import { useState } from "react";
import { Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SectionLabel } from "./SectionLabel";
import type { LabState } from "@/lib/lab-store";
import { getPreset } from "@/lib/presets";

type Props = {
  state: LabState;
  setState: (next: LabState | ((s: LabState) => LabState)) => void;
};

export function RightPanel({ state, setState }: Props) {
  const [explained, setExplained] = useState(false);
  const preset = state.presetId ? getPreset(state.presetId) : null;

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel tone="eval">Evaluation</SectionLabel>
        {preset ? (
          <div className="mt-2 space-y-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {preset.evaluation.summary}
            </p>
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-xs">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Metric</th>
                    <th className="px-3 py-2 text-right font-medium">Baseline</th>
                    <th className="px-3 py-2 text-right font-medium">Tuned</th>
                  </tr>
                </thead>
                <tbody>
                  {preset.evaluation.metrics.map((m) => (
                    <tr key={m.label} className="border-t border-border">
                      <td className="px-3 py-2">{m.label}</td>
                      <td className="px-3 py-2 text-right text-muted-foreground">{m.baseline}</td>
                      <td className="px-3 py-2 text-right font-medium text-success">{m.tuned}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a preset to see how baseline and tuned outputs compare on real metrics.
          </p>
        )}
      </div>

      {preset && (
        <div>
          <SectionLabel>Why fine-tune here?</SectionLabel>
          <p className="mt-2 rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed text-muted-foreground">
            <BookOpen className="mr-1.5 inline h-3.5 w-3.5 -translate-y-0.5" />
            {preset.whenToFineTune}
          </p>
        </div>
      )}

      {preset && (
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExplained((v) => !v)}
            className="w-full justify-start text-xs"
          >
            <Lightbulb className="mr-2 h-3.5 w-3.5" />
            {explained ? "Hide explanation" : "Explain this result"}
          </Button>
          {explained && (
            <div className="mt-2 space-y-2 rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">What changed:</strong> the tuned model learned
                from {state.examples.length} demonstration{state.examples.length === 1 ? "" : "s"}.
                Each pair acts like a worked solution — the model generalizes the pattern (tone,
                format, vocabulary) without you re-stating it in every prompt.
              </p>
              <p>
                <strong className="text-foreground">Watch the weak example.</strong> Even one or two
                low-quality pairs can drag tuned outputs toward shortcuts. Quality &gt; quantity at
                small dataset sizes.
              </p>
              <p>
                <strong className="text-foreground">Prompting alternative:</strong> you could
                approximate this with a long system prompt, but it grows brittle as edge cases
                appear. Tuning bakes the pattern into the weights.
              </p>
            </div>
          )}
        </div>
      )}

      <div>
        <SectionLabel>Notes</SectionLabel>
        <Textarea
          value={state.notes}
          onChange={(e) => setState({ ...state, notes: e.target.value })}
          placeholder="Jot observations, ideas for new examples, or questions to revisit."
          className="mt-2 min-h-[120px] resize-none text-sm"
        />
      </div>
    </div>
  );
}
