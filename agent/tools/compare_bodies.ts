import { defineTool } from "eve/tools";
import { z } from "zod";
import { bodyFacts, resolveBody } from "../../lib/catalog";

export default defineTool({
  description: "Compare two catalog bodies side by side using NASA fact-sheet numbers.",
  inputSchema: z.object({
    first: z.string().min(1).describe("First body name"),
    second: z.string().min(1).describe("Second body name"),
  }),
  async execute({ first, second }) {
    const left = resolveBody(first);
    const right = resolveBody(second);
    if (!left || !right) {
      return {
        ok: false as const,
        error: `Could not resolve ${!left ? first : second}.`,
      };
    }

    return {
      ok: true as const,
      first: bodyFacts(left),
      second: bodyFacts(right),
    };
  },
});
