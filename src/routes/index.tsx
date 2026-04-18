import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Database, GitCompare, CheckCircle2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { PresetCard } from "@/components/PresetCard";
import { Button } from "@/components/ui/button";
import { PRESETS } from "@/lib/presets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fine-Tuning Lab — Learn fine-tuning by doing" },
      {
        name: "description",
        content:
          "An interactive sandbox to compare prompt-only outputs with fine-tuned outputs across realistic tasks.",
      },
      { property: "og:title", content: "Fine-Tuning Lab" },
      {
        property: "og:description",
        content: "Learn when fine-tuning helps and how datasets shape behavior.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  { icon: FileText, title: "Define the task", desc: "Frame what 'good' looks like." },
  { icon: Database, title: "Prepare examples", desc: "A handful of strong I/O pairs." },
  { icon: GitCompare, title: "Compare outputs", desc: "Baseline vs tuned, side by side." },
  { icon: CheckCircle2, title: "Evaluate the gain", desc: "Measure what actually improved." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Hero */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground">
              An interactive sandbox
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Learn fine-tuning by <span className="text-muted-foreground">comparing it</span>.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              See how a small, well-chosen dataset shifts a model's behavior. Pick a preset, inspect
              the examples, and watch baseline vs tuned outputs side by side.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link to="/lab" search={{ preset: "support-tone" }}>
                  Start with a preset
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/lab" search={{ preset: undefined }}>
                  Open blank lab
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Presets */}
        <section className="pb-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Presets</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Click any card to launch a fully loaded comparison.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRESETS.map((p) => (
              <PresetCard key={p.id} preset={p} />
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border py-16">
          <h2 className="text-xl font-semibold tracking-tight">How it works</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Four steps, the same loop every team uses in production.
          </p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className="rounded-xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground">
                    {i + 1}
                  </span>
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* When to fine-tune */}
        <section className="border-t border-border py-16">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Prompting is enough when…
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed">
                <li>• The task is occasional or low-volume.</li>
                <li>• A short instruction reliably gets the format you need.</li>
                <li>• You can describe the behavior in a few sentences.</li>
                <li>• You don't have labeled examples yet.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Fine-tuning helps when…
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed">
                <li>• You need consistent tone, format, or structure at scale.</li>
                <li>• Prompts have grown long and brittle.</li>
                <li>• Domain vocabulary or safety patterns matter.</li>
                <li>• You have 50+ high-quality input/output pairs.</li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          A learning sandbox. Outputs shown are illustrative, not produced by a live model.
        </footer>
      </main>
    </div>
  );
}
