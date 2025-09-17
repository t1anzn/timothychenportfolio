"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect, useState, useRef, use } from "react";

const projects = [
  {
    title: "Full-Stack Movie Database",
    tech: [
      "React",
      "Astro",
      "TailwindCSS",
      "Flask",
      "SQLAlchemy",
      "Gemini API",
      "TMDB API",
    ],
    status: "Completed",
    year: "2025",
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
    github: "https://github.com/timothychen01/cinemind",
  },
  {
    title: "AI Study Companion App",
    tech: ["React Native", "TypeScript", "Firebase", "Gemini API"],
    status: "In Progress",
    year: "2025",
    images: [
      {
        src: "/clean-e-commerce-product-page-design.jpg",
        alt: "AI Study Companion interface",
        caption: "Mobile app interface for study management",
      },
    ],
    slug: "ai-study-companion",
    description:
      "An intelligent mobile study companion that helps students organize their learning materials, create study schedules, and get AI-powered assistance with their studies.",
    features: [
      "AI-powered study recommendations",
      "Smart flashcard generation",
      "Progress tracking and analytics",
      "Offline study mode",
      "Cross-platform mobile app",
      "Cloud synchronization",
    ],
    challenges:
      "Optimizing AI responses for mobile devices and ensuring offline functionality.",
    github: "https://github.com/timothychen01/ai-study-companion",
    demo: null,
  },
  {
    title: "Smart IoT Watering System",
    tech: ["Arduino", "React Native", "MQTT", "Firebase"],
    status: "GitHub",
    year: "2024",
    images: [
      {
        src: "/mobile-app-community-interface-mockup.jpg",
        alt: "IoT Watering System app",
        caption: "Mobile interface for monitoring plant health",
      },
    ],
    slug: "smart-watering-system",
    description:
      "An IoT-based automated plant watering system that monitors soil moisture, weather conditions, and plant health to provide optimal watering schedules.",
    features: [
      "Automated watering based on soil moisture",
      "Weather API integration",
      "Mobile app for remote monitoring",
      "Real-time sensor data visualization",
      "Plant health tracking",
      "Water usage analytics",
    ],
    challenges:
      "Ensuring reliable hardware communication and handling network connectivity issues.",
    github: "https://github.com/timothychen01/smart-watering-system",
    demo: null,
  },
  {
    title: "Community Mobile App",
    tech: ["React Native", "Firebase"],
    status: "Award Winner",
    year: "2022",
    images: [
      {
        src: "/mobile-app-community-interface-mockup.jpg",
        alt: "Community Mobile App interface",
        caption: "Award-winning community engagement platform",
      },
    ],
    slug: "community-mobile-app",
    description:
      "A community-focused mobile application that won first place in a local hackathon. Connects neighbors and facilitates local community engagement through events, services, and discussions.",
    features: [
      "Local community discovery",
      "Event organization and management",
      "Neighbor-to-neighbor services",
      "Real-time messaging",
      "Location-based features",
      "Community bulletin board",
    ],
    challenges:
      "Building trust and safety features while maintaining user privacy and community engagement.",
    github: "https://github.com/timothychen01/community-app",
    demo: null,
  },
  {
    title: "Data Visualization Dashboard",
    tech: ["TypeScript", "D3.js", "Express"],
    status: "In Progress",
    year: "2024",
    images: [
      {
        src: "/data-dashboard-charts.png",
        alt: "Data Visualization Dashboard",
        caption: "Interactive charts and analytics interface",
      },
    ],
    slug: "data-visualization-dashboard",
    description:
      "An interactive data visualization dashboard that transforms complex datasets into intuitive, interactive charts and graphs for business intelligence and analytics.",
    features: [
      "Interactive data visualizations",
      "Real-time data updates",
      "Customizable dashboard layouts",
      "Multiple chart types and formats",
      "Data export capabilities",
      "Responsive design",
    ],
    challenges:
      "Handling large datasets efficiently and creating smooth animations for complex visualizations.",
    github: "https://github.com/timothychen01/data-viz-dashboard",
    demo: null,
  },
  {
    title: "Portfolio Website",
    tech: ["React", "Tailwind", "Framer Motion"],
    status: "Live",
    year: "2024",
    images: [
      {
        src: "/minimalist-portfolio.png",
        alt: "Portfolio Website interface",
        caption: "Clean, minimalist design with smooth animations",
      },
    ],
    slug: "portfolio-website",
    description:
      "A modern, minimalist portfolio website built with React and enhanced with smooth animations. Features a clean design, responsive layout, and engaging user interactions.",
    features: [
      "Minimalist, clean design",
      "Smooth scroll animations",
      "Responsive across all devices",
      "Dark/light theme toggle",
      "Interactive project showcases",
      "Contact form integration",
    ],
    challenges:
      "Balancing visual appeal with performance optimization and ensuring accessibility across all interactions.",
    github: "https://github.com/timothychen01/portfolio",
    demo: "https://timothychen.dev",
  },
];

export default function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    // Listen for theme changes from other pages/tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme" && e.newValue) {
        const newTheme = e.newValue as "light" | "dark";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    // Dispatch a custom event for same-page synchronization
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme: newTheme },
      })
    );
  };

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const scrollToImage = () => {
    // Use requestAnimationFrame to ensure the DOM has updated
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (imageContainerRef.current) {
          const rect = imageContainerRef.current.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const targetPosition = rect.top + scrollTop - 100;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }, 100);
    });
  };

  const nextImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
      setIsTransitioning(false);
      scrollToImage();
    }, 150);
  };

  const prevImage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(
        (prev) => (prev - 1 + project.images.length) % project.images.length
      );
      setIsTransitioning(false);
      scrollToImage();
    }, 150);
  };

  const goToImage = (index: number) => {
    if (isTransitioning || index === currentImageIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
      scrollToImage();
    }, 150);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-delay-1 {
          animation-delay: 0.1s;
        }

        .animate-delay-2 {
          animation-delay: 0.2s;
        }

        .animate-delay-3 {
          animation-delay: 0.3s;
        }

        .image-transition {
          transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        }

        .image-transitioning {
          opacity: 0.7;
          transform: scale(0.98);
        }

        .image-container {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .image-container img,
        .image-container video {
          width: 100%;
          max-width: 100%;
          height: auto;
          object-fit: contain;
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-light tracking-wide hover:text-primary transition-colors duration-300 uppercase"
            >
              Timothy Chen
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
              <Link
                href="/#projects"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Hero Section */}
        <div className="space-y-8 mb-12 mt-8">
          <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>{project.year}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  project.status === "Live"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : project.status === "Completed"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    : project.status === "In Progress"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : project.status === "Award Winner"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                }`}
              >
                {project.status}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-center">
              {project.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="opacity-0 animate-fade-in-up animate-delay-1">
            <div className="flex flex-wrap gap-2 justify-center">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm text-muted-foreground bg-background border border-border/20 rounded-lg shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up animate-delay-2 justify-center">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Demo
              </a>
            )}
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Code
            </a>
          </div>
        </div>

        {/* Project Media Gallery with Thumbnails */}
        <div className="mb-16 opacity-0 animate-fade-in-up animate-delay-3">
          <div className="space-y-6">
            {/* Main Image/Video Display */}
            <div
              ref={imageContainerRef}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted/10 to-muted/30 p-2 shadow-lg"
            >
              <div
                className={`image-transition image-container ${
                  isTransitioning ? "image-transitioning" : ""
                }`}
              >
                {(project.images[currentImageIndex] as any).type === "video" ? (
                  <video
                    key={currentImageIndex}
                    src={project.images[currentImageIndex].src}
                    controls
                    className="w-full h-auto object-contain rounded-2xl bg-background"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    key={currentImageIndex}
                    src={project.images[currentImageIndex].src}
                    alt={project.images[currentImageIndex].alt}
                    className="w-full h-auto object-contain rounded-2xl bg-background shadow-sm"
                  />
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {project.images.length > 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`relative flex-shrink-0 w-20 h-12 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "border-primary shadow-lg scale-110"
                          : "border-border/30 hover:border-primary/50 hover:scale-105"
                      }`}
                      aria-label={`View ${
                        (image as any).type === "video" ? "video" : "image"
                      } ${index + 1}`}
                    >
                      {(image as any).type === "video" ? (
                        <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Active indicator */}
                      {currentImageIndex === index && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Image Counter and Navigation */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous image"
                  >
                    <svg
                      className="w-4 h-4 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <span className="text-sm text-muted-foreground font-mono min-w-16 text-center">
                    {currentImageIndex + 1} / {project.images.length}
                  </span>

                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === project.images.length - 1}
                    className="p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next image"
                  >
                    <svg
                      className="w-4 h-4 text-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* Features */}
            <section className="opacity-0 animate-fade-in-up">
              <h2 className="text-2xl font-medium mb-6">Key Features</h2>
              <div className="space-y-3">
                {project.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Challenges */}
            <section className="opacity-0 animate-fade-in-up animate-delay-1">
              <h2 className="text-2xl font-medium mb-6">
                Challenges & Solutions
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {project.challenges}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Info */}
            <div className="bg-muted/20 rounded-2xl p-6 opacity-0 animate-fade-in-up animate-delay-2">
              <h3 className="text-lg font-medium mb-4">Project Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Year</span>
                  <span>{project.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span>{project.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>Full Stack Web Application</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-muted/20 rounded-2xl p-6 opacity-0 animate-fade-in-up animate-delay-3">
              <h3 className="text-lg font-medium mb-4">Other Projects</h3>
              <div className="space-y-2">
                {projects
                  .filter((p) => p.slug !== project.slug)
                  .slice(0, 3)
                  .map((otherProject) => (
                    <Link
                      key={otherProject.slug}
                      href={`/projects/${otherProject.slug}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 py-1"
                    >
                      {otherProject.title}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 sm:py-16 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                © 2025 Timothy Chen. All rights reserved.
              </div>
              <div className="text-xs text-muted-foreground">
                Built with ❤️ by Timothy Chen
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/timothychenldn/"
                target="_blank"
                rel="noopener noreferrer"
                className="group p-3 rounded-lg bg-background border border-border hover:border-muted-foreground/50 transition-all duration-300 shadow-sm"
                aria-label="LinkedIn Profile"
              >
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
