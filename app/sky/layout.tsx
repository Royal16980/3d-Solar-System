import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sky",
  description: "NASA Astronomy Picture of the Day.",
};

export default function SkyLayout({ children }: { readonly children: ReactNode }) {
  return children;
}
