"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./contexts/ThemeContext";

const projects = [
  {
    title: "Full-Stack Movie Database",
    tech: [
      "React",
      "Astro",
      "TailwindCSS",
      "Flask",
      "SQLAlchemy",
      "SQLite",
      "Alembic",
      "pandas",
      "Gemini API",
    ],
    status: "Completed",
    year: "2025",
    image: "/cinemind3.png",
    slug: "movie-database",
  },
  {
    title: "AI Study Companion App",
    tech: ["React Native", "TypeScript", "Firebase", "Gemini API"],
    status: "In Progress",
    year: "2025",
    image: "/clarifymockup.png",
    slug: "ai-study-companion",
  },
  {
    title: "Smart IoT Watering System",
    tech: ["Arduino", "React Native", "MQTT", "Firebase"],
    status: "Completed",
    year: "2024",
    image: "/smartwateringmockup.png",
    slug: "smart-watering-system",
  },
  {
    title: "Portfolio Website",
    tech: ["React", "Tailwind", "Framer Motion"],
    status: "Live",
    year: "2024",
    image: "/webportfoliomockup1.png",
    slug: "portfolio-website",
  },
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [codeText, setCodeText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    body: "",
  });
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const currentProjects = projects.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  useEffect(() => {
    const codeLines = [
      "const developer = {",
      "  name: 'Timothy Chen',",
      "  role: 'CS Student & Developer',",
      "  passion: 'AI-Powered Solutions',",
      "  location: 'London, UK',",
      "  status: 'Available for work',",
      "}",
    ];

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let fullText = "";

    const typeWriter = () => {
      if (currentLineIndex < codeLines.length) {
        const currentLine = codeLines[currentLineIndex];

        if (currentCharIndex <= currentLine.length) {
          const completedLines = codeLines
            .slice(0, currentLineIndex)
            .join("\n");
          const currentPartialLine = currentLine.substring(0, currentCharIndex);

          fullText =
            currentLineIndex > 0
              ? completedLines + "\n" + currentPartialLine
              : currentPartialLine;

          setCodeText(fullText);
          currentCharIndex++;
        } else {
          currentLineIndex++;
          currentCharIndex = 0;
        }
      } else {
        setTimeout(() => {
          currentLineIndex = 0;
          currentCharIndex = 0;
          fullText = "";
          setCodeText("");
        }, 3000);
      }
    };

    const interval = setInterval(typeWriter, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement;
            section.classList.add("animate-in");

            // Add staggered animations to child elements
            const animatedElements = section.querySelectorAll("[data-animate]");
            animatedElements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("animate-in");
              }, index * 100);
            });

            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const nextPage = () => {
    setCurrentPage((prev) => {
      const newPage = (prev + 1) % totalPages;
      // Smooth scroll to projects section after state update
      setTimeout(() => {
        const projectsElement = document.getElementById("projects");
        if (projectsElement) {
          projectsElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 50);
      return newPage;
    });
  };

  const prevPage = () => {
    setCurrentPage((prev) => {
      const newPage = (prev - 1 + totalPages) % totalPages;
      // Smooth scroll to projects section after state update
      setTimeout(() => {
        const projectsElement = document.getElementById("projects");
        if (projectsElement) {
          projectsElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 50);
      return newPage;
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:timothy.chen188@gmail.com?subject=${encodeURIComponent(
      formData.subject
    )}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.body}`
    )}`;
    window.location.href = mailto;
  };

  return (
    <>
      {/* Immediate theme script to prevent flash */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                document.documentElement.classList.add('dark');
              } catch (e) {}
            })();
          `,
        }}
      />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-in {
            animation: slideUp 0.8s ease-out forwards;
          }

          .animate-slide-left {
            animation: slideInLeft 0.8s ease-out forwards;
          }

          .animate-slide-right {
            animation: slideInRight 0.8s ease-out forwards;
          }

          .animate-fade {
            animation: fadeIn 0.6s ease-out forwards;
          }

          [data-animate] {
            opacity: 0;
            transform: translateY(20px);
          }

          [data-animate].animate-in {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.6s ease-out;
          }

          /* Global theme transition */
          * {
            transition: background-color 0.3s ease, border-color 0.3s ease;
          }
          .text-primary,
          .text-foreground {
            transition: color 0.1s linear;
          }

          .project-badge {
            /* Default badge styles */
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            border-radius: 0.375rem;
            font-weight: 500;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
            transition: background 0.3s, color 0.3s;
          }
          .project-badge.live {
            background: #16a34a; /* green-600 */
            color: #fff;
          }
          .project-badge.completed {
            background: #2563eb; /* blue-600 */
            color: #fff;
          }
          .project-badge.in-progress {
            background: #f59e42; /* amber-400 */
            color: #222;
          }
          .project-badge.award {
            background: #a21caf; /* purple-700 */
            color: #fff;
          }
          .project-badge.other {
            background: #6b7280; /* gray-500 */
            color: #fff;
          }
          @media (prefers-color-scheme: dark) {
            .project-badge.live {
              background: #166534; /* green-800 */
              color: #bbf7d0;
            }
            .project-badge.completed {
              background: #1e3a8a; /* blue-800 */
              color: #93c5fd;
            }
            .project-badge.in-progress {
              background: #b45309; /* amber-700 */
              color: #fde68a;
            }
            .project-badge.award {
              background: #6d28d9; /* purple-800 */
              color: #c4b5fd;
            }
            .project-badge.other {
              background: #374151; /* gray-700 */
              color: #d1d5db;
            }
          }
        `}</style>

        <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <div className="flex flex-col gap-4 p-4 bg-background border border-border rounded-2xl shadow-lg">
            {[
              { id: "intro", label: "Home" },
              { id: "projects", label: "Projects" },
              { id: "work", label: "Experience" },
              { id: "contact", label: "Contact" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-2 h-8 rounded-full transition-all duration-500 hover:scale-110 ${
                  activeSection === section.id
                    ? "bg-foreground"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Navigate to ${section.label}`}
                title={section.label}
              />
            ))}
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 relative z-10">
          {/* Theme Toggle Button - Top Right */}
          <div className="fixed top-8 right-8 z-20">
            <button
              onClick={toggleTheme}
              className="group p-3 rounded-lg bg-background border border-border hover:border-muted-foreground/50 transition-all duration-300 shadow-lg backdrop-blur-sm"
              aria-label="Toggle theme"
            >
              <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <svg
                  className={`w-5 h-5 text-muted-foreground group-hover:text-foreground absolute transition-all duration-500 ${
                    theme === "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-75"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>

                {/* Moon Icon */}
                <svg
                  className={`w-5 h-5 text-muted-foreground group-hover:text-foreground absolute transition-all duration-500 ${
                    theme === "dark"
                      ? "opacity-0 rotate-90 scale-75"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              </div>
            </button>
          </div>
          <header
            id="intro"
            ref={(el) => {
              sectionsRef.current[0] = el;
            }}
            className="min-h-screen flex items-center opacity-0"
          >
            <div className="w-full">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Left side - Visual element */}
                <div className="relative order-2 lg:order-1" data-animate>
                  <div className="relative bg-background border border-border rounded-3xl p-8 lg:p-12 shadow-lg">
                    {/* Abstract code visualization */}
                    <div className="space-y-4 font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive"></div>
                        <div className="w-3 h-3 rounded-full bg-accent"></div>
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                      </div>
                      <div className="space-y-2 text-muted-foreground min-h-[200px]">
                        <pre className="text-foreground whitespace-pre-wrap">
                          {codeText}
                          <span
                            className={`${
                              showCursor ? "opacity-100" : "opacity-0"
                            } transition-opacity duration-100`}
                          >
                            |
                          </span>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="space-y-8 order-1 lg:order-2">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div
                        className="text-sm text-muted-foreground font-mono tracking-wider uppercase"
                        data-animate
                      >
                        Full Stack Developer & CS Student
                      </div>
                      <h1
                        className="text-5xl sm:text-6xl lg:text-7xl font-normal tracking-widest"
                        data-animate
                      >
                        Timothy
                        <br />
                        <span className="text-primary">Chen</span>
                      </h1>
                    </div>

                    <p
                      className="text-xl font-light leading-relaxed max-w-lg text-balance"
                      data-animate
                    >
                      Computer Science student passionate about building
                      beautiful, practical solutions powered by AI.
                    </p>
                  </div>

                  {/* Contact and CTA section */}
                  <div className="space-y-6">
                    <div
                      className="flex flex-col sm:flex-row gap-4"
                      data-animate
                    >
                      <button
                        onClick={() => scrollToSection("projects")}
                        className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                      >
                        <span className="flex items-center gap-2">
                          View My Work
                        </span>
                      </button>

                      <button
                        onClick={() => scrollToSection("contact")}
                        className="group px-8 py-4 border border-border rounded-xl font-medium hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-center"
                      >
                        <span className="flex items-center justify-center gap-2">
                          Get In Touch
                        </span>
                      </button>
                    </div>

                    <div
                      className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-border/50"
                      data-animate
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        London, UK
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href="https://github.com/t1anzn"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-2 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 shadow-sm"
                          aria-label="GitHub Profile"
                        >
                          <svg
                            className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                        </a>

                        <a
                          href="https://www.linkedin.com/in/timothychenldn/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-2 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 shadow-sm"
                          aria-label="LinkedIn Profile"
                        >
                          <svg
                            className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section
            id="projects"
            ref={(el) => {
              sectionsRef.current[1] = el;
            }}
            className="min-h-screen py-20 sm:py-32 opacity-0"
          >
            <div className="space-y-12 sm:space-y-16">
              <div
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
                data-animate
              >
                <h2 className="text-3xl sm:text-4xl font-light">
                  Featured Projects
                </h2>
                <div className="text-sm text-muted-foreground font-mono">
                  {currentPage + 1} of {totalPages}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {currentProjects.map((project, index) => {
                  let badgeClass = "project-badge ";
                  if (theme === "dark") {
                    badgeClass +=
                      project.status === "Live"
                        ? "bg-[#166534] text-[#bbf7d0]"
                        : project.status === "Completed"
                        ? "bg-[#1e3a8a] text-[#93c5fd]"
                        : project.status === "In Progress"
                        ? "bg-[#b45309] text-[#fde68a]"
                        : project.status === "Award Winner"
                        ? "bg-[#6d28d9] text-[#c4b5fd]"
                        : "bg-[#374151] text-[#d1d5db]";
                  } else {
                    badgeClass +=
                      project.status === "Live"
                        ? "bg-[#16a34a] text-white"
                        : project.status === "Completed"
                        ? "bg-[#2563eb] text-white"
                        : project.status === "In Progress"
                        ? "bg-[#f59e42] text-[#222]"
                        : project.status === "Award Winner"
                        ? "bg-[#a21caf] text-white"
                        : "bg-[#6b7280] text-white";
                  }
                  return (
                    <Link
                      key={index}
                      href={`/projects/${project.slug}`}
                      className="group text-left space-y-4 rounded-lg overflow-hidden hover:scale-[1.02] transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-muted-foreground/50"
                      data-animate
                    >
                      <div className="relative overflow-hidden rounded-lg bg-background">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div
                          className={`absolute top-4 right-4 px-2 py-1 rounded shadow-sm font-medium transition-colors duration-300 ${badgeClass}`}
                        >
                          {project.status}
                        </div>
                      </div>

                      <div className="space-y-3 px-1">
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg sm:text-xl font-light text-foreground group-hover:text-muted-foreground transition-colors duration-300">
                            {project.title}
                          </h3>
                          <div className="text-sm text-muted-foreground font-mono">
                            {project.year}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-xs text-muted-foreground bg-background border border-border/20 rounded shadow-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div
                  className="flex items-center justify-center gap-4"
                  data-animate
                >
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="group p-3 rounded-lg bg-background border border-border hover:border-muted-foreground/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border shadow-sm"
                    aria-label="Previous page"
                  >
                    <svg
                      className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(i);
                          // Smooth scroll to projects section after state update
                          setTimeout(() => {
                            const projectsElement =
                              document.getElementById("projects");
                            if (projectsElement) {
                              projectsElement.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }, 50);
                        }}
                        className={`w-8 h-8 rounded-lg text-sm font-mono transition-all duration-300 shadow-sm ${
                          currentPage === i
                            ? "bg-foreground text-background"
                            : "bg-background border border-border hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                    className="group p-3 rounded-lg bg-background border border-border hover:border-muted-foreground/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border shadow-sm"
                    aria-label="Next page"
                  >
                    <svg
                      className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </section>

          <section
            id="work"
            ref={(el) => {
              sectionsRef.current[2] = el;
            }}
            className="min-h-screen py-20 sm:py-32 opacity-0"
          >
            <div className="space-y-12 sm:space-y-16">
              <div
                className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
                data-animate
              >
                <h2 className="text-3xl sm:text-4xl font-light">Experience</h2>
              </div>

              <div className="space-y-8 sm:space-y-12">
                {[
                  {
                    year: "Sep 2024 - 2027",
                    role: "BSc (Hons) in Computer Science",
                    company: "University of the Arts London (UAL)",
                    description:
                      "Currently pursuing a Bachelor's degree in Computer Science, focusing on software development, algorithms, and AI-powered solutions. Building practical skills in full-stack development and modern programming paradigms.",
                    tech: [
                      "Python",
                      "JavaScript",
                      "React",
                      "Astro",
                      "Flask",
                      "SQL",
                    ],
                  },
                  {
                    year: "Sep 2021 - Jun 2023",
                    role: "CertHE in Creative Computing",
                    company: "Goldsmiths University of London",
                    description:
                      "Completed Certificate of Higher Education in Creative Computing, exploring the intersection of technology and creativity. Gained foundational knowledge in programming, digital media, and computational thinking.",
                    tech: [
                      "C++",
                      "p5.js",
                      "HTML/CSS",
                      "openFrameworks",
                      "JUCE",
                    ],
                  },
                ].map((education, index) => (
                  <div
                    key={index}
                    className="group grid lg:grid-cols-12 gap-4 sm:gap-8 py-6 sm:py-8 border-b border-border/50 hover:border-border transition-colors duration-500"
                    data-animate
                  >
                    <div className="lg:col-span-2">
                      <div className="text-xl sm:text-2xl font-light text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                        {education.year}
                      </div>
                    </div>

                    <div className="lg:col-span-6 space-y-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-medium">
                          {education.role}
                        </h3>
                        <div className="text-muted-foreground">
                          {education.company}
                        </div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed max-w-lg">
                        {education.description}
                      </p>
                    </div>

                    <div className="lg:col-span-4">
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                        {education.tech.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs font-mono text-muted-foreground/80 hover:text-foreground transition-colors duration-200 cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="contact"
            ref={(el) => {
              sectionsRef.current[3] = el;
            }}
            className="min-h-screen py-20 sm:py-32 opacity-0"
          >
            <div className="space-y-12 sm:space-y-16">
              <div className="text-center space-y-4" data-animate>
                <h2 className="text-3xl sm:text-4xl font-light">
                  Get In Touch
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto text-balance">
                  Having a project in mind or want to collaborate? I&apos;d love
                  to hear from you.
                </p>
              </div>

              <div className="max-w-2xl mx-auto" data-animate>
                <div className="bg-background border border-border rounded-3xl p-8 shadow-lg">
                  <form onSubmit={handleSendEmail} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-foreground"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-foreground"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-medium text-foreground"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 shadow-sm"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="body"
                        className="text-sm font-medium text-foreground"
                      >
                        Message
                      </label>
                      <textarea
                        id="body"
                        name="body"
                        rows={6}
                        required
                        value={formData.body}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 resize-none shadow-sm"
                        placeholder="Tell me about your project or idea..."
                      />
                    </div>

                    <div className="flex justify-center pt-4">
                      <button
                        type="submit"
                        className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-12 sm:py-16 border-t border-border/30">
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
                  href="https://linkedin.com/in/timothychenldn"
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
          </footer>
        </main>

        <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none"></div>
      </div>
    </>
  );
}
