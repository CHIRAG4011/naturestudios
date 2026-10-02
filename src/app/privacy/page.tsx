import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';
import { ShieldCheck, Lock, Cookie, FileText, Globe, Mail } from 'lucide-react';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'Nature Studios Privacy Policy: comprehensive disclosure on data collection, Google AdSense cookies, DART cookies, user privacy rights (GDPR & CCPA), and security practices.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#150304] text-[#FFF5ED] selection:bg-[#59171B] selection:text-[#FED7B8]">
      <Navbar />

      <main id="main" className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-[#3D0D13] pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D0A0E] border border-[#52141A] text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
              <ShieldCheck className="w-3.5 h-3.5" /> Transparency &amp; Compliance
            </div>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-gradient-warm leading-[0.95]">
              Privacy Policy
            </h1>
            <p className="text-sm font-mono text-[#B89B8D]">
              Effective Date: January 1, 2025 &bull; Last Updated: October 2, 2026
            </p>
            <p className="text-base text-[#E8C5A5] leading-relaxed max-w-3xl font-light">
              At Nature Studios (&ldquo;NatureStudios&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), accessible from{' '}
              <a href="https://naturestudio.in" className="text-[#FED7B8] underline underline-offset-4 hover:text-[#FFF5ED]">
                https://naturestudio.in
              </a>
              , one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Nature Studios and how we use it, including our integration with Google AdSense and third-party advertising networks.
            </p>
          </div>

          {/* Table of Contents / Key Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#1C0507] border border-[#52141A] space-y-1.5">
              <div className="flex items-center gap-2 text-[#FED7B8] text-xs font-mono font-bold uppercase">
                <Lock className="w-3.5 h-3.5" /> 1. Data Protection
              </div>
              <p className="text-xs text-[#B89B8D] leading-relaxed">
                Industry-grade SSL encryption and secure processing for all portfolio and client interactions.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#1C0507] border border-[#52141A] space-y-1.5">
              <div className="flex items-center gap-2 text-[#FED7B8] text-xs font-mono font-bold uppercase">
                <Cookie className="w-3.5 h-3.5" /> 2. Google AdSense &amp; Cookies
              </div>
              <p className="text-xs text-[#B89B8D] leading-relaxed">
                Full disclosure of DoubleClick DART cookies, third-party advertising, and personalized ad opt-outs.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#1C0507] border border-[#52141A] space-y-1.5">
              <div className="flex items-center gap-2 text-[#FED7B8] text-xs font-mono font-bold uppercase">
                <Globe className="w-3.5 h-3.5" /> 3. GDPR &amp; CCPA Rights
              </div>
              <p className="text-xs text-[#B89B8D] leading-relaxed">
                Explicit consumer rights for European Union, United Kingdom, and California residents.
              </p>
            </div>
          </div>

          {/* Main Content Sections */}
          <div className="space-y-10 text-sm text-[#E8C5A5] leading-relaxed">
            {/* Section 1 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  01
                </span>
                Consent
              </h2>
              <p>
                By using our website, you hereby consent to our Privacy Policy and agree to its terms. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at{' '}
                <a href="mailto:naturestudio05@gmail.com" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                  naturestudio05@gmail.com
                </a>.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  02
                </span>
                Information We Collect
              </h2>
              <p>
                The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-[#B89B8D]">
                <li>
                  <strong className="text-[#FFF5ED]">Direct Communications:</strong> If you contact us directly (e.g., via our contact forms, email, WhatsApp, or Discord), we may receive additional information about you such as your name, email address, phone number, company name, project brief, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                </li>
                <li>
                  <strong className="text-[#FFF5ED]">Client Account Registration:</strong> When you register for an account or client workspace on Nature Studios, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.
                </li>
                <li>
                  <strong className="text-[#FFF5ED]">Public Community Portfolios:</strong> Information you voluntarily publish in your creator portfolio (such as handle, portfolio showcase links, bio, and social links) is displayed publicly on the platform per your configuration.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  03
                </span>
                How We Use Your Information
              </h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#B89B8D]">
                <li>Provide, operate, and maintain our website and creative production platform</li>
                <li>Improve, personalize, and expand our website features and user experience</li>
                <li>Understand and analyze how visitors utilize and navigate our website</li>
                <li>Develop new products, services, features, and broadcast capabilities</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Send you emails regarding project milestones, inquiries, and technical alerts</li>
                <li>Detect, prevent, and address technical issues, fraud, and unauthorized platform usage</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  04
                </span>
                Log Files
              </h2>
              <p>
                Nature Studios follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this as a part of hosting services&apos; analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
              </p>
            </section>

            {/* Section 5 - CRITICAL ADSENSE SECTION */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#240709] border border-[#FED7B8]/30 shadow-glow-burgundy">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FED7B8]">
                <Cookie className="w-4 h-4" /> Google AdSense &amp; Advertising Policies
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#FFF5ED]">
                05. Cookies, Web Beacons &amp; Google AdSense
              </h2>
              <p>
                Like any other website, Nature Studios uses &lsquo;cookies&rsquo;. These cookies are used to store information including visitors&apos; preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
              </p>

              <div className="space-y-3 pt-2 border-t border-[#52141A]">
                <h3 className="text-base font-bold text-[#FFF5ED]">Google DoubleClick DART Cookie</h3>
                <p>
                  Google is one of our third-party vendors. Google also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <strong className="text-[#FFF5ED]">https://naturestudio.in</strong> and other sites on the internet.
                </p>
                <p>
                  However, visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at the following URL:{' '}
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FED7B8] underline underline-offset-4 hover:text-[#FFF5ED] break-all font-mono text-xs"
                  >
                    https://policies.google.com/technologies/ads
                  </a>
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#52141A]">
                <h3 className="text-base font-bold text-[#FFF5ED]">Our Advertising Partners</h3>
                <p>
                  Some of advertisers on our site may use cookies and web beacons. Our primary advertising partner is:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-[#B89B8D]">
                  <li>
                    <strong className="text-[#FFF5ED]">Google AdSense:</strong>{' '}
                    <a
                      href="https://policies.google.com/technologies/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FED7B8] underline hover:text-[#FFF5ED]"
                    >
                      Google Privacy &amp; Terms for Advertising
                    </a>
                  </li>
                </ul>
                <p>
                  Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on Nature Studios, which are sent directly to users&apos; browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
                </p>
                <p className="text-xs text-[#B89B8D] italic">
                  Note that Nature Studios has no access to or control over these cookies that are used by third-party advertisers.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#52141A]">
                <h3 className="text-base font-bold text-[#FFF5ED]">Personalized Advertising Opt-Out</h3>
                <p>
                  Users may opt out of personalized advertising by visiting:{' '}
                  <a
                    href="https://www.google.com/settings/ads"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FED7B8] underline hover:text-[#FFF5ED]"
                  >
                    Google Ads Settings (https://www.google.com/settings/ads)
                  </a>
                  .
                </p>
                <p>
                  Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting the Digital Advertising Alliance Consumer Choice page at{' '}
                  <a
                    href="https://www.aboutads.info/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FED7B8] underline hover:text-[#FFF5ED]"
                  >
                    www.aboutads.info
                  </a>{' '}
                  or the Network Advertising Initiative at{' '}
                  <a
                    href="https://www.networkadvertising.org/choices/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FED7B8] underline hover:text-[#FFF5ED]"
                  >
                    www.networkadvertising.org
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  06
                </span>
                Third Party Privacy Policies
              </h2>
              <p>
                Nature Studios&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
              </p>
              <p>
                You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers&apos; respective websites. You can also view our dedicated{' '}
                <Link href="/cookies" className="text-[#FED7B8] underline hover:text-[#FFF5ED]">
                  Cookie Policy
                </Link>{' '}
                for comprehensive guidance.
              </p>
            </section>

            {/* Section 7 - CCPA */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  07
                </span>
                CCPA Privacy Rights (Do Not Sell My Personal Information)
              </h2>
              <p>Under the California Consumer Privacy Act (CCPA), among other rights, California consumers have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#B89B8D]">
                <li>Request that a business that collects a consumer&apos;s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.</li>
                <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
                <li>Request that a business that sells or shares a consumer&apos;s personal data, not sell or share the consumer&apos;s personal data.</li>
              </ul>
              <p>
                If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
              </p>
            </section>

            {/* Section 8 - GDPR */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  08
                </span>
                GDPR Data Protection Rights
              </h2>
              <p>
                We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#B89B8D]">
                <li><strong className="text-[#FFF5ED]">The right to access:</strong> You have the right to request copies of your personal data.</li>
                <li><strong className="text-[#FFF5ED]">The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.</li>
                <li><strong className="text-[#FFF5ED]">The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong className="text-[#FFF5ED]">The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li><strong className="text-[#FFF5ED]">The right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li><strong className="text-[#FFF5ED]">The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
              </ul>
              <p>
                If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.
              </p>
            </section>

            {/* Section 9 - Children's Information */}
            <section className="space-y-3.5 p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13]">
              <h2 className="text-lg font-bold uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <span className="font-mono text-xs text-[#FED7B8] px-2 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A]">
                  09
                </span>
                Children&apos;s Information (COPPA)
              </h2>
              <p>
                Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
              </p>
              <p>
                Nature Studios does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
              </p>
            </section>

            {/* Section 10 - Contact */}
            <section className="space-y-4 p-6 sm:p-8 rounded-2xl bg-[#1C0507] border border-[#52141A]">
              <h2 className="text-xl font-black uppercase text-[#FFF5ED] flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-[#FED7B8]" />
                10. Contact Us &amp; Data Protection Officer
              </h2>
              <p>
                If you have any questions, feedback, or data requests regarding this Privacy Policy or our compliance with Google AdSense policies, please contact us via any of the following channels:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#240709] border border-[#3D0D13]">
                  <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">Primary Privacy Email</span>
                  <a href="mailto:naturestudio05@gmail.com" className="text-sm font-mono font-bold text-[#FED7B8] hover:underline">
                    naturestudio05@gmail.com
                  </a>
                </div>
                <div className="p-3.5 rounded-xl bg-[#240709] border border-[#3D0D13]">
                  <span className="text-[10px] font-mono uppercase text-[#B89B8D] block">Direct WhatsApp Support</span>
                  <a href="https://wa.me/917480066539" target="_blank" rel="noopener noreferrer" className="text-sm font-mono font-bold text-emerald-400 hover:underline">
                    +91 7480 066 539
                  </a>
                </div>
              </div>
              <p className="text-xs text-[#B89B8D]">
                Nature Studios &bull; Headquarters: India &bull; Serving global esports properties, tournament organizers, and creative brands.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
