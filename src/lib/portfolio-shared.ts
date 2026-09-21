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
  workType?: 'GFX' | 'VFX';
  gfxCategory?: 'Tournament' | 'Roster' | 'Thumbnail' | 'Logo/Banners';
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

/**
 * Studio Portfolio Types & Subsections
 */
export type StudioWorkType = 'GFX' | 'VFX';
export type GfxSubsection = 'Tournament' | 'Roster' | 'Thumbnail' | 'Logo/Banners';

export interface StudioPortfolioItem {
  id: string;
  type: StudioWorkType;
  gfxCategory?: GfxSubsection;
  title: string;
  client?: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  tags: string[];
  featured?: boolean;
  order: number;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export const GFX_SUBSECTIONS: GfxSubsection[] = [
  'Tournament',
  'Roster',
  'Thumbnail',
  'Logo/Banners',
];

export const DEFAULT_STUDIO_PORTFOLIO_ITEMS: StudioPortfolioItem[] = [
  // GFX - Tournament
  {
    id: 'studio-gfx-01',
    type: 'GFX',
    gfxCategory: 'Tournament',
    title: 'VALORANT Champions 2026 — Main Broadcast Package',
    client: 'Riot Games // VCT Global',
    description: 'Complete on-air broadcast overlay system, match schedule telemetry, and real-time playoff bracket graphics.',
    imageUrl: '/media/work-valorant-championship.jpg',
    tags: ['Tournament', 'Broadcast', 'HUD', 'VALORANT'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'studio-gfx-02',
    type: 'GFX',
    gfxCategory: 'Tournament',
    title: 'Apex Legends Global Series — Championship Overlays',
    client: 'Electronic Arts // ALGS',
    description: 'Dynamic in-game HUD telemetry, multi-team kill counters, and circle collapse broadcast status graphics.',
    imageUrl: '/media/work-nexus-arena.jpg',
    tags: ['Tournament', 'HUD', 'Esports', 'ALGS'],
    featured: true,
    order: 2,
    status: 'PUBLISHED',
    createdAt: '2026-09-02T00:00:00Z',
    updatedAt: '2026-09-02T00:00:00Z',
  },

  // GFX - Roster
  {
    id: 'studio-gfx-03',
    type: 'GFX',
    gfxCategory: 'Roster',
    title: 'Sentinels 2026 World Lineup — Roster Reveal Cards',
    client: 'Sentinels Esports',
    description: 'Individual player stat cards, starting 5 lineup announcement graphic, and animated social broadcast assets.',
    imageUrl: '/media/work-after-dark.jpg',
    tags: ['Roster', 'Social', 'Player Cards', 'Sentinels'],
    featured: true,
    order: 3,
    status: 'PUBLISHED',
    createdAt: '2026-09-03T00:00:00Z',
    updatedAt: '2026-09-03T00:00:00Z',
  },
  {
    id: 'studio-gfx-04',
    type: 'GFX',
    gfxCategory: 'Roster',
    title: 'Paper Rex International — Lineup Presentation Suite',
    client: 'Paper Rex // VCT Pacific',
    description: 'High-contrast player profile cards, role breakdown graphics, and jersey sponsor integration system.',
    imageUrl: '/media/work-level-up.jpg',
    tags: ['Roster', 'VCT Pacific', 'Branding'],
    featured: false,
    order: 4,
    status: 'PUBLISHED',
    createdAt: '2026-09-04T00:00:00Z',
    updatedAt: '2026-09-04T00:00:00Z',
  },

  // GFX - Thumbnail
  {
    id: 'studio-gfx-05',
    type: 'GFX',
    gfxCategory: 'Thumbnail',
    title: 'VCT Masters Grand Finals — High-CTR Stream Thumbnail',
    client: 'Twitch Esports Showcase',
    description: 'High-contrast typography, dual team faceoff composition, and championship trophy focal point.',
    imageUrl: '/media/hero-lightfield.jpg',
    tags: ['Thumbnail', 'YouTube', 'Stream', 'High-CTR'],
    featured: true,
    order: 5,
    status: 'PUBLISHED',
    createdAt: '2026-09-05T00:00:00Z',
    updatedAt: '2026-09-05T00:00:00Z',
  },
  {
    id: 'studio-gfx-06',
    type: 'GFX',
    gfxCategory: 'Thumbnail',
    title: 'Red Bull Home Ground — Official Stream Artwork',
    client: 'Red Bull Gaming',
    description: 'Kinetic energy visuals with custom stadium lighting and dynamic typography for live broadcast discovery.',
    imageUrl: '/media/studio-plate.jpg',
    tags: ['Thumbnail', 'Red Bull', 'Live Broadcast'],
    featured: false,
    order: 6,
    status: 'PUBLISHED',
    createdAt: '2026-09-06T00:00:00Z',
    updatedAt: '2026-09-06T00:00:00Z',
  },

  // GFX - Logo/Banners
  {
    id: 'studio-gfx-07',
    type: 'GFX',
    gfxCategory: 'Logo/Banners',
    title: 'Nexus Arena Championship — Brand Crest & Stadium Banners',
    client: 'Nexus Gaming League',
    description: 'Vector tournament emblem, perimeter LED arena ribbon boards, and full Twitter / YouTube channel banners.',
    imageUrl: '/media/cta-field.jpg',
    tags: ['Logo/Banners', 'Identity', 'LED Ribbons', 'Branding'],
    featured: true,
    order: 7,
    status: 'PUBLISHED',
    createdAt: '2026-09-07T00:00:00Z',
    updatedAt: '2026-09-07T00:00:00Z',
  },
  {
    id: 'studio-gfx-08',
    type: 'GFX',
    gfxCategory: 'Logo/Banners',
    title: 'Talon Esports Worldwide — Identity Mark & Social Headers',
    client: 'Talon Esports',
    description: 'Modular crest construction, high-impact Twitch offline screens, and partner co-branded header canvases.',
    imageUrl: '/media/hero-lightfield-portrait.jpg',
    tags: ['Logo/Banners', 'Vector', 'Social Headers'],
    featured: false,
    order: 8,
    status: 'PUBLISHED',
    createdAt: '2026-09-08T00:00:00Z',
    updatedAt: '2026-09-08T00:00:00Z',
  },

  // VFX - Videos & Motion
  {
    id: 'studio-vfx-01',
    type: 'VFX',
    title: 'VALORANT Champions 2026 — Cinematic Stage Intro Reel',
    client: 'Riot Games Broadcast',
    description: 'Full 3D arena opening sequence with volumetric lighting, custom stadium holograms, and camera sweep transitions.',
    imageUrl: '/media/work-valorant-championship.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // sample video or playable stream
    thumbnailUrl: '/media/work-valorant-championship.jpg',
    duration: '01:45',
    tags: ['3D Motion', 'Unreal Engine', 'Hologram', 'Intro Reel'],
    featured: true,
    order: 9,
    status: 'PUBLISHED',
    createdAt: '2026-09-09T00:00:00Z',
    updatedAt: '2026-09-09T00:00:00Z',
  },
  {
    id: 'studio-vfx-02',
    type: 'VFX',
    title: 'Nexus Arena LED Ribbons & Stage Holo-Wall Motion Loop',
    client: 'Nexus Esports Arena',
    description: 'Seamless 60fps synchronized motion graphics driving 400 meters of perimeter LED and central cube screens.',
    imageUrl: '/media/work-nexus-arena.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: '/media/work-nexus-arena.jpg',
    duration: '00:30',
    tags: ['LED Loop', 'Motion Graphics', 'Stage Architecture'],
    featured: true,
    order: 10,
    status: 'PUBLISHED',
    createdAt: '2026-09-10T00:00:00Z',
    updatedAt: '2026-09-10T00:00:00Z',
  },
  {
    id: 'studio-vfx-03',
    type: 'VFX',
    title: 'Level Up Championship — 3D Match Trophy Reveal Animation',
    client: 'Level Up Gaming Network',
    description: 'Physically based rendering of the championship cup with chrome reflections and molten gold liquid simulations.',
    imageUrl: '/media/work-level-up.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: '/media/work-level-up.jpg',
    duration: '01:12',
    tags: ['Cinema 4D', 'Octane Render', 'Trophy Reveal', 'Simulation'],
    featured: false,
    order: 11,
    status: 'PUBLISHED',
    createdAt: '2026-09-11T00:00:00Z',
    updatedAt: '2026-09-11T00:00:00Z',
  },
];

