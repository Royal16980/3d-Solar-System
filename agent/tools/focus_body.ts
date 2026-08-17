import { defineTool } from "eve/tools";
import { z } from "zod";
import { BODY_IDS, resolveBody } from "../../lib/solar-system";

export default defineTool({
  description:
    "Move the 3D camera to the Sun or a planet so the visitor can see it in the model.",
  inputSchema: z.object({
    name: z.string().min(1).describe("Body name, such as Earth, Saturn, or Sun"),
  }),
  async execute({ name }) {
    const body = resolveBody(name);
    if (!body) {
      return {
        ok: false as const,
        focused: false as const,
        error: `Unknown body "${name}". Valid names: ${BODY_IDS.join(", ")}.`,
      };
    }

    return {
      ok: true as const,
      focused: true as const,
      id: body.id,
      name: body.name,
    };
  },
});
