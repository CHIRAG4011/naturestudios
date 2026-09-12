import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NatureStudios development database seed...');

  // Create or update demo client user for testing
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('NatureStudios2026!', salt);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@naturestudios.art' },
    update: {},
    create: {
      email: 'demo@naturestudios.art',
      name: 'Vanguard Esports',
      passwordHash,
      emailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    },
  });

  console.log(`👤 Demo user created: ${demoUser.email} (Password: NatureStudios2026!)`);

  // Create or update verified production administrator
  const adminPasswordHash = await bcrypt.hash('Password123!', salt);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@naturestudio.in' },
    update: {
      emailVerified: true,
      passwordHash: adminPasswordHash,
    },
    create: {
      email: 'admin@naturestudio.in',
      name: 'NatureStudios Director',
      passwordHash: adminPasswordHash,
      emailVerified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
  });

  console.log(`👑 Admin user verified: ${adminUser.email} (Password: Password123!)`);

  // Clean existing demo data for clean idempotent runs
  await prisma.notification.deleteMany({ where: { userId: demoUser.id } });
  await prisma.projectRequest.deleteMany({ where: { userId: demoUser.id } });
  await prisma.project.deleteMany({ where: { userId: demoUser.id } });

  // Seed demo projects
  const p1 = await prisma.project.create({
    data: {
      userId: demoUser.id,
      title: 'Global Arena Championship Stage 2026',
      description: 'Full tournament broadcast package, ambient LED stage visuals, and dynamic match HUD integration.',
      projectType: 'Esports & Live Broadcast',
      budget: '$45,000 - $60,000',
      timeline: '8 Weeks',
      status: 'IN_PRODUCTION',
      messages: {
        create: [
          {
            senderId: demoUser.id,
            message: 'Hello team! We have uploaded the updated roster assets and stage dimension CAD files.',
          },
          {
            senderId: demoUser.id,
            message: 'Looking forward to the first kinetic typography animatic review this Friday.',
          },
        ],
      },
    },
  });

  const p2 = await prisma.project.create({
    data: {
      userId: demoUser.id,
      title: 'Botanical Cyber Brand Identity & Jersey Kit',
      description: 'Rebranding visual system fusing organic foliage patterns with sharp competitive esports motifs.',
      projectType: 'Brand & Visual Systems',
      budget: '$25,000',
      timeline: '4 Weeks',
      status: 'REVIEWING',
      messages: {
        create: [
          {
            senderId: demoUser.id,
            message: 'Color palette review looks stunning. The emerald and amber gradient balance is exactly right.',
          },
        ],
      },
    },
  });

  const p3 = await prisma.project.create({
    data: {
      userId: demoUser.id,
      title: 'Season Reveal Cinematic Trailer',
      description: '60-second hyper-kinetic 3D teaser for the upcoming international league launch.',
      projectType: 'Cinematic Content Studio',
      budget: '$35,000',
      timeline: '6 Weeks',
      status: 'RECEIVED',
    },
  });

  console.log(`🎬 Created 3 demo projects: ${p1.id}, ${p2.id}, ${p3.id}`);

  // Seed demo project requests
  await prisma.projectRequest.create({
    data: {
      userId: demoUser.id,
      name: 'Marcus Vance',
      email: 'demo@naturestudios.art',
      company: 'Vanguard Gaming Organization',
      projectType: 'Interactive Web Platforms',
      budget: '$30,000',
      timeline: 'Q3 2026',
      message: 'We are seeking to build a high-performance WebGL community hub for our championship team.',
      status: 'REVIEWING',
    },
  });

  // Seed demo notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: demoUser.id,
        type: 'status_change',
        title: 'Project Moved to In Production',
        message: 'Global Arena Championship Stage 2026 has officially entered active production.',
        read: false,
      },
      {
        userId: demoUser.id,
        type: 'new_message',
        title: 'Studio Message',
        message: 'Lead Motion Designer uploaded 2 new draft frames for your review.',
        read: false,
      },
      {
        userId: demoUser.id,
        type: 'email_verified',
        title: 'Identity Verified',
        message: 'Your NatureStudios client account email has been verified.',
        read: true,
      },
    ],
  });

  console.log('✅ NatureStudios development database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
