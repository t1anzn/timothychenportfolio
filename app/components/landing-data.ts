// Static content for the landing, until the revamp is wired back to Sanity.

export type SectionId = "about" | "now" | "work" | "contact";

export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "now", label: "Now" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export const INTRO =
  "I'm Timothy Chen, a final-year computer science student at UAL CCI.";

export const LOCATION = "Based in London, UK";

// A hackathon as the About journal shows it. placement is only set where there was one.
export type Hackathon = { title: string; placement?: string };

export const HACKATHONS: Hackathon[] = [
  { title: "HackSprint '25" },
  { title: "MeetStream.ai Voice Agents", placement: "3rd" },
  { title: "Perplexity London" },
  { title: "NVIDIA Hack for Impact" },
  { title: "Grok Bot Community Engineering", placement: "Top 5" },
];

export const STACK = [
  { label: "Languages", items: ["Python", "TypeScript", "C++", "SQL"] },
  { label: "AI / ML", items: ["PyTorch", "TensorFlow", "scikit-learn", "OpenCV", "Hugging Face"] },
  { label: "Frontend", items: ["React", "Next.js", "React Native", "Tailwind CSS"] },
  { label: "Backend", items: ["Flask", "SQLAlchemy"] },
  { label: "Tools", items: ["Git", "Docker", "AWS", "Claude", "GitHub Copilot"] },
];

export const INTERESTS = ["AI applications", "Machine learning", "Computer vision"];

export const NOW = [
  {
    label: "Building",
    text: "A reverse-engineering of Apple's spatial reframing: a U-Net for subject segmentation and monocular depth estimation, used to rebuild the scene with depth-aware parallax.",
  },
  {
    label: "Studying",
    text: "Final-year BSc Computer Science at UAL CCI: AI and Intelligent Systems, Evaluating User Experience in Digital Technologies, and Cybersecurity.",
  },
  {
    label: "Leading",
    text: "Chair of ACM at UAL. Planning hackathons and Distinguished Speaker Program talks.",
  },
  {
    label: "Working",
    text: "Founding growth intern at Selah, an email-first Bible reading service. Growth experiments, social content and AI tooling.",
  },
  {
    label: "Part-time",
    text: "Barista at Costa Coffee.",
  },
];

// A project as the Work section shows it. slug is the project's page; without one
// (the offline fallback below) the title is plain text.
export type WorkProject = {
  title: string;
  slug?: string;
  year: string;
  status: string;
  skills: string[];
  summary: string;
  thumb?: string;
};

// Used only if Sanity cannot be reached, so the Work section is never empty.
export const PROJECTS: WorkProject[] = [
  {
    title: "Compute Energy Analytics System",
    year: "2026",
    status: "In progress",
    skills: ["IoT", "data", "AI"],
    summary:
      "Full-stack platform that meters the energy cost of AI training runs from a smart-plug sensor and shows it in a live dashboard.",
  },
  {
    title: "Full-Stack Movie Database",
    year: "2025",
    status: "Completed",
    skills: ["React", "Python", "SQL", "API", "AI"],
    summary: "Web app for browsing and searching films, with a structured backend and database.",
  },
  {
    title: "AI Study Companion App",
    year: "2025",
    status: "In progress",
    skills: ["React Native", "TypeScript", "Firebase", "AI"],
    summary: "Mobile study companion with AI-assisted features and a Firebase-backed workflow.",
  },
  {
    title: "Machine Learning Topic Classifier",
    year: "2025",
    status: "Completed",
    skills: ["ML", "Python"],
    summary: "Text classification project covering dataset preparation, training and evaluation.",
  },
  {
    title: "Mandarin PowerPoint Generator",
    year: "2025",
    status: "Completed",
    skills: ["Python"],
    summary: "Python tool that generates Mandarin learning slides programmatically.",
  },
  {
    title: "Smart IoT Watering System",
    year: "2024",
    status: "Completed",
    skills: ["IoT", "React Native", "Firebase"],
    summary: "Plant watering prototype with sensor data, automation rules and a companion app.",
  },
];

export const CONTACT = {
  email: "timothy.chen188@gmail.com",
  links: [
    { label: "LinkedIn", handle: "in/timothychenldn", href: "https://www.linkedin.com/in/timothychenldn/" },
    { label: "GitHub", handle: "t1anzn", href: "https://github.com/t1anzn" },
    { label: "X", handle: "@timtianye", href: "https://x.com/timtianye" },
  ],
};
