"use client";

import type { CatalogBody } from "@/lib/catalog";
import { formatDayLength, formatKm, formatMass, formatTemperature } from "@/lib/format";

export function GuideBriefing({ body }: { readonly body: CatalogBody }) {
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="text-[11px] uppercase tracking-[0.16em] text-amber-200">Briefing</p>
      <p className="font-medium text-sm">{body.name}</p>
      <p className="text-slate-300 text-xs leading-relaxed">
        {body.kind === "star"
          ? `${body.name} is a ${body.type.toLowerCase()} with a diameter of ${formatKm(body.diameter)}.`
          : `${body.name} is a ${body.type.toLowerCase()} ${body.parentId ? `of ${body.parentId}` : ""} with a diameter of ${formatKm(body.diameter)} and a mass of ${formatMass(body.mass)}.`}
      </p>
      <p className="text-slate-400 text-xs">
        Day {formatDayLength(body.lengthOfDay ?? body.rotationPeriod)} · Temp{" "}
        {formatTemperature(body.meanTemperature)}
      </p>
    </div>
  );
}
