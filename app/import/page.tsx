'use client'

import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { supabase } from '@/lib/supabase'
import type { Lead } from '@/lib/types'

const EXPECTED_COLS = ['place_id','name','category','city','zip','address','phone','website','rating','reviews','business_status','types','score','score_label','outreach','notes']

type ParsedRow = Record<string, string>

function mapRow(row: ParsedRow): Partial<Lead> {
  return {
    place_id:        row.place_id || row['Place ID'] || '',
    name:            row.name     || row['Business Name'] || '',
    category:        row.category || row['Category'] || '',
    city:            row.city     || row['City'] || '',
    zip:             row.zip      || row['ZIP'] || '',
    address:         row.address  || row['Address'] || '',
    phone:           row.phone    || row['Phone'] || '',
    website:         row.website  || row['Website'] || '',
    rating:          parseFloat(row.rating || row['Rating'] || '0') || null,
    reviews:         parseInt(row.reviews  || row['Review Count'] || '0') || 0,
    business_status: row.business_status || row['Status'] || '',
    types:           row.types    || row['Types'] || '',
    score:           parseInt(row.score   || row['Lead Score'] || '1') || 1,
    score_label:     row.score_label || '',
    outreach:        (row.outreach as Lead['outreach']) || 'new',
    notes:           row.notes    || row['Notes'] || '',
  }
}

export default function ImportPage() {
  const [preview, setPreview] = useState<Partial<Lead>[]>([])
  const [rawRows, setRawRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ success: number; skipped: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  // Manual add state
  const [manual, setManual] = useState({ name: '', phone: '', city: '', category: '', address: '' })
  const [manualSaving, setManualSaving] = useState(false)

  function parseFile(file: File) {
    setResult(null)
    setError(null)
    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRawRows(results.data)
        setPreview(results.data.slice(0, 5).map(mapRow))
      },
      error: () => setError('Failed to parse CSV. Make sure it has headers.'),
    })
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type === 'text/csv' || file?.name.endsWith('.csv')) parseFile(file)
    else setError('Please drop a .csv file')
  }, [])

  async function handleImport() {
    if (!rawRows.length) return
    setImporting(true)
    setResult(null)
    try {
      const rows = rawRows.map(mapRow).filter((r) => r.place_id)
      const { data, error: err } = await supabase
        .from('leads')
        .upsert(rows, { onConflict: 'place_id', ignoreDuplicates: false })
        .select('id')
      if (err) throw err
      setResult({ success: data?.length ?? rows.length, skipped: rawRows.length - rows.length })
      setPreview([])
      setRawRows([])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  async function handleManualAdd() {
    if (!manual.name) return
    setManualSaving(true)
    const place_id = `manual_${Date.now()}_${Math.random().toString(36).slice(2)}`
    const { error: err } = await supabase.from('leads').insert({
      ...manual,
      place_id,
      score: 5,
      score_label: 'manual',
      outreach: 'new',
      reviews: 0,
    })
    setManualSaving(false)
    if (err) setError(err.message)
    else {
      setManual({ name: '', phone: '', city: '', category: '', address: '' })
      setResult({ success: 1, skipped: 0 })
    }
  }

  const inputStyle = "w-full bg-[#1a1e2a] border border-[#252836] rounded-lg px-3 py-2 text-sm text-[#e8eaf0] placeholder-[#555b75] focus:outline-none focus:border-[#6c63ff]"

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-1">Import Data</h1>
      <p className="text-[#8b90a7] text-sm mb-8">Upload a CSV from the Python lead finder script</p>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-2xl p-12 text-center mb-6 transition-colors ${
          dragging ? 'border-[#6c63ff] bg-[#6c63ff]/5' : 'border-[#252836] hover:border-[#6c63ff]/40'
        }`}
      >
        <div className="text-4xl mb-3">📂</div>
        <p className="text-[#e8eaf0] font-medium mb-1">Drop your CSV file here</p>
        <p className="text-[#555b75] text-sm mb-4">or</p>
        <label className="cursor-pointer px-4 py-2 bg-[#6c63ff] hover:bg-[#6c63ff]/80 text-white rounded-lg text-sm font-medium transition-colors">
          Browse Files
          <input type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f) }} />
        </label>
        <p className="text-xs text-[#555b75] mt-4">Expected columns: {EXPECTED_COLS.slice(0, 5).join(', ')}, ...</p>
      </div>

      {error && <div className="mb-4 p-3 bg-[#ff5c5c]/10 border border-[#ff5c5c]/30 rounded-lg text-sm text-[#ff5c5c]">{error}</div>}
      {result && (
        <div className="mb-4 p-3 bg-[#22d3a5]/10 border border-[#22d3a5]/30 rounded-lg text-sm text-[#22d3a5]">
          ✅ Imported {result.success} leads{result.skipped > 0 ? ` · ${result.skipped} skipped (no place_id)` : ''}
        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Preview ({rawRows.length} rows)</h2>
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-4 py-2 bg-[#6c63ff] hover:bg-[#6c63ff]/80 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {importing ? 'Importing...' : `Import ${rawRows.length} leads`}
            </button>
          </div>
          <div className="bg-[#13161f] border border-[#252836] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#252836] text-[#555b75]">
                    {['name','category','city','phone','score','outreach'].map((h) => (
                      <th key={h} className="text-left px-4 py-2 uppercase tracking-widest font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-b border-[#252836]/50">
                      <td className="px-4 py-2 text-[#e8eaf0]">{row.name}</td>
                      <td className="px-4 py-2 text-[#8b90a7]">{row.category}</td>
                      <td className="px-4 py-2 text-[#8b90a7]">{row.city}</td>
                      <td className="px-4 py-2 text-[#8b90a7] font-mono">{row.phone}</td>
                      <td className="px-4 py-2 font-mono text-[#22d3a5]">{row.score}</td>
                      <td className="px-4 py-2 text-[#8b90a7]">{row.outreach}</td>
                    </tr>
                  ))}
                  {rawRows.length > 5 && (
                    <tr><td colSpan={6} className="px-4 py-2 text-[#555b75] text-center">... and {rawRows.length - 5} more rows</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manual add */}
      <div className="bg-[#13161f] border border-[#252836] rounded-xl p-6">
        <h2 className="font-semibold mb-4">Add Lead Manually</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input placeholder="Business name *" value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} className={inputStyle} />
          <input placeholder="Phone" value={manual.phone} onChange={(e) => setManual({ ...manual, phone: e.target.value })} className={inputStyle} />
          <input placeholder="City" value={manual.city} onChange={(e) => setManual({ ...manual, city: e.target.value })} className={inputStyle} />
          <input placeholder="Category" value={manual.category} onChange={(e) => setManual({ ...manual, category: e.target.value })} className={inputStyle} />
          <input placeholder="Address" value={manual.address} onChange={(e) => setManual({ ...manual, address: e.target.value })} className={`${inputStyle} md:col-span-2`} />
        </div>
        <button
          onClick={handleManualAdd}
          disabled={!manual.name || manualSaving}
          className="px-4 py-2 bg-[#6c63ff] hover:bg-[#6c63ff]/80 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {manualSaving ? 'Saving...' : '+ Add Lead'}
        </button>
      </div>
    </div>
  )
}
