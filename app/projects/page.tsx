import { redirect } from "next/navigation";

// There is no separate projects index: the Work section on the home page is the list
// of projects, and each one links to its own page. Anything pointing at /projects
// (old links, the old nav) lands there.
export default function ProjectsIndex() {
  redirect("/#work");
}
