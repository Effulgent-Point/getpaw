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
}: {
  params: Promise<{ track: string }>;
}) {
  const { track: id } = await params;
  const track = getTrack(id);
  if (!track) notFound();

  return (
    <TutorialShell>
      <TutorialPlayer track={track} />
    </TutorialShell>
  );
}
