import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Preset } from "@/lib/presets";

export function PresetCard({ preset }: { preset: Preset }) {
  return (
    <Link
      to="/lab"
      search={{ preset: preset.id }}
      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-soft transition hover:border-foreground/20 hover:shadow-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="space-y-2">
        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {preset.category}
        </span>
        <h3 className="text-base font-semibold tracking-tight">{preset.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{preset.shortDescription}</p>
      </div>
      <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-foreground">
        Launch preset
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
