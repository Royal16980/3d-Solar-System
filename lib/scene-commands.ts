import type { EveMessage } from "eve/react";

export type FocusBodyCommand = {
  readonly kind: "focus_body";
  readonly toolCallId: string;
  readonly id: string;
};

export type OrbitSpeedCommand = {
  readonly kind: "set_orbit_speed";
  readonly toolCallId: string;
  readonly multiplier: number;
};

export type SceneCommand = FocusBodyCommand | OrbitSpeedCommand;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function extractLatestSceneCommand(
  messages: readonly EveMessage[],
): SceneCommand | undefined {
  for (let messageIndex = messages.length - 1; messageIndex >= 0; messageIndex -= 1) {
    const message = messages[messageIndex];
    if (!message) {
      continue;
    }

    for (let partIndex = message.parts.length - 1; partIndex >= 0; partIndex -= 1) {
      const part = message.parts[partIndex];
      if (part.type !== "dynamic-tool" || part.state !== "output-available") {
        continue;
      }

      const output = part.output;
      if (!isRecord(output) || output.ok !== true) {
        continue;
      }

      if (part.toolName === "focus_body" && typeof output.id === "string") {
        return {
          kind: "focus_body",
          toolCallId: part.toolCallId,
          id: output.id,
        };
      }

      if (part.toolName === "set_orbit_speed" && typeof output.multiplier === "number") {
        return {
          kind: "set_orbit_speed",
          toolCallId: part.toolCallId,
          multiplier: output.multiplier,
        };
      }
    }
  }

  return undefined;
}
