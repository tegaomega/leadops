'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { label: 'Overview',   href: '/overview',  icon: '◈' },
  { label: 'Lead List',  href: '/leads',     icon: '⊞' },
  { label: 'Outreach',   href: '/outreach',  icon: '◎' },
]

const tools = [
  { label: 'Import Data', href: '/import',   icon: '↑' },
  { label: 'Playbook',      href: '/playbook',      icon: '📋' },
  { label: 'Presentation', href: '/presentation',  icon: '🎯' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#13161f] border-r border-[#252836] px-3 py-6">
        <div className="px-3 mb-8">
          <div className="text-xl font-bold text-white tracking-tight">LeadOps</div>
          <div className="text-xs text-[#8b90a7] mt-0.5">Web Dev CRM</div>
        </div>

        <div className="mb-2 px-3 text-[10px] font-semibold text-[#555b75] uppercase tracking-widest">Main</div>
        <nav className="space-y-0.5 mb-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-[#6c63ff]/20 text-[#6c63ff] font-medium'
                  : 'text-[#8b90a7] hover:text-[#e8eaf0] hover:bg-[#1a1e2a]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mb-2 px-3 text-[10px] font-semibold text-[#555b75] uppercase tracking-widest">Tools</div>
        <nav className="space-y-0.5 mb-6">
          {tools.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-[#6c63ff]/20 text-[#6c63ff] font-medium'
                  : 'text-[#8b90a7] hover:text-[#e8eaf0] hover:bg-[#1a1e2a]'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-3 py-2 rounded-lg bg-[#1a1e2a] text-xs text-[#8b90a7]">
          <div className="font-medium text-[#e8eaf0] mb-0.5">Team</div>
          <div>3 members</div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#13161f] border-t border-[#252836] flex z-50">
        {[...nav, ...tools].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
              pathname === item.href ? 'text-[#6c63ff]' : 'text-[#555b75]'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
