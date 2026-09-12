'use client';

import React, { useState } from 'react';
import { PortfolioData } from '@/lib/portfolio-service';
import { EditorialTheme } from './themes/EditorialTheme';
import { CinematicTheme } from './themes/CinematicTheme';
import { EsportsTheme } from './themes/EsportsTheme';
import { MinimalTheme } from './themes/MinimalTheme';
import { CreativeGridTheme } from './themes/CreativeGridTheme';
import { ImmersiveTheme } from './themes/ImmersiveTheme';
import { MagazineTheme } from './themes/MagazineTheme';
import { ExperimentalTheme } from './themes/ExperimentalTheme';
import { CustomTheme } from './themes/CustomTheme';
import { Mail, Send, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface PortfolioRendererProps {
  portfolio: PortfolioData;
  isEmbed?: boolean;
}

/**
 * Master Portfolio Renderer
 * Dynamically switches layouts between the 8 genuine portfolio themes:
 * 1. Editorial
 * 2. Cinematic
 * 3. Minimal
 * 4. Creative Grid
 * 5. Immersive
 * 6. Esports
 * 7. Magazine
 * 8. Experimental
 */
export function PortfolioRenderer({ portfolio, isEmbed }: PortfolioRendererProps) {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/portfolio/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: portfolio.slug,
          name: contactName,
          email: contactEmail,
          company: contactCompany,
          message: contactMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit message');
      }

      setSubmitStatus('success');
      setContactName('');
      setContactEmail('');
      setContactCompany('');
      setContactMessage('');
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const themeId = portfolio.designConfig?.themeId || portfolio.themeId || 'editorial';

  const renderActiveTheme = () => {
    switch (themeId) {
      case 'cinematic':
        return <CinematicTheme portfolio={portfolio} />;
      case 'esports':
        return <EsportsTheme portfolio={portfolio} />;
      case 'minimal':
        return <MinimalTheme portfolio={portfolio} isEmbed={isEmbed} />;
      case 'creative-grid':
        return <CreativeGridTheme portfolio={portfolio} isEmbed={isEmbed} />;
      case 'immersive':
        return <ImmersiveTheme portfolio={portfolio} isEmbed={isEmbed} />;
      case 'magazine':
        return <MagazineTheme portfolio={portfolio} isEmbed={isEmbed} />;
      case 'experimental':
        return <ExperimentalTheme portfolio={portfolio} isEmbed={isEmbed} />;
      case 'custom':
        return <CustomTheme portfolio={portfolio} isEmbed={isEmbed} />;
      case 'editorial':
      default:
        return <EditorialTheme portfolio={portfolio} isEmbed={isEmbed} />;
    }
  };

  return (
    <div className="relative">
      {renderActiveTheme()}

      {/* Floating "Contact Me" Action Button */}
      {portfolio.contactConfig?.contactFormEnabled !== false && !isEmbed && (
        <button
          onClick={() => setContactOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-[#59171B] hover:bg-[#7A2228] text-[#FED7B8] font-mono text-xs uppercase tracking-widest border border-[#FED7B8]/40 shadow-glow-burgundy transition-all duration-300 hover:scale-105"
        >
          <Mail className="w-4 h-4" />
          <span>Contact {portfolio.personalInfo?.fullName?.split(' ')[0] || 'Creator'}</span>
        </button>
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#240709] border border-[#52141A] rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => {
                setContactOpen(false);
                setSubmitStatus('idle');
              }}
              className="absolute top-4 right-4 text-[#B89B8D] hover:text-[#FFF5ED] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
                Direct Inquiry
              </span>
              <h3 className="text-2xl font-bold uppercase text-[#FFF5ED]">
                Message {portfolio.personalInfo?.fullName || 'Creator'}
              </h3>
            </div>

            {submitStatus === 'success' ? (
              <div className="p-6 rounded-xl bg-[#150304] border border-[#18A957]/40 text-center">
                <CheckCircle2 className="w-10 h-10 text-[#18A957] mx-auto mb-3" />
                <h4 className="text-lg font-bold text-[#FFF5ED] mb-1">Message Transmitted</h4>
                <p className="text-xs text-[#B89B8D] mb-4">
                  Your inquiry has been securely delivered directly to {portfolio.personalInfo?.fullName}.
                </p>
                <button
                  onClick={() => setContactOpen(false)}
                  className="px-4 py-2 bg-[#3A0E11] text-[#FED7B8] text-xs font-mono uppercase rounded-lg border border-[#52141A]"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {submitStatus === 'error' && (
                  <div className="p-3 bg-[#3A0E11] border border-[#E63946] rounded-lg text-xs text-[#E63946] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-[#B89B8D] uppercase mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#B89B8D] uppercase mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex@team.com"
                    className="field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#B89B8D] uppercase mb-1">
                    Organization / Team (Optional)
                  </label>
                  <input
                    type="text"
                    value={contactCompany}
                    onChange={(e) => setContactCompany(e.target.value)}
                    placeholder="Apex Esports"
                    className="field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#B89B8D] uppercase mb-1">
                    Project Details / Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your timeline, scope, and goals..."
                    className="field resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary justify-center mt-4"
                >
                  {isSubmitting ? (
                    'Transmitting Message...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Transmit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
