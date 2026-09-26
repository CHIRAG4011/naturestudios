import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Load .env
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

loadEnv();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('No MONGODB_URI found in .env');
  process.exit(1);
}

const infinixItems = [
  // GFX - Tournament: Key Visuals & Posters
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
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // GFX - Tournament: Broadcast HUD & Stream Pack
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
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // GFX - Tournament: Social Story Decks
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
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // GFX - Thumbnail: Group Stage Match Thumbnails
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
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // GFX - Logo/Banners: Brand Assets & Badging System
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
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // VFX - Showreel: Teaser Trailer
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
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // VFX - Broadcast: Caster Desk Dynamic Motion
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
    order: 2,
    status: 'PUBLISHED',
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // VFX - Broadcast: Animated L-Band Ribbon & HUD
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
    order: 3,
    status: 'PUBLISHED',
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },

  // VFX - Cinematics: 144Hz Match Transition Stinger
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
    featured: false,
    order: 4,
    status: 'PUBLISHED',
    portfolioSource: 'studio',
    createdAt: '2026-09-26T00:00:00Z',
    updatedAt: '2026-09-26T00:00:00Z',
  },
];

async function seed() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });

  try {
    await client.connect();
    const db = client.db();
    const col = db.collection('studio_portfolio_items');

    console.log(`Connected to DB "${db.databaseName}". Seeding ${infinixItems.length} Infinix items...`);

    for (const item of infinixItems) {
      const res = await col.updateOne(
        { id: item.id },
        { $set: item },
        { upsert: true }
      );
      console.log(`- Upserted [${item.id}]: matched=${res.matchedCount}, upserted=${res.upsertedCount}`);
    }

    const totalCount = await col.countDocuments({ portfolioSource: 'studio' });
    console.log(`\n✅ Seeding complete! Total studio items in MongoDB: ${totalCount}`);
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();
