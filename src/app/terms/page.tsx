import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';

// The root layout applies a `%s — NatureStudios` template, so the title here
// must NOT repeat the site name or it renders twice.
export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use',
  description:
    'The terms that govern use of the NatureStudios website, client workspace, and any material published on them.',
  path: '/terms',
});

export default function TermsPage() {
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
              Terms of Use
            </h1>
            <p className="text-sm text-cream-muted font-mono">Last updated: January 2025</p>
          </div>

          <div className="space-y-8 text-sm text-cream-dim leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the NatureStudios platform, you agree to be bound by these
                Terms of Use. If you do not agree, please discontinue use of our services
                immediately. These terms apply to all visitors, users, and clients.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">2. Use of the Platform</h2>
              <p>
                The NatureStudios client portal is provided for the purpose of project management,
                collaboration, and communication between NatureStudios and its clients. You may not
                use the platform for any unlawful purpose or in a way that infringes the rights of others.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activity that occurs under your account. Notify us immediately of any
                unauthorized access.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">3. Intellectual Property</h2>
              <p>
                All creative work, design assets, motion graphics, and visual systems produced by
                NatureStudios remain the property of NatureStudios until full payment is received
                per the terms of the applicable project agreement. Upon final payment, ownership
                transfers as specified in that agreement.
              </p>
              <p>
                The NatureStudios brand, name, logo, and website content are proprietary and may
                not be reproduced without express written consent.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">4. Project Agreements</h2>
              <p>
                Specific terms governing project deliverables, timelines, revisions, and payment
                are governed by the individual project agreement signed between NatureStudios
                and the client. In the event of conflict between these terms and a project agreement,
                the project agreement takes precedence.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">5. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, NatureStudios shall not be liable
                for any indirect, incidental, or consequential damages arising from your use of
                the platform. Our total liability for any claim arising out of these terms shall
                not exceed the amount you paid us in the preceding 12 months.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">6. Governing Law</h2>
              <p>
                These terms are governed by the laws of England and Wales. Any disputes shall be
                subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-bold uppercase text-cream">7. Contact</h2>
              <p>
                For questions regarding these terms, contact us at{' '}
                <a href="mailto:legal@naturestudios.art" className="text-forest-light hover:text-forest-bright transition-colors duration-150 underline underline-offset-2">
                  legal@naturestudios.art
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
