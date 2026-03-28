'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLeads } from '@/hooks/useLeads'

const slides = [
  { id: 'cover',        label: 'Cover' },
  { id: 'problem',      label: 'Problem' },
  { id: 'solution',     label: 'Solution' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'scoring',      label: 'Scoring' },
  { id: 'stack',        label: 'Stack' },
  { id: 'impact',       label: 'Impact' },
  { id: 'demo',         label: 'Live Demo' },
  { id: 'roadmap',      label: 'Roadmap' },
]

export default function PresentationPage() {
  const { leads } = useLeads()
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const total   = leads.length
  const hot     = leads.filter(l => l.score >= 8).length
  const warm    = leads.filter(l => l.score >= 6 && l.score < 8).length
  const inPipe  = leads.filter(l => ['contacted','follow-up'].includes(l.outreach)).length

  const go = useCallback((idx: number) => {
    if (animating || idx < 0 || idx >= slides.length) return
    setAnimating(true)
    setTimeout(() => { setCurrent(idx); setAnimating(false) }, 200)
  }, [animating])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(current + 1)
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(current - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, go])

  const s = (bg = '#0c0e14') =>
    `min-h-screen flex flex-col items-center justify-center p-12 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`

  return (
    <div className="relative min-h-screen bg-[#0c0e14] select-none">

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#252836] z-50">
        <div className="h-full bg-[#6c63ff] transition-all duration-300"
          style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
      </div>

      {/* Slide nav dots */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {slides.map((s, i) => (
          <button key={s.id} onClick={() => go(i)}
            className={`h-1.5 rounded-full transition-all duration-200 ${i === current ? 'w-6 bg-[#6c63ff]' : 'w-1.5 bg-[#252836] hover:bg-[#555b75]'}`} />
        ))}
      </div>

      {/* Slide counter */}
      <div className="fixed top-4 right-6 text-xs text-[#555b75] z-50 font-mono">
        {current + 1} / {slides.length}
      </div>

      {/* ── SLIDE 0: COVER ── */}
      {current === 0 && (
        <div className={s()}>
          <div className="text-center max-w-3xl">
            <div className="inline-block bg-[#6c63ff]/10 border border-[#6c63ff]/30 text-[#a5a0ff] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              Technical Project Summary · March 2026
            </div>
            <h1 className="text-8xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Lead<span className="text-[#6c63ff]">Ops</span>
            </h1>
            <p className="text-2xl text-[#8b90a7] mb-12">
              Real-Time Lead Intelligence & Outreach CRM<br/>for Houston SMB Web Development
            </p>
            <div className="flex justify-center gap-12">
              {[
                { label: 'Author',  value: 'Tega P. Eshareturi' },
                { label: 'Role',    value: 'Data Science · Oracle' },
                { label: 'Status',  value: '✓ Live in Production', color: '#22d3a5' },
              ].map(m => (
                <div key={m.label} className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#555b75] mb-1">{m.label}</div>
                  <div className="text-sm font-semibold" style={{ color: m.color || '#e8eaf0' }}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE 1: PROBLEM ── */}
      {current === 1 && (
        <div className={s()}>
          <div className="max-w-4xl w-full">
            <div className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-3">The Problem</div>
            <h2 className="text-5xl font-bold mb-12" style={{ fontFamily: 'Georgia, serif' }}>
              Houston has a<br/><span className="text-[#ff5c5c]">trust gap.</span>
            </h2>
            <div className="grid grid-cols-3 gap-6">
              {[
                { stat: '40–60%', label: 'of Houston SMBs have no professional website', color: '#ff5c5c' },
                { stat: '78%',    label: 'of customers skip a business with no site, even with 5-star reviews', color: '#f5c542' },
                { stat: '$0',     label: 'spent on digital presence by most target businesses', color: '#8b90a7' },
              ].map(c => (
                <div key={c.stat} className="bg-[#13161f] border border-[#252836] rounded-2xl p-8">
                  <div className="text-5xl font-bold font-mono mb-4" style={{ color: c.color }}>{c.stat}</div>
                  <p className="text-[#8b90a7] text-sm leading-relaxed">{c.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-[#13161f] border border-[#252836] rounded-2xl p-6">
              <p className="text-[#8b90a7] leading-relaxed">
                <span className="text-[#e8eaf0] font-semibold">The operational challenge:</span> Manually identifying, scoring, and coordinating outreach across thousands of businesses across dozens of Houston ZIP codes is prohibitively time-intensive without infrastructure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE 2: SOLUTION ── */}
      {current === 2 && (
        <div className={s()}>
          <div className="max-w-4xl w-full">
            <div className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-3">The Solution</div>
            <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              An end-to-end<br/><span className="text-[#22d3a5]">automated pipeline.</span>
            </h2>
            <p className="text-[#8b90a7] mb-10 text-lg">From raw Google Maps data to a live CRM in one command.</p>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { step: '01', label: 'Discover',  desc: 'Google Maps Places API scans 50 categories × 10 ZIP codes', color: '#6c63ff' },
                { step: '02', label: 'Filter',    desc: 'Removes businesses that already have a real website', color: '#6c63ff' },
                { step: '03', label: 'Score',     desc: 'Proprietary 1–10 algorithm ranks by conversion potential', color: '#6c63ff' },
                { step: '04', label: 'Sync',      desc: 'Upserts to Supabase — idempotent, zero duplicates', color: '#22d3a5' },
                { step: '05', label: 'Collaborate', desc: 'Team of 3 shares live CRM, kanban, and pitch templates', color: '#22d3a5' },
              ].map((step, i) => (
                <div key={step.step} className="flex items-center gap-3">
                  <div className="bg-[#13161f] border border-[#252836] rounded-2xl p-5 w-44">
                    <div className="text-xs font-mono font-bold mb-2" style={{ color: step.color }}>{step.step}</div>
                    <div className="font-semibold text-[#e8eaf0] mb-1">{step.label}</div>
                    <div className="text-[11px] text-[#555b75] leading-relaxed">{step.desc}</div>
                  </div>
                  {i < 4 && <div className="text-[#252836] text-2xl">→</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE 3: ARCHITECTURE ── */}
      {current === 3 && (
        <div className={s()}>
          <div className="max-w-3xl w-full">
            <div className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-3">Architecture</div>
            <h2 className="text-5xl font-bold mb-10" style={{ fontFamily: 'Georgia, serif' }}>System Design</h2>
            <div className="flex flex-col items-center gap-2">
              {[
                { node: 'Google Maps Places API', color: 'border-[#6c63ff]/50 text-[#a5a0ff]' },
                { arrow: true },
                { node: 'Python — 10 Parallel Workers (ThreadPoolExecutor)', color: 'border-[#252836]' },
                { arrow: true },
                { node: 'Scoring Engine — Deterministic 1–10 Model', color: 'border-[#252836]' },
                { arrow: true },
                { node: 'Supabase PostgreSQL — Upsert on place_id', color: 'border-[#6c63ff]/50 text-[#a5a0ff]', note: 'Real-time CDC → WebSocket' },
                { arrow: true },
                { node: 'Next.js 16 — React hooks + Server Components', color: 'border-[#252836]' },
                { arrow: true },
                { node: 'Vercel Edge CDN — Auto-deploy on git push', color: 'border-[#22d3a5]/50 text-[#22d3a5]' },
                { arrow: true },
                { node: '3-Person Team — Sub-200ms real-time sync', color: 'border-[#22d3a5]/50 text-[#22d3a5]' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center w-full">
                  {'arrow' in item ? (
                    <div className="text-[#555b75] text-lg my-1">↓</div>
                  ) : (
                    <div className={`w-full max-w-lg bg-[#13161f] border rounded-xl px-6 py-3 text-sm font-medium text-center relative ${item.color}`}>
                      {item.node}
                      {item.note && <span className="absolute -right-36 top-1/2 -translate-y-1/2 text-xs text-[#555b75] whitespace-nowrap">{item.note}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE 4: SCORING ── */}
      {current === 4 && (
        <div className={s()}>
          <div className="max-w-4xl w-full">
            <div className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-3">Algorithm</div>
            <h2 className="text-5xl font-bold mb-10" style={{ fontFamily: 'Georgia, serif' }}>Lead Scoring Model</h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-[#13161f] border border-[#252836] rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#555b75] mb-5">Calculation</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Base score',              pts: '+1', always: true },
                    { label: 'Verified phone number',   pts: '+1' },
                    { label: 'Status: Operational',     pts: '+1' },
                    { label: '1+ Reviews',              pts: '+1' },
                    { label: '5+ Reviews',              pts: '+1' },
                    { label: '20+ Reviews',             pts: '+1' },
                    { label: 'Rating 4.0–4.4 ⭐',        pts: '+1' },
                    { label: 'Rating 4.5+ ⭐',           pts: '+3', hot: true },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between items-center border-b border-[#252836] pb-2">
                      <span className="text-sm text-[#8b90a7]">{r.label}</span>
                      <span className={`font-mono font-bold text-sm ${r.hot ? 'text-[#f5c542]' : 'text-[#22d3a5]'}`}>{r.pts}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm font-bold text-[#e8eaf0]">Maximum</span>
                    <span className="font-mono font-bold text-[#6c63ff]">10</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { range: '8–10', label: 'Hot', desc: 'Operational + high reviews + 4.5+ stars. Call first. Premium pitch.', color: '#22d3a5', bg: 'bg-[#22d3a5]/10 border-[#22d3a5]/30' },
                  { range: '6–7',  label: 'Warm', desc: 'Good signals. Growth tier. High conversion probability.', color: '#f5c542', bg: 'bg-[#f5c542]/10 border-[#f5c542]/30' },
                  { range: '4–5',  label: 'Cool', desc: 'Starter tier. Price-sensitive. Needs ROI framing.', color: '#8b90a7', bg: 'bg-[#252836]/40 border-[#252836]' },
                  { range: '1–3',  label: 'Cold', desc: 'Walk-in only. Verify still operational.', color: '#ff5c5c', bg: 'bg-[#ff5c5c]/10 border-[#ff5c5c]/30' },
                ].map(tier => (
                  <div key={tier.range} className={`border rounded-2xl p-5 ${tier.bg}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono font-bold text-2xl" style={{ color: tier.color }}>{tier.range}</span>
                      <span className="font-semibold text-[#e8eaf0]">{tier.label}</span>
                    </div>
                    <p className="text-xs text-[#8b90a7]">{tier.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE 5: STACK ── */}
      {current === 5 && (
        <div className={s()}>
          <div className="max-w-4xl w-full">
            <div className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-3">Technology</div>
            <h2 className="text-5xl font-bold mb-10" style={{ fontFamily: 'Georgia, serif' }}>Stack</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { tech: 'Next.js 16 (App Router)',       role: 'Frontend framework',              why: 'Server components, Vercel-native, file-based routing' },
                { tech: 'TypeScript',                    role: 'Type safety',                     why: 'End-to-end type safety across all data models' },
                { tech: 'Supabase + PostgreSQL',         role: 'Database & real-time',            why: 'CDC via WebSocket, REST API, row-level security ready' },
                { tech: 'Python + ThreadPoolExecutor',   role: 'Data acquisition',                why: '10 parallel workers — 10x faster than sequential calls' },
                { tech: 'Tailwind CSS',                  role: 'Styling',                         why: 'Zero runtime CSS overhead, utility-first' },
                { tech: 'Recharts',                      role: 'Analytics charts',                why: 'React-native, composable, performant' },
                { tech: 'dnd-kit',                       role: 'Kanban drag & drop',              why: 'Accessible, pointer + touch sensor support' },
                { tech: 'Vercel Edge CDN',               role: 'Hosting & CI/CD',                 why: 'Auto-deploy on git push, global edge network' },
              ].map(s => (
                <div key={s.tech} className="bg-[#13161f] border border-[#252836] rounded-xl p-5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-[#e8eaf0] text-sm">{s.tech}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded">{s.role}</span>
                  </div>
                  <p className="text-xs text-[#555b75]">{s.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE 6: IMPACT ── */}
      {current === 6 && (
        <div className={s()}>
          <div className="max-w-4xl w-full">
            <div className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-3">Results</div>
            <h2 className="text-5xl font-bold mb-10" style={{ fontFamily: 'Georgia, serif' }}>Business Impact</h2>
            <div className="grid grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Leads found today',       value: total.toLocaleString(), color: '#6c63ff' },
                { label: 'Hot leads (score 8–10)',  value: hot.toLocaleString(),   color: '#22d3a5' },
                { label: 'Warm leads (score 6–7)',  value: warm.toLocaleString(),  color: '#f5c542' },
                { label: 'In active outreach',      value: inPipe.toLocaleString(), color: '#8b90a7' },
              ].map(s => (
                <div key={s.label} className="bg-[#13161f] border border-[#252836] rounded-2xl p-8 text-center">
                  <div className="text-5xl font-bold font-mono mb-3" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-sm text-[#8b90a7]">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#13161f] border border-[#252836] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#252836]">
                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-[#555b75]">Metric</th>
                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-[#555b75]">Before</th>
                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-[#555b75]">LeadOps</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Time to find 100 leads',   '~8 hours',     '~5 minutes'],
                    ['Duplicates',               'Common',        'Zero'],
                    ['Team sync',                'Text / email',  'Real-time <200ms'],
                    ['Lead context on call',     'None',          'Score + pitch template'],
                  ].map(([m, b, a]) => (
                    <tr key={m} className="border-b border-[#252836]/50">
                      <td className="px-5 py-3 text-[#e8eaf0] font-medium">{m}</td>
                      <td className="px-5 py-3 text-[#ff5c5c]">{b}</td>
                      <td className="px-5 py-3 text-[#22d3a5] font-semibold">{a}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE 7: DEMO ── */}
      {current === 7 && (
        <div className={s()}>
          <div className="max-w-3xl w-full text-center">
            <div className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-3">Live</div>
            <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>See it in action.</h2>
            <p className="text-[#8b90a7] text-lg mb-12">All data is live from Supabase. Updates in real time.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { page: 'Overview',  path: '/overview',  desc: 'Live stats + 4 charts', icon: '◈' },
                { page: 'Leads',     path: '/leads',     desc: 'Filter + search + export', icon: '⊞' },
                { page: 'Outreach',  path: '/outreach',  desc: 'Kanban drag-and-drop', icon: '◎' },
                { page: 'Playbook',  path: '/playbook',  desc: 'Sales battlecards + scripts', icon: '📋' },
              ].map(p => (
                <a key={p.page} href={p.path} target="_blank"
                  className="bg-[#13161f] border border-[#252836] hover:border-[#6c63ff]/50 rounded-2xl p-6 text-left transition-colors group">
                  <div className="text-2xl mb-3">{p.icon}</div>
                  <div className="font-semibold text-[#e8eaf0] mb-1 group-hover:text-[#6c63ff] transition-colors">{p.page}</div>
                  <div className="text-xs text-[#555b75]">{p.desc}</div>
                </a>
              ))}
            </div>
            <div className="bg-[#13161f] border border-[#252836] rounded-xl px-6 py-4 text-sm text-[#8b90a7] font-mono">
              https://leadops-ochre.vercel.app
            </div>
          </div>
        </div>
      )}

      {/* ── SLIDE 8: ROADMAP ── */}
      {current === 8 && (
        <div className={s()}>
          <div className="max-w-4xl w-full">
            <div className="text-[#6c63ff] text-xs font-bold uppercase tracking-widest mb-3">Future</div>
            <h2 className="text-5xl font-bold mb-10" style={{ fontFamily: 'Georgia, serif' }}>Roadmap</h2>
            <div className="space-y-4">
              {[
                { phase: '01', title: 'Phase 2 — DevOps', desc: 'Docker containerization · GitHub Actions CI/CD · Automated test suite', color: '#6c63ff', status: 'Next' },
                { phase: '02', title: 'Phase 3 — GenAI Integration', desc: 'Claude/Gemini API for personalized pitch generation · RAG over playbook · Oracle team AI assistant', color: '#f5c542', status: 'Planned' },
                { phase: '03', title: 'Phase 4 — MCP Servers', desc: 'Model Context Protocol server exposing LeadOps as AI agent tools · Autonomous outreach sequencing', color: '#22d3a5', status: 'Planned' },
                { phase: '04', title: 'Phase 5 — Enterprise Scale', desc: 'Texas → Nationwide expansion · LLM-powered qualification · CRM integrations (Salesforce, HubSpot)', color: '#8b90a7', status: 'Future' },
              ].map(r => (
                <div key={r.phase} className="flex gap-6 items-start bg-[#13161f] border border-[#252836] rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold font-mono flex-shrink-0"
                    style={{ background: `${r.color}20`, border: `1px solid ${r.color}50`, color: r.color }}>
                    {r.phase}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-[#e8eaf0]">{r.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                        style={{ background: `${r.color}15`, color: r.color }}>{r.status}</span>
                    </div>
                    <p className="text-sm text-[#555b75]">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation arrows */}
      <button onClick={() => go(current - 1)} disabled={current === 0}
        className="fixed left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#13161f] border border-[#252836] text-[#8b90a7] hover:text-[#e8eaf0] hover:border-[#6c63ff]/50 disabled:opacity-20 transition-all text-xl z-50">
        ‹
      </button>
      <button onClick={() => go(current + 1)} disabled={current === slides.length - 1}
        className="fixed right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#13161f] border border-[#252836] text-[#8b90a7] hover:text-[#e8eaf0] hover:border-[#6c63ff]/50 disabled:opacity-20 transition-all text-xl z-50">
        ›
      </button>

      {/* Keyboard hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[#555b75] font-mono z-50">
        ← → arrow keys to navigate
      </div>
    </div>
  )
}
