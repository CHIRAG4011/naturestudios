'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { IntroStatement } from '@/components/IntroStatement';
import { TrustedClients } from '@/components/TrustedClients';
import { ScrollStory } from '@/components/ScrollStory';
import { Services } from '@/components/Services';
import { Work } from '@/components/Work';
import { Studio } from '@/components/Studio';
import { Process } from '@/components/Process';
import { Stats } from '@/components/Stats';
import { Testimonial } from '@/components/Testimonial';
import { Ticker } from '@/components/Ticker';
import { CallToAction } from '@/components/CallToAction';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED]">
      <Navbar />
      <main id="main" className="flex-1">
        {/* 1. Cinematic Hero */}
        <Hero />

        {/* Dynamic Kinetic Ticker */}
        <Ticker />

        {/* 2. Intro Statement */}
        <IntroStatement />

        {/* 3. Trusted By */}
        <TrustedClients />

        {/* 4. Pinned Storytelling Scene */}
        <ScrollStory />

        {/* 5. Services */}
        <Services />

        {/* 6. Featured Work (Cinematic Reel) */}
        <Work />

        {/* 7. Studio Philosophy */}
        <Studio />

        {/* 8. Process */}
        <Process />

        {/* 9. Statistics */}
        <Stats />

        {/* 10. Testimonial */}
        <Testimonial />

        {/* 11. Final CTA */}
        <CallToAction />
      </main>
      {/* 12. Footer */}
      <Footer />
    </div>
  );
}
