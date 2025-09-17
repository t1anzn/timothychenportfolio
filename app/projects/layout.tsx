import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Timothy Chen",
  description: "Detailed view of Timothy Chen's projects and work",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
