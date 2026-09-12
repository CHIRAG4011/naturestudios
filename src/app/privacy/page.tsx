import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';

// The root layout applies a `%s — NatureStudios` template, so the title here
// must NOT repeat the site name or it renders twice.
export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How NatureStudios collects, uses, stores, and deletes personal information for visitors and client-workspace accounts.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-midnight text-cream">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 space-y-10">
          <div className="space-y-3">
            <span className="text-label font-mono tracking-[0.2em] uppercase text-forest-light">
              Legal
            </span>
            <h1 className="text-display-sm font-black uppercase tracking-tight leading-[0.92] text-cream">
              Privacy Policy
            </h1>
            <p className="text-sm text-cream-muted font-mono">Last updated: January 2025</p>
          </div>

          <div className="space-y-8 text-sm text-cream-dim leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account,
                submit a project inquiry, or communicate with our team. This includes your name, email
                address, company name, and project details.
              </p>
              <p>
                We also automatically collect certain information when you use our services, including
                log data, device information, and usage patterns, which we use solely to improve our
                platform and service quality.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services,
                to process your project inquiries and manage client relationships, and to send you
                technical notices and support messages.
              </p>
              <p>
                We will never sell your personal information to third parties, and we do not use
                your data for advertising purposes.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">3. Information Sharing</h2>
              <p>
                We may share your information with trusted service providers who assist us in
                operating our platform (such as email delivery and cloud infrastructure), but only
                under strict confidentiality agreements and solely for the purposes described in
                this policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information,
                including encrypted connections (HTTPS), secure password hashing, and HTTP-only
                session cookies. However, no method of transmission over the internet is 100%
                secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">5. Your Rights</h2>
              <p>
                You may access, update, or delete your account information at any time through
                your client dashboard. To request complete data deletion or exercise any other
                rights under applicable data protection law, please contact us directly.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">6. Contact</h2>
              <p>
                For privacy-related questions or requests, please reach out to us at{' '}
                <a href="mailto:privacy@naturestudios.art" className="text-forest-light hover:text-forest-bright transition-colors duration-150 underline underline-offset-2">
                  privacy@naturestudios.art
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
