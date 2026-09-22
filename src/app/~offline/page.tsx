"use client";

export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F0E8",
        fontFamily: "var(--font-poppins, system-ui, sans-serif)",
        color: "#1C1917",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "480px" }}>
        {/* Brand */}
        <p
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#78716C",
            marginBottom: "2rem",
          }}
        >
          SLPZY · SLEEPEAZY
        </p>

        {/* Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            margin: "0 auto 2rem",
            border: "1.5px solid #D6D3D1",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#78716C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
            <path d="M8 2v16" />
            <path d="M16 6v16" />
          </svg>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 300,
            letterSpacing: "0.05em",
            marginBottom: "1rem",
            lineHeight: 1.4,
          }}
        >
          You&apos;re offline
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 300,
            color: "#78716C",
            lineHeight: 1.8,
            marginBottom: "2.5rem",
          }}
        >
          Sepertinya koneksi internet kamu sedang terputus.
          <br />
          Sambungkan kembali untuk melihat koleksi TENCEL™ terbaru kami.
        </p>

        {/* CTA */}
        <button
          onClick={() => window.location.reload()}
          style={{
            display: "inline-block",
            padding: "0.75rem 2rem",
            border: "1.5px solid #1C1917",
            borderRadius: "9999px",
            background: "transparent",
            color: "#1C1917",
            fontSize: "0.8rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s ease",
          }}
        >
          Coba lagi
        </button>
      </div>
    </main>
  );
}
