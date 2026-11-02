import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 500, margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.5rem" }}>
        404 — Page Not Found
      </h1>
      <p style={{ color: "var(--text-2)", marginBottom: "1.5rem" }}>
        The document utility or page you requested does not exist.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Workspace
      </Link>
    </div>
  );
}
