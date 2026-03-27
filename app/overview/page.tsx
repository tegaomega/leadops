'use client'

import { useLeads } from '@/hooks/useLeads'
import StatCard from '@/components/StatCard'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const SCORE_COLORS = ['#22d3a5', '#f5c542', '#8b90a7', '#ff5c5c']
const OUTREACH_COLORS: Record<string, string> = {
  new: '#8b90a7',
  contacted: '#f5c542',
  'follow-up': '#fb923c',
  closed: '#22d3a5',
  lost: '#ff5c5c',
}
const BAR_COLOR = '#6c63ff'

const tooltipStyle = {
  backgroundColor: '#13161f',
  border: '1px solid #252836',
  borderRadius: 8,
  color: '#e8eaf0',
  fontSize: 12,
}

export default function OverviewPage() {
  const { leads, loading } = useLeads()

  if (loading) {
    return (
      <div className="p-8">
        <div className="h-8 w-48 bg-[#1a1e2a] rounded animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[#13161f] border border-[#252836] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const total = leads.length
  const hot = leads.filter((l) => l.score >= 8).length
  const inOutreach = leads.filter((l) => ['contacted', 'follow-up'].includes(l.outreach)).length
  const closed = leads.filter((l) => l.outreach === 'closed').length

  // Category chart
  const catMap: Record<string, number> = {}
  leads.forEach((l) => { catMap[l.category] = (catMap[l.category] || 0) + 1 })
  const topCats = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }))

  // Score distribution
  const scoreDist = [
    { name: 'Hot (8-10)',  value: leads.filter((l) => l.score >= 8).length },
    { name: 'Warm (6-7)', value: leads.filter((l) => l.score >= 6 && l.score < 8).length },
    { name: 'Cool (4-5)', value: leads.filter((l) => l.score >= 4 && l.score < 6).length },
    { name: 'Cold (1-3)', value: leads.filter((l) => l.score < 4).length },
  ].filter((d) => d.value > 0)

  // Outreach pipeline
  const outreachMap: Record<string, number> = {}
  leads.forEach((l) => { outreachMap[l.outreach] = (outreachMap[l.outreach] || 0) + 1 })
  const outreachDist = Object.entries(outreachMap).map(([name, value]) => ({ name, value }))

  // Top cities
  const cityMap: Record<string, number> = {}
  leads.forEach((l) => { if (l.city) cityMap[l.city] = (cityMap[l.city] || 0) + 1 })
  const topCities = Object.entries(cityMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <h1 className="text-2xl font-bold mb-1">Overview</h1>
      <p className="text-[#8b90a7] text-sm mb-8">Live lead intelligence dashboard</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Leads"  value={total}      icon="📋" />
        <StatCard label="Hot Leads"    value={hot}        color="#22d3a5" icon="🔥" />
        <StatCard label="In Outreach"  value={inOutreach} color="#f5c542" icon="📞" />
        <StatCard label="Closed"       value={closed}     color="#6c63ff" icon="✅" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#13161f] border border-[#252836] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#8b90a7] uppercase tracking-widest mb-4">Top Categories</h2>
          {topCats.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-[#555b75] text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCats} layout="vertical" margin={{ left: 0, right: 16 }}>
                <XAxis type="number" tick={{ fill: '#555b75', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#8b90a7', fontSize: 11 }} width={110} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1a1e2a' }} />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#13161f] border border-[#252836] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#8b90a7] uppercase tracking-widest mb-4">Score Distribution</h2>
          {scoreDist.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-[#555b75] text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={scoreDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {scoreDist.map((_, i) => <Cell key={i} fill={SCORE_COLORS[i % SCORE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#8b90a7', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#13161f] border border-[#252836] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#8b90a7] uppercase tracking-widest mb-4">Outreach Pipeline</h2>
          {outreachDist.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-[#555b75] text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={outreachDist} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {outreachDist.map((entry, i) => (
                    <Cell key={i} fill={OUTREACH_COLORS[entry.name] || '#8b90a7'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#8b90a7', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-[#13161f] border border-[#252836] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#8b90a7] uppercase tracking-widest mb-4">Top Cities</h2>
          {topCities.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-[#555b75] text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCities} margin={{ left: 0, right: 16 }}>
                <XAxis dataKey="name" tick={{ fill: '#8b90a7', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555b75', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#1a1e2a' }} />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
