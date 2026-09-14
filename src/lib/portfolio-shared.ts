/**
 * Portfolio Shared Types and Isomorphic Utilities
 * Client-safe: Contains NO server, database, or Node-specific dependencies.
 */

export type PortfolioStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED' | 'SUSPENDED';

export interface PortfolioResolution {
  portfolio: PortfolioData | null;
  state: 'PUBLISHED' | 'SUSPENDED' | 'DRAFT' | 'NOT_FOUND';
  suspendedReason?: string | null;
}

export type PortfolioThemeId =
  | 'editorial'
  | 'cinematic'
  | 'minimal'
  | 'creative-grid'
  | 'immersive'
  | 'esports'
  | 'magazine'
  | 'experimental'
  | 'custom';

export interface PortfolioPersonalInfo {
  fullName: string;
  professionalName?: string;
  username: string;
  profileImage?: string;
  coverImage?: string;
  location?: string;
  country?: string;
  professionalTitle?: string;
  tagline?: string;
  aboutMe?: string;
  publicEmail?: string;
  phone?: string;
  website?: string;
  availability?: string; // Available for projects, full-time, booked
}

export interface PortfolioProfessionalIdentity {
  jobTitle?: string;
  industry?: string;
  primaryRole?: string;
  secondaryRoles?: string[];
  yearsExperience?: number;
  summary?: string;
  careerObjective?: string;
  specialization?: string;
  workType?: string; // Remote, Hybrid, On-site
  freelanceAvailability?: boolean;
}

export interface PortfolioSkill {
  id: string;
  name: string;
  category: string;
  experienceLevel: string; // Beginner, Intermediate, Expert
  years?: number;
  proficiency?: number; // 1-100
}

export interface PortfolioProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  role?: string;
  client?: string;
  category: string;
  tools?: string[];
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  projectUrl?: string;
  thumbnail?: string;
  gallery?: string[];
  videoUrl?: string;
  challenge?: string;
  responsibilities?: string;
  solution?: string;
  outcome?: string;
  results?: string;
  tags?: string[];
  order: number;
}

export interface PortfolioExperience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentPosition?: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
}

export interface PortfolioEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface PortfolioCertification {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
  award?: string;
}

export interface PortfolioServiceItem {
  id: string;
  name: string;
  description: string;
  startingPrice?: string;
  deliveryTime?: string;
}

export interface PortfolioSocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  behance?: string;
  dribbble?: string;
  youtube?: string;
  twitch?: string;
  discord?: string;
  website?: string;
}

export interface PortfolioContactConfig {
  publicEmail?: string;
  contactFormEnabled: boolean;
  location?: string;
  availability?: string;
  preferredContactMethod?: string;
}

export interface PortfolioDesignConfig {
  themeId: PortfolioThemeId;
  fontPair: string; // editorial, brutalist, minimal, esports, modern-sans
  accentColor: string; // burgundy, beige, orange, green, red, custom hex
  backgroundStyle: string; // dark-burgundy, void, wine, warm-beige, midnight, forest
  heroLayout: string; // split, center-bold, full-bleed, minimal
  projectLayout: string; // reel, grid-2, masonry, list
  cardStyle: string; // elevated, bordered, glass, minimal
  sectionOrder: string[]; // ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'services', 'contact']
  navigationStyle: string; // fixed-top, minimal-dock, drawer
  animationIntensity: 'subtle' | 'cinematic' | 'reduced';
  imageTreatment: 'monochrome-hover' | 'cinematic-glow' | 'standard';
  templateName?: string;
  customCss?: string;
  visibleSections?: {
    about?: boolean;
    skills?: boolean;
    projects?: boolean;
    experience?: boolean;
    education?: boolean;
    achievements?: boolean;
    services?: boolean;
    contact?: boolean;
  };
}

export interface PortfolioSeoConfig {
  seoTitle?: string;
  seoDescription?: string;
  socialPreviewImage?: string;
}

export interface PortfolioData {
  id: string;
  userId: string;
  slug: string;
  status: PortfolioStatus;
  title: string;
  description?: string;
  themeId: PortfolioThemeId;
  personalInfo: PortfolioPersonalInfo;
  professionalIdentity: PortfolioProfessionalIdentity;
  skills: PortfolioSkill[];
  projects: PortfolioProjectItem[];
  experience: PortfolioExperience[];
  education: PortfolioEducation[];
  certifications: PortfolioCertification[];
  services: PortfolioServiceItem[];
  socialLinks: PortfolioSocialLinks;
  contactConfig: PortfolioContactConfig;
  designConfig: PortfolioDesignConfig;
  seoConfig: PortfolioSeoConfig;
  views?: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Reserved subdomains that cannot be claimed by users
 */
export const RESERVED_SUBDOMAINS = new Set([
  'www',
  'admin',
  'api',
  'app',
  'dashboard',
  'mail',
  'smtp',
  'ftp',
  'support',
  'help',
  'blog',
  'status',
  'cdn',
  'assets',
  'static',
  'dev',
  'staging',
  'test',
  'login',
  'auth',
  'portfolio',
  'work',
  'services',
  'about',
  'studio',
  'contact',
  'terms',
  'privacy',
  'register',
  'verify',
  'settings',
  'naturestudio',
  'naturestudios',
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SUBDOMAINS.has(slug.toLowerCase().trim());
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Default design configuration
 */
export const DEFAULT_DESIGN_CONFIG: PortfolioDesignConfig = {
  themeId: 'editorial',
  fontPair: 'editorial',
  accentColor: '#59171B',
  backgroundStyle: 'dark-burgundy',
  heroLayout: 'center-bold',
  projectLayout: 'reel',
  cardStyle: 'glass',
  sectionOrder: ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'services', 'contact'],
  navigationStyle: 'fixed-top',
  animationIntensity: 'cinematic',
  imageTreatment: 'cinematic-glow',
};
