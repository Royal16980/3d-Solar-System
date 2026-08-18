import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const CACHE = "/tmp/ss-data";

const WIKI_TITLES = {
  sun: "Sun",
  mercury: "Mercury_(planet)",
  venus: "Venus",
  earth: "Earth",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
  ceres: "Ceres_(dwarf_planet)",
  haumea: "Haumea",
  makemake: "Makemake",
  eris: "Eris_(dwarf_planet)",
  moon: "Moon",
  io: "Io_(moon)",
  europa: "Europa_(moon)",
  ganymede: "Ganymede_(moon)",
  callisto: "Callisto_(moon)",
  titan: "Titan_(moon)",
  enceladus: "Enceladus",
  triton: "Triton_(moon)",
  phobos: "Phobos_(moon)",
  deimos: "Deimos_(moon)",
  rhea: "Rhea_(moon)",
  dione: "Dione_(moon)",
  tethys: "Tethys_(moon)",
  iapetus: "Iapetus_(moon)",
  miranda: "Miranda_(moon)",
  ariel: "Ariel_(moon)",
  umbriel: "Umbriel_(moon)",
  titania: "Titania_(moon)",
  oberon: "Oberon_(moon)",
  charon: "Charon_(moon)",
};

const VISUAL = {
  sun: { color: 0xffc857, glow: 0xffe29a, size: 5.6, distance: 0, orbitSpeed: 0, hasRings: false },
  mercury: { color: 0xb1b1b1, glow: 0xd7d7d7, size: 0.38, distance: 10, orbitSpeed: 0.016, hasRings: false },
  venus: { color: 0xe3b56a, glow: 0xf0c98a, size: 0.92, distance: 14, orbitSpeed: 0.012, hasRings: false },
  earth: { color: 0x3b82f6, glow: 0x7dd3fc, size: 1, distance: 18.5, orbitSpeed: 0.01, hasRings: false },
  mars: { color: 0xef6b4a, glow: 0xfca5a5, size: 0.53, distance: 23, orbitSpeed: 0.008, hasRings: false },
  jupiter: { color: 0xd6b07c, glow: 0xf5d0a9, size: 2.35, distance: 32, orbitSpeed: 0.0044, hasRings: false },
  saturn: { color: 0xe8d5a3, glow: 0xf8e7c1, size: 2.05, distance: 42, orbitSpeed: 0.0032, hasRings: true },
  uranus: { color: 0x7dd3c7, glow: 0xa5f3fc, size: 1.45, distance: 52, orbitSpeed: 0.0022, hasRings: true },
  neptune: { color: 0x3b82f6, glow: 0x93c5fd, size: 1.4, distance: 62, orbitSpeed: 0.0017, hasRings: false },
  pluto: { color: 0xc4b5a5, glow: 0xe7e5e4, size: 0.32, distance: 72, orbitSpeed: 0.0011, hasRings: false },
  ceres: { color: 0xa8a29e, glow: 0xd6d3d1, size: 0.22, distance: 27, orbitSpeed: 0.006, hasRings: false },
  haumea: { color: 0xd6d3d1, glow: 0xf5f5f4, size: 0.24, distance: 78, orbitSpeed: 0.0009, hasRings: true },
  makemake: { color: 0xd4a574, glow: 0xf5d0a9, size: 0.23, distance: 82, orbitSpeed: 0.0008, hasRings: false },
  eris: { color: 0xe7e5e4, glow: 0xfafafa, size: 0.26, distance: 88, orbitSpeed: 0.0006, hasRings: false },
};

const FEATURED_MOONS = [
  "Moon",
  "Phobos",
  "Deimos",
  "Io",
  "Europa",
  "Ganymede",
  "Callisto",
  "Titan",
  "Enceladus",
  "Rhea",
  "Dione",
  "Tethys",
  "Iapetus",
  "Miranda",
  "Ariel",
  "Umbriel",
  "Titania",
  "Oberon",
  "Triton",
  "Charon",
];

const DWARFS = [
  {
    id: "ceres",
    name: "Ceres",
    kind: "dwarf-planet",
    type: "Dwarf planet",
    aliases: [],
    mass: 0.000939,
    diameter: 939.4,
    density: 2162,
    gravity: 0.27,
    distanceFromSun: 413.7,
    orbitalPeriod: 1682,
    rotationPeriod: 9.07,
    meanTemperature: -105,
    numberOfMoons: 0,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
    orbitalEccentricity: 0.076,
    orbitalInclination: 10.6,
  },
  {
    id: "haumea",
    name: "Haumea",
    kind: "dwarf-planet",
    type: "Dwarf planet",
    aliases: [],
    mass: 0.00067,
    diameter: 1560,
    density: 1885,
    gravity: 0.4,
    distanceFromSun: 6452,
    orbitalPeriod: 103774,
    rotationPeriod: 3.9,
    meanTemperature: -241,
    numberOfMoons: 2,
    hasRingSystem: true,
    hasGlobalMagneticField: false,
    orbitalEccentricity: 0.195,
    orbitalInclination: 28.2,
  },
  {
    id: "makemake",
    name: "Makemake",
    kind: "dwarf-planet",
    type: "Dwarf planet",
    aliases: [],
    mass: 0.0005,
    diameter: 1430,
    density: 1700,
    gravity: 0.5,
    distanceFromSun: 6850,
    orbitalPeriod: 112897,
    rotationPeriod: 22.8,
    meanTemperature: -239,
    numberOfMoons: 1,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
    orbitalEccentricity: 0.161,
    orbitalInclination: 29,
  },
  {
    id: "eris",
    name: "Eris",
    kind: "dwarf-planet",
    type: "Dwarf planet",
    aliases: [],
    mass: 0.0028,
    diameter: 2326,
    density: 2520,
    gravity: 0.82,
    distanceFromSun: 10125,
    orbitalPeriod: 203830,
    rotationPeriod: 25.9,
    meanTemperature: -230,
    numberOfMoons: 1,
    hasRingSystem: false,
    hasGlobalMagneticField: false,
    orbitalEccentricity: 0.436,
    orbitalInclination: 44.0,
  },
];

const SUN = {
  id: "sun",
  name: "Sun",
  kind: "star",
  type: "G-type main-sequence star",
  aliases: ["sol", "star"],
  mass: 1989000,
  diameter: 1392700,
  density: 1408,
  gravity: 274,
  escapeVelocity: 617.6,
  rotationPeriod: 609.12,
  lengthOfDay: 609.12,
  distanceFromSun: 0,
  perihelion: 0,
  aphelion: 0,
  orbitalPeriod: 0,
  orbitalVelocity: 0,
  orbitalInclination: 0,
  orbitalEccentricity: 0,
  obliquityToOrbit: 7.25,
  meanTemperature: 5499,
  surfacePressure: null,
  numberOfMoons: 0,
  hasRingSystem: false,
  hasGlobalMagneticField: true,
};

const ALIASES = {
  earth: ["terra", "world"],
  mars: ["red planet"],
  sun: ["sol", "star"],
  moon: ["luna"],
};

const TYPES = {
  mercury: "Terrestrial planet",
  venus: "Terrestrial planet",
  earth: "Terrestrial planet",
  mars: "Terrestrial planet",
  jupiter: "Gas giant",
  saturn: "Gas giant",
  uranus: "Ice giant",
  neptune: "Ice giant",
  pluto: "Dwarf planet",
};

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const response = await fetch(url, {
      headers: { "user-agent": "OrbitObservatory/1.0 (educational catalog builder)" },
    });
    if (response.status === 429) {
      await sleep(800 * (attempt + 1));
      continue;
    }
    if (!response.ok) {
      throw new Error(`${url} -> ${response.status}`);
    }
    return response.json();
  }
  throw new Error(`${url} -> 429 after retries`);
}

const WIKI_FALLBACKS = {
  tethys:
    "Tethys is a mid-sized moon of Saturn with a bright, heavily cratered icy surface and a huge canyon system called Ithaca Chasma.",
  iapetus:
    "Iapetus is Saturn's two-toned moon: one hemisphere is as dark as coal, the other as bright as snow, with a tall equatorial ridge.",
  miranda:
    "Miranda is the smallest of Uranus's five major moons and has some of the most extreme cliffs and patchwork terrain in the solar system.",
  ariel:
    "Ariel is a Uranian moon with a mix of cratered highlands and younger, grooved terrain that suggests past tectonic activity.",
  umbriel:
    "Umbriel is a dark, heavily cratered moon of Uranus. Its ancient surface is one of the least reflective among the major Uranian satellites.",
  titania:
    "Titania is the largest moon of Uranus. It has fault valleys and a mix of ice and rock, pointing to a history of internal heating.",
  oberon:
    "Oberon is the outermost of Uranus's major moons, with an old, cratered icy surface and a hint of a dark, reddish material in some basins.",
  charon:
    "Charon is Pluto's largest moon and so massive that the two bodies orbit a barycenter outside Pluto, making them a true double system.",
};

async function wiki(id, title) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const data = await fetchJson(url);
    return {
      title: data.title,
      extract: data.extract,
      description: data.description,
      thumbnail: data.thumbnail?.source ?? null,
      originalImage: data.originalimage?.source ?? null,
      wikipedia: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`,
    };
  } catch (error) {
    if (!WIKI_FALLBACKS[id]) {
      throw error;
    }
    return {
      title: title.replaceAll("_", " "),
      extract: WIKI_FALLBACKS[id],
      description: "Natural satellite",
      thumbnail: null,
      originalImage: null,
      wikipedia: `https://en.wikipedia.org/wiki/${title}`,
    };
  }
}

function slug(name) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "");
}

function hoursToLabel(hours) {
  if (hours == null || Number.isNaN(Number(hours))) return "Unknown";
  const value = Math.abs(Number(hours));
  if (value >= 24) {
    const days = value / 24;
    return `${days.toFixed(days >= 10 ? 0 : 1)} Earth days`;
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} hours`;
}

function daysToLabel(days) {
  if (!days) return "n/a";
  if (days >= 365) {
    return `${(days / 365.25).toFixed(days >= 3650 ? 0 : 1)} Earth years`;
  }
  return `${days.toFixed(days >= 10 ? 0 : 1)} Earth days`;
}

async function main() {
  const planets = JSON.parse(await readFile(path.join(CACHE, "planets.json"), "utf8"));
  const satellites = JSON.parse(await readFile(path.join(CACHE, "satellites.json"), "utf8"));
  const apod = JSON.parse(await readFile(path.join(CACHE, "apod.json"), "utf8"));

  const wikiCache = {};
  const wikiDir = path.join(CACHE, "wiki");
  await mkdir(wikiDir, { recursive: true });
  for (const [id, title] of Object.entries(WIKI_TITLES)) {
    const cacheFile = path.join(wikiDir, `${id}.json`);
    try {
      wikiCache[id] = JSON.parse(await readFile(cacheFile, "utf8"));
      process.stdout.write(`wiki ${id} (cache)\n`);
    } catch {
      process.stdout.write(`wiki ${id}\n`);
      wikiCache[id] = await wiki(id, title);
      await writeFile(cacheFile, `${JSON.stringify(wikiCache[id], null, 2)}\n`);
      await sleep(350);
    }
  }

  const planetByNasaId = Object.fromEntries(planets.map((planet) => [planet.id, planet]));

  const bodies = [];

  function addBody(base, extras = {}) {
    const id = base.id;
    const visual = VISUAL[id] ?? extras.visual ?? {
      color: 0x94a3b8,
      glow: 0xcbd5e1,
      size: 0.2,
      distance: extras.distance ?? 20,
      orbitSpeed: 0.004,
      hasRings: Boolean(base.hasRingSystem),
    };
    const page = wikiCache[id];
    bodies.push({
      id,
      name: base.name,
      aliases: ALIASES[id] ?? [],
      kind: base.kind,
      type: base.type,
      parentId: extras.parentId ?? null,
      color: visual.color,
      glow: visual.glow,
      size: visual.size,
      distance: visual.distance,
      orbitSpeed: visual.orbitSpeed,
      hasRings: visual.hasRings || Boolean(base.hasRingSystem),
      mass: base.mass ?? null,
      diameter: base.diameter ?? extras.diameter ?? null,
      density: base.density ?? extras.density ?? null,
      gravity: base.gravity ?? extras.gravity ?? null,
      escapeVelocity: base.escapeVelocity ?? null,
      rotationPeriod: base.rotationPeriod ?? null,
      lengthOfDay: base.lengthOfDay ?? base.rotationPeriod ?? null,
      distanceFromSun: base.distanceFromSun ?? extras.distanceFromSun ?? null,
      perihelion: base.perihelion ?? null,
      aphelion: base.aphelion ?? null,
      orbitalPeriod: base.orbitalPeriod ?? extras.orbitalPeriod ?? null,
      orbitalVelocity: base.orbitalVelocity ?? null,
      orbitalInclination: base.orbitalInclination ?? extras.orbitalInclination ?? null,
      orbitalEccentricity: base.orbitalEccentricity ?? extras.orbitalEccentricity ?? null,
      obliquityToOrbit: base.obliquityToOrbit ?? null,
      meanTemperature: base.meanTemperature ?? extras.meanTemperature ?? null,
      surfacePressure: base.surfacePressure ?? null,
      numberOfMoons: base.numberOfMoons ?? extras.numberOfMoons ?? 0,
      hasRingSystem: Boolean(base.hasRingSystem),
      hasGlobalMagneticField: Boolean(base.hasGlobalMagneticField),
      dayLength: hoursToLabel(base.lengthOfDay ?? base.rotationPeriod),
      yearLength: daysToLabel(base.orbitalPeriod ?? extras.orbitalPeriod),
      summary: page?.extract ?? extras.summary ?? "",
      description: page?.description ?? base.type,
      thumbnail: page?.thumbnail ?? null,
      image: page?.originalImage ?? page?.thumbnail ?? null,
      wikipedia: page?.wikipedia ?? null,
      featured: extras.featured ?? ["star", "planet"].includes(base.kind),
    });
  }

  addBody(SUN, { featured: true });

  for (const planet of planets) {
    const id = slug(planet.name);
    addBody(
      {
        ...planet,
        id,
        kind: planet.name === "Pluto" ? "dwarf-planet" : "planet",
        type: TYPES[id] ?? "Planet",
      },
      { featured: planet.name !== "Pluto" },
    );
  }

  for (const dwarf of DWARFS) {
    addBody(dwarf, { featured: false });
  }

  const moonsByPlanet = {};
  for (const moon of satellites) {
    const planet = planetByNasaId[moon.planetId];
    if (!planet) continue;
    const parentId = slug(planet.name);
    moonsByPlanet[parentId] ??= [];
    moonsByPlanet[parentId].push(moon.name);
    if (!FEATURED_MOONS.includes(moon.name)) continue;
    const id = slug(moon.name);
    const diameter = moon.radius ? moon.radius * 2 : null;
    addBody(
      {
        id,
        name: moon.name,
        kind: "moon",
        type: `Moon of ${planet.name}`,
        aliases: ALIASES[id] ?? [],
        mass: moon.gm ? Number((moon.gm / 6.6743e-11 / 1e24).toPrecision(4)) : null,
        diameter,
        density: moon.density ? moon.density * 1000 : null,
        gravity: null,
        numberOfMoons: 0,
        hasRingSystem: false,
        hasGlobalMagneticField: false,
        rotationPeriod: null,
        orbitalPeriod: null,
      },
      {
        parentId,
        featured: ["moon", "io", "europa", "ganymede", "titan", "triton", "charon"].includes(id),
        diameter,
        density: moon.density ? moon.density * 1000 : null,
        visual: {
          color: 0xcbd5e1,
          glow: 0xf8fafc,
          size: Math.max(0.12, Math.min(0.55, (moon.radius ?? 200) / 2000)),
          distance: (VISUAL[parentId]?.distance ?? 20) + 1.6,
          orbitSpeed: 0.02,
          hasRings: false,
        },
        summary: wikiCache[id]?.extract,
      },
    );
  }

  for (const body of bodies) {
    if (body.kind === "planet" || body.kind === "dwarf-planet") {
      body.moons = moonsByPlanet[body.id] ?? [];
      body.numberOfMoons = body.moons.length || body.numberOfMoons;
    } else {
      body.moons = [];
    }
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    sources: [
      "NASA planetary fact sheet via devstronomy/nasa-data-scraper",
      "Wikipedia REST summaries",
      "NASA Astronomy Picture of the Day",
    ],
    bodies,
    apod,
  };

  await mkdir(path.join(ROOT, "data"), { recursive: true });
  await writeFile(path.join(ROOT, "data/catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`wrote ${bodies.length} bodies`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
