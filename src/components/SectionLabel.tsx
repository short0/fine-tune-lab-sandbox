import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "baseline" | "tuned" | "eval";
}) {
  const toneClass = {
    neutral: "text-muted-foreground bg-muted",
    baseline: "text-muted-foreground bg-muted",
    tuned: "text-success bg-success/10",
    eval: "text-foreground bg-accent",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
