import { defineTool } from "eve/tools";
import { z } from "zod";
import { BODY_IDS, resolveBody } from "../../lib/catalog";

export default defineTool({
  description:
    "Move the 3D camera to a catalog body so the visitor can inspect it. Works for the Sun, planets, and dwarf planets in the scene.",
  inputSchema: z.object({
    name: z.string().min(1).describe("Body name, such as Earth, Saturn, Pluto, or Sun"),
  }),
  async execute({ name }) {
    const body = resolveBody(name);
    if (!body) {
      return {
        ok: false as const,
        focused: false as const,
        error: `Unknown body "${name}". Valid names include: ${BODY_IDS.slice(0, 16).join(", ")}.`,
      };
    }

    if (body.kind === "moon") {
      return {
        ok: true as const,
        focused: true as const,
        id: body.parentId ?? body.id,
        name: body.name,
        note: `${body.name} is a moon. The camera focuses its parent, ${body.parentId}.`,
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
