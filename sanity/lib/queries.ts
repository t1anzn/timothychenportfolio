import { groq } from "next-sanity";

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    title,
    "slug": slug.current,
    year,
    status,
    summary,
    skills,
    thumbnail,
    hidden
  }
`;

export const allProjectSlugsQuery = groq`
  *[_type == "project" && defined(slug.current)]{
    "slug": slug.current
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    year,
    status,
    category,
    summary,
    description,
    skills,
    features,
    challenges,
    githubUrl,
    demoUrl,
    thumbnail,
    media
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    name,
    location,
    email,
    phone,
    heroTagline,
    summary,
    portrait,
    skillGroups,
    education,
    experience,
    socialLinks,
    cvUrl,
    siteTitle,
    projectsPageTitle
  }
`;

export const nowQuery = groq`
  *[_type == "now"][0]{
    items,
    "updatedAt": _updatedAt
  }
`;
