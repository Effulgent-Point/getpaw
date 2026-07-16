"use client";

// Last-resort boundary for errors thrown in the root layout itself. It must
// render its own <html>/<body> because it replaces the whole document.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f7f6",
          color: "#191d1b",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div style={{ maxWidth: 520, padding: "0 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#5e6a66", margin: "0 0 24px" }}>
            An unexpected error interrupted the page. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              border: "1px solid #191d1b",
              background: "#191d1b",
              color: "#f5f7f6",
              borderRadius: 8,
              padding: "10px 18px",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
