export function scoreMeta(score: number) {
  if (score >= 8) return { label: 'Hot',  bg: 'bg-[#22d3a5]/10', text: 'text-[#22d3a5]' }
  if (score >= 6) return { label: 'Warm', bg: 'bg-[#f5c542]/10', text: 'text-[#f5c542]' }
  if (score >= 4) return { label: 'Cool', bg: 'bg-[#555b75]/20',  text: 'text-[#8b90a7]' }
  return              { label: 'Cold', bg: 'bg-[#ff5c5c]/10', text: 'text-[#ff5c5c]' }
}

export function outreachMeta(status: string) {
  switch (status) {
    case 'contacted':  return { bg: 'bg-[#f5c542]/10',  text: 'text-[#f5c542]' }
    case 'follow-up':  return { bg: 'bg-orange-500/10',  text: 'text-orange-400' }
    case 'closed':     return { bg: 'bg-[#22d3a5]/10',  text: 'text-[#22d3a5]' }
    case 'lost':       return { bg: 'bg-[#ff5c5c]/10',  text: 'text-[#ff5c5c]' }
    default:           return { bg: 'bg-[#555b75]/20',  text: 'text-[#8b90a7]' }
  }
}

export default function ScoreBadge({ score }: { score: number }) {
  const { label, bg, text } = scoreMeta(score)
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono font-semibold ${bg} ${text}`}>
      {score} <span className="font-sans font-normal opacity-70">{label}</span>
    </span>
  )
}
