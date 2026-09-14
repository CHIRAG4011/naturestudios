import {
  Clapperboard,
  Compass,
  MonitorPlay,
  Radio,
  Shapes,
  Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Accent = 'green' | 'orange' | 'burgundy' | 'beige';

export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Studio', href: '/studio' },
  { label: 'About', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
];

export interface Service {
  id: string;
  index: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const SERVICES: readonly Service[] = [
  {
    id: 'esports-production',
    index: '01',
    title: 'Esports Production',
    description: 'Tier-1 tournament stadium staging, arena operations, real-time match servers, and championship broadcasts.',
    icon: Radio,
  },
  {
    id: 'brand-identity',
    index: '02',
    title: 'Brand & Identity',
    description: 'Visual identities, competitive esports club logos, dynamic kinetic typography, and multi-platform design systems.',
    icon: Shapes,
  },
  {
    id: 'content-studio',
    index: '03',
    title: 'Content Studio',
    description: 'Hyper-kinetic trailers, tournament teasers, documentary series, and 3D narrative worldbuilding.',
    icon: Clapperboard,
  },
  {
    id: 'digital-experiences',
    index: '04',
    title: 'Digital Experiences',
    description: 'Interactive portfolio platforms, WebGL tournament hubs, match score trackers, and custom esports web apps.',
    icon: MonitorPlay,
  },
  {
    id: 'tournaments',
    index: '05',
    title: 'Tournaments',
    description: 'Physical stage architecture fused with generative lighting and responsive ambient LED stadium screens.',
    icon: Trophy,
  },
  {
    id: 'creative-direction',
    index: '06',
    title: 'Creative Direction',
    description: 'Holistic narrative concepting, IP strategy, and executive production for competitive gaming titles.',
    icon: Compass,
  },
  {
    id: 'broadcast-design',
    index: '07',
    title: 'Broadcast Design',
    description: 'Live match HUDs, in-game graphic overlays, dynamic lower-thirds, and real-time statistics packages.',
    icon: Radio,
  },
  {
    id: 'motion-design',
    index: '08',
    title: 'Motion Design',
    description: 'Fluid 3D character motion, glitch particle simulations, Title Sequences, and animated arena toolkits.',
    icon: Shapes,
  },
] as const;

export interface Project {
  id: string;
  slug: string;
  number: string;
  title: string;
  description: string;
  category: 'BRANDING' | 'ESPORTS' | 'DIGITAL' | 'CONTENT' | 'PRODUCTION';
  tags: string[];
  year: string;
  client?: string;
  image: string;
  challenge?: string;
  strategy?: string;
  creativeDirection?: string;
  results?: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'valorant-championship',
    slug: 'valorant-championship',
    number: '01',
    title: 'VALORANT CHAMPIONSHIP',
    description: 'Arena broadcast identity, 3D motion graphics package, and live stage visual system for world finals.',
    category: 'ESPORTS',
    tags: ['ESPORTS', 'BRANDING', 'MOTION'],
    year: '2025',
    client: 'Riot Games / Champions Tour (Sample Concept)',
    image: '/media/work-valorant-championship.jpg',
    challenge: 'Unify stadium lighting, spectator HUDs, and real-time kill tracking across 12 simultaneous language broadcasts.',
    strategy: 'Build an organic-digital design language centered around burgundy atmospheric depth and warm beige radiant energy.',
    creativeDirection: 'Kinetic geometry meeting high-contrast arena lighting.',
    results: 'Broadcast package delivered across 4 stadium screens with zero latency.',
  },
  {
    id: 'nexus-arena',
    slug: 'nexus-arena',
    number: '02',
    title: 'NEXUS ARENA',
    description: 'Organic-synthetic physical arena architecture with responsive plant-reactive ambient lighting.',
    category: 'PRODUCTION',
    tags: ['PRODUCTION', 'ESPORTS', 'STAGE'],
    year: '2025',
    client: 'NatureStudios Botanical Lab',
    image: '/media/work-nexus-arena.jpg',
    challenge: 'Engineer a physical stadium stage featuring living botanical walls integrated with real-time tournament telemetry.',
    strategy: 'Pair biological micro-sensors with DMX stage lighting to pulse stadium colors according to team victory momentum.',
    creativeDirection: 'The living arena: nature reclaiming competitive technology.',
    results: 'Award-winning experimental stage design showcased to 40,000 live attendees.',
  },
  {
    id: 'level-up',
    slug: 'level-up',
    number: '03',
    title: 'LEVEL UP',
    description: 'High-octane commercial campaign, 3D world assets, and omnichannel social design kit.',
    category: 'CONTENT',
    tags: ['CONTENT', 'BRANDING', '3D WORLD'],
    year: '2024',
    client: 'Level Up Entertainment',
    image: '/media/work-level-up.jpg',
    challenge: 'Produce a 90-second hype trailer highlighting competitive instinct and raw player discipline.',
    strategy: 'Cinematic 3D render pipelines combining Unreal Engine 5 with octane lighting.',
    creativeDirection: 'Futuristic speed, dark burgundy atmosphere, and warm lens flares.',
    results: 'Over 10M organic views across social channels within 48 hours.',
  },
  {
    id: 'after-dark',
    slug: 'after-dark',
    number: '04',
    title: 'AFTER DARK',
    description: 'Nocturnal tournament brand system, custom trophy fabrication, and cinematic hero teaser.',
    category: 'BRANDING',
    tags: ['BRANDING', 'ESPORTS', 'FABRICATION'],
    year: '2024',
    client: 'After Dark Series',
    image: '/media/work-after-dark.jpg',
    challenge: 'Establish an elusive, prestige midnight esports brand identity for an invitation-only championship.',
    strategy: 'Dark wine shadows, deep red live indicators, and sculpted obsidian-finish tournament trophies.',
    creativeDirection: 'Underground nocturnal tournament culture.',
    results: 'Entire invitational sold out within 8 minutes of announcement.',
  },
  {
    id: 'game-shift',
    slug: 'game-shift',
    number: '05',
    title: 'GAME//SHIFT',
    description: 'Next-generation esports interactive portal, live match prediction engine, and creator hub.',
    category: 'DIGITAL',
    tags: ['DIGITAL', 'WEBGL', 'PLATFORM'],
    year: '2024',
    client: 'Shift Media',
    image: '/media/hero-lightfield.jpg',
    challenge: 'Develop a high-performance, real-time web platform capable of handling 250k concurrent spectators.',
    strategy: 'Next.js App Router with edge caching, WebSockets telemetry, and 256-bit encrypted authentication.',
    creativeDirection: 'Sleek dark burgundy dashboard with warm beige typography.',
    results: 'Sub-second page transitions and seamless multi-device responsiveness.',
  },
  {
    id: 'origin',
    slug: 'origin',
    number: '06',
    title: 'ORIGIN',
    description: 'Documentary series examining the grassroots rise of competitive gaming champions.',
    category: 'CONTENT',
    tags: ['CONTENT', 'DOCUMENTARY', 'FILM'],
    year: '2023',
    client: 'Global Esports Alliance',
    image: '/media/studio-plate.jpg',
    challenge: 'Capture raw, vulnerable human stories behind the relentless drive to compete on the world stage.',
    strategy: 'Editorial cinematography, warm natural lighting, and intimate documentary filmmaking.',
    creativeDirection: 'Organic realism meeting competitive fire.',
    results: 'Screened at major digital festivals and praised for artistic integrity.',
  },
] as const;

export const STATS = [
  { value: 48, suffix: '+', pad: 0, label: 'Projects Delivered' },
  { value: 12, suffix: '', pad: 2, label: 'Global Esports Arenas' },
  { value: 25, suffix: 'M+', pad: 0, label: 'Audience Reach' },
  { value: 8, suffix: '', pad: 2, label: 'Years of Excellence' },
] as const;

export const TICKER_ITEMS = [
  'Cinematic Broadcast',
  'Arena Architecture',
  'User Portfolio Subdomains',
  'Organic Worldbuilding',
  'Motion Systems',
  'Tournament Identity',
  'Esports Innovation',
] as const;
