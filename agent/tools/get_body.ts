import { defineTool } from "eve/tools";
import { z } from "zod";
import { BODY_IDS, bodyFacts, resolveBody } from "../../lib/solar-system";

export default defineTool({
  description: "Look up facts about the Sun or a planet in this model.",
  inputSchema: z.object({
    name: z.string().min(1).describe("Body name, such as Earth, Saturn, or Sun"),
  }),
  async execute({ name }) {
    const body = resolveBody(name);
    if (!body) {
      return {
        ok: false as const,
        error: `Unknown body "${name}". Valid names: ${BODY_IDS.join(", ")}.`,
      };
    }

    return { ok: true as const, ...bodyFacts(body) };
  },
});
