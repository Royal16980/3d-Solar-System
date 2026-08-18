"use client";

import { getBody, PLANET_ORDER } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function PlanetRail({
  focusedBodyId,
  onSelect,
}: {
  readonly focusedBodyId: string;
  readonly onSelect: (id: string) => void;
}) {
  return (
    <div className="pointer-events-auto flex max-w-full gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70 p-2 backdrop-blur-xl">
      {PLANET_ORDER.map((id) => {
        const body = getBody(id);
        if (!body) return null;
        const active = focusedBodyId === id;
        return (
          <button
            className={cn(
              "flex min-w-16 flex-col items-center gap-1 rounded-xl px-2 py-2 text-center transition-colors",
              active ? "bg-white text-slate-950" : "text-slate-200 hover:bg-white/10",
            )}
            key={id}
            onClick={() => onSelect(id)}
            type="button"
          >
            <span
              className="size-3 rounded-full"
              style={{ backgroundColor: `#${body.color.toString(16).padStart(6, "0")}` }}
            />
            <span className="font-medium text-[11px]">{body.name}</span>
          </button>
        );
      })}
    </div>
  );
}
