import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TRACK_IDS, getTrack } from "@/lib/tutorial/data";
import { TutorialPlayer } from "@/components/tutorial/TutorialPlayer";
import { TutorialShell } from "@/components/tutorial/TutorialShell";

// Prebuild all nine tracks; anything else is a 404.
export function generateStaticParams() {
  return TRACK_IDS.map((track) => ({ track }));
}
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ track: string }>;
}): Promise<Metadata> {
  const { track: id } = await params;
  const track = getTrack(id);
  if (!track) return {};
  return {
    title: `${track.title} tutorial`,
    description: track.desc,
    alternates: { canonical: `https://getpaw.dev/tutorial/${track.id}` },
  };
}

export default async function TrackPage({
  params,
  searchParams,
}: {
  params: Promise<{ track: string }>;
  searchParams: Promise<{ p?: string }>;
}) {
  const { track: id } = await params;
  // getTrack() never returns undefined here: dynamicParams=false already 404s
  // any param not returned by generateStaticParams (which returns every id).
  // The guard is belt-and-suspenders.
  const track = getTrack(id);
  if (!track) notFound();

  // Resolve ?p= server-side and clamp it, then key the player on the target
  // page so a same-track deep link (e.g. a search hit into the current track)
  // forces a clean remount instead of silently doing nothing.
  const { p } = await searchParams;
  const total = track.pages.length;
  const parsed = p !== undefined ? Number.parseInt(p, 10) : 0;
  const initialPage =
    Number.isInteger(parsed) && parsed >= 0 && parsed < total ? parsed : 0;

  const nextIdx = TRACK_IDS.indexOf(track.id) + 1;
  const nextRaw = nextIdx < TRACK_IDS.length ? getTrack(TRACK_IDS[nextIdx]) : undefined;
  const nextTrack = nextRaw
    ? { id: nextRaw.id, title: nextRaw.title, icon: nextRaw.icon }
    : undefined;

  return (
    <TutorialShell>
      <TutorialPlayer
        key={`${track.id}:${initialPage}`}
        track={track}
        initialPage={initialPage}
        nextTrack={nextTrack}
      />
    </TutorialShell>
  );
}
