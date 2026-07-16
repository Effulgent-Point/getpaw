"use client";

import Link from "next/link";

// Branded recovery UI for any client/runtime error thrown inside a route
// (TutorialPlayer, SlideViewer, CatalogView, etc.). Rendered inside the shell
// layout, so the header/footer stay in place.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="wrap py-24">
      <span className="eyebrow">
        <span className="tick" />
        Something went wrong
      </span>
      <h1 className="mt-5 max-w-[720px] font-display text-[clamp(30px,5vw,50px)] font-extrabold leading-[1.02] tracking-[-0.02em]">
        This page hit a snag.
      </h1>
      <p className="mt-4 max-w-[540px] text-[17px] text-mut">
        An unexpected error interrupted this view. You can try again, or head
        back to the start.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" className="btn" onClick={reset}>
          Try again
        </button>
        <Link className="btn line" href="/">
          Go home
        </Link>
      </div>
    </section>
  );
}
