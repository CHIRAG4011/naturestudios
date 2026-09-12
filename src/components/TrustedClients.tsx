'use client';

import React from 'react';

const CLIENTS = [
  { name: 'CHAMPIONS TOUR', note: 'DEMO CONCEPT' },
  { name: 'ARENA SERIES', note: 'DEMO CONCEPT' },
  { name: 'LEVEL UP MEDIA', note: 'STUDIO PARTNER' },
  { name: 'SHIFT BROADCAST', note: 'DEMO CONCEPT' },
  { name: 'ESPORTS COLLECTIVE', note: 'COLLABORATION' },
];

export function TrustedClients() {
  return (
    <section className="py-12 bg-[#150304] border-b border-[#3D0D13]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-mono tracking-widest uppercase text-[#B89B8D]">
            COLLABORATIVE PARTNERS & PRODUCTIONS <span className="text-[#FED7B8] font-bold">[SAMPLE DEMO ROSTER]</span>
          </div>
          <div className="flex flex-wrap items-center gap-8 text-xs font-mono tracking-widest text-[#FED7B8]/70">
            {CLIENTS.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="font-bold text-[#FFF5ED]">{c.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2D0A0E] border border-[#52141A] text-[#B89B8D]">
                  {c.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
