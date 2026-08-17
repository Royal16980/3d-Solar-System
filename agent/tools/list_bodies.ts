import { defineTool } from "eve/tools";
import { z } from "zod";
import { BODIES, bodyFacts } from "../../lib/solar-system";

export default defineTool({
  description: "List the Sun and planets in this 3D solar system model.",
  inputSchema: z.object({}),
  async execute() {
    return BODIES.map(bodyFacts);
  },
});
