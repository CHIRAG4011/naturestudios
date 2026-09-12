'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2, AlertCircle, Mail, MapPin, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [projectType, setProjectType] = useState('Esports & Live Broadcast');
  const [budget, setBudget] = useState('$25,000 - $50,000');
  const [timeline, setTimeline] = useState('4 - 8 Weeks');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/project-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          projectType,
          budget,
          timeline,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit inquiry');
        setLoading(false);
        return;
      }

      setSuccess(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    'w-full rounded-lg border border-rim bg-deep px-3.5 py-2.5 text-xs text-cream placeholder:text-cream-muted focus:border-forest/60 focus:outline-none focus:ring-1 focus:ring-forest/30 transition-colors duration-150';

  return (
    <section id="contact" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

        {/* ── Info column ── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <span className="section-label">{'//'} Start a Project</span>
            <h2 className="text-display-md font-black uppercase text-cream tracking-tight leading-[0.95]">
              Let&apos;s Build<br />The Arena
            </h2>
          </div>

          <p className="text-sm text-cream-dim leading-relaxed max-w-sm">
            Whether you need a broadcast graphics package for a stadium tournament, a new team visual identity,
            or a physical stage installation — submit your inquiry to begin our creative dialogue.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { icon: Mail,   color: 'text-[#FED7B8]', text: 'inquiries@naturestudio.in' },
              { icon: MapPin, color: 'text-ember-light',  text: 'London · Los Angeles · Tokyo' },
              { icon: Globe,  color: 'text-forest-light', text: 'Worldwide Broadcast Production' },
            ].map(({ icon: Icon, color, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 p-3 rounded-xl border border-rim bg-surface-card"
              >
                <Icon className={`h-4 w-4 shrink-0 ${color}`} aria-hidden="true" />
                <span className="text-xs text-cream-dim font-mono">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form column ── */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl border border-rim bg-surface-card shadow-card">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 flex items-center gap-2.5 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />
                  <p>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <CheckCircle2 className="h-12 w-12 text-forest-bright mx-auto animate-bounce" aria-hidden="true" />
                <h3 className="text-xl font-bold uppercase text-cream">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-cream-dim max-w-md mx-auto leading-relaxed">
                  Thank you — your project brief has been recorded in our production system.
                  Our directors will review your parameters and respond within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 rounded-lg border border-rim px-4 py-2 text-xs font-mono uppercase text-cream-muted hover:text-cream hover:border-edge transition-colors duration-150 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono uppercase tracking-wider text-cream-dim mb-1.5">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Elena Vance"
                      autoComplete="name"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-mono uppercase tracking-wider text-cream-dim mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="elena@organization.gg"
                      autoComplete="email"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-org" className="block text-xs font-mono uppercase tracking-wider text-cream-dim mb-1.5">
                      Organization / Club
                    </label>
                    <input
                      id="contact-org"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Apex Legion"
                      autoComplete="organization"
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-scope" className="block text-xs font-mono uppercase tracking-wider text-cream-dim mb-1.5">
                      Service Scope
                    </label>
                    <select
                      id="contact-scope"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="Esports & Live Broadcast">Esports &amp; Live Broadcast</option>
                      <option value="Brand & Visual Systems">Brand &amp; Visual Systems</option>
                      <option value="Cinematic Content Studio">Cinematic Content Studio</option>
                      <option value="Interactive Web Platforms">Interactive Web Platforms</option>
                      <option value="Stage & Environmental Design">Stage &amp; Environmental Design</option>
                      <option value="Creative Direction & Strategy">Creative Direction &amp; Strategy</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-budget" className="block text-xs font-mono uppercase tracking-wider text-cream-dim mb-1.5">
                      Estimated Budget
                    </label>
                    <select
                      id="contact-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="$15,000 - $30,000">$15,000 – $30,000</option>
                      <option value="$30,000 - $60,000">$30,000 – $60,000</option>
                      <option value="$60,000 - $120,000">$60,000 – $120,000</option>
                      <option value="$120,000+">$120,000+</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-timeline" className="block text-xs font-mono uppercase tracking-wider text-cream-dim mb-1.5">
                      Target Launch
                    </label>
                    <select
                      id="contact-timeline"
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value)}
                      className={fieldClass}
                    >
                      <option value="1 - 2 Months">1 – 2 Months</option>
                      <option value="2 - 4 Months">2 – 4 Months</option>
                      <option value="4 - 6 Months">4 – 6 Months</option>
                      <option value="Long-term Partnership">Long-term Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono uppercase tracking-wider text-cream-dim mb-1.5">
                    Project Goals &amp; Vision
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the tournament, deliverables, timeline and design goals..."
                    className={fieldClass}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-label inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      <span>Sending Inquiry…</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Project Brief</span>
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
