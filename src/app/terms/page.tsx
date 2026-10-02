import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';
import { FileText, Shield, Scale, Mail } from 'lucide-react';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Use',
  description:
    'Nature Studios Terms of Use: platform terms, intellectual property, client engagements, acceptable use, and third-party advertising policies.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-[#3D0D13] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
              <Scale className="w-3.5 h-3.5" /> Terms &amp; Conditions
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
              Terms of Use
            </h1>
            <p className="text-sm font-mono text-[#B89B8D]">
              Last Updated: October 2, 2026 &bull; Published by Nature Studios
            </p>
            <p className="text-base text-[#E8C5A5] leading-relaxed max-w-3xl font-light">
              Welcome to Nature Studios (&ldquo;NatureStudios&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By accessing or using our website at{' '}
              <a href="https://naturestudio.in" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                https://naturestudio.in
              </a>
              , our client portal, or any associated digital services, you agree to be bound by these Terms of Use and all applicable laws and regulations.
            </p>
          </div>

          <div className="space-y-10 text-sm text-[#E8C5A5] leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  01
                </span>
                Acceptance of Terms
              </h2>
              <p>
                By accessing this website, you are agreeing to be bound by these website Terms of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  02
                </span>
                Intellectual Property &amp; License
              </h2>
              <p>
                The materials, brand marks, 3D assets, animations, software code, and visual identities produced by Nature Studios are protected by applicable copyright, trademark, and intellectual property law.
              </p>
              <p>
                Permission is granted to temporarily view the materials on Nature Studios&apos;s website for personal, non-commercial transitory viewing only. Under this license you may not:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#B89B8D]">
                <li>Modify or copy the materials without prior express written consent</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial) without license</li>
                <li>Attempt to decompile or reverse engineer any software contained on Nature Studios&apos;s website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or &ldquo;mirror&rdquo; the materials on any other server</li>
              </ul>
            </section>

            {/* Section 3 - Third Party Services & Ads */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#240709] border border-[#FED7B8]/30 shadow-glow-burgundy">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
                <Shield className="w-4 h-4" /> Advertising Compliance
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                03. Third-Party Services &amp; Google AdSense
              </h2>
              <p>
                Our website utilizes third-party technologies and services, including Google AdSense, to serve relevant advertisements to users. By using the site, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#B89B8D]">
                <li>Third-party advertisers may display advertisements based on automated algorithms and cookie data.</li>
                <li>Nature Studios does not control the content of third-party advertisements and is not responsible for any transactions or interactions between you and third-party advertisers.</li>
                <li>You may review and manage your advertising preferences as described in our{' '}
                  <Link href="/privacy" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link href="/cookies" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                    Cookie Policy
                  </Link>.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  04
                </span>
                Client Workspace &amp; Portfolios
              </h2>
              <p>
                Users registering for client workspaces or community portfolio profiles agree to provide truthful, accurate, and current information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p>
                You agree not to upload, transmit, or distribute any content that infringes upon third-party intellectual property rights, contains malicious code, or violates any applicable laws.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  05
                </span>
                Limitation of Liability
              </h2>
              <p>
                In no event shall Nature Studios or its directors, employees, or partners be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Nature Studios&apos;s website.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  06
                </span>
                Governing Law &amp; Jurisdiction
              </h2>
              <p>
                Any claim relating to Nature Studios&apos;s website shall be governed by the laws of India without regard to its conflict of law provisions, with non-exclusive jurisdiction in the courts of India, while respecting international consumer protection treaties applicable to overseas clients.
              </p>
            </section>

            {/* Section 7 - Contact */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#1C0507] border border-[#52141A]">
              <h2 className="text-xl font-black uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-[#FED7B8]" />
                07. Contact Information
              </h2>
              <p>
                If you have any questions or concerns regarding these Terms of Use, please contact us at:
              </p>
              <div className="p-4 rounded-xl bg-[#240709] border border-[#3D0D13] font-mono text-xs text-[#FED7B8] space-y-1">
                <div>Email: <a href="mailto:naturestudio05@gmail.com" className="underline hover:text-[#FFF5ED]">naturestudio05@gmail.com</a></div>
                <div>WhatsApp: <a href="https://wa.me/917480066539" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">+91 7480 066 539</a></div>
                <div>Website: <a href="https://naturestudio.in" className="underline hover:text-[#FFF5ED]">https://naturestudio.in</a></div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
