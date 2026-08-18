"use client";

import { PauseIcon, PlayIcon } from "lucide-react";

const SPEEDS = [0, 0.25, 1, 4, 12] as const;

export function TimeControls({
  orbitSpeed,
  onChange,
}: {
  readonly orbitSpeed: number;
  readonly onChange: (value: number) => void;
}) {
  const paused = orbitSpeed === 0;

  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-2 py-1 backdrop-blur-md">
      <button
        aria-label={paused ? "Play orbits" : "Pause orbits"}
        className="flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10"
        onClick={() => onChange(paused ? 1 : 0)}
        type="button"
      >
        {paused ? <PlayIcon className="size-3.5" /> : <PauseIcon className="size-3.5" />}
      </button>
      {SPEEDS.filter((speed) => speed > 0).map((speed) => (
        <button
          className={`rounded-full px-2 py-1 text-[11px] ${
            orbitSpeed === speed ? "bg-amber-200 text-slate-950" : "text-slate-300 hover:bg-white/10"
          }`}
          key={speed}
          onClick={() => onChange(speed)}
          type="button"
        >
          {speed}×
        </button>
      ))}
    </div>
  );
}
