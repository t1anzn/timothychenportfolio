import type { Metadata } from "next";
import Link from "next/link";
import { Download, ExternalLink } from "lucide-react";

import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import type { SiteSettings } from "@/sanity/lib/types";

export const metadata: Metadata = {
  title: "CV | Timothy Chen",
  description: "View and download Timothy Chen's CV.",
};

export default async function CVPage() {
  const siteSettings = await client.fetch<SiteSettings>(
    siteSettingsQuery,
    {},
    { next: { revalidate: 45 } }
  );

  const cvUrl = siteSettings?.cvUrl;
  // Sanity's ?dl= param forces a download (with a friendly filename) instead
  // of opening inline — needed because the asset is served cross-origin.
  const downloadUrl = cvUrl
    ? `${cvUrl}?dl=${encodeURIComponent(siteSettings?.cvFileName ?? "CV.pdf")}`
    : undefined;

  return (
    <main className="cv cv-standalone">
      <header>
        <p className="muted">
          <Link href="/">Home</Link> / <span>CV</span>
        </p>
        <h1>Curriculum Vitae</h1>
        {cvUrl ? (
          <div className="cv-actions no-print">
            <a
              className="cv-action-btn"
              href={cvUrl}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={16} aria-hidden="true" />
              Open in new tab
            </a>
            <a className="cv-action-btn" href={downloadUrl}>
              <Download size={16} aria-hidden="true" />
              Download PDF
            </a>
          </div>
        ) : null}
      </header>

      <hr />

      {cvUrl ? (
        <div className="pdf-viewer no-print">
          <object data={cvUrl} type="application/pdf" className="pdf-frame">
            <iframe src={cvUrl} title="CV" className="pdf-frame" />
            <p className="muted pdf-fallback">
              Your browser can&apos;t display the PDF inline.{" "}
              <a href={cvUrl} target="_blank" rel="noreferrer">
                Open the CV in a new tab
              </a>{" "}
              or{" "}
              <a href={downloadUrl}>download it</a>.
            </p>
          </object>
        </div>
      ) : (
        <p className="muted">
          No CV has been uploaded yet. Add one in Sanity Studio under Site
          Settings → CV / Résumé.
        </p>
      )}
    </main>
  );
}
