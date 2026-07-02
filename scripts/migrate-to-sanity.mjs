// One-time migration script: reads the site's existing hardcoded content
// (content/projects.md, the old hardcoded array from app/projects/[slug]/page.tsx,
// content/now.md, and the hardcoded bio text from HomeClient.tsx) and writes
// equivalent documents into Sanity. Safe to re-run (uses createOrReplace with
// deterministic IDs).
//
// Usage:
//   node --env-file=.env.local scripts/migrate-to-sanity.mjs
// Requires SANITY_WRITE_TOKEN (Editor/Administrator token) in .env.local,
// in addition to NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET.

import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN. Set them in .env.local, then run:\n" +
      "  node --env-file=.env.local scripts/migrate-to-sanity.mjs"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const PUBLIC_DIR = path.join(process.cwd(), "public");
const uploadedAssets = new Map();

async function uploadImage(filename) {
  if (uploadedAssets.has(filename)) return uploadedAssets.get(filename);
  const filePath = path.join(PUBLIC_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", buffer, { filename });
  const ref = { _type: "reference", _ref: asset._id };
  uploadedAssets.set(filename, ref);
  console.log(`  uploaded image: ${filename} -> ${asset._id}`);
  return ref;
}

async function imageField(filename) {
  if (!filename) return undefined;
  return { _type: "image", asset: await uploadImage(filename) };
}

// ---------------------------------------------------------------------------
// Merged project data (union of content/projects.md + the old hardcoded
// array in app/projects/[slug]/page.tsx). `order` matches the previous
// homepage grid order; mandarin-ppt-generator is appended since it wasn't
// reachable from the homepage before.
// ---------------------------------------------------------------------------
const projects = [
  {
    slug: "movie-database",
    title: "Full-Stack Movie Database",
    year: "2025",
    status: "Completed",
    category: "Full Stack Web Application",
    summary:
      "full-stack web app for browsing/searching films with a structured backend + database.",
    description:
      "CineMind is a comprehensive full-stack movie database application that combines the power of modern web technologies with AI-driven insights. Built with React and Astro for lightning-fast performance, it features real-time movie search, detailed information pages, user reviews, and intelligent recommendations powered by Google's Gemini API.",
    skills: ["React", "Astro", "TailwindCSS", "Flask", "SQLAlchemy", "Gemini API"],
    features: [
      "Real-time movie search with advanced filtering options",
      "AI-powered movie sentiment analysis",
      "Analytics dashboard for movie data insights",
      "Comprehensive movie details with cast, crew, and reviews",
      "Responsive design optimized for all devices",
      "Fast server-side rendering with Astro framework",
      "Integration with TMDB API for extensive movie database",
    ],
    challenges:
      "Database schema design for efficient querying, dynamic movie grid rendering, robust search filtering and optimizing data fetching for performance.",
    githubUrl: "https://github.com/t1anzn/cinemind",
    thumbnailFile: "cinemindthumb.png",
    hidden: false,
    order: 0,
    media: [
      { type: "image", file: "cinemindmainlong.png", alt: "CineMind homepage interface", caption: "Main dashboard showcasing featured movies and search functionality" },
      { type: "image", file: "cinemindlong.png", alt: "CineMind search results", caption: "Advanced search and filtering capabilities" },
      { type: "image", file: "cinemindmoviepage.png", alt: "CineMind movie details page", caption: "Detailed movie information with ratings, cast, and AI sentiment analysis" },
      { type: "video", path: "/cinemind-demo.mp4", alt: "CineMind demo video", caption: "Live demonstration of CineMind's AI-powered features and user interface" },
    ],
  },
  {
    slug: "compute-energy-analytics",
    title: "Compute Energy Analytics System (CEAS)",
    year: "2026",
    status: "Work in Progress",
    summary:
      "visual + comparative analysis of AI workload energy consumption using the university's existing zigbee telemetry infrastructure.",
    skills: ["iot", "data", "ai"],
    thumbnailFile: null, // no real thumbnail yet, falls back to /placeholder.svg on the site
    hidden: false,
    order: 1,
    media: [],
  },
  {
    slug: "tcp-key-value-server",
    title: "TCP Key-Value Server",
    year: "2026",
    status: "Work in Progress",
    category: "Networking / Systems Programming",
    summary:
      "C++ TCP key-value server with basic client-server communication. Planned: more commands, data persistence, protocol improvements.",
    description:
      "A C++ TCP key-value server with basic client-server communication. Planned features include more commands, data persistence, and protocol improvements.",
    skills: ["C++", "TCP/IP", "Linux"],
    features: [
      "Basic client-server communication over TCP",
      "Planned: more commands, data persistence, protocol improvements",
    ],
    challenges:
      "Implementing robust socket handling, planning for extensible protocol design, and ensuring cross-platform compatibility.",
    githubUrl: "https://github.com/t1anzn/redisclone",
    thumbnailFile: "tcp.png",
    hidden: true,
    order: 2,
    media: [
      { type: "image", file: "tcp.png", alt: "TCP Key-Value Server thumbnail", caption: "Project logo/thumbnail" },
    ],
  },
  {
    slug: "ai-study-companion",
    title: "AI Study Companion App",
    year: "2025",
    status: "In Progress",
    category: "Mobile Application",
    summary:
      "mobile study companion concept with ai-assisted features and a firebase-backed workflow.",
    description:
      "An intelligent mobile study companion that allows students to take photos of their study materials and create simple, easy-to-understand study packs.",
    skills: ["React Native", "TypeScript", "Firebase", "Gemini API"],
    features: [
      "Image recognition for extracting text from study materials",
      "Smart flashcard generation",
      "Simplified explanations of complex topics",
      "Study pack creation and management",
      "Tagging and categorization of study materials",
      "Filtering and search functionality",
    ],
    challenges:
      "Prompt engineering for generating effective AI study materials, and formatting extracted text from images accurately.",
    thumbnailFile: "clarifyiphone.png",
    hidden: false,
    order: 3,
    media: [
      { type: "image", file: "clarifymockup.png", alt: "AI Study Companion interface", caption: "Mobile app interface for study management" },
      { type: "image", file: "clarifyiphone.png", alt: "AI Study Companion interface", caption: "Mobile app interface for study management" },
      { type: "video", path: "/MVP1.mp4", alt: "AI Study Companion demo video", caption: "Live demonstration of the AI Study Companion app features" },
    ],
  },
  {
    slug: "smart-watering-system",
    title: "Smart IoT Watering System",
    year: "2024",
    status: "Completed",
    category: "IoT Hardware Project",
    summary:
      "iot plant watering prototype with sensor data, automation rules, and a companion interface.",
    description:
      "An IoT-based automated plant watering system that monitors soil moisture and plant health to provide optimal watering schedules, through a mobile app interface.",
    skills: ["Arduino", "Expo Go", "React Native", "MQTT", "Firebase"],
    features: [
      "Automated watering based on soil moisture",
      "Mobile app for remote monitoring",
      "Remote watering control",
      "Real-time sensor data visualization",
      "Firebase integration for long-term data storage",
      "Plant moisture and water usage analytics",
    ],
    challenges:
      "Ensuring reliable hardware communication, handling effective data transmission between devices, and addressing network connectivity issues.",
    githubUrl: "https://github.com/t1anzn/SmartWateringCompanion",
    thumbnailFile: "smartwateringmockup.png",
    hidden: false,
    order: 4,
    media: [
      { type: "image", file: "smartwateringmockup.png", alt: "IoT Watering System app", caption: "Mobile interface for monitoring plant health" },
      { type: "image", file: "circuitdiagram.png", alt: "Circuit diagram of the Smart IoT Watering System", caption: "Circuit diagram of the Smart IoT Watering System" },
      { type: "image", file: "labelledwatering.PNG", alt: "Labelled prototype of the Smart IoT Watering System circuit", caption: "Labelled prototype of the Smart IoT Watering System circuit" },
      { type: "image", file: "ultrasoniclabelled.PNG", alt: "Labelled ultrasonic sensor system", caption: "Labelled ultrasonic sensor system" },
      { type: "video", path: "/wateringshowcase.mp4", alt: "Smart IoT Watering System demo video", caption: "Live demonstration of the Smart IoT Watering System features" },
    ],
  },
  {
    slug: "topic-classifier",
    title: "Machine Learning Topic Classifier",
    year: "2025",
    status: "Completed",
    category: "Machine Learning Project",
    summary:
      "ml text classification project focused on dataset prep, training, and evaluation.",
    description:
      "A machine learning project that classifies news articles into predefined topics using a fine-tuned BERT deep learning model.",
    skills: ["Python", "Flask", "BERT", "scikit-learn", "Google Colab", "pandas", "NumPy", "Matplotlib"],
    features: [
      "Automatic news article classification",
      "Fine-tuned BERT model with 2,000+ labeled samples",
      "Optimized training for best validation performance",
      "Comparison with TF-IDF + Naive Bayes baseline",
      "Flask backend for model inference",
      "User-friendly web interface",
      "Gdown for large model file handling",
    ],
    challenges:
      "Fine-tuning BERT for optimal performance, TF-IDF and Naive Bayes baseline implementation.",
    githubUrl: "https://github.com/t1anzn/topic-classifier",
    thumbnailFile: "topic-classifier-preview.png",
    hidden: false,
    order: 5,
    media: [
      { type: "image", file: "topic-classifier-preview.png", alt: "AI-Powered Topic Classifier web interface", caption: "Frontend interface for text input and topic classification results" },
      { type: "video", path: "/topic-classifier-demo.mp4", alt: "Topic Classifier demo video", caption: "Demo showcasing the topic classification process and result output" },
    ],
  },
  {
    slug: "mandarin-ppt-generator",
    title: "Mandarin Powerpoint Generator",
    year: "2025",
    status: "Live",
    category: "Desktop Application",
    summary: "python tool to generate mandarin learning slides programmatically.",
    description:
      "A desktop tool that generates Mandarin learning PowerPoints from vocabulary lists.",
    skills: ["Python", "Tkinter", "python-pptx", "deep-translator (Google Translate)"],
    features: ["Simple GUI", "PowerPoint export", "Translation support"],
    challenges:
      "Generating consistent slide layouts and handling translation edge cases.",
    githubUrl: "https://github.com/t1anzn/Mandarin-PPT-Generator",
    thumbnailFile: "mandarin-ppt-gui.png",
    hidden: false,
    order: 6,
    media: [
      { type: "image", file: "mandarin-ppt-gui.png", alt: "GUI of the Mandarin Powerpoint Generator", caption: "GUI of the Mandarin Powerpoint Generator" },
      { type: "image", file: "mandarin-ppt-slide.png", alt: "Slide generated by the Mandarin Powerpoint Generator", caption: "Slide generated by the Mandarin Powerpoint Generator" },
    ],
  },
];

// ---------------------------------------------------------------------------
// siteSettings (hand-transcribed from app/components/HomeClient.tsx)
// ---------------------------------------------------------------------------
const siteSettingsData = {
  name: "Timothy Chen",
  location: "London, UK",
  email: "timothy.chen188@gmail.com",
  phone: "+44 7863 472 097",
  heroTagline: "computer science student / ai engineer in london.",
  summary:
    "computer science student with experience building complete applications, integrating AI solutions and solving system design challenges.",
  portraitFile: "IMG_2832.jpg",
  skillGroups: [
    { groupName: "frontend", skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
    { groupName: "backend", skills: ["Python", "Flask", "SQLAlchemy"] },
    { groupName: "mobile", skills: ["React Native"] },
    { groupName: "cloud / devops", skills: ["AWS", "Docker", "Firebase"] },
    { groupName: "data", skills: ["SQL"] },
  ],
  education: [
    { institution: "BSc (Hons) Computer Science — UAL", dateRange: "Sep 2024 – 2027" },
    { institution: "CertHE Creative Computing — Goldsmiths, University of London", dateRange: "Sep 2021 – Jun 2023" },
  ],
  experience: [
    {
      role: "Founding Growth Intern — Selah",
      dateRange: "May 2026 – Present",
      bullets: [
        "First hire at an early-stage email-first Bible reading startup, owning growth across content, partnerships, and community.",
        "Running growth experiments across social media and outreach channels, and building AI tooling to automate repeatable tasks.",
      ],
    },
    {
      role: "Barista — Costa Coffee",
      dateRange: "Oct 2025 – Present",
      bullets: [
        "Delivered customer-first service while preparing coffee and beverages to standard, maintaining speed and accuracy during busy periods.",
        "Maintained cleanliness across the store for dine-in service, including tables and front-of-house.",
        "Followed SOPs for drink prep, food handling, and closing/opening procedures.",
        "Completed ongoing online Costa learning and training modules to stay aligned with store standards.",
      ],
    },
    {
      role: "Barista — Chatime",
      dateRange: "Jul 2024 – Jan 2025",
      bullets: [
        "Prepared drinks to standard while maintaining speed and accuracy during busy periods.",
        "Managed stock levels and ensured ingredient availability.",
        "Delivered friendly, efficient customer service.",
      ],
    },
    {
      role: "3D Visual Artist — Self-Employed",
      dateRange: "Jan 2016 – 2024",
      bullets: [
        "Produced 3D visual assets using Cinema4D and Adobe Photoshop.",
        "Optimised rendering times through post-processing and workflow improvements.",
        "Managed end-to-end project delivery: requirements, feedback cycles, and deadlines.",
      ],
    },
  ],
  socialLinks: {
    linkedin: "https://www.linkedin.com/in/timothychenldn/",
    github: "https://github.com/t1anzn",
    twitter: "https://x.com/timtianye",
  },
  cvUrl: "/TimothyChenCV.pdf",
  siteTitle: "Timothy Chen - Developer Portfolio",
  projectsPageTitle: "Projects | Timothy Chen",
};

// ---------------------------------------------------------------------------
// now (hand-transcribed from content/now.md)
// ---------------------------------------------------------------------------
const nowItems = [
  "second year bsc (hons) computer science at ual cci, studying software engineering, critical interfaces (hci), and global perspectives on computer science.",
  "working towards the aws cloud practitioner certificate, focusing on core services + fundamentals (iam, vpc, ec2, s3), security best practices, and pricing.",
  "founding growth intern at selah — an email-first bible reading service. running growth experiments, owning social content, and building ai tooling to scale what works.",
];

async function migrateProjects() {
  const summary = [];
  for (const p of projects) {
    console.log(`Migrating project: ${p.title}`);
    const thumbnail = await imageField(p.thumbnailFile);
    const media = [];
    for (const m of p.media) {
      if (m.type === "image") {
        media.push({
          _type: "mediaImage",
          _key: m.file,
          asset: await uploadImage(m.file),
          alt: m.alt,
          caption: m.caption,
        });
      } else {
        media.push({
          _type: "mediaVideo",
          _key: m.path,
          videoPath: m.path,
          alt: m.alt,
          caption: m.caption,
        });
      }
    }

    const doc = {
      _id: `project-${p.slug}`,
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      year: p.year,
      status: p.status,
      category: p.category,
      summary: p.summary,
      description: p.description,
      skills: p.skills,
      features: p.features,
      challenges: p.challenges,
      githubUrl: p.githubUrl,
      demoUrl: p.demoUrl,
      thumbnail,
      media,
      hidden: p.hidden,
      order: p.order,
    };

    await client.createOrReplace(doc);
    summary.push({ id: doc._id, title: doc.title, hidden: doc.hidden, order: doc.order });
  }
  return summary;
}

async function migrateSiteSettings() {
  const portrait = await imageField(siteSettingsData.portraitFile);
  const doc = {
    _id: "siteSettings",
    _type: "siteSettings",
    name: siteSettingsData.name,
    location: siteSettingsData.location,
    email: siteSettingsData.email,
    phone: siteSettingsData.phone,
    heroTagline: siteSettingsData.heroTagline,
    summary: siteSettingsData.summary,
    portrait,
    skillGroups: siteSettingsData.skillGroups,
    education: siteSettingsData.education,
    experience: siteSettingsData.experience,
    socialLinks: siteSettingsData.socialLinks,
    cvUrl: siteSettingsData.cvUrl,
    siteTitle: siteSettingsData.siteTitle,
    projectsPageTitle: siteSettingsData.projectsPageTitle,
  };
  await client.createOrReplace(doc);
  return doc._id;
}

async function migrateNow() {
  const doc = { _id: "now", _type: "now", items: nowItems };
  await client.createOrReplace(doc);
  return doc._id;
}

async function main() {
  console.log(`Migrating into Sanity project ${projectId} / dataset ${dataset}\n`);

  const projectsSummary = await migrateProjects();
  const siteSettingsId = await migrateSiteSettings();
  const nowId = await migrateNow();

  console.log("\nDone. Created/updated documents:");
  console.table(projectsSummary);
  console.log(siteSettingsId, nowId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
