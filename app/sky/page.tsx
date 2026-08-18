import { SiteHeader } from "@/app/_components/site-header";
import { FALLBACK_APOD, type ApodImage } from "@/lib/catalog";

async function loadApod(): Promise<ApodImage> {
  try {
    const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return FALLBACK_APOD;
    const data = (await response.json()) as ApodImage;
    return data.media_type === "image" ? data : FALLBACK_APOD;
  } catch {
    return FALLBACK_APOD;
  }
}

export default async function SkyPage() {
  const apod = await loadApod();

  return (
    <div className="min-h-dvh bg-[#05060c] text-slate-50">
      <SiteHeader current="sky" />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200">
          NASA Astronomy Picture of the Day
        </p>
        <h1 className="mt-2 font-medium text-4xl tracking-tight">{apod.title}</h1>
        <p className="mt-2 text-slate-400 text-sm">{apod.date}</p>

        {apod.media_type === "image" ? (
          <img
            alt={apod.title}
            className="mt-8 w-full rounded-3xl border border-white/10 object-cover"
            src={apod.hdurl ?? apod.url}
          />
        ) : null}

        <p className="mt-8 max-w-3xl text-slate-300 leading-relaxed">{apod.explanation}</p>
        {apod.copyright ? (
          <p className="mt-4 text-slate-500 text-sm">Image credit: {apod.copyright}</p>
        ) : null}
      </main>
    </div>
  );
}
