"use client";

import { MessageCircleIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { BODIES } from "@/lib/solar-system";
import type { SceneCommand } from "@/lib/scene-commands";
import { AgentChat } from "./agent-chat";

const SolarSystem = dynamic(
  () => import("./solar-system").then((module) => module.SolarSystem),
  {
    loading: () => <div className="h-full w-full bg-slate-950" />,
    ssr: false,
  },
);

export function SolarExplorer() {
  const [focusedBodyId, setFocusedBodyId] = useState("sun");
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [chatOpen, setChatOpen] = useState(true);

  const focused = BODIES.find((body) => body.id === focusedBodyId) ?? BODIES[0];

  const handleSceneCommand = useCallback((command: SceneCommand) => {
    if (command.kind === "focus_body") {
      setFocusedBodyId(command.id);
      return;
    }
    setOrbitSpeed(command.multiplier);
  }, []);

  return (
    <main className="relative h-dvh overflow-hidden bg-slate-950 text-slate-50">
      <SolarSystem
        focusedBodyId={focusedBodyId}
        onSelectBody={setFocusedBodyId}
        orbitSpeed={orbitSpeed}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 p-4 sm:p-6">
        <div className="pointer-events-auto max-w-md rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 shadow-2xl backdrop-blur-md">
          <p className="text-[11px] uppercase tracking-[0.2em] text-sky-300">3D Solar System</p>
          <h1 className="mt-1 font-medium text-xl tracking-tight">{focused?.name}</h1>
          <p className="mt-1 text-slate-300 text-sm">{focused?.summary}</p>
          <p className="mt-2 text-slate-400 text-xs">
            Orbit speed {orbitSpeed === 0 ? "paused" : `${orbitSpeed.toFixed(1)}×`} · click a body
            or ask the guide
          </p>
        </div>

        <button
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2 text-sm shadow-lg backdrop-blur-md lg:hidden"
          onClick={() => setChatOpen((open) => !open)}
          type="button"
        >
          <MessageCircleIcon className="size-4" />
          {chatOpen ? "Hide guide" : "Ask guide"}
        </button>
      </div>

      <aside
        className={`absolute inset-x-0 bottom-0 z-20 flex h-[58vh] flex-col border-white/10 bg-slate-950/80 shadow-2xl backdrop-blur-xl transition-transform duration-200 lg:inset-y-4 lg:right-4 lg:left-auto lg:h-auto lg:w-[26rem] lg:rounded-2xl lg:border ${
          chatOpen ? "translate-y-0" : "translate-y-[110%] lg:translate-y-0"
        }`}
      >
        <AgentChat
          clientContext={{ focusedBody: focusedBodyId, orbitSpeed }}
          onSceneCommand={handleSceneCommand}
          variant="panel"
        />
      </aside>
    </main>
  );
}
