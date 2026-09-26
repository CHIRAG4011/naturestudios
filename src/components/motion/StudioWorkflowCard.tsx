'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Activity, Cpu, ArrowRight, Check, Sliders, Layers } from 'lucide-react';
import { Tilt3DCard } from '@/components/motion/Tilt3DCard';
import { Magnetic } from '@/components/motion/Magnetic';

interface WorkflowPreset {
  id: string;
  name: string;
  tag: string;
  engine: string;
  latency: string;
  framerate: string;
  colorSpace: string;
  description: string;
}

const PRESETS: WorkflowPreset[] = [
  {
    id: 'broadcast-hud',
    name: 'Broadcast HUD',
    tag: 'RT-GRAPHICS',
    engine: 'Unreal 5.4.4',
    latency: '8ms Ultra-Low',
    framerate: '4K @ 60 FPS',
    colorSpace: 'ACEScc Rec.2020',
    description: 'Dynamic in-game broadcast overlays, live tournament telemetry & scoreboards.',
  },
  {
    id: 'unreal-arena',
    name: 'Unreal 5 Arena',
    tag: 'VIRTUAL-STAGE',
    engine: 'UE5 Lumen + Nanite',
    latency: '14ms Synced',
    framerate: '4K @ 120 FPS',
    colorSpace: 'ACEScg HDR-Cinema',
    description: '360° virtual production arena with live camera tracking & LED volume sync.',
  },
  {
    id: 'esports-motion',
    name: 'Esports Motion',
    tag: 'IDENTITY-VFX',
    engine: 'After Effects + Octane',
    latency: 'Zero Buffer',
    framerate: 'ProRes 4444 XQ',
    colorSpace: 'DCI-P3 Cinema',
    description: 'High-octane team roster intros, stinger transitions & championship graphics.',
  },
  {
    id: 'stage-arch',
    name: 'Stage Architecture',
    tag: 'SPATIAL-ENV',
    engine: 'Notch + Disguise d3',
    latency: 'Sub-frame Genlock',
    framerate: 'Custom 16K Canvas',
    colorSpace: 'Linear RAW',
    description: 'Physical stadium LED facade mapping and kinetic lighting DMX protocols.',
  },
];

export function StudioWorkflowCard() {
  const [selectedPreset, setSelectedPreset] = useState<WorkflowPreset>(PRESETS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [typedPrompt, setTypedPrompt] = useState('Direct tournament broadcast identity...');

  const handleInitiate = () => {
    setIsProcessing(true);
    setProcessed(false);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessed(true);
      setTimeout(() => setProcessed(false), 3000);
    }, 1200);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Dynamic Backlight Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#2563EB]/40 via-[#38BDF8]/20 to-[#1D4ED8]/40 rounded-[28px] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Floating KaultAI HUD Micro Tag pinned to top-right */}
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-2 z-20 px-3 py-1 rounded-full bg-[#070D1E]/95 border border-[#38BDF8]/60 shadow-[0_0_20px_rgba(56,189,248,0.35)] backdrop-blur-md text-[10px] font-mono tracking-widest text-[#38BDF8] flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
        <span>[ VELOCITY_X ]</span>
      </motion.div>

      {/* Floating KaultAI HUD Micro Tag pinned to bottom-left */}
      <motion.div
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex absolute -bottom-4 -left-4 z-20 px-3 py-1 rounded-full bg-[#070D1E]/95 border border-[#2563EB]/60 shadow-[0_0_20px_rgba(37,99,235,0.35)] backdrop-blur-md text-[10px] font-mono tracking-widest text-[#94A3B8] items-center gap-1.5"
      >
        <Activity className="w-3 h-3 text-[#18A957]" />
        <span>[ FLOW_LOCKED: 99.8% ]</span>
      </motion.div>

      {/* 3D Tilt Wrapper */}
      <Tilt3DCard maxTilt={4} glareOpacity={0.16} className="w-full rounded-[24px]">
        <div className="relative rounded-[24px] bg-[#070D1E]/90 border border-[#1E3A8A]/90 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden">
          {/* Subtle Cyber Grid Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#1E3A8A_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Top Bar / Telemetry Status */}
          <div className="relative z-10 flex items-center justify-between border-b border-[#1E3A8A]/60 pb-4 mb-5 text-[11px] font-mono">
            <div className="flex items-center gap-2 text-[#F8FAFC]">
              <div className="w-2.5 h-2.5 rounded-sm bg-[#2563EB] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#38BDF8]" />
              </div>
              <span className="font-bold tracking-wider uppercase text-xs">STUDIO PIPELINE</span>
              <span className="text-[#38BDF8] text-[10px] px-1.5 py-0.5 rounded bg-[#172554] border border-[#2563EB]/40">
                v2.6
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#38BDF8]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#18A957] animate-pulse" />
              <span className="text-[10px] tracking-widest text-[#94A3B8]">GPU CLUSTER ONLINE</span>
            </div>
          </div>

          {/* Central Directive Prompt */}
          <div className="relative z-10 space-y-3 mb-5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8]">
              <span className="uppercase tracking-widest text-[#38BDF8]">DIRECTIVE INGEST</span>
              <span className="text-[10px]">{selectedPreset.tag}</span>
            </div>

            <div className="relative">
              <div className="w-full px-4 py-3 rounded-xl bg-[#030712]/80 border border-[#1E3A8A] text-sm text-[#F8FAFC] font-mono flex items-center justify-between shadow-inner focus-within:border-[#38BDF8] transition-colors">
                <span className="truncate">{typedPrompt}</span>
                <span className="w-2 h-4 bg-[#38BDF8] animate-pulse ml-1 shrink-0" />
              </div>
            </div>

            {/* Quick Presets Selection Pills */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider block mb-2">
                SELECT STUDIO PRESET:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(preset);
                        setTypedPrompt(`Directing ${preset.name.toLowerCase()}...`);
                      }}
                      className={`px-3 py-2 rounded-xl text-left font-mono text-[11px] transition-all flex flex-col justify-between border cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E40AF]/30 border-[#38BDF8] text-[#F8FAFC] shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                          : 'bg-[#0B132B]/60 border-[#1E3A8A]/50 text-[#94A3B8] hover:border-[#2563EB] hover:text-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{preset.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-[#38BDF8]" />}
                      </div>
                      <span className="text-[9px] text-[#64748B] mt-0.5">{preset.engine}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active Preset Telemetry Meters */}
          <div className="relative z-10 bg-[#030712]/60 rounded-xl p-3 border border-[#1E3A8A]/70 mb-5">
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-1.5 rounded-lg bg-[#070D1E] border border-[#1E3A8A]/40">
                <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">Latency</span>
                <span className="text-xs font-bold text-[#38BDF8] tabular-nums">{selectedPreset.latency}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#070D1E] border border-[#1E3A8A]/40">
                <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">Rate</span>
                <span className="text-xs font-bold text-[#F8FAFC] tabular-nums">{selectedPreset.framerate}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#070D1E] border border-[#1E3A8A]/40">
                <span className="text-[9px] uppercase tracking-wider text-[#64748B] block">Color</span>
                <span className="text-xs font-bold text-[#38BDF8] truncate block">{selectedPreset.colorSpace}</span>
              </div>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-2.5 px-1 leading-relaxed">
              {selectedPreset.description}
            </p>
          </div>

          {/* Action Trigger Button */}
          <div className="relative z-10">
            <button
              type="button"
              onClick={handleInitiate}
              disabled={isProcessing}
              className={`w-full py-3 px-5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                processed
                  ? 'bg-[#18A957] text-[#030712] shadow-[0_0_25px_rgba(24,169,87,0.5)]'
                  : isProcessing
                  ? 'bg-[#1E40AF] text-[#F8FAFC] animate-pulse'
                  : 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-[#F8FAFC] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:brightness-110 active:scale-[0.98]'
              }`}
            >
              {processed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>PIPELINE ENGAGED // LINKED</span>
                </>
              ) : isProcessing ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-[#38BDF8]" />
                  <span>INITIALIZING CLUSTER SHADERS...</span>
                </>
              ) : (
                <>
                  <span>INITIATE DEEP WORKFLOW</span>
                  <ArrowRight className="w-4 h-4 text-[#38BDF8]" />
                </>
              )}
            </button>
          </div>
        </div>
      </Tilt3DCard>
    </div>
  );
}
