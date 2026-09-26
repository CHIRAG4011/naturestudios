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
  accentColor: '#2563EB',
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
    images: ['/media/work-creator-clipping.jpg', '/media/infinix/gfx/broadcast/reel-overlay.png'],
    videoUrl: '/media/infinix/vfx/broadcast-motion-comp24.mp4',
    duration: '01:15',
    tags: ['Clipping', 'Elvish Yadav', 'Scout', 'Kashvi', 'Shorts', 'Highlights', 'Viral Reels', 'Motion Subtitles'],
    featured: true,
    order: 1,
    status: 'PUBLISHED',
    createdAt: '2026-09-24T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
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

export const DEFAULT_COMMUNITY_PORTFOLIO_ITEMS: PortfolioData[] = [];

