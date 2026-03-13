import Link from "next/link";
import { notFound } from "next/navigation";

type ProjectImage =
  | {
      type?: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "video";
      src: string;
      alt: string;
      caption?: string;
    };

type Project = {
  title: string;
  tech: string[];
  status: string;
  year: string;
  category: string;
  images?: ProjectImage[];
  slug: string;
  description: string;
  features?: string[];
  challenges?: string;
  github?: string;
  demo?: string | null;
};

const projects: Project[] = [
  {
    title: "TCP Key-Value Server",
    tech: ["C++", "TCP/IP", "Linux"],
    status: "Work in Progress",
    year: "2026",
    category: "Networking / Systems Programming",
    images: [
      {
        src: "/tcp.png",
        alt: "TCP Key-Value Server thumbnail",
        caption: "Project logo/thumbnail",
      },
    ],
    slug: "tcp-key-value-server",
    description:
      "A C++ TCP key-value server with basic client-server communication. Planned features include more commands, data persistence, and protocol improvements.",
    features: [
      "Basic client-server communication over TCP",
      "Planned: more commands, data persistence, protocol improvements",
    ],
    challenges:
      "Implementing robust socket handling, planning for extensible protocol design, and ensuring cross-platform compatibility.",
    github: "https://github.com/t1anzn/redisclone",
  },
  {
    title: "Full-Stack Movie Database",
    tech: [
      "React",
      "Astro",
      "TailwindCSS",
      "Flask",
      "SQLAlchemy",
      "Gemini API",
    ],
    status: "Completed",
    year: "2025",
    category: "Full Stack Web Application",
    images: [
      {
        src: "/cinemindmainlong.png",
        alt: "CineMind homepage interface",
        caption:
          "Main dashboard showcasing featured movies and search functionality",
      },
      {
        src: "/cinemindlong.png",
        alt: "CineMind search results",
        caption: "Advanced search and filtering capabilities",
      },
      {
        src: "/cinemindmoviepage.png",
        alt: "CineMind movie details page",
        caption:
          "Detailed movie information with ratings, cast, and AI sentiment analysis",
      },
      {
        type: "video",
        src: "/cinemind-demo.mp4",
        alt: "CineMind demo video",
        caption:
          "Live demonstration of CineMind's AI-powered features and user interface",
      },
    ],
    slug: "movie-database",
    description:
      "CineMind is a comprehensive full-stack movie database application that combines the power of modern web technologies with AI-driven insights. Built with React and Astro for lightning-fast performance, it features real-time movie search, detailed information pages, user reviews, and intelligent recommendations powered by Google's Gemini API.",
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
    github: "https://github.com/t1anzn/cinemind",
  },
  {
    title: "Machine Learning Topic Classifier",
    tech: [
      "Python",
      "Flask",
      "BERT",
      "scikit-learn",
      "Google Colab",
      "pandas",
      "NumPy",
      "Matplotlib",
    ],
    status: "Completed",
    year: "2025",
    category: "Machine Learning Project",
    images: [
      {
        src: "/topic-classifier-preview.png",
        alt: "AI-Powered Topic Classifier web interface",
        caption:
          "Frontend interface for text input and topic classification results",
      },
      {
        type: "video",
        src: "/topic-classifier-demo.mp4",
        alt: "Topic Classifier demo video",
        caption:
          "Demo showcasing the topic classification process and result output",
      },
    ],
    slug: "topic-classifier",
    description:
      "A machine learning project that classifies news articles into predefined topics using a fine-tuned BERT deep learning model.",
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
    github: "https://github.com/t1anzn/topic-classifier",
  },
  {
    title: "AI Study Companion App",
    tech: ["React Native", "TypeScript", "Firebase", "Gemini API"],
    status: "In Progress",
    year: "2025",
    category: "Mobile Application",
    images: [
      {
        src: "/clarifymockup.png",
        alt: "AI Study Companion interface",
        caption: "Mobile app interface for study management",
      },
      {
        src: "/clarifyiphone.png",
        alt: "AI Study Companion interface",
        caption: "Mobile app interface for study management",
      },
      {
        type: "video",
        src: "/MVP1.mp4",
        alt: "AI Study Companion demo video",
        caption: "Live demonstration of the AI Study Companion app features",
      },
    ],
    slug: "ai-study-companion",
    description:
      "An intelligent mobile study companion that allows students to take photos of their study materials and create simple, easy-to-understand study packs.",
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
    demo: null,
  },
  {
    title: "Smart IoT Watering System",
    tech: ["Arduino", "Expo Go", "React Native", "MQTT", "Firebase"],
    status: "Completed",
    year: "2024",
    category: "IoT Hardware Project",
    images: [
      {
        src: "/smartwateringmockup.png",
        alt: "IoT Watering System app",
        caption: "Mobile interface for monitoring plant health",
      },
      {
        src: "/circuitdiagram.png",
        alt: "Circuit diagram of the Smart IoT Watering System",
        caption: "Circuit diagram of the Smart IoT Watering System",
      },
      {
        src: "/labelledwatering.PNG",
        alt: "Labelled prototype of the Smart IoT Watering System circuit",
        caption: "Labelled prototype of the Smart IoT Watering System circuit",
      },
      {
        src: "/ultrasoniclabelled.PNG",
        alt: "Labelled ultrasonic sensor system",
        caption: "Labelled ultrasonic sensor system",
      },
      {
        type: "video",
        src: "/wateringshowcase.mp4",
        alt: "Smart IoT Watering System demo video",
        caption: "Live demonstration of the Smart IoT Watering System features",
      },
    ],
    slug: "smart-watering-system",
    description:
      "An IoT-based automated plant watering system that monitors soil moisture and plant health to provide optimal watering schedules, through a mobile app interface.",
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
    github: "https://github.com/t1anzn/SmartWateringCompanion",
    demo: null,
  },
  {
    title: "Mandarin Powerpoint Generator",
    tech: [
      "Python",
      "Tkinter",
      "python-pptx",
      "deep-translator (Google Translate)",
    ],
    status: "Live",
    year: "2025",
    category: "Desktop Application",
    images: [
      {
        src: "/mandarin-ppt-gui.png",
        alt: "GUI of the Mandarin Powerpoint Generator",
        caption: "GUI of the Mandarin Powerpoint Generator",
      },
      {
        src: "/mandarin-ppt-slide.png",
        alt: "Slide generated by the Mandarin Powerpoint Generator",
        caption: "Slide generated by the Mandarin Powerpoint Generator",
      },
    ],
    slug: "mandarin-ppt-generator",
    description:
      "A desktop tool that generates Mandarin learning PowerPoints from vocabulary lists.",
    features: ["Simple GUI", "PowerPoint export", "Translation support"],
    challenges:
      "Generating consistent slide layouts and handling translation edge cases.",
    github: "https://github.com/t1anzn/Mandarin-PPT-Generator",
  },
];

function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="cv cv-standalone">
      <header>
        <p className="muted">
          <Link href="/">Home</Link> / <Link href="/#projects">Projects</Link> /{" "}
          <span>{project.title}</span>
        </p>
        <h1>{project.title}</h1>
        <div className="meta muted">
          <span>{project.year}</span>
          <span>{project.status}</span>
          <span>{project.category}</span>
        </div>
      </header>

      <hr />

      <section>
        <h2>Description</h2>
        <p>{project.description}</p>
      </section>

      {project.tech?.length ? (
        <section>
          <h2>Tech</h2>
          <p className="muted">{project.tech.join(", ")}</p>
        </section>
      ) : null}

      {project.features?.length ? (
        <section>
          <h2>Key Points</h2>
          <ul>
            {project.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {project.challenges ? (
        <section>
          <h2>Challenges</h2>
          <p>{project.challenges}</p>
        </section>
      ) : null}

      {(project.github || project.demo) && (
        <section>
          <h2>Links</h2>
          <ul>
            {project.github ? (
              <li>
                <a href={project.github} target="_blank" rel="noreferrer">
                  {project.github.includes("github.com")
                    ? "GitHub repo"
                    : "Source"}
                </a>
              </li>
            ) : null}
            {project.demo ? (
              <li>
                <a href={project.demo} target="_blank" rel="noreferrer">
                  Live Demo
                </a>
              </li>
            ) : null}
          </ul>
        </section>
      )}

      {project.images?.length ? (
        <section>
          <h2>Media</h2>
          <div className="media-list">
            {project.images.map((media) => (
              <figure
                className="media-item"
                key={`${project.slug}-${media.src}`}
              >
                {media.type === "video" ? (
                  <video controls preload="metadata">
                    <source src={media.src} />
                    {media.alt}
                  </video>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={media.src} alt={media.alt} />
                )}
                {media.caption ? (
                  <figcaption className="muted">{media.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
