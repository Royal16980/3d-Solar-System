import { defineTool } from "eve/tools";
import { z } from "zod";
import { BODIES, bodyFacts } from "../../lib/catalog";

export default defineTool({
  description:
    "List bodies in the observatory catalog: the Sun, planets, dwarf planets, and featured moons.",
  inputSchema: z.object({
    kind: z
      .enum(["all", "star", "planet", "dwarf-planet", "moon"])
      .optional()
      .describe("Optional filter. Defaults to all."),
  }),
  async execute({ kind }) {
    const selected = BODIES.filter((body) => kind == null || kind === "all" || body.kind === kind);
    return selected.map((body) => ({
      ...bodyFacts(body),
      featured: body.featured,
    }));
  },
});
