'use client'

import { useState, useMemo, useRef } from 'react'
import { useLeads } from '@/hooks/useLeads'
import ScoreBadge, { outreachMeta } from '@/components/ScoreBadge'
import type { Lead, OutreachStatus } from '@/lib/types'

const OUTREACH_OPTIONS: OutreachStatus[] = ['new', 'contacted', 'follow-up', 'closed', 'lost']
const PAGE_SIZE = 25

function pitchTemplate(lead: Lead): string {
  return `Hi, I'm reaching out to ${lead.name} in ${lead.city}. I noticed your business doesn't have a website yet — I build professional websites starting at $149/month that help local businesses like yours get found on Google and convert more customers. Would you be open to a quick 10-minute call this week?`
}

function DetailPanel({ lead, onClose, onUpdateOutreach, onUpdateNotes }: {
  lead: Lead
  onClose: () => void
  onUpdateOutreach: (id: string, s: OutreachStatus) => void
  onUpdateNotes: (id: string, n: string) => void
}) {
  const [notes, setNotes] = useState(lead.notes)
  const [pitch, setPitch] = useState(false)
  const om = outreachMeta(lead.outreach)

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#13161f] border-l border-[#252836] h-full overflow-y-auto p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold">{lead.name}</h2>
            <p className="text-sm text-[#8b90a7]">{lead.category} · {lead.city}</p>
          </div>
          <button onClick={onClose} className="text-[#555b75] hover:text-[#e8eaf0] text-xl mt-0.5">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-[#1a1e2a] rounded-lg p-3">
            <div className="text-[#555b75] text-xs mb-1">Score</div>
            <ScoreBadge score={lead.score} />
          </div>
          <div className="bg-[#1a1e2a] rounded-lg p-3">
            <div className="text-[#555b75] text-xs mb-1">Status</div>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${om.bg} ${om.text}`}>{lead.outreach}</span>
          </div>
          <div className="bg-[#1a1e2a] rounded-lg p-3 col-span-2">
            <div className="text-[#555b75] text-xs mb-1">Address</div>
            <div className="text-[#e8eaf0]">{lead.address || '—'}</div>
          </div>
          <div className="bg-[#1a1e2a] rounded-lg p-3">
            <div className="text-[#555b75] text-xs mb-1">Phone</div>
            <div className="text-[#e8eaf0]">{lead.phone || '—'}</div>
          </div>
          <div className="bg-[#1a1e2a] rounded-lg p-3">
            <div className="text-[#555b75] text-xs mb-1">Rating</div>
            <div className="text-[#e8eaf0]">{lead.rating ? `${lead.rating} ⭐ (${lead.reviews})` : '—'}</div>
          </div>
          <div className="bg-[#1a1e2a] rounded-lg p-3 col-span-2">
            <div className="text-[#555b75] text-xs mb-1">Website</div>
            <div className="text-[#e8eaf0] break-all">{lead.website || 'None'}</div>
          </div>
        </div>

        <div>
          <label className="text-xs text-[#555b75] uppercase tracking-widest mb-1 block">Outreach Status</label>
          <select
            value={lead.outreach}
            onChange={(e) => onUpdateOutreach(lead.id, e.target.value as OutreachStatus)}
            className="w-full bg-[#1a1e2a] border border-[#252836] rounded-lg px-3 py-2 text-sm text-[#e8eaf0] focus:outline-none focus:border-[#6c63ff]"
          >
            {OUTREACH_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-[#555b75] uppercase tracking-widest mb-1 block">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => onUpdateNotes(lead.id, notes)}
            rows={4}
            placeholder="Add notes..."
            className="w-full bg-[#1a1e2a] border border-[#252836] rounded-lg px-3 py-2 text-sm text-[#e8eaf0] resize-none focus:outline-none focus:border-[#6c63ff]"
          />
        </div>

        <button
          onClick={() => setPitch(!pitch)}
          className="w-full py-2 rounded-lg bg-[#6c63ff]/20 text-[#6c63ff] text-sm font-medium hover:bg-[#6c63ff]/30 transition-colors"
        >
          {pitch ? 'Hide Pitch' : '✨ Generate Pitch'}
        </button>
        {pitch && (
          <div className="bg-[#1a1e2a] border border-[#252836] rounded-lg p-4 text-sm text-[#e8eaf0] leading-relaxed">
            {pitchTemplate(lead)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function LeadsPage() {
  const { leads, loading, updateOutreach, updateNotes } = useLeads()
  const [search, setSearch] = useState('')
  const [scoreFilter, setScoreFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [outreachFilter, setOutreachFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Lead | null>(null)
  const notesTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const categories = useMemo(() => [...new Set(leads.map((l) => l.category).filter(Boolean))].sort(), [leads])
  const cities = useMemo(() => [...new Set(leads.map((l) => l.city).filter(Boolean))].sort(), [leads])

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (search) {
        const q = search.toLowerCase()
        if (![l.name, l.city, l.category, l.phone].some((f) => f?.toLowerCase().includes(q))) return false
      }
      if (scoreFilter === 'hot'  && !(l.score >= 8)) return false
      if (scoreFilter === 'warm' && !(l.score >= 6 && l.score < 8)) return false
      if (scoreFilter === 'cool' && !(l.score >= 4 && l.score < 6)) return false
      if (scoreFilter === 'cold' && !(l.score < 4)) return false
      if (categoryFilter !== 'all' && l.category !== categoryFilter) return false
      if (cityFilter !== 'all' && l.city !== cityFilter) return false
      if (outreachFilter !== 'all' && l.outreach !== outreachFilter) return false
      return true
    })
  }, [leads, search, scoreFilter, categoryFilter, cityFilter, outreachFilter])

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  function exportCSV() {
    const cols = ['name','category','city','zip','address','phone','website','rating','reviews','score','outreach','notes']
    const rows = filtered.map((l) => cols.map((c) => JSON.stringify((l as unknown as Record<string, unknown>)[c] ?? '')).join(','))
    const csv = [cols.join(','), ...rows].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `leads_export_${Date.now()}.csv`
    a.click()
  }

  const selectStyle = "bg-[#1a1e2a] border border-[#252836] rounded-lg px-3 py-2 text-sm text-[#e8eaf0] focus:outline-none focus:border-[#6c63ff]"

  if (loading) return (
    <div className="p-8">
      <div className="h-8 w-48 bg-[#1a1e2a] rounded animate-pulse mb-6" />
      {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-[#13161f] border border-[#252836] rounded-lg mb-2 animate-pulse" />)}
    </div>
  )

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Lead List</h1>
          <p className="text-[#8b90a7] text-sm">{filtered.length} leads{search || scoreFilter !== 'all' ? ' (filtered)' : ''}</p>
        </div>
        <button onClick={exportCSV} className="px-4 py-2 bg-[#1a1e2a] border border-[#252836] rounded-lg text-sm hover:border-[#6c63ff] transition-colors">
          ↓ Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name, city, category, phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 min-w-48 bg-[#1a1e2a] border border-[#252836] rounded-lg px-3 py-2 text-sm text-[#e8eaf0] placeholder-[#555b75] focus:outline-none focus:border-[#6c63ff]"
        />
        <select value={scoreFilter} onChange={(e) => { setScoreFilter(e.target.value); setPage(1) }} className={selectStyle}>
          <option value="all">All Scores</option>
          <option value="hot">Hot (8-10)</option>
          <option value="warm">Warm (6-7)</option>
          <option value="cool">Cool (4-5)</option>
          <option value="cold">Cold (1-3)</option>
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }} className={selectStyle}>
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={cityFilter} onChange={(e) => { setCityFilter(e.target.value); setPage(1) }} className={selectStyle}>
          <option value="all">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={outreachFilter} onChange={(e) => { setOutreachFilter(e.target.value); setPage(1) }} className={selectStyle}>
          <option value="all">All Statuses</option>
          {OUTREACH_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#13161f] border border-[#252836] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#252836] text-[#555b75] text-xs uppercase tracking-widest">
                <th className="text-left px-4 py-3 font-semibold">Business</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">City</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-semibold">Score</th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">Reviews</th>
                <th className="text-left px-4 py-3 font-semibold">Outreach</th>
                <th className="text-left px-4 py-3 font-semibold hidden xl:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className="border-b border-[#252836]/50 hover:bg-[#1a1e2a] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#e8eaf0]">{lead.name}</div>
                    <div className="text-xs text-[#555b75]">{lead.zip}</div>
                  </td>
                  <td className="px-4 py-3 text-[#8b90a7] hidden md:table-cell">{lead.category}</td>
                  <td className="px-4 py-3 text-[#8b90a7] hidden md:table-cell">{lead.city}</td>
                  <td className="px-4 py-3 text-[#8b90a7] hidden lg:table-cell font-mono text-xs">{lead.phone || '—'}</td>
                  <td className="px-4 py-3"><ScoreBadge score={lead.score} /></td>
                  <td className="px-4 py-3 text-[#8b90a7] hidden lg:table-cell font-mono">{lead.reviews}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.outreach}
                      onChange={(e) => updateOutreach(lead.id, e.target.value as OutreachStatus)}
                      className="bg-[#1a1e2a] border border-[#252836] rounded px-2 py-1 text-xs text-[#e8eaf0] focus:outline-none"
                    >
                      {OUTREACH_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell" onClick={(e) => e.stopPropagation()}>
                    <input
                      defaultValue={lead.notes}
                      onBlur={(e) => {
                        clearTimeout(notesTimers.current[lead.id])
                        notesTimers.current[lead.id] = setTimeout(() => updateNotes(lead.id, e.target.value), 500)
                      }}
                      placeholder="Add note..."
                      className="bg-transparent border-b border-[#252836] text-xs text-[#8b90a7] w-full focus:outline-none focus:border-[#6c63ff] py-0.5"
                    />
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={8} className="text-center py-16 text-[#555b75]">No leads match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#252836] text-sm text-[#8b90a7]">
            <span>Page {page} of {totalPages} · {filtered.length} leads</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-[#1a1e2a] disabled:opacity-30 hover:text-[#e8eaf0] transition-colors">← Prev</button>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-[#1a1e2a] disabled:opacity-30 hover:text-[#e8eaf0] transition-colors">Next →</button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <DetailPanel
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdateOutreach={(id, s) => { updateOutreach(id, s); setSelected((prev) => prev ? { ...prev, outreach: s } : null) }}
          onUpdateNotes={(id, n) => { updateNotes(id, n); setSelected((prev) => prev ? { ...prev, notes: n } : null) }}
        />
      )}
    </div>
  )
}
