import Link from "next/link";
import { SiteHeader } from "@/app/_components/site-header";
import { BODIES, type BodyKind } from "@/lib/catalog";
import { formatKm, shortSummary } from "@/lib/format";
import { PRODUCT } from "@/lib/product";

const SECTIONS: { kind: BodyKind; title: string; copy: string }[] = [
  { kind: "star", title: "Star", copy: "The engine of the system." },
  { kind: "planet", title: "Planets", copy: "Eight worlds, from scorched rock to ice giants." },
  { kind: "dwarf-planet", title: "Dwarf planets", copy: "Round worlds that share their orbits." },
  { kind: "moon", title: "Major moons", copy: "The largest and most studied natural satellites." },
];

export default function CatalogPage() {
  return (
    <div className="min-h-dvh bg-[#05060c] text-slate-50">
      <SiteHeader current="catalog" />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200">Catalog</p>
        <h1 className="mt-2 font-medium text-4xl tracking-tight">{PRODUCT.name} archive</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          {BODIES.length} bodies compiled from NASA planetary fact sheets and Wikipedia. Open any
          world in the 3D observatory.
        </p>

        {SECTIONS.map((section) => {
          const items = BODIES.filter((body) => body.kind === section.kind);
          return (
            <section className="mt-12" key={section.kind}>
              <div className="mb-5">
                <h2 className="font-medium text-xl">{section.title}</h2>
                <p className="text-slate-400 text-sm">{section.copy}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((body) => (
                  <Link
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-amber-200/30 hover:bg-white/8"
                    href={`/?body=${body.id}`}
                    key={body.id}
                  >
                    {body.thumbnail ? (
                      <img alt="" className="h-36 w-full object-cover" src={body.thumbnail} />
                    ) : (
                      <div
                        className="h-36 w-full"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, #${body.color.toString(16).padStart(6, "0")}, #0f172a)`,
                        }}
                      />
                    )}
                    <div className="space-y-2 p-4">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                        {body.type}
                      </p>
                      <h3 className="font-medium text-lg">{body.name}</h3>
                      <p className="text-slate-400 text-sm">{shortSummary(body.summary, 140)}</p>
                      <p className="text-slate-500 text-xs">
                        {formatKm(body.diameter)}
                        {body.numberOfMoons ? ` · ${body.numberOfMoons} moons` : ""}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <footer className="mt-16 border-white/10 border-t py-8 text-slate-500 text-xs">
          Data from NASA planetary fact sheets and Wikipedia. Sky images from NASA APOD.
          Visual orbits are scaled for readability, not true astronomical distances.
        </footer>
      </main>
    </div>
  );
}
