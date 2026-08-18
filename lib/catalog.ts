import catalog from "@/data/catalog.json";

export type BodyKind = "star" | "planet" | "dwarf-planet" | "moon";

export type CatalogBody = {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly kind: BodyKind;
  readonly type: string;
  readonly parentId: string | null;
  readonly color: number;
  readonly glow: number;
  readonly size: number;
  readonly distance: number;
  readonly orbitSpeed: number;
  readonly hasRings: boolean;
  readonly mass: number | null;
  readonly diameter: number | null;
  readonly density: number | null;
  readonly gravity: number | null;
  readonly escapeVelocity: number | null;
  readonly rotationPeriod: number | null;
  readonly lengthOfDay: number | null;
  readonly distanceFromSun: number | null;
  readonly perihelion: number | null;
  readonly aphelion: number | null;
  readonly orbitalPeriod: number | null;
  readonly orbitalVelocity: number | null;
  readonly orbitalInclination: number | null;
  readonly orbitalEccentricity: number | null;
  readonly obliquityToOrbit: number | null;
  readonly meanTemperature: number | null;
  readonly surfacePressure: number | null;
  readonly numberOfMoons: number;
  readonly hasRingSystem: boolean;
  readonly hasGlobalMagneticField: boolean;
  readonly dayLength: string;
  readonly yearLength: string;
  readonly summary: string;
  readonly description: string;
  readonly thumbnail: string | null;
  readonly image: string | null;
  readonly wikipedia: string | null;
  readonly featured: boolean;
  readonly moons: readonly string[];
};

export type ApodImage = {
  readonly date: string;
  readonly title: string;
  readonly explanation: string;
  readonly url: string;
  readonly hdurl?: string;
  readonly media_type: string;
  readonly copyright?: string;
};

export const BODIES = catalog.bodies as CatalogBody[];
export const FALLBACK_APOD = catalog.apod as ApodImage;
export const CATALOG_SOURCES = catalog.sources;
export const BODY_IDS = BODIES.map((body) => body.id);

const byId = new Map(BODIES.map((body) => [body.id, body]));

export function getBody(id: string): CatalogBody | undefined {
  return byId.get(id);
}

export function requireBody(id: string): CatalogBody {
  const body = byId.get(id);
  if (!body) {
    throw new Error(`Unknown body: ${id}`);
  }
  return body;
}

export function normalizeBodyName(value: string): string {
  return value.trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, " ").trim();
}

export function resolveBody(name: string): CatalogBody | undefined {
  const needle = normalizeBodyName(name);
  if (needle.length === 0) {
    return undefined;
  }

  return BODIES.find((body) => {
    if (normalizeBodyName(body.id) === needle || normalizeBodyName(body.name) === needle) {
      return true;
    }
    return body.aliases.some((alias) => normalizeBodyName(alias) === needle);
  });
}

export function sceneBodies(showDwarfs: boolean): CatalogBody[] {
  return BODIES.filter((body) => {
    if (body.kind === "star" || body.kind === "planet") return true;
    return showDwarfs && body.kind === "dwarf-planet";
  });
}

export function moonsOf(parentId: string): CatalogBody[] {
  return BODIES.filter((body) => body.kind === "moon" && body.parentId === parentId);
}

export function bodyFacts(body: CatalogBody) {
  return {
    id: body.id,
    name: body.name,
    kind: body.kind,
    type: body.type,
    parentId: body.parentId,
    moons: body.numberOfMoons,
    moonNames: body.moons,
    dayLength: body.dayLength,
    yearLength: body.yearLength,
    diameterKm: body.diameter,
    massEarth: body.mass,
    gravity: body.gravity,
    meanTemperatureC: body.meanTemperature,
    distanceFromSunMillionKm: body.distanceFromSun,
    hasRings: body.hasRingSystem,
    hasMagneticField: body.hasGlobalMagneticField,
    summary: body.summary,
  };
}

export const PLANET_ORDER = [
  "sun",
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
] as const;
