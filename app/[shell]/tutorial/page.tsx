import type { Metadata } from "next";
import { TrackSelector } from "@/components/tutorial/TrackSelector";
import { TutorialShell } from "@/components/tutorial/TutorialShell";

export const metadata: Metadata = {
  title: "Tutorial",
  description:
    "Learn paw by doing. Nine interactive tracks generated from the paw CLI tutorial, so the web never drifts from the tool.",
  alternates: { canonical: "https://getpaw.dev/tutorial" },
};

export default function TutorialIndexPage() {
  return (
    <TutorialShell>
      <TrackSelector />
    </TutorialShell>
  );
}
