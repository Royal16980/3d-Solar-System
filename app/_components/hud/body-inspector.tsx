"use client";

import { ExternalLinkIcon } from "lucide-react";
import { moonsOf, type CatalogBody } from "@/lib/catalog";
import { formatKm, formatMass, formatNumber, formatTemperature, shortSummary } from "@/lib/format";

export function BodyInspector({
  body,
  onSelectMoon,
}: {
  readonly body: CatalogBody;
  readonly onSelectMoon?: (name: string) => void;
}) {
  const moons = moonsOf(body.id);

  return (
    <section className="pointer-events-auto flex max-h-[44vh] w-[min(100%,22rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/78 shadow-2xl backdrop-blur-xl lg:max-h-[70vh] lg:w-full lg:max-w-sm">
      {body.thumbnail ? (
        <img
          alt={body.name}
          className="hidden h-36 w-full object-cover sm:block"
          src={body.thumbnail}
        />
      ) : null}
      <div className="space-y-4 overflow-y-auto p-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-amber-200">{body.type}</p>
          <h2 className="mt-1 font-medium text-2xl tracking-tight">{body.name}</h2>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">{shortSummary(body.summary, 260)}</p>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="Diameter" value={formatKm(body.diameter)} />
          <Stat label="Mass" value={formatMass(body.mass)} />
          <Stat label="Day" value={body.dayLength} />
          <Stat label="Year" value={body.yearLength} />
          <Stat label="Mean temp" value={formatTemperature(body.meanTemperature)} />
          <Stat
            label="Gravity"
            value={body.gravity == null ? "—" : `${formatNumber(body.gravity, 1)} m/s²`}
          />
          <Stat
            label="Distance"
            value={body.distanceFromSun ? `${formatNumber(body.distanceFromSun, 1)} million km` : "—"}
          />
          <Stat label="Moons" value={String(body.numberOfMoons)} />
        </dl>

        {moons.length > 0 ? (
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-slate-400">Major moons</p>
            <div className="flex flex-wrap gap-1.5">
              {moons.map((moon) => (
                <button
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs hover:bg-white/10"
                  key={moon.id}
                  onClick={() => onSelectMoon?.(moon.name)}
                  type="button"
                >
                  {moon.name}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {body.wikipedia ? (
          <a
            className="inline-flex items-center gap-1.5 text-amber-100 text-xs hover:underline"
            href={body.wikipedia}
            rel="noreferrer"
            target="_blank"
          >
            Wikipedia <ExternalLinkIcon className="size-3" />
          </a>
        ) : null}
      </div>
    </section>
  );
}

function Stat({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2">
      <dt className="text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</dt>
      <dd className="mt-1 text-slate-100">{value}</dd>
    </div>
  );
}
