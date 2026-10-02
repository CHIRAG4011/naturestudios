import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';
import { Cookie, ShieldAlert, Sliders, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = pageMetadata({
  title: 'Cookie Policy',
  description:
    'Nature Studios Cookie Policy: how we use cookies, web beacons, Google AdSense tracking, and how you can manage or opt-out of cookies.',
  path: '/cookies',
});

const COOKIE_TYPES = [
  {
    category: 'Essential / Strictly Necessary',
    purpose: 'Crucial for website security, user authentication, session integrity, and fraud prevention. The platform cannot function properly without these cookies.',
    examples: 'session_token, auth_state, csrf_protection, naturestudios_cookie_consent',
    canDisable: 'Required for core operation',
  },
  {
    category: 'Advertising & Marketing (Google AdSense)',
    purpose: 'Used by third-party advertising networks (including Google AdSense) to deliver relevant advertisements tailored to your interests and measure campaign performance.',
    examples: '__gads, __gpi, IDE, DSID, test_cookie',
    canDisable: 'Configurable via Ads Settings & Consent Banner',
  },
  {
    category: 'Analytics & Performance',
    purpose: 'Allows us to measure visitors, source traffic, page loading speeds, and overall technical performance so we can optimize our creative showcase.',
    examples: '_ga, _gid, _gat, vercel_speed_insights',
    canDisable: 'Optional',
  },
  {
    category: 'Preferences & Functionality',
    purpose: 'Remember your settings, preferences (e.g., custom cursor settings, audio controls, visual filters), and past interactions.',
    examples: 'ns_theme_preference, ns_audio_state, ns_cursor_mode',
    canDisable: 'Optional',
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-[#3D0D13] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
              <Cookie className="w-3.5 h-3.5" /> Cookie Management &amp; Consent
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
              Cookie Policy
            </h1>
            <p className="text-sm font-mono text-[#B89B8D]">
              Last Updated: October 2, 2026 &bull; Compliant with Google AdSense EU &amp; US Policies
            </p>
            <p className="text-base text-[#E8C5A5] leading-relaxed max-w-3xl font-light">
              This Cookie Policy explains how Nature Studios (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) uses cookies and similar technologies when you visit our website at{' '}
              <a href="https://naturestudio.in" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                https://naturestudio.in
              </a>
              . It explains what these technologies are, why we use them, and your rights to control our use of them.
            </p>
          </div>

          <div className="space-y-10 text-sm text-[#E8C5A5] leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  01
                </span>
                What Are Cookies?
              </h2>
              <p>
                Cookies are small data files placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work efficiently, as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case, Nature Studios) are called &ldquo;first-party cookies&rdquo;. Cookies set by parties other than the website owner are called &ldquo;third-party cookies&rdquo;. Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., interactive content, analytics, and advertising via Google AdSense).
              </p>
            </section>

            {/* Section 2 - Table of Cookies */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  02
                </span>
                Categories of Cookies We Use
              </h2>
              <div className="grid grid-cols-1 gap-4 pt-2">
                {COOKIE_TYPES.map((cookie) => (
                  <div
                    key={cookie.category}
                    className="p-5 rounded-xl bg-[#240709] border border-[#52141A] space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="font-bold text-[#FFF5ED] text-base">{cookie.category}</h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#150304] text-[#FED7B8] border border-[#3D0D13] w-fit">
                        {cookie.canDisable}
                      </span>
                    </div>
                    <p className="text-xs text-[#B89B8D] leading-relaxed">{cookie.purpose}</p>
                    <div className="text-[11px] font-mono text-[#E8C5A5]">
                      <span className="text-[#FED7B8]">Common Cookies: </span>
                      {cookie.examples}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 - Google AdSense Deep-Dive */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#240709] border border-[#FED7B8]/30 shadow-glow-burgundy">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
                <Cookie className="w-4 h-4" /> Advertising Integration
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                03. Google AdSense &amp; Advertising Cookies
              </h2>
              <p>
                We use Google AdSense to serve advertisements when you visit our website. Google and its affiliated ad network partners use cookies to serve ads based on your prior visits to Nature Studios or other websites on the internet.
              </p>
              <div className="space-y-3 pt-2 border-t border-[#52141A]">
                <h3 className="text-base font-bold text-[#FFF5ED]">How Google Uses Cookies in Ad Serving</h3>
                <ul className="list-disc pl-5 space-y-2 text-[#B89B8D]">
                  <li>
                    <strong className="text-[#FFF5ED]">DoubleClick DART Cookie:</strong> Enables Google and its partners to serve ads based on your visit to our site and/or other sites across the Internet.
                  </li>
                  <li>
                    <strong className="text-[#FFF5ED]">Frequency Capping:</strong> Ensures that you do not see the same advertisement repeatedly.
                  </li>
                  <li>
                    <strong className="text-[#FFF5ED]">Reporting &amp; Fraud Detection:</strong> Combats invalid clicks, bot traffic, and fraudulent activity.
                  </li>
                </ul>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#52141A]">
                <h3 className="text-base font-bold text-[#FFF5ED]">How to Opt Out of Personalized Advertising</h3>
                <p>
                  You can opt out of personalized advertising at any time by visiting Google&apos;s Ads Settings:
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#59171B] border border-[#FED7B8]/40 text-xs font-mono text-[#FED7B8] hover:bg-[#7B1F25] transition-all"
                  >
                    <span>Google Ads Settings</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C0507] border border-[#52141A] text-xs font-mono text-[#FFF5ED] hover:border-[#FED7B8] transition-all"
                  >
                    <span>Digital Advertising Alliance (DAA)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.youronlinechoices.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C0507] border border-[#52141A] text-xs font-mono text-[#FFF5ED] hover:border-[#FED7B8] transition-all"
                  >
                    <span>Your Online Choices (EU/EEA)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </section>

            {/* Section 4 - Browser Controls */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  04
                </span>
                How Can I Control Cookies in My Browser?
              </h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website, though your access to some functionality and areas of our website may be restricted.
              </p>
              <p>
                As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser&apos;s help menu for more information. Guidance for common browsers:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#240709] border border-[#3D0D13] hover:border-[#FED7B8]/40 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-mono text-[#FFF5ED] group-hover:text-[#FED7B8]">Google Chrome</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B89B8D] group-hover:text-[#FED7B8]" />
                </a>
                <a
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#240709] border border-[#3D0D13] hover:border-[#FED7B8]/40 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-mono text-[#FFF5ED] group-hover:text-[#FED7B8]">Mozilla Firefox</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B89B8D] group-hover:text-[#FED7B8]" />
                </a>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#240709] border border-[#3D0D13] hover:border-[#FED7B8]/40 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-mono text-[#FFF5ED] group-hover:text-[#FED7B8]">Apple Safari</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B89B8D] group-hover:text-[#FED7B8]" />
                </a>
                <a
                  href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-[#240709] border border-[#3D0D13] hover:border-[#FED7B8]/40 transition-all flex items-center justify-between group"
                >
                  <span className="text-xs font-mono text-[#FFF5ED] group-hover:text-[#FED7B8]">Microsoft Edge</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#B89B8D] group-hover:text-[#FED7B8]" />
                </a>
              </div>
            </section>

            {/* Section 5 - Updates and Contact */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#1C0507] border border-[#52141A]">
              <h2 className="text-xl font-black uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-[#FED7B8]" />
                05. Questions About This Cookie Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
              <p>
                If you have questions about our use of cookies or other technologies, please email us at{' '}
                <a href="mailto:naturestudio05@gmail.com" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                  naturestudio05@gmail.com
                </a>{' '}
                or visit our{' '}
                <Link href="/privacy" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                  Privacy Policy
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
