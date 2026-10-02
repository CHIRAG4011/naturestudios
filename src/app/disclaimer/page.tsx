import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';
import { AlertCircle, ExternalLink, ShieldCheck, Mail } from 'lucide-react';

export const metadata: Metadata = pageMetadata({
  title: 'Disclaimer',
  description:
    'Nature Studios Website & Advertising Disclaimer: general information, external links, third-party advertising disclosures, and service limitations.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-[#3D0D13] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
              <AlertCircle className="w-3.5 h-3.5" /> Legal Notice &amp; Disclosures
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
              Disclaimer
            </h1>
            <p className="text-sm font-mono text-[#B89B8D]">
              Last Updated: October 2, 2026 &bull; Published by Nature Studios
            </p>
            <p className="text-base text-[#E8C5A5] leading-relaxed max-w-3xl font-light">
              The information provided by Nature Studios (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) on{' '}
              <a href="https://naturestudio.in" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                https://naturestudio.in
              </a>{' '}
              is for general informational and creative portfolio presentation purposes only. All information on the Site is provided in good faith.
            </p>
          </div>

          <div className="space-y-10 text-sm text-[#E8C5A5] leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  01
                </span>
                General Website Disclaimer
              </h2>
              <p>
                Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
              </p>
            </section>

            {/* Section 2 - Third Party Ads (AdSense) */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#240709] border border-[#FED7B8]/30 shadow-glow-burgundy">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
                <ShieldCheck className="w-4 h-4" /> Advertising Disclosure
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                02. Advertising &amp; Third-Party Sponsors (Google AdSense)
              </h2>
              <p>
                This Site may contain advertisements, sponsored links, and promotions served automatically by third-party advertising networks, primarily{' '}
                <strong className="text-[#FFF5ED]">Google AdSense</strong>.
              </p>
              <p>
                Nature Studios does not endorse, guarantee, or make any representations regarding the accuracy, validity, reliability, or safety of any products, services, or claims advertised in these third-party promotional units. The appearance of advertisements on Nature Studios does not constitute an endorsement by Nature Studios.
              </p>
              <p>
                For information on how Google AdSense selects and personalizes advertisements, please read our{' '}
                <Link href="/privacy" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/cookies" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            {/* Section 3 - External Links */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  03
                </span>
                External Links Disclaimer
              </h2>
              <p>
                The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties (e.g., Discord community servers, WhatsApp channels, Instagram profiles, YouTube channels, client properties, or external portfolio assets). Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
              </p>
            </section>

            {/* Section 4 - Portfolio and Intellectual Property */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  04
                </span>
                Portfolio &amp; Client Trademarks
              </h2>
              <p>
                All project case studies, broadcast screenshots, tournament titles, and brand marks displayed on Nature Studios are the property of their respective copyright and trademark owners. They are showcased herein strictly for professional demonstration and case-study illustrative purposes under fair dealing principles.
              </p>
            </section>

            {/* Section 5 - Contact */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#1C0507] border border-[#52141A]">
              <h2 className="text-xl font-black uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-[#FED7B8]" />
                05. Questions &amp; Inquiries
              </h2>
              <p>
                Should you require any more information or have any questions about our site&apos;s disclaimer, please feel free to contact us by email at{' '}
                <a href="mailto:naturestudio05@gmail.com" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                  naturestudio05@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
