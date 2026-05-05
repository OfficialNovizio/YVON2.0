'use client';

import { useState } from 'react';

const steps = [
  { id: 1, label: 'Brief', done: true },
  { id: 2, label: 'Mood', done: true },
  { id: 3, label: 'Script', done: true },
  { id: 4, label: 'Captions', done: true },
  { id: 5, label: 'Prompts', done: false, active: true },
  { id: 6, label: 'Assets', done: false },
];

const prompts = [
  {
    id: 1,
    title: 'The Monolith',
    version: 'v1.1',
    text: 'Cinematic wide shot, brutalist concrete monolith structure standing in a vast minimal desert landscape. Golden hour lighting casting dramatic long shadows. A solitary figure in high-end knitwear stands at the base, looking up. Shot on 35mm film, anamorphic lens flare, deep focus, color grading inspired by Denis Villeneuve. 8k resolution, highly detailed.',
  },
  {
    id: 2,
    title: 'Founder Pulse',
    version: 'v2.0',
    text: 'Close up portrait of a young Gen Z founder in a dimly lit, high-end creative studio workspace. Focus on intense, concentrated expression illuminated by the cool glow of a monitor. Background softly blurred with bokeh from colored neon LED strips. Premium, moody, authentic, contemporary style, medium format photography, sharp focus on eyes.',
  },
];

const meta = [
  { label: 'Objective', value: 'Launch Spring Collection' },
  { label: 'Audience', value: 'Gen Z Founders' },
  { label: 'Tone', value: 'Premium / Cinematic' },
  { label: 'Status', value: 'Active', green: true },
];

export default function CreativeStudioPage() {
  const [copied, setCopied] = useState<number | null>(null);

  function handleCopy(id: number, text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="pt-20 pb-24 px-8 max-w-[900px] mx-auto">

      {/* Page Header */}
      <div className="text-center pt-14 pb-10">
        <h1
          className="text-[56px] font-semibold text-white mb-3"
          style={{ letterSpacing: '-0.28px', lineHeight: '1.07' }}
        >
          Creative Studio
        </h1>
        <div className="flex items-center justify-center gap-3">
          <span className="text-[15px] text-white/50 font-medium">Novizio Spring Campaign</span>
          <span className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            In Production
          </span>
        </div>
      </div>

      {/* Workflow Stepper */}
      <div className="flex items-center justify-center gap-0 mb-14">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold transition-all
                  ${step.active
                    ? 'bg-[#0066cc] text-white'
                    : step.done
                    ? 'bg-white/10 text-white'
                    : 'bg-white/5 text-white/20'
                  }`}
              >
                {step.done && !step.active ? (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  step.active ? 'text-[#0066cc]' : step.done ? 'text-white/60' : 'text-white/20'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-px mb-6 mx-1 ${
                  steps[i + 1].done || steps[i + 1].active ? 'bg-white/20' : 'bg-white/5'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Section Title */}
      <h2
        className="text-[28px] font-semibold text-white text-center mb-8"
        style={{ letterSpacing: '-0.28px' }}
      >
        AI Image Prompts
      </h2>

      {/* Prompt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-[#111111] border border-white/[0.06] rounded-[18px] p-7 flex flex-col gap-5"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <h3
                className="text-[17px] font-semibold text-white"
                style={{ letterSpacing: '-0.374px' }}
              >
                {prompt.title}
              </h3>
              <span className="text-[10px] font-bold text-white/30 bg-white/5 border border-white/[0.06] px-2.5 py-1 rounded-full uppercase tracking-widest">
                {prompt.version}
              </span>
            </div>

            {/* Prompt Text */}
            <p
              className="text-[14px] text-white/60 flex-grow"
              style={{ lineHeight: '1.65' }}
            >
              {prompt.text}
            </p>

            {/* Card Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => handleCopy(prompt.id, prompt.text)}
                className="flex items-center gap-2 bg-[#0066cc] hover:opacity-90 text-white px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied === prompt.id ? 'check' : 'content_copy'}
                </span>
                {copied === prompt.id ? 'Copied' : 'Copy Prompt'}
              </button>
              <button className="text-[13px] font-semibold text-white/40 hover:text-white/70 transition-colors px-3 py-2.5 rounded-full hover:bg-white/5 active:scale-95">
                Refine
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Metadata Strip */}
      <div className="bg-[#111111] border border-white/[0.06] rounded-[18px] px-8 py-6 grid grid-cols-4 gap-6 mb-12">
        {meta.map((item) => (
          <div key={item.label}>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] mb-1.5">
              {item.label}
            </p>
            <p
              className={`text-[14px] font-semibold flex items-center gap-1.5 ${
                item.green ? 'text-green-400' : 'text-white'
              }`}
            >
              {item.green && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block flex-shrink-0" />
              )}
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Step Navigation */}
      <div className="flex items-center justify-center gap-4">
        <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/60 text-[13px] font-semibold hover:bg-white/5 hover:text-white transition-all active:scale-95">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Captions
        </button>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0066cc] text-white text-[13px] font-semibold hover:opacity-90 transition-all active:scale-95">
          Generate Assets
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* Page Footer */}
      <footer className="mt-24 pt-8 border-t border-white/5 flex items-center justify-between">
        <p className="text-[12px] text-white/20">
          © 2024 YVONOs Creative Studio. Built for Excellence.
        </p>
        <div className="flex items-center gap-6 text-[12px] text-white/30">
          {['Privacy', 'Terms', 'Support', 'Contact'].map((link) => (
            <a key={link} href="#" className="hover:text-white/60 transition-colors">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
