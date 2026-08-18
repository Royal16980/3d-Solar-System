import { FALLBACK_APOD } from "@/lib/catalog";

export async function GET() {
  try {
    const response = await fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY", {
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      return Response.json(FALLBACK_APOD);
    }
    const data = (await response.json()) as typeof FALLBACK_APOD;
    if (data.media_type !== "image" || !data.url) {
      return Response.json(FALLBACK_APOD);
    }
    return Response.json(data);
  } catch {
    return Response.json(FALLBACK_APOD);
  }
}
