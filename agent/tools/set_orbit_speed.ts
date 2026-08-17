import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description:
    "Change how fast planets orbit in the 3D model. 1 is the default, 0 pauses, and higher values speed the scene up.",
  inputSchema: z.object({
    multiplier: z
      .number()
      .min(0)
      .max(20)
      .describe("Orbit speed multiplier. 1 is default, 0 pauses motion."),
  }),
  async execute({ multiplier }) {
    return {
      ok: true as const,
      multiplier,
      paused: multiplier === 0,
    };
  },
});
