'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { PortfolioData, PortfolioThemeId } from '@/lib/portfolio-service';
import {
  User,
  Briefcase,
  Wrench,
  FolderGit2,
  Clock,
  GraduationCap,
  Award,
  Package,
  Share2,
  Mail,
  Palette,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Save,
  Loader2,
  Plus,
  Trash2,
  Eye,
  ExternalLink,
  Shield,
  Sparkles,
  Sliders,
  Layout,
  Type,
  Grid,
  Layers,
  Check,
  Globe,
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Personal Info', icon: User },
  { id: 2, name: 'Identity', icon: Briefcase },
  { id: 3, name: 'Skills', icon: Wrench },
  { id: 4, name: 'Projects', icon: FolderGit2 },
  { id: 5, name: 'Experience', icon: Clock },
  { id: 6, name: 'Education', icon: GraduationCap },
  { id: 7, name: 'Achievements', icon: Award },
  { id: 8, name: 'Services', icon: Package },
  { id: 9, name: 'Social Links', icon: Share2 },
  { id: 10, name: 'Contact', icon: Mail },
  { id: 11, name: 'Design & Templates', icon: Palette },
  { id: 12, name: 'SEO & Metadata', icon: Search },
  { id: 13, name: 'Review & Publish', icon: CheckCircle2 },
];

const THEMES: { id: PortfolioThemeId; name: string; desc: string }[] = [
  { id: 'editorial', name: '01 — Editorial', desc: 'Bold typography, high art direction, crisp grids.' },
  { id: 'cinematic', name: '02 — Cinematic', desc: 'Dark burgundy environment, warm beige light trails, full-screen reel.' },
  { id: 'esports', name: '03 — Esports', desc: 'Tournament HUD detailing, match stat indicators, red LIVE badges.' },
  { id: 'minimal', name: '04 — Minimal', desc: 'Quiet confidence, maximum void contrast, spacious layout.' },
  { id: 'creative-grid', name: '05 — Creative Grid', desc: 'Asymmetric masonry cards and vivid project tags.' },
  { id: 'immersive', name: '06 — Immersive', desc: 'Parallax depth layers, floating glass badges, chapter transitions.' },
  { id: 'magazine', name: '07 — Magazine', desc: 'Editorial multi-column spread with issue volumes and pull quotes.' },
  { id: 'experimental', name: '08 — Experimental', desc: 'Kinetic geometry, avant-garde borders, brutalist layout.' },
  { id: 'custom', name: '09 — Custom Template Studio', desc: 'Bespoke layout engine: custom colors, fonts, hero layouts, card aesthetics & section visibility.' },
];

const TEMPLATE_PRESETS = [
  {
    name: 'Esports Broadcast HUD',
    desc: 'Aggressive tournament aesthetic with crimson telemetry and split layout',
    config: {
      accentColor: '#E63946',
      backgroundStyle: 'void',
      fontPair: 'esports',
      heroLayout: 'split',
      projectLayout: 'reel',
      cardStyle: 'bordered',
    },
  },
  {
    name: 'Swiss Studio Minimal',
    desc: 'Understated discipline, maximum contrast void, high whitespace',
    config: {
      accentColor: '#FED7B8',
      backgroundStyle: 'void',
      fontPair: 'modern-sans',
      heroLayout: 'minimal',
      projectLayout: 'list',
      cardStyle: 'minimal',
    },
  },
  {
    name: 'Dark Luxury Editorial',
    desc: 'Deep velvet wine ambiance with classical serif headlines',
    config: {
      accentColor: '#FED7B8',
      backgroundStyle: 'wine',
      fontPair: 'editorial',
      heroLayout: 'center-bold',
      projectLayout: 'masonry',
      cardStyle: 'glass',
    },
  },
  {
    name: 'Cyberpunk Neon',
    desc: 'Midnight blue matrix with neon cyan accents and brutalist monospace',
    config: {
      accentColor: '#00F0FF',
      backgroundStyle: 'midnight',
      fontPair: 'brutalist',
      heroLayout: 'split',
      projectLayout: 'grid-2',
      cardStyle: 'bordered',
    },
  },
  {
    name: 'Nature Organic',
    desc: 'Rich forest atmosphere with emerald organic tones',
    config: {
      accentColor: '#18A957',
      backgroundStyle: 'forest',
      fontPair: 'modern-sans',
      heroLayout: 'full-bleed',
      projectLayout: 'grid-2',
      cardStyle: 'glass',
    },
  },
];

const ACCENT_PRESETS = [
  { name: 'Warm Beige', hex: '#FED7B8' },
  { name: 'Nature Burgundy', hex: '#59171B' },
  { name: 'Crimson Red', hex: '#E63946' },
  { name: 'Studio Emerald', hex: '#18A957' },
  { name: 'Cyber Orange', hex: '#FF6B35' },
  { name: 'Electric Violet', hex: '#8A2BE2' },
  { name: 'Neon Cyan', hex: '#00F0FF' },
  { name: 'Radiant Gold', hex: '#F59E0B' },
];

export default function PortfolioWizard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [designSubTab, setDesignSubTab] = useState<'curated' | 'custom'>('curated');
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autosaveStatus, setAutosaveStatus] = useState<'Saved' | 'Saving...' | 'Unsaved Changes' | 'Save Failed'>('Saved');
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial portfolio
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/portfolio/edit');
      return;
    }

    if (user) {
      fetch('/api/portfolio')
        .then((res) => res.json())
        .then((data) => {
          if (data.portfolio) {
            setPortfolio(data.portfolio);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  // Autosave function
  const triggerAutosave = (updated: PortfolioData) => {
    setPortfolio(updated);
    setAutosaveStatus('Unsaved Changes');

    if (autosaveTimeoutRef.current) clearTimeout(autosaveTimeoutRef.current);

    autosaveTimeoutRef.current = setTimeout(async () => {
      setAutosaveStatus('Saving...');
      try {
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
        if (res.ok) {
          setAutosaveStatus('Saved');
        } else {
          setAutosaveStatus('Save Failed');
        }
      } catch (err) {
        setAutosaveStatus('Save Failed');
      }
    }, 1200);
  };

  const updatePersonalInfo = (field: string, val: any) => {
    if (!portfolio) return;
    const updated = {
      ...portfolio,
      personalInfo: { ...portfolio.personalInfo, [field]: val },
    };
    triggerAutosave(updated);
  };

  const updateIdentity = (field: string, val: any) => {
    if (!portfolio) return;
    const updated = {
      ...portfolio,
      professionalIdentity: { ...portfolio.professionalIdentity, [field]: val },
    };
    triggerAutosave(updated);
  };

  const updateSocialLinks = (field: string, val: string) => {
    if (!portfolio) return;
    const updated = {
      ...portfolio,
      socialLinks: { ...portfolio.socialLinks, [field]: val },
    };
    triggerAutosave(updated);
  };

  const updateDesign = (field: string, val: any) => {
    if (!portfolio) return;
    const updated = {
      ...portfolio,
      themeId: field === 'themeId' ? val : portfolio.themeId,
      designConfig: { ...portfolio.designConfig, [field]: val },
    };
    triggerAutosave(updated);
  };

  const applyTemplatePreset = (preset: typeof TEMPLATE_PRESETS[0]) => {
    if (!portfolio) return;
    const updated: PortfolioData = {
      ...portfolio,
      themeId: 'custom',
      designConfig: {
        ...(portfolio.designConfig || {}),
        themeId: 'custom',
        ...preset.config,
        templateName: preset.name,
      },
    };
    triggerAutosave(updated);
  };

  const updateVisibleSection = (section: string, val: boolean) => {
    if (!portfolio) return;
    const updated: PortfolioData = {
      ...portfolio,
      designConfig: {
        ...(portfolio.designConfig || {}),
        visibleSections: {
          ...(portfolio.designConfig?.visibleSections || {}),
          [section]: val,
        },
      },
    };
    triggerAutosave(updated);
  };

  const updateSeo = (field: string, val: string) => {
    if (!portfolio) return;
    const updated = {
      ...portfolio,
      seoConfig: { ...portfolio.seoConfig, [field]: val },
    };
    triggerAutosave(updated);
  };

  // Add Project
  const addProject = () => {
    if (!portfolio) return;
    const newProj = {
      id: `proj_${Date.now()}`,
      title: 'New Project',
      slug: `project-${(portfolio.projects?.length || 0) + 1}`,
      description: 'Comprehensive project description and strategy.',
      category: 'ESPORTS',
      order: (portfolio.projects?.length || 0) + 1,
    };
    const updated = {
      ...portfolio,
      projects: [...(portfolio.projects || []), newProj],
    };
    triggerAutosave(updated);
  };

  const removeProject = (index: number) => {
    if (!portfolio) return;
    const projs = [...(portfolio.projects || [])];
    projs.splice(index, 1);
    triggerAutosave({ ...portfolio, projects: projs });
  };

  // Add Skill
  const addSkill = () => {
    if (!portfolio) return;
    const newSkill = {
      id: `skill_${Date.now()}`,
      name: 'Creative Direction',
      category: 'Design',
      experienceLevel: 'Expert',
    };
    triggerAutosave({ ...portfolio, skills: [...(portfolio.skills || []), newSkill] });
  };

  const removeSkill = (index: number) => {
    if (!portfolio) return;
    const sks = [...(portfolio.skills || [])];
    sks.splice(index, 1);
    triggerAutosave({ ...portfolio, skills: sks });
  };

  if (authLoading || loading || !portfolio) {
    return (
      <div className="min-h-screen bg-[#150304] text-[#FFF5ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FED7B8] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#150304] text-[#FFF5ED] font-sans selection:bg-[#59171B] selection:text-[#FED7B8]">
      {/* Top Wizard Control Bar */}
      <header className="sticky top-0 z-40 bg-[#1C0507]/90 backdrop-blur-md border-b border-[#3D0D13] px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/portfolio" className="text-xs font-mono uppercase text-[#FED7B8] hover:underline">
            ← My Portfolio
          </Link>
          <span className="text-[#52141A]">/</span>
          <span className="text-xs font-mono uppercase text-[#B89B8D]">
            Step {currentStep} of 13: {STEPS[currentStep - 1].name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs font-mono flex items-center gap-2">
            {autosaveStatus === 'Saving...' && <Loader2 className="w-3.5 h-3.5 text-[#FED7B8] animate-spin" />}
            {autosaveStatus === 'Saved' && <CheckCircle2 className="w-3.5 h-3.5 text-[#18A957]" />}
            <span
              className={`${
                autosaveStatus === 'Saved'
                  ? 'text-[#18A957]'
                  : autosaveStatus === 'Save Failed'
                  ? 'text-[#E63946]'
                  : 'text-[#FED7B8]'
              }`}
            >
              {autosaveStatus}
            </span>
          </div>

          <Link
            href="/portfolio/preview"
            className="btn-secondary text-xs py-1.5 px-3 hidden sm:inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </Link>
        </div>
      </header>

      {/* Step Navigation Bar */}
      <div className="border-b border-[#3D0D13] bg-[#240709] overflow-x-auto px-6 py-3 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const active = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                  active
                    ? 'bg-[#59171B] text-[#FED7B8] border border-[#FED7B8]/40'
                    : 'text-[#B89B8D] hover:text-[#FFF5ED] hover:bg-[#2D0A0E]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.id}. {step.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* STEP 1: PERSONAL INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
                Step 01 / 13
              </span>
              <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">Personal Information</h2>
              <p className="text-xs text-[#B89B8D] mt-1">
                Your core public presence and creator coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={portfolio.personalInfo?.fullName || ''}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  className="field"
                  placeholder="Chirag Gupta"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Professional / Display Name</label>
                <input
                  type="text"
                  value={portfolio.personalInfo?.professionalName || ''}
                  onChange={(e) => updatePersonalInfo('professionalName', e.target.value)}
                  className="field"
                  placeholder="Kryptic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">
                  Portfolio Subdomain Slug (username.naturestudio.in) *
                </label>
                <input
                  type="text"
                  value={portfolio.slug || ''}
                  onChange={(e) => triggerAutosave({ ...portfolio, slug: e.target.value })}
                  className="field font-mono"
                  placeholder="alex"
                />
                <span className="text-[11px] font-mono text-[#FED7B8] block mt-1">
                  URL: https://{portfolio.slug || 'username'}.naturestudio.in
                </span>
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Professional Title</label>
                <input
                  type="text"
                  value={portfolio.personalInfo?.professionalTitle || ''}
                  onChange={(e) => updatePersonalInfo('professionalTitle', e.target.value)}
                  className="field"
                  placeholder="Lead Esports Broadcast Art Director"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Headline / Tagline</label>
              <input
                type="text"
                value={portfolio.personalInfo?.tagline || ''}
                onChange={(e) => updatePersonalInfo('tagline', e.target.value)}
                className="field"
                placeholder="CREATING THE NEXT GENERATION OF COMPETITIVE DIGITAL WORLDS"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">About Me (Biography)</label>
              <textarea
                rows={5}
                value={portfolio.personalInfo?.aboutMe || ''}
                onChange={(e) => updatePersonalInfo('aboutMe', e.target.value)}
                className="field resize-none"
                placeholder="Describe your background, creative philosophy, and major career achievements..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Location</label>
                <input
                  type="text"
                  value={portfolio.personalInfo?.location || ''}
                  onChange={(e) => updatePersonalInfo('location', e.target.value)}
                  className="field"
                  placeholder="Tokyo / Los Angeles"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Public Email</label>
                <input
                  type="email"
                  value={portfolio.personalInfo?.publicEmail || ''}
                  onChange={(e) => updatePersonalInfo('publicEmail', e.target.value)}
                  className="field"
                  placeholder="creator@naturestudio.in"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Availability Status</label>
                <select
                  value={portfolio.personalInfo?.availability || 'Available for projects'}
                  onChange={(e) => updatePersonalInfo('availability', e.target.value)}
                  className="field"
                >
                  <option value="Available for projects">Available for projects</option>
                  <option value="Open to full-time roles">Open to full-time roles</option>
                  <option value="Booked for Q3">Booked for Q3</option>
                  <option value="Select engagements only">Select engagements only</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROFESSIONAL IDENTITY */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
                Step 02 / 13
              </span>
              <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">Professional Identity</h2>
              <p className="text-xs text-[#B89B8D] mt-1">Industry specialization and positioning.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Primary Role</label>
                <input
                  type="text"
                  value={portfolio.professionalIdentity?.primaryRole || ''}
                  onChange={(e) => updateIdentity('primaryRole', e.target.value)}
                  className="field"
                  placeholder="Broadcast Graphics Designer"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Industry</label>
                <input
                  type="text"
                  value={portfolio.professionalIdentity?.industry || ''}
                  onChange={(e) => updateIdentity('industry', e.target.value)}
                  className="field"
                  placeholder="Esports & Digital Media"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={portfolio.professionalIdentity?.yearsExperience || 5}
                  onChange={(e) => updateIdentity('yearsExperience', parseInt(e.target.value, 10))}
                  className="field"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Work Type</label>
                <select
                  value={portfolio.professionalIdentity?.workType || 'Remote'}
                  onChange={(e) => updateIdentity('workType', e.target.value)}
                  className="field"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Specialization Focus</label>
              <input
                type="text"
                value={portfolio.professionalIdentity?.specialization || ''}
                onChange={(e) => updateIdentity('specialization', e.target.value)}
                className="field"
                placeholder="Unreal Engine Virtual Production & Tournament Overlays"
              />
            </div>
          </div>
        )}

        {/* STEP 3: SKILLS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
                  Step 03 / 13
                </span>
                <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">Skills & Capabilities</h2>
                <p className="text-xs text-[#B89B8D] mt-1">Tools, software, and creative proficiencies.</p>
              </div>
              <button onClick={addSkill} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>

            <div className="space-y-3">
              {portfolio.skills?.map((skill, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#240709] border border-[#3D0D13] flex items-center gap-4">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => {
                      const updated = [...portfolio.skills];
                      updated[idx].name = e.target.value;
                      triggerAutosave({ ...portfolio, skills: updated });
                    }}
                    className="field flex-1"
                    placeholder="Skill name (e.g. Cinema 4D)"
                  />
                  <select
                    value={skill.experienceLevel}
                    onChange={(e) => {
                      const updated = [...portfolio.skills];
                      updated[idx].experienceLevel = e.target.value;
                      triggerAutosave({ ...portfolio, skills: updated });
                    }}
                    className="field w-40"
                  >
                    <option value="Expert">Expert</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                  <button
                    onClick={() => removeSkill(idx)}
                    className="p-2 text-[#E63946] hover:bg-[#3A0E11] rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PROJECTS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
                  Step 04 / 13
                </span>
                <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">Featured Projects</h2>
                <p className="text-xs text-[#B89B8D] mt-1">Showcase your best esports, branding, and motion projects.</p>
              </div>
              <button onClick={addProject} className="btn-secondary text-xs py-2 px-3 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-6">
              {portfolio.projects?.map((proj, idx) => (
                <div key={proj.id || idx} className="p-6 rounded-2xl bg-[#240709] border border-[#52141A] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#FED7B8] uppercase font-bold">
                      Project #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeProject(idx)}
                      className="text-xs font-mono text-[#E63946] hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].title = e.target.value;
                          triggerAutosave({ ...portfolio, projects: updated });
                        }}
                        className="field"
                        placeholder="VALORANT Champions 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Category</label>
                      <input
                        type="text"
                        value={proj.category}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].category = e.target.value;
                          triggerAutosave({ ...portfolio, projects: updated });
                        }}
                        className="field"
                        placeholder="ESPORTS / BROADCAST"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...portfolio.projects];
                        updated[idx].description = e.target.value;
                        triggerAutosave({ ...portfolio, projects: updated });
                      }}
                      className="field resize-none"
                      placeholder="Comprehensive project narrative and results..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Client (Optional)</label>
                      <input
                        type="text"
                        value={proj.client || ''}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].client = e.target.value;
                          triggerAutosave({ ...portfolio, projects: updated });
                        }}
                        className="field"
                        placeholder="Riot Games / ESL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Project Link (URL)</label>
                      <input
                        type="text"
                        value={proj.projectUrl || ''}
                        onChange={(e) => {
                          const updated = [...portfolio.projects];
                          updated[idx].projectUrl = e.target.value;
                          triggerAutosave({ ...portfolio, projects: updated });
                        }}
                        className="field"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Image Thumbnail URL</label>
                    <input
                      type="text"
                      value={proj.thumbnail || ''}
                      onChange={(e) => {
                        const updated = [...portfolio.projects];
                        updated[idx].thumbnail = e.target.value;
                        triggerAutosave({ ...portfolio, projects: updated });
                      }}
                      className="field"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 11: DESIGN & CUSTOM TEMPLATES */}
        {currentStep === 11 && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
                  Step 11 / 13
                </span>
                <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">Portfolio Design & Custom Templates</h2>
                <p className="text-xs text-[#B89B8D] mt-1">
                  Select an iconic studio theme or enter the Custom Template Studio to configure bespoke colors, typography, hero wireframes, and grid systems.
                </p>
              </div>

              <div className="flex items-center gap-2 p-1 rounded-xl bg-[#240709] border border-[#3D0D13]">
                <button
                  onClick={() => setDesignSubTab('curated')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                    designSubTab === 'curated'
                      ? 'bg-[#59171B] text-[#FED7B8] shadow-md'
                      : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                  }`}
                >
                  8 Signature Themes
                </button>
                <button
                  onClick={() => {
                    setDesignSubTab('custom');
                    updateDesign('themeId', 'custom');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    designSubTab === 'custom' || portfolio.themeId === 'custom'
                      ? 'bg-[#FED7B8] text-[#150304] font-bold shadow-md'
                      : 'text-[#B89B8D] hover:text-[#FFF5ED]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" /> Custom Studio
                </button>
              </div>
            </div>

            {/* TAB 1: CURATED SIGNATURE THEMES */}
            {designSubTab === 'curated' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {THEMES.map((theme) => {
                    const isSelected = portfolio.themeId === theme.id;
                    return (
                      <div
                        key={theme.id}
                        onClick={() => {
                          updateDesign('themeId', theme.id);
                          if (theme.id === 'custom') setDesignSubTab('custom');
                        }}
                        className={`p-6 rounded-2xl cursor-pointer border transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#3A0E11] border-[#FED7B8] shadow-glow-burgundy scale-[1.01]'
                            : 'bg-[#240709] border-[#3D0D13] hover:border-[#52141A]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold uppercase text-[#FFF5ED]">{theme.name}</span>
                          {isSelected && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold bg-[#18A957] text-black">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#B89B8D] leading-relaxed">{theme.desc}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 rounded-2xl bg-[#1C0507] border border-[#52141A] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold uppercase text-[#FED7B8]">Need Complete Creative Freedom?</h4>
                    <p className="text-xs text-[#B89B8D] mt-0.5">
                      Launch the Custom Template Studio to hand-pick accent colors, background styles, typography engines, and hero wireframes.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDesignSubTab('custom');
                      updateDesign('themeId', 'custom');
                    }}
                    className="btn-primary text-xs py-2.5 px-4 whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" /> Open Custom Studio
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM TEMPLATE STUDIO */}
            {designSubTab === 'custom' && (
              <div className="space-y-8">
                {/* 1. Quick Presets */}
                <div className="p-6 rounded-2xl bg-[#240709] border border-[#52141A] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] block mb-0.5">
                        TEMPLATE ENGINE
                      </span>
                      <h3 className="text-lg font-black uppercase text-[#FFF5ED] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FED7B8]" /> Quick-Start Template Presets
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#B89B8D]">1-Click Base Architecture</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {TEMPLATE_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyTemplatePreset(preset)}
                        className={`p-4 rounded-xl text-left border transition-all ${
                          portfolio.designConfig?.templateName === preset.name
                            ? 'bg-[#3A0E11] border-[#FED7B8] shadow-md'
                            : 'bg-[#1C0507] border-[#3D0D13] hover:border-[#52141A]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase text-[#FFF5ED]">{preset.name}</span>
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: preset.config.accentColor }}
                          />
                        </div>
                        <p className="text-[11px] text-[#B89B8D] leading-tight line-clamp-2">{preset.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Accent Color Palette & Custom HEX */}
                <div className="p-6 rounded-2xl bg-[#240709] border border-[#3D0D13] space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] block mb-0.5">
                      COLOR GRADING
                    </span>
                    <h3 className="text-lg font-black uppercase text-[#FFF5ED]">Custom Accent Color</h3>
                    <p className="text-xs text-[#B89B8D] mt-0.5">
                      Applied dynamically to buttons, glowing aura meshes, project category tags, and active states.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {ACCENT_PRESETS.map((color) => {
                      const isActive = (portfolio.designConfig?.accentColor || '#FED7B8') === color.hex;
                      return (
                        <button
                          key={color.hex}
                          onClick={() => updateDesign('accentColor', color.hex)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all ${
                            isActive
                              ? 'border-[#FED7B8] bg-[#3A0E11] shadow-glow-burgundy scale-105'
                              : 'border-[#3D0D13] bg-[#1C0507] hover:border-[#52141A]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/40"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="text-[#FFF5ED]">{color.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom HEX Input */}
                  <div className="pt-2 flex items-center gap-4 max-w-sm">
                    <label className="text-xs font-mono uppercase text-[#B89B8D]">Custom HEX:</label>
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="color"
                        value={portfolio.designConfig?.accentColor || '#FED7B8'}
                        onChange={(e) => updateDesign('accentColor', e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={portfolio.designConfig?.accentColor || '#FED7B8'}
                        onChange={(e) => updateDesign('accentColor', e.target.value)}
                        placeholder="#FED7B8"
                        className="field font-mono text-xs uppercase flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Atmospheric Background Style */}
                <div className="p-6 rounded-2xl bg-[#240709] border border-[#3D0D13] space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] block mb-0.5">
                      ENVIRONMENT
                    </span>
                    <h3 className="text-lg font-black uppercase text-[#FFF5ED]">Atmospheric Background</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                      { id: 'dark-burgundy', name: 'Dark Burgundy', hex: '#150304' },
                      { id: 'void', name: 'Void Black', hex: '#050505' },
                      { id: 'wine', name: 'Deep Wine', hex: '#2B080C' },
                      { id: 'midnight', name: 'Midnight Navy', hex: '#070C18' },
                      { id: 'forest', name: 'Forest Emerald', hex: '#08140E' },
                      { id: 'warm-beige', name: 'Warm Ivory', hex: '#FAF4EE' },
                    ].map((bg) => {
                      const isActive = (portfolio.designConfig?.backgroundStyle || 'dark-burgundy') === bg.id;
                      return (
                        <button
                          key={bg.id}
                          onClick={() => updateDesign('backgroundStyle', bg.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isActive
                              ? 'border-[#FED7B8] ring-1 ring-[#FED7B8]'
                              : 'border-[#3D0D13] hover:border-[#52141A]'
                          }`}
                          style={{ backgroundColor: bg.hex }}
                        >
                          <div
                            className={`text-xs font-bold uppercase mb-1 ${
                              bg.id === 'warm-beige' ? 'text-black' : 'text-white'
                            }`}
                          >
                            {bg.name}
                          </div>
                          <span
                            className={`text-[10px] font-mono block ${
                              bg.id === 'warm-beige' ? 'text-black/60' : 'text-white/50'
                            }`}
                          >
                            {bg.hex}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Typography & Font Engine */}
                <div className="p-6 rounded-2xl bg-[#240709] border border-[#3D0D13] space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] block mb-0.5">
                      TYPOGRAPHY
                    </span>
                    <h3 className="text-lg font-black uppercase text-[#FFF5ED]">Font Pairing Engine</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: 'modern-sans', name: 'Modern Sans', preview: 'Clean Precision', desc: 'Inter & Outfit geometric' },
                      { id: 'editorial', name: 'High Editorial', preview: 'Classical Serif', desc: 'Serif display + clean body' },
                      { id: 'brutalist', name: 'Technical Brutalist', preview: 'TERMINAL_01', desc: 'Monospace code aesthetics' },
                      { id: 'esports', name: 'Kinetic Esports', preview: 'CHAMPIONS HUD', desc: 'Ultra-bold high-energy display' },
                    ].map((font) => {
                      const isActive = (portfolio.designConfig?.fontPair || 'modern-sans') === font.id;
                      return (
                        <button
                          key={font.id}
                          onClick={() => updateDesign('fontPair', font.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            isActive
                              ? 'bg-[#3A0E11] border-[#FED7B8] shadow-md'
                              : 'bg-[#1C0507] border-[#3D0D13] hover:border-[#52141A]'
                          }`}
                        >
                          <div className="text-xs font-bold uppercase text-[#FFF5ED] mb-1">{font.name}</div>
                          <div className="text-sm font-bold text-[#FED7B8] mb-1">{font.preview}</div>
                          <div className="text-[11px] text-[#B89B8D]">{font.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Hero & Project Layouts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hero Layout */}
                  <div className="p-6 rounded-2xl bg-[#240709] border border-[#3D0D13] space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] block mb-0.5">
                        HERO WIREFRAME
                      </span>
                      <h3 className="text-base font-black uppercase text-[#FFF5ED]">Hero Architecture</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'split', name: 'Split Screen 50/50', desc: 'Title on left, portrait card on right' },
                        { id: 'center-bold', name: 'Centered Monolith', desc: 'Monumental centered headline & portrait' },
                        { id: 'full-bleed', name: 'Full-Bleed Stage', desc: 'Cinematic wide visual card' },
                        { id: 'minimal', name: 'Minimal Streamline', desc: 'High void whitespace & clean coordinates' },
                      ].map((hl) => {
                        const isActive = (portfolio.designConfig?.heroLayout || 'split') === hl.id;
                        return (
                          <button
                            key={hl.id}
                            onClick={() => updateDesign('heroLayout', hl.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isActive
                                ? 'bg-[#3A0E11] border-[#FED7B8]'
                                : 'bg-[#1C0507] border-[#3D0D13] hover:border-[#52141A]'
                            }`}
                          >
                            <div className="text-xs font-bold uppercase text-[#FFF5ED] mb-1">{hl.name}</div>
                            <div className="text-[10px] text-[#B89B8D] leading-tight">{hl.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Project Layout */}
                  <div className="p-6 rounded-2xl bg-[#240709] border border-[#3D0D13] space-y-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] block mb-0.5">
                        PROJECT WIREFRAME
                      </span>
                      <h3 className="text-base font-black uppercase text-[#FFF5ED]">Project Grid System</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'grid-2', name: '2-Column Showcase', desc: 'Balanced visual grid with category badges' },
                        { id: 'masonry', name: 'Dynamic Masonry', desc: 'Staggered columns with varied card heights' },
                        { id: 'reel', name: 'Cinematic Reel', desc: 'Horizontal cards with client details' },
                        { id: 'list', name: 'Typographic List', desc: 'Editorial index catalogue layout' },
                      ].map((pl) => {
                        const isActive = (portfolio.designConfig?.projectLayout || 'grid-2') === pl.id;
                        return (
                          <button
                            key={pl.id}
                            onClick={() => updateDesign('projectLayout', pl.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isActive
                                ? 'bg-[#3A0E11] border-[#FED7B8]'
                                : 'bg-[#1C0507] border-[#3D0D13] hover:border-[#52141A]'
                            }`}
                          >
                            <div className="text-xs font-bold uppercase text-[#FFF5ED] mb-1">{pl.name}</div>
                            <div className="text-[10px] text-[#B89B8D] leading-tight">{pl.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 6. Card & Surface Style */}
                <div className="p-6 rounded-2xl bg-[#240709] border border-[#3D0D13] space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] block mb-0.5">
                      SURFACE FINISH
                    </span>
                    <h3 className="text-base font-black uppercase text-[#FFF5ED]">Card & Surface Aesthetics</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'glass', name: 'Glassmorphic', desc: 'Translucent blur with glowing edge' },
                      { id: 'bordered', name: 'Technical Border', desc: 'High-contrast 2px tech borders' },
                      { id: 'elevated', name: 'Deep Elevation', desc: 'Dark wine drop shadows' },
                      { id: 'minimal', name: 'Flat Minimal', desc: 'Clean borderless divider lines' },
                    ].map((cs) => {
                      const isActive = (portfolio.designConfig?.cardStyle || 'glass') === cs.id;
                      return (
                        <button
                          key={cs.id}
                          onClick={() => updateDesign('cardStyle', cs.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isActive
                              ? 'bg-[#3A0E11] border-[#FED7B8]'
                              : 'bg-[#1C0507] border-[#3D0D13] hover:border-[#52141A]'
                          }`}
                        >
                          <div className="text-xs font-bold uppercase text-[#FFF5ED] mb-1">{cs.name}</div>
                          <div className="text-[10px] text-[#B89B8D]">{cs.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 7. Section Visibility Toggles */}
                <div className="p-6 rounded-2xl bg-[#240709] border border-[#3D0D13] space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FED7B8] block mb-0.5">
                      MODULARITY
                    </span>
                    <h3 className="text-base font-black uppercase text-[#FFF5ED]">Visible Portfolio Sections</h3>
                    <p className="text-xs text-[#B89B8D] mt-0.5">
                      Turn sections on or off to match your creative profile needs.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'skills', label: 'Skills & Toolset' },
                      { key: 'projects', label: 'Featured Projects' },
                      { key: 'services', label: 'Client Services' },
                      { key: 'experience', label: 'Career Experience' },
                      { key: 'education', label: 'Academic History' },
                      { key: 'achievements', label: 'Awards & Honors' },
                    ].map((sec) => {
                      const isVisible = portfolio.designConfig?.visibleSections?.[sec.key as keyof typeof portfolio.designConfig.visibleSections] !== false;
                      return (
                        <label
                          key={sec.key}
                          className="flex items-center gap-3 p-3 rounded-xl bg-[#1C0507] border border-[#3D0D13] cursor-pointer hover:border-[#52141A]"
                        >
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={(e) => updateVisibleSection(sec.key, e.target.checked)}
                            className="w-4 h-4 rounded text-[#59171B] focus:ring-0 cursor-pointer"
                          />
                          <span className="text-xs font-mono uppercase text-[#FFF5ED]">{sec.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="p-6 rounded-2xl bg-[#1C0507] border border-[#52141A] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-[#FED7B8] uppercase font-bold flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#18A957]" /> Custom Template Settings Configured
                    </div>
                    <p className="text-[11px] text-[#B89B8D] mt-0.5">
                      Your custom template is live. Preview changes across desktop, tablet, and mobile frames.
                    </p>
                  </div>
                  <Link
                    href="/portfolio/preview"
                    target="_blank"
                    className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 whitespace-nowrap"
                  >
                    <Eye className="w-3.5 h-3.5" /> Launch Device Preview ↗
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 12: SEO & METADATA */}
        {currentStep === 12 && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
                Step 12 / 13
              </span>
              <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">SEO & Search Engine Indexing</h2>
              <p className="text-xs text-[#B89B8D] mt-1">
                Optimize your custom subdomain for Google, Bing, LinkedIn, and Discord link previews.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#240709] border border-[#52141A] space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">SEO Title Tag</label>
                <input
                  type="text"
                  value={portfolio.seoConfig?.seoTitle || ''}
                  onChange={(e) => updateSeo('seoTitle', e.target.value)}
                  className="field"
                  placeholder={`${portfolio.personalInfo?.fullName || 'Creator'} — Esports & Creative Portfolio`}
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Meta Description</label>
                <textarea
                  rows={3}
                  value={portfolio.seoConfig?.seoDescription || ''}
                  onChange={(e) => updateSeo('seoDescription', e.target.value)}
                  className="field resize-none"
                  placeholder="Official portfolio showcasing broadcast design, esports tournament identity, and real-time motion systems."
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#B89B8D] mb-1">Social Preview Image URL (OG Image)</label>
                <input
                  type="text"
                  value={portfolio.seoConfig?.socialPreviewImage || ''}
                  onChange={(e) => updateSeo('socialPreviewImage', e.target.value)}
                  className="field"
                  placeholder="https://naturestudio.in/media/og-preview.jpg"
                />
              </div>
            </div>

            {/* Google Search Simulator */}
            <div className="p-6 rounded-2xl bg-[#1C0507] border border-[#3D0D13] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B89B8D] block">
                SEARCH RESULT SIMULATOR
              </span>
              <div className="text-xs font-mono text-[#18A957]">
                https://{portfolio.slug}.naturestudio.in
              </div>
              <div className="text-base font-bold text-[#8AB4F8] hover:underline cursor-pointer">
                {portfolio.seoConfig?.seoTitle || `${portfolio.personalInfo?.fullName || 'Creator'} — Portfolio`}
              </div>
              <p className="text-xs text-[#BDC1C6] line-clamp-2">
                {portfolio.seoConfig?.seoDescription ||
                  portfolio.personalInfo?.tagline ||
                  'Official portfolio on NatureStudios creative platform.'}
              </p>
            </div>
          </div>
        )}

        {/* STEP 13: REVIEW & PUBLISH */}
        {currentStep === 13 && (
          <div className="space-y-8">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#FED7B8] block mb-1">
                Step 13 / 13
              </span>
              <h2 className="text-3xl font-black uppercase text-[#FFF5ED]">Review & Publish</h2>
              <p className="text-xs text-[#B89B8D] mt-1">
                Verify your settings and publish your portfolio live to the web.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#240709] border border-[#52141A] space-y-4 font-mono text-xs">
              <div className="flex justify-between border-b border-[#3D0D13] pb-3">
                <span className="text-[#B89B8D]">SUBDOMAIN:</span>
                <span className="text-[#FED7B8] font-bold">https://{portfolio.slug}.naturestudio.in</span>
              </div>
              <div className="flex justify-between border-b border-[#3D0D13] pb-3">
                <span className="text-[#B89B8D]">THEME:</span>
                <span className="text-[#FED7B8] uppercase">{portfolio.themeId}</span>
              </div>
              <div className="flex justify-between border-b border-[#3D0D13] pb-3">
                <span className="text-[#B89B8D]">PROJECTS COUNT:</span>
                <span className="text-[#FFF5ED]">{portfolio.projects?.length || 0}</span>
              </div>
              <div className="flex justify-between border-b border-[#3D0D13] pb-3">
                <span className="text-[#B89B8D]">STATUS:</span>
                <span className="text-[#18A957] font-bold">{portfolio.status}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={async () => {
                  await fetch('/api/portfolio/publish', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'PUBLISHED' }),
                  });
                  setPortfolio({ ...portfolio, status: 'PUBLISHED' });
                  alert(`Portfolio successfully published to https://${portfolio.slug}.naturestudio.in!`);
                }}
                className="btn-primary text-xs py-3 px-6"
              >
                Publish Live to {portfolio.slug}.naturestudio.in
              </button>
              <Link href="/portfolio/preview" className="btn-secondary text-xs py-3 px-6">
                Open Device Preview
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="mt-12 pt-6 border-t border-[#3D0D13] flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
            className="btn-secondary text-xs py-2.5 px-4 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>
          <span className="text-xs font-mono text-[#B89B8D]">
            {currentStep} / 13
          </span>
          <button
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 13))}
            disabled={currentStep === 13}
            className="btn-primary text-xs py-2.5 px-5 disabled:opacity-40"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
