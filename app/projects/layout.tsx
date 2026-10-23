import type { Metadata } from "next";

import DocShell from "../components/DocShell";

export const metadata: Metadata = {
  title: "Projects | Timothy Chen",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocShell>{children}</DocShell>;
}
