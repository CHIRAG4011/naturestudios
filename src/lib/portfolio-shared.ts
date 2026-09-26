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
  portfolioSource?: 'studio' | 'user';
  category?: 'GFX' | 'VFX' | 'Other';
  gfxSubcategory?: GfxSubsection;
  customCategory?: string;
  mediaType?: 'image' | 'video';
  mediaUrl?: string;
  mediaGallery?: string[];
  videoThumbnailUrl?: string;
  duration?: string;
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
export type GfxSubsection = 'Tournament' | 'Roster' | 'Thumbnail' | 'Logo/Banner' | 'Logo/Banners' | 'Jersey';
export type VfxSubsection = 'Clipping' | 'Cinematics' | 'Showreel' | 'Broadcast';

export interface StudioPortfolioItem {
  id: string;
  portfolioSource?: 'studio';
  type: StudioWorkType;
  gfxCategory?: GfxSubsection;
  vfxCategory?: VfxSubsection;
  title: string;
  client?: string;
  description: string;
  imageUrl: string;
  images?: string[];
  gallery?: string[];
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
  'Logo/Banner',
  'Jersey',
];

export const VFX_SUBSECTIONS: VfxSubsection[] = [
  'Clipping',
  'Cinematics',
  'Showreel',
  'Broadcast',
];

export function toGfxCategorySlug(category: string): string {
  const norm = category.toLowerCase().trim();
  if (norm.includes('tourn')) return 'tournament';
  if (norm.includes('roster')) return 'roster';
  if (norm.includes('thumb')) return 'thumbnail';
  if (norm.includes('logo') || norm.includes('banner')) return 'logo-banner';
  if (norm.includes('jersey')) return 'jersey';
  return norm.replace(/[^a-z0-9]+/g, '-');
}

export function fromGfxCategorySlug(slug?: string): GfxSubsection | undefined {
  if (!slug) return undefined;
  const s = slug.toLowerCase().trim();
  if (s === 'tournament') return 'Tournament';
  if (s === 'roster') return 'Roster';
  if (s === 'thumbnail') return 'Thumbnail';
  if (s === 'logo-banner' || s === 'logo' || s === 'banners' || s === 'banner') return 'Logo/Banner';
  if (s === 'jersey' || s === 'jerseys') return 'Jersey';
  return undefined;
}

export function toVfxCategorySlug(category: string): string {
  const norm = category.toLowerCase().trim();
  if (norm.includes('clip')) return 'clipping';
  if (norm.includes('cinema')) return 'cinematics';
  if (norm.includes('showreel')) return 'showreel';
  if (norm.includes('broad')) return 'broadcast';
  return norm.replace(/[^a-z0-9]+/g, '-');
}

export function fromVfxCategorySlug(slug?: string): VfxSubsection | undefined {
  if (!slug) return undefined;
  const s = slug.toLowerCase().trim();
  if (s === 'clipping' || s === 'clips' || s === 'clip') return 'Clipping';
  if (s === 'cinematics' || s === 'cinematic') return 'Cinematics';
  if (s === 'showreel' || s === 'reels' || s === 'reel') return 'Showreel';
  if (s === 'broadcast') return 'Broadcast';
  return undefined;
}

export const DEFAULT_STUDIO_PORTFOLIO_ITEMS: StudioPortfolioItem[] = [
  // GFX - Tournament: Infinix Partnership Key Visuals & Posters
  {
    id: 'studio-gfx-infinix-posters',
    type: 'GFX',
    gfxCategory: 'Tournament',
    title: 'Infinix Hot 70 Pro Championship — Key Visuals & Tournament Poster Suite',
    client: 'Infinix India x MediaTek // Free Fire MAX Series',
    description: 'Official tournament key visuals and promotional campaign posters engineered by NatureStudios for the Infinix Hot 70 Pro x Free Fire MAX Championship. Includes Coming Soon teaser poster, Registrations Are Live announcement, Official Prize Pool showcase, and the complete 4-part "All You Need To Know" tournament rulebook & roadmap carousel deck.',
    imageUrl: '/media/infinix/gfx/posters/coming-soon.jpg',
    thumbnailUrl: '/media/infinix/gfx/posters/coming-soon.jpg',
    images: [
      '/media/infinix/gfx/posters/coming-soon.jpg',
      '/media/infinix/gfx/posters/registrations-live.jpg',
      '/media/infinix/gfx/posters/prizepool.jpg',
      '/media/infinix/gfx/posters/all-you-need-to-know-1.png',
      '/media/infinix/gfx/posters/all-you-need-to-know-2.png',
      '/media/infinix/gfx/posters/all-you-need-to-know-3.png',
      '/media/infinix/gfx/posters/all-you-need-to-know-4.png',
    ],
    tags: ['Infinix', 'Hot 70 Pro', 'Free Fire MAX', 'Tournament', 'Key Visuals', 'Posters', 'Prizepool', 'Carousel Deck'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'studio-gfx-infinix-broadcast-hud',
    type: 'GFX',
    gfxCategory: 'Tournament',
    title: 'Infinix Hot 70 Pro Tournament — Stream Pack, L-Bands & Broadcast HUD Suite',
    client: 'Infinix India // Esports Broadcast Network',
    description: 'Complete live broadcast HUD and stream overlay identity system designed for the Infinix Hot 70 Pro Championship. Features official Points Table overlay, Live Stream Prize Pool graphic, Reel format broadcast overlay, dual L-Band lower thirds (with and without character art), dynamic animated Tickers, and co-branded sponsor badges for MediaTek Dimensity and 144Hz display tech.',
    imageUrl: '/media/infinix/gfx/broadcast/points-table.png',
    thumbnailUrl: '/media/infinix/gfx/broadcast/points-table.png',
    images: [
      '/media/infinix/gfx/broadcast/points-table.png',
      '/media/infinix/gfx/broadcast/stream-prizepool.png',
      '/media/infinix/gfx/broadcast/reel-overlay.png',
      '/media/infinix/gfx/broadcast/l-band-1.png',
      '/media/infinix/gfx/broadcast/l-band-2.png',
      '/media/infinix/gfx/broadcast/l-band-1-no-char.png',
      '/media/infinix/gfx/broadcast/l-band-2-no-char.png',
      '/media/infinix/gfx/broadcast/ticker-1.png',
      '/media/infinix/gfx/broadcast/ticker-2.png',
      '/media/infinix/gfx/broadcast/ticker-3.png',
      '/media/infinix/gfx/broadcast/ticker-register-now.png',
      '/media/infinix/gfx/broadcast/144hz-badge.png',
      '/media/infinix/gfx/broadcast/mediatek-badge.png',
      '/media/infinix/gfx/broadcast/hot-badge.png',
    ],
    tags: ['Infinix', 'Broadcast HUD', 'Stream Pack', 'Points Table', 'L-Bands', 'Tickers', 'MediaTek', '144Hz'],
    featured: true,
    order: 2,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'studio-gfx-infinix-social-stories',
    type: 'GFX',
    gfxCategory: 'Tournament',
    title: 'Infinix Championship — Social Story Decks & Match Progression Suite',
    client: 'Infinix Esports // Free Fire MAX Community',
    description: 'High-impact 9:16 vertical social story graphics for Instagram and YouTube Stories announcing critical match milestones: Registration Ends Today, Round 1 Begins, Round 2 Begins, Semi Finals Begins, and Grand Finals Begins.',
    imageUrl: '/media/infinix/gfx/stories/grand-finals-begins.png',
    thumbnailUrl: '/media/infinix/gfx/stories/grand-finals-begins.png',
    images: [
      '/media/infinix/gfx/stories/grand-finals-begins.png',
      '/media/infinix/gfx/stories/semi-finals-begins.png',
      '/media/infinix/gfx/stories/round-2-begins.png',
      '/media/infinix/gfx/stories/round-1-begins.png',
      '/media/infinix/gfx/stories/registration-ends-today.png',
    ],
    tags: ['Infinix', 'Social Stories', 'Tournament', 'Grand Finals', 'Semi Finals', 'Stories', '9:16'],
    featured: true,
    order: 3,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // GFX - Tournament (Official Real Tournament Posters)
  {
    id: 'studio-gfx-tournament-clash-squad-cup',
    type: 'GFX',
    gfxCategory: 'Tournament',
    title: 'Clash Squad Cup Season 1 — Official Tournament Graphics Suite',
    client: 'ProSports Esports Association (PSESA) // Pune E-Sports',
    description: 'Complete tournament graphics suite engineered by Nature Studios as official Visual Partner for Clash Squad Cup Season 1. Includes Event Roadmap & Qualifiers schedule, Prize Pool Distribution breakdown, Registration Form artwork, Venue Presentation, and tournament guidelines carousel slides.',
    imageUrl: '/media/tournaments/clash-squad-cup/event-roadmap.png',
    thumbnailUrl: '/media/tournaments/clash-squad-cup/event-roadmap.png',
    images: [
      '/media/tournaments/clash-squad-cup/event-roadmap.png',
      '/media/tournaments/clash-squad-cup/all-you-need-to-know.png',
      '/media/tournaments/clash-squad-cup/prizepool-distribution.png',
      '/media/tournaments/clash-squad-cup/registration-form.png',
      '/media/tournaments/clash-squad-cup/venue-page.png',
    ],
    tags: ['Tournament', 'Clash Squad Cup', 'PSESA', 'Pune E-Sports', 'Roadmap', 'Prizepool', 'Carousel Deck'],
    featured: false,
    order: 4,
    status: 'PUBLISHED',
    createdAt: '2026-09-01T00:00:00Z',
    updatedAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'studio-gfx-tournament-troopers-challengers',
    type: 'GFX',
    gfxCategory: 'Tournament',
    title: "Trooper's Challenger's Series — Championship Tournament Graphics",
    client: 'Trooper Live // Free Fire MAX Community India',
    description: "High-impact competitive tournament visual identity and promotional campaign engineered by Nature Studios for Trooper's Challenger's Series presented by Trooper Live. Features 500 INR/day prize pool announcement posters, slots and match schedule graphics, prize pool distribution cards, format breakdown, and interactive swipe-up story slides.",
    imageUrl: '/media/tournaments/troopers-challengers/tropper-prizepool.png',
    thumbnailUrl: '/media/tournaments/troopers-challengers/tropper-prizepool.png',
    images: [
      '/media/tournaments/troopers-challengers/tropper-prizepool.png',
      '/media/tournaments/troopers-challengers/tropper-pp-distribution.png',
      '/media/tournaments/troopers-challengers/tropper-all-you-need-to-know.png',
      '/media/tournaments/troopers-challengers/tropper-thanks-for-swipe-up.png',
    ],
    tags: ['Tournament', 'Troopers Challenger Series', 'Trooper Live', 'Prizepool', 'Slots', 'Swipe Up Story'],
    featured: false,
    order: 5,
    status: 'PUBLISHED',
    createdAt: '2026-09-02T00:00:00Z',
    updatedAt: '2026-09-02T00:00:00Z',
  },
  {
    id: 'studio-gfx-tournament-crowned-glory',
    type: 'GFX',
    gfxCategory: 'Tournament',
    title: 'Crowned Glory Championship — Multi-Mode Tournament Visual Package',
    client: 'Crowned Glory // Echo Fluxx // Free Fire MAX Community India',
    description: 'Official tournament visual identity and social broadcast suite designed by Nature Studios as official Visuals Partner for Crowned Glory Championship. Featuring Full Map and CS Mode prize pool distribution tier graphics, 5000 prize pool event launch posters, team registration sheets, and social media tournament swipe decks.',
    imageUrl: '/media/tournaments/crowned-glory/crowned-glory-all-you-need-to-know.jpg',
    thumbnailUrl: '/media/tournaments/crowned-glory/crowned-glory-all-you-need-to-know.jpg',
    images: [
      '/media/tournaments/crowned-glory/crowned-glory-all-you-need-to-know.jpg',
      '/media/tournaments/crowned-glory/crowned-glory-prizepool-5000.jpg',
      '/media/tournaments/crowned-glory/crowned-glory-distribution.jpg',
      '/media/tournaments/crowned-glory/crowned-glory-roadmap.jpg',
      '/media/tournaments/crowned-glory/crowned-glory-swipe-cover.jpg',
    ],
    tags: ['Tournament', 'Crowned Glory', 'Echo Fluxx', 'Full Map', 'CS Mode', 'Prizepool', 'Roadmap'],
    featured: false,
    order: 6,
    status: 'PUBLISHED',
    createdAt: '2026-09-03T00:00:00Z',
    updatedAt: '2026-09-03T00:00:00Z',
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
    id: 'studio-gfx-infinix-thumbnails',
    type: 'GFX',
    gfxCategory: 'Thumbnail',
    title: 'Infinix Hot 70 Pro Group Stage — High-CTR Match Stream Thumbnails',
    client: 'Infinix Gaming // YouTube & Rooter Live Streams',
    description: 'High-CTR YouTube and live stream match thumbnails engineered for the Infinix Hot 70 Pro Championship Group Stage (Group A and Group B). Crafted with high-contrast typography, 3D character key art, brand badge hierarchy, and intense esports lighting.',
    imageUrl: '/media/infinix/gfx/thumbnails/group-stage-group-a.png',
    thumbnailUrl: '/media/infinix/gfx/thumbnails/group-stage-group-a.png',
    images: [
      '/media/infinix/gfx/thumbnails/group-stage-group-a.png',
      '/media/infinix/gfx/thumbnails/group-stage-group-b.png',
    ],
    tags: ['Infinix', 'Thumbnail', 'YouTube', 'Group Stage', 'High-CTR', 'Stream Cover'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
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
    order: 2,
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
    order: 3,
    status: 'PUBLISHED',
    createdAt: '2026-09-06T00:00:00Z',
    updatedAt: '2026-09-06T00:00:00Z',
  },

  // GFX - Logo/Banners
  {
    id: 'studio-gfx-infinix-branding',
    type: 'GFX',
    gfxCategory: 'Logo/Banners',
    title: 'Infinix Hot 70 Pro & MediaTek — Brand Asset System & Badging Suite',
    client: 'Infinix Mobile // MediaTek Dimensity Co-Branding',
    description: 'Official vector insignia, brand typography integration, and hardware specification badges including the HOT 70 Pro custom typography mark, Infinix Play crest, 144Hz ultra-refresh rate badge, and MediaTek partnership mark for esports broadcast certification.',
    imageUrl: '/media/infinix/gfx/broadcast/hot-70-pro-logo.png',
    thumbnailUrl: '/media/infinix/gfx/broadcast/hot-70-pro-logo.png',
    images: [
      '/media/infinix/gfx/broadcast/hot-70-pro-logo.png',
      '/media/infinix/gfx/broadcast/infinix-play-logo.png',
      '/media/infinix/gfx/broadcast/144hz-badge.png',
      '/media/infinix/gfx/broadcast/mediatek-badge.png',
      '/media/infinix/gfx/broadcast/hot-badge.png',
    ],
    tags: ['Infinix', 'Logo/Banners', 'Branding', 'MediaTek', '144Hz', 'Identity Mark'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
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
    order: 2,
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
    order: 3,
    status: 'PUBLISHED',
    createdAt: '2026-09-08T00:00:00Z',
    updatedAt: '2026-09-08T00:00:00Z',
  },

  // GFX - Jersey
  {
    id: 'studio-gfx-09',
    type: 'GFX',
    gfxCategory: 'Jersey',
    title: 'Championship Pro Kit — Custom Esports Jersey & Apparel Suite',
    client: 'NatureStudios Esports Apparel // Pro Series',
    description: 'Sublimation-printed pro gaming jersey design, custom geometric gold and dark burgundy vector detailing, moisture-wicking fabric technical mockups, and premium sponsor emblem mapping.',
    imageUrl: '/media/work-jersey-championship.jpg',
    images: ['/media/work-jersey-championship.jpg', '/media/work-valorant-championship.jpg'],
    tags: ['Jersey', 'Apparel', 'Esports Kit', 'Sublimation', 'Merch'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-08T12:00:00Z',
    updatedAt: '2026-09-08T12:00:00Z',
  },

  // VFX - Clipping & Creator Highlights
  {
    id: 'studio-vfx-clipping-creators',
    type: 'VFX',
    vfxCategory: 'Clipping',
    title: 'Elite Creator Clipping Suite — Elvish Yadav, Scout & Kashvi',
    client: 'Elvish Yadav // Scout (Tanmay Singh) // Kashvi Hiranandani',
    description: 'NatureStudios is recently collaborating with premier creators Elvish Yadav, Scout (Tanmay Singh), and Kashvi (Kashvi Hiranandani) to produce viral stream clipping suites, high-retention YouTube Shorts, esports tournament clutches, and kinetic subtitle motion design engineered for multi-million reach across YouTube and Instagram Reels.',
    imageUrl: '/media/work-creator-clipping.jpg',
    thumbnailUrl: '/media/work-creator-clipping.jpg',
    images: ['/media/work-creator-clipping.jpg', '/media/hero-lightfield.jpg'],
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '01:15',
    tags: ['Clipping', 'Elvish Yadav', 'Scout', 'Kashvi', 'Shorts', 'Highlights', 'Viral Reels', 'Motion Subtitles'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-24T00:00:00Z',
    updatedAt: '2026-09-24T00:00:00Z',
  },

  // VFX - Showreel / Cinematic Teaser (Infinix Flagship)
  {
    id: 'studio-vfx-infinix-teaser',
    type: 'VFX',
    vfxCategory: 'Showreel',
    title: 'Infinix Hot 70 Pro — Official Tournament 3D Cinematic Teaser Trailer',
    client: 'Infinix Mobile India x MediaTek',
    description: 'Flagship 3D cinematic teaser trailer and motion reel engineered by NatureStudios for the Infinix Hot 70 Pro x Free Fire MAX Championship. Features dynamic 3D camera sweeps, explosive energy particle simulations, device silhouette reveals, synced dramatic audio design, and 1080p 60fps tournament launch visuals.',
    imageUrl: '/media/infinix/gfx/posters/coming-soon.jpg',
    thumbnailUrl: '/media/infinix/gfx/posters/coming-soon.jpg',
    videoUrl: '/media/infinix/vfx/infinix-teaser-trailer.mp4',
    duration: '00:45',
    tags: ['Infinix', '3D Motion', 'Teaser Trailer', 'Showreel', 'Cinematics', 'Unreal Engine', 'Particle FX', 'VFX'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'studio-vfx-01',
    type: 'VFX',
    vfxCategory: 'Showreel',
    title: 'VALORANT Champions 2026 — Cinematic Stage Intro Reel',
    client: 'Riot Games Broadcast',
    description: 'Full 3D arena opening sequence with volumetric lighting, custom stadium holograms, and camera sweep transitions.',
    imageUrl: '/media/work-valorant-championship.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: '/media/work-valorant-championship.jpg',
    duration: '01:45',
    tags: ['3D Motion', 'Unreal Engine', 'Hologram', 'Intro Reel'],
    featured: false,
    order: 2,
    status: 'PUBLISHED',
    createdAt: '2026-09-09T00:00:00Z',
    updatedAt: '2026-09-09T00:00:00Z',
  },

  // VFX - Broadcast: Infinix Caster Desk & Animated HUD
  {
    id: 'studio-vfx-infinix-caster-desk',
    type: 'VFX',
    vfxCategory: 'Broadcast',
    title: 'Infinix Championship — Caster Desk Dynamic Motion & Broadcast Stage Loop',
    client: 'Infinix Gaming Arena // Live Broadcast Operations',
    description: 'Seamless 60fps animated caster desk motion backdrop engineered for live tournament studio broadcasts. Synchronized glowing LED circuit runs, rotating 3D Infinix and MediaTek emblems, animated stage perimeter lighting, and studio desk monitors designed for high-energy esports analysis desks.',
    imageUrl: '/media/infinix/gfx/broadcast/points-table.png',
    thumbnailUrl: '/media/infinix/gfx/broadcast/points-table.png',
    videoUrl: '/media/infinix/vfx/caster-desk-motion.mp4',
    duration: '00:30',
    tags: ['Infinix', 'Broadcast', 'Caster Desk', 'Stage Loop', '60fps', 'LED Screen', 'VFX'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'studio-vfx-infinix-animated-hud',
    type: 'VFX',
    vfxCategory: 'Broadcast',
    title: 'Infinix Tournament — Animated L-Band Ribbon & Broadcast Motion Stinger Suite',
    client: 'Infinix India // Esports Stream Production',
    description: 'Complete suite of animated broadcast motion graphics including the dynamic animated L-Band sponsor ribbon loop, broadcast replay transition stingers, match bumper sequences, and live countdown animation packages for the Infinix Hot 70 Pro Championship.',
    imageUrl: '/media/infinix/gfx/broadcast/l-band-1.png',
    thumbnailUrl: '/media/infinix/gfx/broadcast/l-band-1.png',
    videoUrl: '/media/infinix/vfx/l-band-animated.mp4',
    duration: '00:25',
    images: [
      '/media/infinix/gfx/broadcast/l-band-1.png',
      '/media/infinix/gfx/broadcast/l-band-2.png',
      '/media/infinix/gfx/broadcast/144hz-badge.png',
    ],
    tags: ['Infinix', 'Broadcast', 'L-Band Motion', 'Animated HUD', 'Stingers', 'Transitions', 'VFX'],
    featured: true,
    order: 2,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'studio-vfx-03',
    type: 'VFX',
    vfxCategory: 'Broadcast',
    title: 'Level Up Championship — 3D Match Trophy Reveal Animation',
    client: 'Level Up Gaming Network',
    description: 'Physically based rendering of the championship cup with chrome reflections and molten gold liquid simulations.',
    imageUrl: '/media/work-level-up.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: '/media/work-level-up.jpg',
    duration: '01:12',
    tags: ['Cinema 4D', 'Octane Render', 'Trophy Reveal', 'Simulation'],
    featured: false,
    order: 3,
    status: 'PUBLISHED',
    createdAt: '2026-09-11T00:00:00Z',
    updatedAt: '2026-09-11T00:00:00Z',
  },

  // VFX - Cinematics: Infinix 144Hz Stinger
  {
    id: 'studio-vfx-infinix-transition-stinger',
    type: 'VFX',
    vfxCategory: 'Cinematics',
    title: 'Infinix 144Hz Hyper-Speed Match Transition Stinger & Replay Wipe',
    client: 'Infinix Performance Series // Broadcast Production',
    description: 'Ultra-fast broadcast transition stinger featuring 144Hz motion blur kinematics, high-voltage energy bursts, and branded MediaTek Dimensity audio stings engineered for seamless instant match replay transitions during live tournament streams.',
    imageUrl: '/media/infinix/gfx/broadcast/144hz-badge.png',
    thumbnailUrl: '/media/infinix/gfx/broadcast/144hz-badge.png',
    videoUrl: '/media/infinix/vfx/broadcast-motion-comp25.mp4',
    duration: '00:15',
    tags: ['Infinix', 'Cinematics', '144Hz', 'Transition', 'Replay Wipe', 'Stinger', 'VFX'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
  {
    id: 'studio-vfx-02',
    type: 'VFX',
    vfxCategory: 'Cinematics',
    title: 'Nexus Arena LED Ribbons & Stage Holo-Wall Motion Loop',
    client: 'Nexus Esports Arena',
    description: 'Seamless 60fps synchronized motion graphics driving 400 meters of perimeter LED and central cube screens.',
    imageUrl: '/media/work-nexus-arena.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: '/media/work-nexus-arena.jpg',
    duration: '00:30',
    tags: ['LED Loop', 'Motion Graphics', 'Stage Architecture'],
    featured: false,
    order: 2,
    status: 'PUBLISHED',
    createdAt: '2026-09-10T00:00:00Z',
    updatedAt: '2026-09-10T00:00:00Z',
  },
];

function createCommunityPortfolio(data: {
  id: string;
  userId: string;
  slug: string;
  status: PortfolioStatus;
  category: 'GFX' | 'VFX';
  gfxSubcategory?: GfxSubsection;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  mediaGallery: string[];
  videoThumbnailUrl?: string;
  duration?: string;
  title: string;
  description: string;
  themeId: PortfolioThemeId;
  personalInfo: PortfolioPersonalInfo;
  professionalIdentity?: PortfolioProfessionalIdentity;
  skills: PortfolioSkill[];
  projects: PortfolioProjectItem[];
  views?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}): PortfolioData {
  return {
    ...data,
    portfolioSource: 'user',
    professionalIdentity: data.professionalIdentity || {
      primaryRole: data.personalInfo.professionalTitle,
      summary: data.description,
    },
    experience: [],
    education: [],
    certifications: [],
    services: [],
    socialLinks: {},
    contactConfig: { contactFormEnabled: true },
    designConfig: DEFAULT_DESIGN_CONFIG,
    seoConfig: {
      seoTitle: `${data.personalInfo.fullName} — Portfolio | NatureStudios`,
      seoDescription: data.personalInfo.aboutMe?.slice(0, 160) || 'Creative portfolio on NatureStudios.',
    },
  };
}

export const DEFAULT_COMMUNITY_PORTFOLIO_ITEMS: PortfolioData[] = [
  createCommunityPortfolio({
    id: 'comm-alex-tournament',
    userId: 'user_alex_tournament_01',
    slug: 'alex-tournament-gfx',
    status: 'PUBLISHED',
    category: 'GFX',
    gfxSubcategory: 'Tournament',
    mediaType: 'image',
    mediaUrl: '/media/work-valorant-championship.jpg',
    mediaGallery: [
      '/media/work-valorant-championship.jpg',
      '/media/work-nexus-arena.jpg',
      '/media/hero-lightfield.jpg',
      '/media/cta-field.jpg',
    ],
    title: 'Alex Rivera — Esports Tournament Graphics & Stage Visuals',
    description:
      'Senior Esports Graphic Designer with 6+ years of experience delivering grand final broadcast packages, HUD overlays, tournament match schedules, and stadium LED telemetry for Tier 1 international competitions.',
    themeId: 'esports',
    personalInfo: {
      fullName: 'Alex Rivera',
      professionalName: 'Alex Rivera // ApexGFX',
      username: 'alex-tournament-gfx',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
      coverImage: '/media/work-valorant-championship.jpg',
      location: 'Los Angeles, CA & Remote Worldwide',
      country: 'USA',
      professionalTitle: 'Tournament Lead Graphic Designer',
      tagline: 'Designing high-intensity tournament packages for the world’s biggest esports stages.',
      aboutMe:
        'I collaborate directly with tournament organizers, broadcast directors, and esports franchises to craft visually cohesive broadcast graphics. Specializing in tournament playoff bracket designs, HUD telemetry, in-arena scoreboard displays, and dynamic social broadcast collateral.',
      publicEmail: 'alex.rivera.gfx@example.com',
      availability: 'Available for Tournament Contracts & Commissions',
    },
    professionalIdentity: {
      primaryRole: 'Tournament Graphic Specialist',
      yearsExperience: 6,
      summary: 'Crafting grand finals broadcast packages, tournament overlays, and high-impact stadium graphics.',
    },
    skills: [
      { id: 'sk-1', name: 'Adobe Photoshop', category: 'Design', experienceLevel: 'Expert', proficiency: 98 },
      { id: 'sk-2', name: 'Tournament HUD Design', category: 'Esports', experienceLevel: 'Expert', proficiency: 95 },
      { id: 'sk-3', name: 'Broadcast Overlay Systems', category: 'Broadcast', experienceLevel: 'Expert', proficiency: 92 },
      { id: 'sk-4', name: 'Figma Layouts', category: 'UI', experienceLevel: 'Intermediate', proficiency: 88 },
      { id: 'sk-5', name: 'Adobe Illustrator', category: 'Vector', experienceLevel: 'Expert', proficiency: 90 },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'ALGS Pro Circuit 2026 — Main Stage Broadcast Packaging',
        slug: 'algs-stage-packaging',
        description: 'Complete 4K tournament overlay package, match telemetry panels, live kill counters, and circle status monitors.',
        client: 'Electronic Arts // ALGS',
        category: 'GFX',
        workType: 'GFX',
        gfxCategory: 'Tournament',
        thumbnail: '/media/work-valorant-championship.jpg',
        gallery: ['/media/work-valorant-championship.jpg', '/media/work-nexus-arena.jpg'],
        tools: ['Photoshop', 'Illustrator', 'Singular.live', 'After Effects'],
        challenge: 'Deliver zero-latency broadcast overlays capable of real-time multi-team API score updates.',
        solution: 'Built modular 1080p and 4K vector asset templates with automated telemetry data layers.',
        outcome: 'Used on live Twitch and YouTube broadcasts reaching over 2.4 million concurrent viewers.',
        order: 1,
      },
      {
        id: 'proj-2',
        title: 'VCT Champions 2026 — Playoff Bracket & Schedule System',
        slug: 'vct-champions-brackets',
        description: 'Dynamic double-elimination bracket displays and high-contrast match day lineup banners.',
        client: 'Riot Games Partner',
        category: 'GFX',
        workType: 'GFX',
        gfxCategory: 'Tournament',
        thumbnail: '/media/work-nexus-arena.jpg',
        gallery: ['/media/work-nexus-arena.jpg', '/media/hero-lightfield.jpg'],
        tools: ['Photoshop', 'Cinema 4D'],
        challenge: 'Present complex multi-group tournament progression in a clean, broadcast-ready format.',
        solution: 'Developed an illuminated cyber-red bracket typography system with instant team slot swaps.',
        order: 2,
      },
      {
        id: 'proj-3',
        title: 'Red Bull Home Ground — Arena LED Ribbon & Stage Visuals',
        slug: 'redbull-stage-visuals',
        description: 'Synchronized stadium stage graphics, countdown stingers, and player podium nameplates.',
        client: 'Red Bull Gaming',
        category: 'GFX',
        workType: 'GFX',
        gfxCategory: 'Tournament',
        thumbnail: '/media/cta-field.jpg',
        gallery: ['/media/cta-field.jpg'],
        tools: ['Photoshop', 'Illustrator'],
        order: 3,
      },
    ],
    views: 1420,
    publishedAt: '2026-09-10T12:00:00Z',
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
  }),
  createCommunityPortfolio({
    id: 'comm-elena-tournament',
    userId: 'user_elena_tournament_02',
    slug: 'elena-tournament-arts',
    status: 'PUBLISHED',
    category: 'GFX',
    gfxSubcategory: 'Tournament',
    mediaType: 'image',
    mediaUrl: '/media/work-nexus-arena.jpg',
    mediaGallery: [
      '/media/work-nexus-arena.jpg',
      '/media/work-level-up.jpg',
      '/media/work-after-dark.jpg',
    ],
    title: 'Elena Rostova — Global Esports Tournament Art Director',
    description:
      'Art Director crafting visual identities for world-championship tier gaming events, arena stage visuals, and competitive esports brand packages.',
    themeId: 'editorial',
    personalInfo: {
      fullName: 'Elena Rostova',
      professionalName: 'Elena Rostova // Studio Rostova',
      username: 'elena-tournament-arts',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces',
      coverImage: '/media/work-nexus-arena.jpg',
      location: 'Berlin, Germany & Worldwide',
      country: 'Germany',
      professionalTitle: 'Esports Art Director & Tournament Designer',
      tagline: 'Visual identity systems for major multi-title gaming championships worldwide.',
      aboutMe:
        'With a decade of experience across premier esports tournaments, I create cohesive visual systems that bridge broadcast screens, arena stage architecture, and digital fan engagement.',
      publicEmail: 'elena@rostovarts.com',
      availability: 'Accepting Tournament Brand System Inquiries',
    },
    skills: [
      { id: 'sk-1', name: 'Tournament Identity Design', category: 'Branding', experienceLevel: 'Expert', proficiency: 99 },
      { id: 'sk-2', name: 'Stage Architecture Visuals', category: 'Environmental', experienceLevel: 'Expert', proficiency: 94 },
      { id: 'sk-3', name: 'Adobe Photoshop', category: 'Design', experienceLevel: 'Expert', proficiency: 96 },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Nexus Masters Global Finals — Stage & Broadcast Package',
        slug: 'nexus-masters-finals',
        description: 'Comprehensive key art suite and tournament stage graphics across 3 arena destinations.',
        client: 'Nexus Gaming League',
        category: 'GFX',
        workType: 'GFX',
        gfxCategory: 'Tournament',
        thumbnail: '/media/work-nexus-arena.jpg',
        gallery: ['/media/work-nexus-arena.jpg', '/media/work-level-up.jpg'],
        tools: ['Photoshop', 'Illustrator', 'Cinema 4D'],
        order: 1,
      },
    ],
    views: 890,
    publishedAt: '2026-09-11T12:00:00Z',
    createdAt: '2026-09-11T12:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
  }),
  createCommunityPortfolio({
    id: 'comm-marcus-roster',
    userId: 'user_marcus_roster_03',
    slug: 'marcus-roster-esports',
    status: 'PUBLISHED',
    category: 'GFX',
    gfxSubcategory: 'Roster',
    mediaType: 'image',
    mediaUrl: '/media/work-after-dark.jpg',
    mediaGallery: [
      '/media/work-after-dark.jpg',
      '/media/work-level-up.jpg',
      '/media/work-valorant-championship.jpg',
    ],
    title: 'Marcus Vance — Pro Team Rosters & Player Cards',
    description:
      'Esports roster graphic artist specializing in high-octane player reveal cards, starting 5 lineup posters, and roster announcement packages for franchised teams.',
    themeId: 'esports',
    personalInfo: {
      fullName: 'Marcus Vance',
      professionalName: 'Marcus Vance // VanceDesign',
      username: 'marcus-roster-esports',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
      coverImage: '/media/work-after-dark.jpg',
      location: 'Austin, TX & Remote',
      professionalTitle: 'Esports Roster & Player Card Specialist',
      tagline: 'High-octane player reveal cards and starting lineup packages.',
      aboutMe:
        'I transform athlete photography and 3D in-game character models into championship-tier roster graphics that generate massive social engagement.',
      publicEmail: 'marcus@vancedesign.gg',
      availability: 'Available for Roster Drops & Announcements',
    },
    skills: [
      { id: 'sk-1', name: 'Roster Card Design', category: 'GFX', experienceLevel: 'Expert', proficiency: 98 },
      { id: 'sk-2', name: 'Photo Manipulation', category: 'Photoshop', experienceLevel: 'Expert', proficiency: 96 },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Sentinels 2026 Starting Five Reveal Graphics',
        slug: 'sentinels-starting-five',
        description: 'Championship lineup announcement cards and social carousel suite.',
        client: 'Sentinels Esports',
        category: 'GFX',
        workType: 'GFX',
        gfxCategory: 'Roster',
        thumbnail: '/media/work-after-dark.jpg',
        gallery: ['/media/work-after-dark.jpg'],
        tools: ['Photoshop', 'Lightroom'],
        order: 1,
      },
    ],
    views: 650,
    publishedAt: '2026-09-12T12:00:00Z',
    createdAt: '2026-09-12T12:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
  }),
  createCommunityPortfolio({
    id: 'comm-liam-thumbnail',
    userId: 'user_liam_thumbnail_04',
    slug: 'liam-apex-thumbnails',
    status: 'PUBLISHED',
    category: 'GFX',
    gfxSubcategory: 'Thumbnail',
    mediaType: 'image',
    mediaUrl: '/media/hero-lightfield.jpg',
    mediaGallery: [
      '/media/hero-lightfield.jpg',
      '/media/studio-plate.jpg',
      '/media/work-valorant-championship.jpg',
    ],
    title: 'Liam Chen — High-CTR YouTube & Stream Covers',
    description:
      'High-CTR YouTube thumbnail designer helping top gaming creators and esports tournaments hit 15%+ click-through rates with proven visual psychology.',
    themeId: 'creative-grid',
    personalInfo: {
      fullName: 'Liam Chen',
      professionalName: 'Liam Chen // ApexThumbnails',
      username: 'liam-apex-thumbnails',
      profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop&crop=faces',
      coverImage: '/media/hero-lightfield.jpg',
      location: 'Toronto, Canada & Worldwide',
      professionalTitle: 'YouTube Packaging & CTR Specialist',
      tagline: 'Generating 40M+ views with high-converting gaming thumbnails.',
      aboutMe:
        'Visual storytelling tailored for YouTube algorithms and human attention spans. I design high-impact thumbnails that maximize click-through rates.',
      publicEmail: 'liam@apexthumbnails.com',
      availability: 'Taking Monthly Creator Retainers',
    },
    skills: [
      { id: 'sk-1', name: 'High-CTR Thumbnail Design', category: 'GFX', experienceLevel: 'Expert', proficiency: 98 },
      { id: 'sk-2', name: 'Adobe Photoshop', category: 'Design', experienceLevel: 'Expert', proficiency: 97 },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'VCT Masters Grand Finals Match Highlights Thumbnail',
        slug: 'vct-masters-highlights',
        description: 'Clutch moment visual composition driving 1.8M YouTube impressions.',
        client: 'Twitch Esports Highlight Hub',
        category: 'GFX',
        workType: 'GFX',
        gfxCategory: 'Thumbnail',
        thumbnail: '/media/hero-lightfield.jpg',
        gallery: ['/media/hero-lightfield.jpg'],
        tools: ['Photoshop'],
        order: 1,
      },
    ],
    views: 1100,
    publishedAt: '2026-09-13T12:00:00Z',
    createdAt: '2026-09-13T12:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
  }),
  createCommunityPortfolio({
    id: 'comm-sophia-logos',
    userId: 'user_sophia_logo_05',
    slug: 'sophia-aegis-branding',
    status: 'PUBLISHED',
    category: 'GFX',
    gfxSubcategory: 'Logo/Banner',
    mediaType: 'image',
    mediaUrl: '/media/cta-field.jpg',
    mediaGallery: [
      '/media/cta-field.jpg',
      '/media/hero-lightfield-portrait.jpg',
      '/media/work-nexus-arena.jpg',
    ],
    title: 'Sophia Kim — Esports Org Crests & Stream Banners',
    description:
      'Brand identity designer crafting iconic vector insignias, stadium perimeter LED ribbons, Twitch headers, and social brand systems for gaming organizations.',
    themeId: 'minimal',
    personalInfo: {
      fullName: 'Sophia Kim',
      professionalName: 'Sophia Kim // Aegis Branding',
      username: 'sophia-aegis-branding',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
      coverImage: '/media/cta-field.jpg',
      location: 'Seoul, South Korea & Remote',
      professionalTitle: 'Esports Brand Identity & Vector Illustrator',
      tagline: 'Iconic vector insignias and stadium banner systems.',
      aboutMe:
        'Crafting timeless esports emblems and arena banners that stand out on jerseys, broadcast screens, and international stage ribbons.',
      publicEmail: 'sophia@aegisbranding.io',
      availability: 'Available for Full Org Rebrands',
    },
    skills: [
      { id: 'sk-1', name: 'Vector Logo Illustration', category: 'Vector', experienceLevel: 'Expert', proficiency: 99 },
      { id: 'sk-2', name: 'Banner & Ribbon Systems', category: 'Environmental', experienceLevel: 'Expert', proficiency: 94 },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'Nexus Arena Brand Crest & Stadium Banners',
        slug: 'nexus-arena-crest',
        description: 'Complete emblem redesign and perimeter banner canvas.',
        client: 'Nexus Gaming League',
        category: 'GFX',
        workType: 'GFX',
        gfxCategory: 'Logo/Banners',
        thumbnail: '/media/cta-field.jpg',
        gallery: ['/media/cta-field.jpg'],
        tools: ['Illustrator', 'Photoshop'],
        order: 1,
      },
    ],
    views: 780,
    publishedAt: '2026-09-14T12:00:00Z',
    createdAt: '2026-09-14T12:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
  }),
  createCommunityPortfolio({
    id: 'comm-kai-vfx',
    userId: 'user_kai_vfx_06',
    slug: 'kai-kinetix-vfx',
    status: 'PUBLISHED',
    category: 'VFX',
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    videoThumbnailUrl: '/media/work-valorant-championship.jpg',
    duration: '01:30',
    mediaGallery: [
      '/media/work-valorant-championship.jpg',
      '/media/work-nexus-arena.jpg',
    ],
    title: 'Kai Takahashi — 3D Motion Graphics & Broadcast VFX',
    description:
      '3D Motion Designer and broadcast VFX specialist delivering stadium opening sequences, Unreal Engine real-time cinematics, and high-energy esports match stingers.',
    themeId: 'cinematic',
    personalInfo: {
      fullName: 'Kai Takahashi',
      professionalName: 'Kai Takahashi // Kinetix VFX',
      username: 'kai-kinetix-vfx',
      profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces',
      coverImage: '/media/work-valorant-championship.jpg',
      location: 'Tokyo, Japan & Worldwide',
      professionalTitle: 'Cinematic 3D Motion Designer',
      tagline: '3D stadium openers and real-time Unreal Engine cinematics.',
      aboutMe:
        'Specializing in dynamic 3D camera sweeps, particle dynamics, and broadcast stinger transitions for high-octane esports stages.',
      publicEmail: 'kai@kinetixvfx.studio',
      availability: 'Available for Motion & 3D Contracts',
    },
    skills: [
      { id: 'sk-1', name: 'Unreal Engine 5', category: '3D', experienceLevel: 'Expert', proficiency: 95 },
      { id: 'sk-2', name: 'Cinema 4D + Octane', category: '3D', experienceLevel: 'Expert', proficiency: 96 },
      { id: 'sk-3', name: 'After Effects', category: 'VFX', experienceLevel: 'Expert', proficiency: 98 },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'VCT Masters 3D Intro Sequence & Arena Holograms',
        slug: 'vct-masters-intro-vfx',
        description: 'Complete 3D cinematic opening sequence rendered in Unreal Engine 5.',
        client: 'Esports Broadcast Productions',
        category: 'VFX',
        workType: 'VFX',
        thumbnail: '/media/work-valorant-championship.jpg',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        tools: ['Unreal Engine 5', 'Cinema 4D', 'After Effects'],
        order: 1,
      },
    ],
    views: 1650,
    publishedAt: '2026-09-15T12:00:00Z',
    createdAt: '2026-09-15T12:00:00Z',
    updatedAt: '2026-09-15T12:00:00Z',
  }),
];
