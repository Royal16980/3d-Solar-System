"use client";

import { MessageCircleIcon, SparklesIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getBody, resolveBody, requireBody, type CatalogBody } from "@/lib/catalog";
import type { SceneCommand } from "@/lib/scene-commands";
import { AgentChat } from "./agent-chat";
import { BodyInspector } from "./hud/body-inspector";
import { GuideBriefing } from "./hud/guide-briefing";
import { PlanetRail } from "./hud/planet-rail";
import { SearchCommand } from "./hud/search-command";
import { TimeControls } from "./hud/time-controls";
import { SiteHeader } from "./site-header";

const SolarSystem = dynamic(
  () => import("./solar-system").then((module) => module.SolarSystem),
  {
    loading: () => <div className="h-full w-full bg-[#05060c]" />,
    ssr: false,
  },
);

export function ExplorerApp({ initialBodyId = "earth" }: { readonly initialBodyId?: string }) {
  const [selectedId, setSelectedId] = useState(initialBodyId);
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [showDwarfs, setShowDwarfs] = useState(
    () => getBody(initialBodyId)?.kind === "dwarf-planet",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("body");
    if (requested && getBody(requested)) {
      setSelectedId(requested);
      if (getBody(requested)?.kind === "dwarf-planet") {
        setShowDwarfs(true);
      }
    }
  }, []);
  const [guideOpen, setGuideOpen] = useState(true);

  const selected = getBody(selectedId) ?? requireBody("earth");
  const sceneFocusId = selected.kind === "moon" ? (selected.parentId ?? "sun") : selected.id;

  const selectBody = useCallback((id: string) => {
    setSelectedId(id);
    const body = getBody(id);
    if (body?.kind === "dwarf-planet") {
      setShowDwarfs(true);
    }
  }, []);

  const handleSearch = useCallback(
    (body: CatalogBody) => {
      selectBody(body.id);
    },
    [selectBody],
  );

  const handleSceneCommand = useCallback((command: SceneCommand) => {
    if (command.kind === "focus_body") {
      selectBody(command.id);
      return;
    }
    setOrbitSpeed(command.multiplier);
  }, [selectBody]);

  const clientContext = useMemo(
    () => ({
      focusedBody: selected.id,
      orbitSpeed,
      showDwarfs,
    }),
    [orbitSpeed, selected.id, showDwarfs],
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#05060c] text-slate-50">
      <SiteHeader
        current="explore"
        trailing={
          <div className="flex items-center gap-2">
            <SearchCommand onSelect={handleSearch} />
            <button
              className={`hidden rounded-full border px-3 py-1.5 text-xs sm:inline ${
                showDwarfs
                  ? "border-amber-200/40 bg-amber-200/10 text-amber-100"
                  : "border-white/10 text-slate-300"
              }`}
              onClick={() => setShowDwarfs((value) => !value)}
              type="button"
            >
              Dwarf planets
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm lg:hidden"
              onClick={() => setGuideOpen((value) => !value)}
              type="button"
            >
              <MessageCircleIcon className="size-3.5" />
              Guide
            </button>
          </div>
        }
      />

      <div className="relative min-h-0 flex-1">
        <SolarSystem
          focusedBodyId={sceneFocusId}
          onSelectBody={selectBody}
          orbitSpeed={orbitSpeed}
          showDwarfs={showDwarfs}
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <BodyInspector
              body={selected}
              onSelectMoon={(name) => {
                const moon = resolveBody(name);
                if (moon) selectBody(moon.id);
              }}
            />
            <div className="hidden lg:block" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <TimeControls onChange={setOrbitSpeed} orbitSpeed={orbitSpeed} />
            <PlanetRail focusedBodyId={sceneFocusId} onSelect={selectBody} />
          </div>
        </div>

        <aside
          className={`absolute inset-x-0 bottom-0 z-20 flex h-[52vh] flex-col border-white/10 bg-slate-950/82 shadow-2xl backdrop-blur-xl transition-transform duration-200 lg:inset-y-20 lg:right-5 lg:left-auto lg:h-auto lg:w-[24.5rem] lg:rounded-2xl lg:border ${
            guideOpen ? "translate-y-0" : "translate-y-[110%] lg:translate-y-0"
          }`}
        >
          <div className="flex items-center gap-2 border-white/10 border-b px-4 py-3 text-amber-100 text-xs uppercase tracking-[0.18em]">
            <SparklesIcon className="size-3.5" />
            Observatory guide
          </div>
          <div className="px-4 pt-3">
            <GuideBriefing body={selected} />
          </div>
          <AgentChat
            clientContext={clientContext}
            onSceneCommand={handleSceneCommand}
            variant="panel"
          />
        </aside>
      </div>
    </div>
  );
}
