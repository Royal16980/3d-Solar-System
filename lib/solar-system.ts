export type CelestialBody = {
  readonly id: string;
  readonly name: string;
  readonly aliases: readonly string[];
  readonly kind: "star" | "planet";
  readonly color: number;
  readonly size: number;
  readonly distance: number;
  readonly orbitSpeed: number;
  readonly type: string;
  readonly moons: number;
  readonly dayLength: string;
  readonly yearLength: string;
  readonly summary: string;
};

export const BODIES: readonly CelestialBody[] = [
  {
    id: "sun",
    name: "Sun",
    aliases: ["sol", "star"],
    kind: "star",
    color: 0xffcc00,
    size: 5,
    distance: 0,
    orbitSpeed: 0,
    type: "G-type main-sequence star",
    moons: 0,
    dayLength: "25 days at the equator",
    yearLength: "n/a",
    summary:
      "The star at the center of the solar system. It holds 99.8% of the system's mass and lights every planet.",
  },
  {
    id: "mercury",
    name: "Mercury",
    aliases: [],
    kind: "planet",
    color: 0x999999,
    size: 0.4,
    distance: 8,
    orbitSpeed: 0.0125,
    type: "Terrestrial planet",
    moons: 0,
    dayLength: "176 Earth days",
    yearLength: "88 Earth days",
    summary:
      "The smallest planet and the closest to the Sun. Days are longer than its year, and the surface swings from scorching to freezing.",
  },
  {
    id: "venus",
    name: "Venus",
    aliases: [],
    kind: "planet",
    color: 0xff9933,
    size: 0.9,
    distance: 12,
    orbitSpeed: 0.0083,
    type: "Terrestrial planet",
    moons: 0,
    dayLength: "243 Earth days (retrograde)",
    yearLength: "225 Earth days",
    summary:
      "Earth's nearest neighbor, wrapped in a thick carbon-dioxide atmosphere. It is the hottest planet because of a runaway greenhouse effect.",
  },
  {
    id: "earth",
    name: "Earth",
    aliases: ["terra", "world"],
    kind: "planet",
    color: 0x3399ff,
    size: 1,
    distance: 16,
    orbitSpeed: 0.0063,
    type: "Terrestrial planet",
    moons: 1,
    dayLength: "24 hours",
    yearLength: "365.25 days",
    summary:
      "The only known world with life. Liquid water, a protective magnetic field, and a breathable atmosphere make it unique in this model.",
  },
  {
    id: "mars",
    name: "Mars",
    aliases: ["red planet"],
    kind: "planet",
    color: 0xff3333,
    size: 0.5,
    distance: 20,
    orbitSpeed: 0.005,
    type: "Terrestrial planet",
    moons: 2,
    dayLength: "24.6 hours",
    yearLength: "687 Earth days",
    summary:
      "The red planet, colored by iron oxide dust. It has polar ice, the tallest volcano in the solar system, and two small moons.",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    aliases: [],
    kind: "planet",
    color: 0xffcc00,
    size: 1.1,
    distance: 26,
    orbitSpeed: 0.0038,
    type: "Gas giant",
    moons: 95,
    dayLength: "10 hours",
    yearLength: "12 Earth years",
    summary:
      "The largest planet. A fast-spinning gas giant with a Great Red Spot storm and a large family of moons, including volcanic Io and icy Europa.",
  },
  {
    id: "saturn",
    name: "Saturn",
    aliases: [],
    kind: "planet",
    color: 0x6699ff,
    size: 1,
    distance: 32,
    orbitSpeed: 0.0031,
    type: "Gas giant",
    moons: 146,
    dayLength: "10.7 hours",
    yearLength: "29 Earth years",
    summary:
      "Famous for its icy ring system. Saturn is less dense than water and has dozens of moons, including hazy Titan.",
  },
  {
    id: "uranus",
    name: "Uranus",
    aliases: [],
    kind: "planet",
    color: 0x9966cc,
    size: 0.8,
    distance: 38,
    orbitSpeed: 0.0026,
    type: "Ice giant",
    moons: 28,
    dayLength: "17 hours",
    yearLength: "84 Earth years",
    summary:
      "An ice giant that rolls on its side. Methane in the atmosphere gives it a pale blue-green color.",
  },
  {
    id: "neptune",
    name: "Neptune",
    aliases: [],
    kind: "planet",
    color: 0x33cccc,
    size: 0.7,
    distance: 44,
    orbitSpeed: 0.0023,
    type: "Ice giant",
    moons: 16,
    dayLength: "16 hours",
    yearLength: "165 Earth years",
    summary:
      "The farthest planet from the Sun. It has the strongest winds in the solar system and a large moon, Triton, that orbits backward.",
  },
];

export const BODY_IDS = BODIES.map((body) => body.id);

export function normalizeBodyName(value: string): string {
  return value.trim().toLowerCase().replaceAll(/[^a-z0-9]+/g, " ").trim();
}

export function resolveBody(name: string): CelestialBody | undefined {
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

export function bodyFacts(body: CelestialBody) {
  return {
    id: body.id,
    name: body.name,
    kind: body.kind,
    type: body.type,
    moons: body.moons,
    dayLength: body.dayLength,
    yearLength: body.yearLength,
    summary: body.summary,
  };
}
