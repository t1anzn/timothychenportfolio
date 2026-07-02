export type SanityImageValue = {
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
};

export type ProjectListItem = {
  title: string;
  slug: string;
  year?: string;
  status?: string;
  summary?: string;
  skills?: string[];
  thumbnail?: SanityImageValue;
  hidden?: boolean;
};

export type ProjectMediaImage = {
  _type: "mediaImage";
  _key: string;
  asset: NonNullable<SanityImageValue["asset"]>;
  alt: string;
  caption?: string;
};

export type ProjectMediaVideo = {
  _type: "mediaVideo";
  _key: string;
  videoPath: string;
  alt: string;
  caption?: string;
};

export type ProjectMedia = ProjectMediaImage | ProjectMediaVideo;

export type ProjectDetail = {
  title: string;
  slug: string;
  year?: string;
  status?: string;
  category?: string;
  summary?: string;
  description?: string;
  skills?: string[];
  features?: string[];
  challenges?: string;
  githubUrl?: string;
  demoUrl?: string;
  thumbnail?: SanityImageValue;
  media?: ProjectMedia[];
};

export type SkillGroup = {
  groupName: string;
  skills: string[];
};

export type EducationItem = {
  institution: string;
  dateRange: string;
};

export type ExperienceItem = {
  role: string;
  dateRange: string;
  bullets?: string[];
};

export type SocialLinks = {
  linkedin?: string;
  github?: string;
  twitter?: string;
};

export type SiteSettings = {
  name?: string;
  location?: string;
  email?: string;
  phone?: string;
  heroTagline?: string;
  summary?: string;
  portrait?: SanityImageValue;
  skillGroups?: SkillGroup[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
  socialLinks?: SocialLinks;
  cvUrl?: string;
  siteTitle?: string;
  projectsPageTitle?: string;
};

export type NowData = {
  date: string;
  items: string[];
};
