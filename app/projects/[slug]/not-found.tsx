import Link from "next/link";

import { DocClose } from "../../components/DocShell";

export default function NotFound() {
  return (
    <>
      <DocClose href="/#work" label="Back to work" />
      <main className="doc doc-body">
        <p className="doc-meta-line void-mono">404</p>
        <h1 className="doc-title">Nothing here</h1>
        <p className="doc-lede">
          That project does not exist, or it has moved. The rest of them are in the
          Work section.
        </p>
        <p className="doc-links void-mono">
          <Link href="/#work">Work</Link>
        </p>
      </main>
    </>
  );
}
