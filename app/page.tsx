import { ExplorerApp } from "@/app/_components/explorer-app";
import { getBody } from "@/lib/catalog";

export default async function Page({
  searchParams,
}: {
  readonly searchParams: Promise<{ body?: string }>;
}) {
  const { body } = await searchParams;
  const initialBodyId = body && getBody(body) ? body : "earth";
  return <ExplorerApp initialBodyId={initialBodyId} />;
}
