'use client'

import { useState } from 'react'
import { useLeads } from '@/hooks/useLeads'
import ScoreBadge, { outreachMeta } from '@/components/ScoreBadge'
import type { Lead, OutreachStatus } from '@/lib/types'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'

const COLUMNS: { id: OutreachStatus; label: string; color: string }[] = [
  { id: 'new',        label: 'New',        color: '#8b90a7' },
  { id: 'contacted',  label: 'Contacted',  color: '#f5c542' },
  { id: 'follow-up',  label: 'Follow-Up',  color: '#fb923c' },
  { id: 'closed',     label: 'Closed',     color: '#22d3a5' },
]

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: lead.id })
  const style = transform ? { transform: `translate3d(${transform.x}px,${transform.y}px,0)` } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`bg-[#1a1e2a] border border-[#252836] rounded-xl p-4 cursor-grab active:cursor-grabbing transition-opacity ${isDragging ? 'opacity-40' : 'hover:border-[#6c63ff]/40'}`}
    >
      <div className="font-medium text-sm text-[#e8eaf0] mb-1 leading-snug">{lead.name}</div>
      <div className="text-xs text-[#555b75] mb-3">{lead.category} · {lead.city}</div>
      <div className="flex items-center justify-between">
        <ScoreBadge score={lead.score} />
        <span className="text-xs text-[#555b75] font-mono">{lead.phone || '—'}</span>
      </div>
    </div>
  )
}

function Column({ id, label, color, leads, onCardClick }: {
  id: OutreachStatus
  label: string
  color: string
  leads: Lead[]
  onCardClick: (l: Lead) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col min-w-[260px] w-full">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-sm font-semibold text-[#e8eaf0]">{label}</span>
        <span className="ml-auto text-xs font-mono bg-[#1a1e2a] border border-[#252836] px-2 py-0.5 rounded-full text-[#8b90a7]">{leads.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 min-h-[200px] rounded-xl p-3 transition-colors ${isOver ? 'bg-[#6c63ff]/5 border-2 border-dashed border-[#6c63ff]/30' : 'bg-[#0c0e14]/40'}`}
      >
        {leads.map((l) => <LeadCard key={l.id} lead={l} onClick={() => onCardClick(l)} />)}
        {leads.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-[#555b75] text-xs">Drop here</div>
        )}
      </div>
    </div>
  )
}

function DetailModal({ lead, onClose, onUpdateOutreach, onUpdateNotes }: {
  lead: Lead
  onClose: () => void
  onUpdateOutreach: (id: string, s: OutreachStatus) => void
  onUpdateNotes: (id: string, n: string) => void
}) {
  const [notes, setNotes] = useState(lead.notes)
  const om = outreachMeta(lead.outreach)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#13161f] border border-[#252836] rounded-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg">{lead.name}</h2>
            <p className="text-sm text-[#8b90a7]">{lead.category} · {lead.city}</p>
          </div>
          <button onClick={onClose} className="text-[#555b75] hover:text-[#e8eaf0] text-xl">✕</button>
        </div>
        <div className="flex gap-3 mb-4">
          <ScoreBadge score={lead.score} />
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${om.bg} ${om.text}`}>{lead.outreach}</span>
        </div>
        <div className="text-sm text-[#8b90a7] mb-1">{lead.address}</div>
        <div className="text-sm font-mono text-[#8b90a7] mb-4">{lead.phone}</div>
        <select
          value={lead.outreach}
          onChange={(e) => onUpdateOutreach(lead.id, e.target.value as OutreachStatus)}
          className="w-full bg-[#1a1e2a] border border-[#252836] rounded-lg px-3 py-2 text-sm text-[#e8eaf0] mb-3 focus:outline-none focus:border-[#6c63ff]"
        >
          {(['new','contacted','follow-up','closed','lost'] as OutreachStatus[]).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onUpdateNotes(lead.id, notes)}
          rows={3}
          placeholder="Notes..."
          className="w-full bg-[#1a1e2a] border border-[#252836] rounded-lg px-3 py-2 text-sm text-[#e8eaf0] resize-none focus:outline-none focus:border-[#6c63ff]"
        />
      </div>
    </div>
  )
}

export default function OutreachPage() {
  const { leads, loading, updateOutreach, updateNotes } = useLeads()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Lead | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const activeLead = leads.find((l) => l.id === activeId)

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string)
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const { active, over } = e
    if (!over) return
    const lead = leads.find((l) => l.id === active.id)
    if (!lead) return
    const newStatus = over.id as OutreachStatus
    if (lead.outreach !== newStatus) {
      updateOutreach(lead.id, newStatus)
    }
  }

  if (loading) return (
    <div className="p-8">
      <div className="h-8 w-48 bg-[#1a1e2a] rounded animate-pulse mb-8" />
      <div className="flex gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="w-64 h-96 bg-[#13161f] border border-[#252836] rounded-xl animate-pulse" />)}
      </div>
    </div>
  )

  return (
    <div className="p-6 md:p-8 h-full">
      <h1 className="text-2xl font-bold mb-1">Outreach</h1>
      <p className="text-[#8b90a7] text-sm mb-8">Drag leads between stages to update their status</p>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              {...col}
              leads={leads.filter((l) => l.outreach === col.id)}
              onCardClick={setSelected}
            />
          ))}
        </div>
        <DragOverlay>
          {activeLead && (
            <div className="bg-[#1a1e2a] border border-[#6c63ff]/40 rounded-xl p-4 shadow-2xl w-64 rotate-2">
              <div className="font-medium text-sm text-[#e8eaf0] mb-1">{activeLead.name}</div>
              <div className="text-xs text-[#555b75]">{activeLead.category} · {activeLead.city}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {selected && (
        <DetailModal
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdateOutreach={(id, s) => { updateOutreach(id, s); setSelected((p) => p ? { ...p, outreach: s } : null) }}
          onUpdateNotes={(id, n) => { updateNotes(id, n); setSelected((p) => p ? { ...p, notes: n } : null) }}
        />
      )}
    </div>
  )
}
