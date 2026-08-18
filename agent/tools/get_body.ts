import { defineTool } from "eve/tools";
import { z } from "zod";
import { BODY_IDS, bodyFacts, moonsOf, resolveBody } from "../../lib/catalog";

export default defineTool({
  description: "Look up NASA-backed facts about the Sun, a planet, dwarf planet, or major moon.",
  inputSchema: z.object({
    name: z.string().min(1).describe("Body name, such as Earth, Titan, Ceres, or Sun"),
  }),
  async execute({ name }) {
    const body = resolveBody(name);
    if (!body) {
      return {
        ok: false as const,
        error: `Unknown body "${name}". Valid names include: ${BODY_IDS.slice(0, 16).join(", ")}.`,
      };
    }

    return {
      ok: true as const,
      ...bodyFacts(body),
      majorMoons: moonsOf(body.id).map((moon) => moon.name),
    };
  },
});
