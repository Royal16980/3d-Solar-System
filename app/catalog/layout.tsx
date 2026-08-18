import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Catalog",
  description: "NASA-backed archive of the Sun, planets, dwarf planets, and major moons.",
};

export default function CatalogLayout({ children }: { readonly children: ReactNode }) {
  return children;
}
