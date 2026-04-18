import { useState } from "react";
import { Sparkles, Plus, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SectionLabel } from "./SectionLabel";
import type { LabState } from "@/lib/lab-store";
import { PRESETS } from "@/lib/presets";

type Props = {
  state: LabState;
  setState: (next: LabState | ((s: LabState) => LabState)) => void;
  loadPreset: (id: string) => void;
};

export function LeftPanel({ state, setState, loadPreset }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [newIn, setNewIn] = useState("");
  const [newOut, setNewOut] = useState("");

  const updateExample = (i: number, key: "input" | "output", val: string) => {
    setState((s) => ({
      ...s,
      examples: s.examples.map((e, idx) => (idx === i ? { ...e, [key]: val } : e)),
    }));
  };

  const removeExample = (i: number) => {
    setState((s) => ({ ...s, examples: s.examples.filter((_, idx) => idx !== i) }));
  };

  const addExample = () => {
    if (!newIn.trim() || !newOut.trim()) return;
    setState((s) => ({
      ...s,
      examples: [...s.examples, { input: newIn, output: newOut, quality: "strong" }],
    }));
    setNewIn("");
    setNewOut("");
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* Preset selector */}
      <div>
        <SectionLabel>Preset</SectionLabel>
        <div className="mt-2 grid gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPreset(p.id)}
              className={`flex flex-col items-start rounded-lg border px-3 py-2 text-left text-sm transition ${
                state.presetId === p.id
                  ? "border-foreground/30 bg-accent"
                  : "border-border bg-card hover:border-foreground/20"
              }`}
            >
              <span className="font-medium">{p.title}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{p.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Task description */}
      <div>
        <SectionLabel>Task definition</SectionLabel>
        <Textarea
          value={state.taskDescription}
          onChange={(e) => setState({ ...state, taskDescription: e.target.value })}
          placeholder="What should the model do? Define success in 1–3 sentences."
          className="mt-2 min-h-[100px] resize-none text-sm"
        />
      </div>

      {/* Examples */}
      <div>
        <div className="flex items-center justify-between">
          <SectionLabel>Training examples ({state.examples.length})</SectionLabel>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdd((v) => !v)}
            className="h-7 px-2 text-xs"
          >
            <Plus className="mr-1 h-3 w-3" /> Add
          </Button>
        </div>

        {state.examples.length === 0 && (
          <div className="mt-2 rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            No examples yet. Pick a preset or add your own.
          </div>
        )}

        <ul className="mt-2 space-y-2">
          {state.examples.map((ex, i) => (
            <li
              key={i}
              className="group rounded-lg border border-border bg-card p-3 text-xs"
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  {ex.quality === "weak" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-warning-foreground">
                      <AlertCircle className="h-2.5 w-2.5" /> Weak example
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">
                      <Sparkles className="h-2.5 w-2.5" /> Strong example
                    </span>
                  )}
                </span>
                <button
                  onClick={() => removeExample(i)}
                  className="text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"
                  aria-label="Remove example"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-1.5">
                <div>
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">
                    Input
                  </span>
                  <Textarea
                    value={ex.input}
                    onChange={(e) => updateExample(i, "input", e.target.value)}
                    className="mt-0.5 min-h-[40px] resize-none text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">
                    Output
                  </span>
                  <Textarea
                    value={ex.output}
                    onChange={(e) => updateExample(i, "output", e.target.value)}
                    className="mt-0.5 min-h-[60px] resize-none text-xs"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {showAdd && (
          <div className="mt-2 space-y-2 rounded-lg border border-border bg-surface p-3">
            <Input
              value={newIn}
              onChange={(e) => setNewIn(e.target.value)}
              placeholder="Input"
              className="text-xs"
            />
            <Textarea
              value={newOut}
              onChange={(e) => setNewOut(e.target.value)}
              placeholder="Desired output"
              className="min-h-[60px] resize-none text-xs"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addExample} className="h-7 text-xs">
                Save example
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowAdd(false)}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
