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
import { FAQ } from '@/components/FAQ';
import { CallToAction } from '@/components/CallToAction';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#030712] text-[#F8FAFC]">
      <Navbar />
      <main id="main" className="flex-1 flex flex-col">
        <Hero />
        <Ticker />
        <IntroStatement />
        <TrustedClients />
        <ScrollStory />
        <Services />
        <Work />
        <Studio />
        <Process />
        <Stats />
        <Testimonial />
        <FAQ />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
