import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Timothy Chen",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
