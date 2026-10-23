import { DocClose } from "../../components/DocShell";

// Shown while a project loads: just the frame, with the title's worth of space held
// open so nothing jumps when the content arrives.
export default function Loading() {
  return (
    <>
      <DocClose href="/#work" label="Back to work" />
      <main className="doc" aria-busy="true">
        <p className="doc-meta-line void-mono">Loading</p>
        <div className="doc-skeleton" aria-hidden="true" />
      </main>
    </>
  );
}
