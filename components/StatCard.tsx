interface StatCardProps {
  label: string
  value: number | string
  color?: string
  icon?: string
}

export default function StatCard({ label, value, color = '#6c63ff', icon }: StatCardProps) {
  return (
    <div className="bg-[#13161f] border border-[#252836] rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#8b90a7] uppercase tracking-widest font-semibold">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="text-3xl font-bold font-mono" style={{ color }}>{value}</div>
    </div>
  )
}
