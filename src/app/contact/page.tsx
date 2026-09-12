'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Contact } from '@/components/Contact';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-midnight text-cream">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Get In Touch</span>
          </motion.div>
        </div>
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
