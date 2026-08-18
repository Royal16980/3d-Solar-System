"use client";

import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BODIES, type CatalogBody } from "@/lib/catalog";

export function SearchCommand({
  onSelect,
}: {
  readonly onSelect: (body: CatalogBody) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-slate-300 text-sm hover:bg-white/10"
        onClick={() => setOpen(true)}
        type="button"
      >
        <SearchIcon className="size-3.5" />
        <span>Search</span>
        <kbd className="hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400 sm:inline">
          ⌘K
        </kbd>
      </button>
      <CommandDialog onOpenChange={setOpen} open={open} title="Search the catalog">
        <CommandInput placeholder="Search planets, moons, dwarf planets…" />
        <CommandList>
          <CommandEmpty>No matching body.</CommandEmpty>
          {(["star", "planet", "dwarf-planet", "moon"] as const).map((kind) => {
            const items = BODIES.filter((body) => body.kind === kind);
            if (items.length === 0) return null;
            return (
              <CommandGroup heading={kind.replace("-", " ")} key={kind}>
                {items.map((body) => (
                  <CommandItem
                    key={body.id}
                    onSelect={() => {
                      onSelect(body);
                      setOpen(false);
                    }}
                    value={`${body.name} ${body.aliases.join(" ")} ${body.type}`}
                  >
                    <span>{body.name}</span>
                    <span className="ml-auto text-muted-foreground text-xs">{body.type}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
