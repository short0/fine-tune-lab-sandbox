import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Settings2, BarChart3, FlaskConical } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { LeftPanel } from "@/components/LeftPanel";
import { CenterPanel } from "@/components/CenterPanel";
import { RightPanel } from "@/components/RightPanel";
import { useLabStore } from "@/lib/lab-store";

type LabSearch = { preset?: string };

export const Route = createFileRoute("/lab")({
  validateSearch: (search: Record<string, unknown>): LabSearch => ({
    preset: typeof search.preset === "string" ? search.preset : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Lab — Fine-Tuning Lab" },
      {
        name: "description",
        content: "Compare baseline and fine-tuned outputs side by side.",
      },
      { property: "og:title", content: "Fine-Tuning Lab" },
      {
        property: "og:description",
        content: "Compare baseline and fine-tuned outputs side by side.",
      },
    ],
  }),
  component: Lab,
});

type MobileTab = "setup" | "compare" | "eval";

function Lab() {
  const { preset } = Route.useSearch();
  const { state, setState, loadPreset, undo, redo, reset, canUndo, canRedo, hydrated } =
    useLabStore();
  const [tab, setTab] = useState<MobileTab>("compare");
  const [autoLoaded, setAutoLoaded] = useState(false);

  // Auto-load preset from URL on first hydration if no preset is active or it differs.
  useEffect(() => {
    if (!hydrated || autoLoaded) return;
    if (preset && state.presetId !== preset) {
      loadPreset(preset);
    }
    setAutoLoaded(true);
  }, [hydrated, autoLoaded, preset, state.presetId, loadPreset]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        showLabActions
        onUndo={undo}
        onRedo={redo}
        onReset={reset}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Mobile tabs */}
      <div className="sticky top-14 z-30 border-b border-border bg-background/90 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 py-2">
          {(
            [
              { id: "setup", label: "Setup", icon: Settings2 },
              { id: "compare", label: "Compare", icon: FlaskConical },
              { id: "eval", label: "Evaluate", icon: BarChart3 },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition ${
                tab === t.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Desktop / tablet 3-panel */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)_320px] xl:grid-cols-[300px_minmax(0,1fr)_340px]">
          <aside className="max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <LeftPanel state={state} setState={setState} loadPreset={loadPreset} />
          </aside>
          <section className="min-h-[calc(100vh-7rem)]">
            <CenterPanel state={state} setState={setState} />
          </section>
          <aside className="max-h-[calc(100vh-7rem)] overflow-y-auto pl-2">
            <RightPanel state={state} setState={setState} />
          </aside>
        </div>

        {/* Tablet 2-panel */}
        <div className="hidden md:grid md:grid-cols-[260px_minmax(0,1fr)] md:gap-5 lg:hidden">
          <aside className="max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
            <LeftPanel state={state} setState={setState} loadPreset={loadPreset} />
          </aside>
          <section className="space-y-6">
            <CenterPanel state={state} setState={setState} />
            <RightPanel state={state} setState={setState} />
          </section>
        </div>

        {/* Mobile stacked */}
        <div className="md:hidden">
          {tab === "setup" && <LeftPanel state={state} setState={setState} loadPreset={loadPreset} />}
          {tab === "compare" && <CenterPanel state={state} setState={setState} />}
          {tab === "eval" && <RightPanel state={state} setState={setState} />}
        </div>
      </main>
    </div>
  );
}
