'use client'

import { useLeads } from '@/hooks/useLeads'

export default function PlaybookPage() {
  const { leads } = useLeads()
  const total = leads.length
  const hot = leads.filter((l) => l.score >= 8).length

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-24">

      {/* Sticky header */}
      <div className="sticky top-0 z-40 px-6 py-5 text-white border-b border-slate-800 flex justify-between items-center"
        style={{ background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(10px)' }}>
        <div>
          <h2 className="text-lg font-semibold">Sales Lead Command Center</h2>
          <p className="text-xs text-slate-400">Current Campaign: <span className="text-blue-400">Houston "No-Web" Outreach</span></p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Live Lead Count</p>
            <p className="text-sm font-bold text-emerald-400">{total.toLocaleString()} Records</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Hot Leads</p>
            <p className="text-sm font-bold text-orange-400">{hot.toLocaleString()} 🔥</p>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-12 max-w-6xl mx-auto space-y-20">

        {/* ── MARKET INSIGHT ── */}
        <section id="market" className="scroll-mt-24">
          <div className="mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Strategy</p>
            <h3 className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Houston Market Opportunity</h3>
            <p className="text-slate-500 mt-2 text-lg">Why this campaign matters right now.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '👥', color: 'text-blue-500', title: 'The "Trust Gap"', body: 'In Houston\'s competitive service market, 78% of customers will skip a business if they cannot find a professional site, even if the Google Reviews are 5-star.' },
              { icon: '📱', color: 'text-emerald-500', title: 'The Mobile Surge', body: 'Most local searches for "Plumber" or "Food Truck" happen on the move. No site means no "One-Click Booking" or "Directions" integration.' },
              { icon: '📈', color: 'text-purple-500', title: 'Wix Studio Edge', body: "We aren't selling \"sites.\" We are selling Business Operating Systems (CRM, Bookings, Automations) that traditional agencies overcharge for." },
            ].map((c) => (
              <div key={c.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform">
                <div className={`text-3xl mb-4 ${c.color}`}>{c.icon}</div>
                <h4 className="font-bold text-slate-800 text-lg">{c.title}</h4>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SCORING ── */}
        <section id="scoring" className="scroll-mt-24 bg-slate-900 rounded-[2rem] p-10 text-white">
          <div className="max-w-3xl">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Scoring Logic</p>
            <h3 className="text-4xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Lead Scoring: The 1–10 Breakdown</h3>
            <p className="text-slate-400 mt-4 text-lg">A proprietary algorithm to filter junk and focus on businesses with <em>Ability to Pay</em> and <em>Critical Need.</em></p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <div className="space-y-8">
              {[
                { score: '10', ring: 'border-blue-500 bg-blue-500/20 text-blue-400', label: 'The "Golden" Lead', desc: 'Operational + Phone + 20+ Reviews + 4.5 Stars. This business is drowning in work but losing efficiency. They need Automation.' },
                { score: '7–9', ring: 'border-emerald-500 bg-emerald-500/20 text-emerald-400', label: 'High Growth', desc: 'Good reviews but low volume. They need a site to Scale. High conversion probability for professional portfolios.' },
                { score: '5–6', ring: 'border-yellow-500 bg-yellow-500/20 text-yellow-400', label: 'Warm Prospect', desc: 'Operational but minimal reviews. Offer the Starter tier. They are price-sensitive but reachable.' },
                { score: '1–4', ring: 'border-slate-600 bg-slate-700 text-slate-400', label: 'Cold / Scouting', desc: 'No phone or low ratings. Do not call. Walk-in only to verify they are still open.', dim: true },
              ].map((row) => (
                <div key={row.score} className={`flex gap-4 items-start ${row.dim ? 'opacity-40' : ''}`}>
                  <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold flex-shrink-0 text-sm ${row.ring}`}>{row.score}</div>
                  <div>
                    <h4 className="font-bold text-lg">{row.label}</h4>
                    <p className="text-sm text-slate-400 mt-1 leading-relaxed">{row.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 h-fit">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">Calculation Logic</h4>
              <ul className="space-y-4 text-sm">
                {[
                  { label: 'Base Score', pts: '1 pt', color: 'text-white' },
                  { label: 'Verified Phone Number', pts: '+1 pt', color: 'text-emerald-400' },
                  { label: 'Status: Operational', pts: '+1 pt', color: 'text-emerald-400' },
                  { label: '1+ Reviews', pts: '+1 pt', color: 'text-emerald-400' },
                  { label: '5+ Reviews', pts: '+1 pt', color: 'text-emerald-400' },
                  { label: '20+ Reviews', pts: '+1 pt', color: 'text-emerald-400' },
                  { label: 'Rating 4.0–4.4 Stars', pts: '+1 pt', color: 'text-yellow-400' },
                  { label: 'Rating 4.5+ Stars', pts: '+3 pts', color: 'text-orange-400' },
                ].map((row) => (
                  <li key={row.label} className="flex justify-between border-b border-slate-700 pb-3">
                    <span className="text-slate-300">{row.label}</span>
                    <span className={`font-bold font-mono ${row.color}`}>{row.pts}</span>
                  </li>
                ))}
                <li className="flex justify-between pt-1">
                  <span className="font-bold text-white">Maximum Score</span>
                  <span className="font-bold font-mono text-blue-400">10 pts</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── TIER 1 BATTLECARDS ── */}
        <section id="tier1" className="scroll-mt-24">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-orange-100 text-orange-600">Tier 1: Emergency & High Ticket</span>
            <h3 className="text-4xl font-bold text-slate-900 mt-3" style={{ fontFamily: 'Georgia, serif' }}>Core Industry Battlecards</h3>
            <p className="text-slate-500 mt-1">Deep-dive strategies for our most profitable categories.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '🔧', iconBg: 'bg-blue-50 text-blue-600', tag: 'Avg Deal: $2,500+', tagColor: 'bg-blue-100 text-blue-700',
                title: 'Home Trades (Plumbing / Electric)',
                pain: '"I\'m losing high-end homeowners because my only presence is a 3.8-star Google listing with no portfolio."',
                reasons: ['Need 24/7 Lead Capture for emergencies', 'Trust builds through License/Insurance display', 'High project costs require professional visual proof'],
                featureColor: 'text-blue-600', feature: 'Wix Booking for Quote Estimates',
              },
              {
                icon: '🚚', iconBg: 'bg-orange-50 text-orange-600', tag: 'High Vol / Low Friction', tagColor: 'bg-orange-100 text-orange-700',
                title: 'Food Trucks & Pop-Ups',
                pain: '"Customers never know where I am today. My Instagram menu is blurry and hard to read."',
                reasons: ['Dynamic "Location Finder" map', 'Direct-to-consumer online ordering (Zero Fees)', 'QR Code menus for faster service line-ups'],
                featureColor: 'text-orange-600', feature: 'Sync with Google Calendar for locations',
              },
              {
                icon: '🏗️', iconBg: 'bg-slate-100 text-slate-600', tag: 'High ACV', tagColor: 'bg-slate-100 text-slate-700',
                title: 'General Contractors & Roofers',
                pain: '"I\'m getting all my jobs from referrals but I can\'t scale. Nobody can see my project portfolio."',
                reasons: ['Before/after project gallery drives inbound', 'License, bond, and insurance display builds trust', 'Project estimate request form captures warm leads 24/7'],
                featureColor: 'text-slate-600', feature: 'Wix Pro Gallery + Quote Request Form',
              },
              {
                icon: '🔒', iconBg: 'bg-yellow-50 text-yellow-600', tag: 'Emergency Demand', tagColor: 'bg-yellow-100 text-yellow-700',
                title: 'Locksmiths & Security',
                pain: '"I\'m spending $600/month on Yelp ads that don\'t convert. People need me NOW, not in 3 days."',
                reasons: ['24/7 emergency call button above the fold', 'Live chat widget for immediate response', 'Google Maps embed for instant directions'],
                featureColor: 'text-yellow-600', feature: 'Click-to-Call + Live Chat Integration',
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl text-2xl ${card.iconBg}`}>{card.icon}</div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${card.tagColor}`}>{card.tag}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-800">{card.title}</h4>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">The Pain Point</p>
                    <p className="text-sm text-slate-600 italic leading-relaxed">{card.pain}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Why They Need You</p>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {card.reasons.map((r) => <li key={r}>• {r}</li>)}
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className={`text-[10px] font-bold uppercase mb-1 ${card.featureColor}`}>Killer Feature</p>
                    <p className="text-xs font-bold text-slate-800">{card.feature}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIER 2 BATTLECARDS ── */}
        <section id="tier2" className="scroll-mt-24">
          <div className="mb-8">
            <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">Tier 2: Lifestyle & Beauty</span>
            <h3 className="text-4xl font-bold text-slate-900 mt-3" style={{ fontFamily: 'Georgia, serif' }}>Lifestyle Industry Battlecards</h3>
            <p className="text-slate-500 mt-1">High-frequency, relationship-driven businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '✂️', iconBg: 'bg-pink-50 text-pink-600', tag: 'Repeat Clients', tagColor: 'bg-pink-100 text-pink-700',
                title: 'Salons & Nail Bars',
                pain: '"I\'m fully booked through word-of-mouth but I can\'t grow because new clients can\'t find or book me online."',
                reasons: ['Online booking eliminates phone interruptions mid-service', 'Gallery/portfolio drives Instagram-style discovery', 'Loyalty programs and gift cards increase LTV'],
                featureColor: 'text-pink-600', feature: 'Wix Bookings + SMS Reminder Automation',
              },
              {
                icon: '💪', iconBg: 'bg-green-50 text-green-600', tag: 'Subscription Revenue', tagColor: 'bg-green-100 text-green-700',
                title: 'Gyms & Personal Trainers',
                pain: '"I charge per session but I need recurring revenue. My clients forget to rebook and I lose momentum."',
                reasons: ['Membership/subscription billing automation', 'Transformation gallery builds social proof', 'Online class scheduling fills off-peak slots'],
                featureColor: 'text-green-600', feature: 'Wix Pricing Plans for Monthly Memberships',
              },
              {
                icon: '🐾', iconBg: 'bg-amber-50 text-amber-600', tag: 'High LTV', tagColor: 'bg-amber-100 text-amber-700',
                title: 'Pet Groomers & Vets',
                pain: '"I rely on repeat customers but I have no system for reminders, rescheduling, or bringing back lapsed clients."',
                reasons: ['Automated appointment reminders cut no-shows by 40%', 'Pet profile system builds long-term relationships', 'Review request automation grows Google ratings'],
                featureColor: 'text-amber-600', feature: 'Wix Automations for Re-Engagement Flows',
              },
              {
                icon: '🍽️', iconBg: 'bg-red-50 text-red-600', tag: 'Daily Revenue', tagColor: 'bg-red-100 text-red-700',
                title: 'Restaurants & Cafés',
                pain: '"I\'m paying 30% commission to DoorDash and GrubHub. I can\'t build a real customer relationship through them."',
                reasons: ['Direct online ordering eliminates third-party fees', 'Table reservation system fills seats proactively', 'Email/SMS list captures repeat customer data'],
                featureColor: 'text-red-600', feature: 'Wix Restaurants with Direct Online Ordering',
              },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl text-2xl ${card.iconBg}`}>{card.icon}</div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${card.tagColor}`}>{card.tag}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-800">{card.title}</h4>
                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">The Pain Point</p>
                    <p className="text-sm text-slate-600 italic leading-relaxed">{card.pain}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Why They Need You</p>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {card.reasons.map((r) => <li key={r}>• {r}</li>)}
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className={`text-[10px] font-bold uppercase mb-1 ${card.featureColor}`}>Killer Feature</p>
                    <p className="text-xs font-bold text-slate-800">{card.feature}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PRICING TIERS ── */}
        <section className="scroll-mt-24">
          <div className="mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pricing</p>
            <h3 className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>What You're Selling</h3>
            <p className="text-slate-500 mt-1">Three tiers. One conversation framework.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { tier: 'Starter', price: '$149', per: '/mo', color: 'border-blue-200', accent: 'bg-blue-600', tag: 'Most Common Close', items: ['5-Page Professional Site', 'Contact Form + Click-to-Call', 'Google Business Integration', 'Mobile Responsive', 'SSL + Hosting Included'] },
              { tier: 'Growth', price: '$299', per: '/mo', color: 'border-emerald-300 ring-2 ring-emerald-400', accent: 'bg-emerald-600', tag: '⭐ Best Value', items: ['Everything in Starter', 'Wix Bookings / Online Orders', 'Basic SEO Package', 'Backend Dashboard', 'Monthly Analytics Report'] },
              { tier: 'Premium', price: '$499', per: '/mo', color: 'border-purple-200', accent: 'bg-purple-600', tag: 'Enterprise Clients', items: ['Everything in Growth', 'Full Back-Office Management', 'Email Marketing Automation', 'CRM Integration', 'Priority Support (24hr SLA)'] },
            ].map((p) => (
              <div key={p.tier} className={`bg-white rounded-3xl p-8 shadow-sm border-2 ${p.color} relative`}>
                <span className={`absolute -top-3 left-6 text-[10px] font-bold px-3 py-1 rounded-full text-white ${p.accent}`}>{p.tag}</span>
                <h4 className="text-xl font-bold text-slate-800 mt-2">{p.tier}</h4>
                <div className="mt-3 mb-6">
                  <span className="text-4xl font-bold text-slate-900">{p.price}</span>
                  <span className="text-slate-400 text-sm">{p.per}</span>
                </div>
                <ul className="space-y-3">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-emerald-500 mt-0.5">✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── SCRIPT LIBRARY ── */}
        <section id="scripts" className="scroll-mt-24">
          <div className="mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Execution</p>
            <h3 className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>The Script Library</h3>
            <p className="text-slate-500">Battle-tested templates for every channel.</p>
          </div>
          <div className="space-y-6">
            {[
              {
                icon: '📞', channel: 'The "Lost Opportunity" Call', target: 'Target: High Priority (7+)', targetColor: 'bg-blue-100 text-blue-600',
                context: 'Use when they have 50+ reviews but NO website. Highlight that they are already successful, but "leaking" customers to competitors who look more professional online.',
                script: `"Hi [Name], I'm [Your Name] with [Company]. I'm calling because I was actually just looking for a [Industry] in [City] and found you on Google Maps.\n\nYou have incredible reviews — honestly, some of the best I've seen in the area. But I noticed something: when I went to click your website to check your [Services/Menu], there wasn't one listed.\n\nIn a market like [City], about 70% of high-end customers skip a business without a site, even with great reviews. I'm building out professional hubs for [Industry] that include [Killer Feature].\n\nCan I send you a 60-second mockup of what your brand could look like on mobile?"`,
                tip: 'Starts with a compliment. Uses "negative urgency" (losing customers). Offers a "mockup" (low friction) not a "meeting" (high friction).',
                tipColor: 'bg-emerald-50 text-emerald-700',
              },
              {
                icon: '🚶', channel: 'The "In the Area" Walk-In', target: 'Target: Local Retail / Salons', targetColor: 'bg-orange-100 text-orange-600',
                context: 'Best used in dense commercial areas. Drop in during off-peak hours (10am–12pm or 2pm–4pm). Always have a phone mockup ready.',
                script: `"Hi, I'm [Your Name]. I build websites for a few businesses here in [Neighborhood]. I was just passing by and realized [Business Name] is the only one on the block without a digital storefront on Google.\n\nI don't want to take up your time while you're working, but I've got a design for a [Industry] booking system that cuts out the phone tag you're doing right now.\n\nIf I leave my card, could I text you a link to a demo later today?"`,
                tip: 'Short, respectful of their time. Leaves a tangible follow-up action. Never ask for a decision on the first visit.',
                tipColor: 'bg-blue-50 text-blue-700',
              },
              {
                icon: '💬', channel: 'The Cold Text / DM', target: 'Target: Food Trucks / Pop-Ups', targetColor: 'bg-purple-100 text-purple-600',
                context: 'Use for businesses that are clearly active on Instagram or Facebook but have no website link in bio. Keep it under 3 sentences.',
                script: `"Hey [Name] 👋 Found [Business] on Google Maps — love the reviews. Noticed no site yet. I build mobile-first sites for Houston food businesses. Yours could have a live location map + online ordering in under a week. Want me to send a quick mockup? No cost, no commitment."`,
                tip: 'Keep DMs under 3 sentences. Use one emoji max. Always end with a yes/no question. Never pitch price in the first message.',
                tipColor: 'bg-purple-50 text-purple-700',
              },
            ].map((s) => (
              <div key={s.channel} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{s.icon} {s.channel}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${s.targetColor}`}>{s.target}</span>
                </div>
                <div className="p-8">
                  <p className="text-sm text-slate-500 mb-5"><strong>Context:</strong> {s.context}</p>
                  <div className="border-l-4 border-blue-400 bg-slate-50 p-6 rounded-r-lg mb-5 font-mono text-sm text-slate-700 leading-relaxed whitespace-pre-line">{s.script}</div>
                  <div className={`p-4 rounded-xl text-xs leading-relaxed ${s.tipColor}`}><strong>Why it works: </strong>{s.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── OBJECTION KILLERS ── */}
        <section id="objections" className="scroll-mt-24 pb-10">
          <div className="mb-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Execution</p>
            <h3 className="text-4xl font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>Objection Killers</h3>
            <p className="text-slate-500">The "Feel-Felt-Found" method for turning a NO into a YES.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                objection: '"I have a Facebook Page already."',
                response: 'I totally understand — Facebook is great for social updates. However, Facebook is rented land. If their algorithm changes or your account gets flagged, your business vanishes. A website is your digital real estate — you own it, you control it, and most importantly, it\'s what Google shows first in local searches.',
                highlight: 'Facebook is rented land.',
              },
              {
                objection: '"I\'m too busy, I don\'t need leads."',
                response: "That's exactly why we need to talk. My system isn't just about leads — it's about Efficiency. Every hour you spend answering the phone for basic questions about your hours or services is an hour you aren't [working]. A site automates your FAQs and Bookings so you get your time back.",
                highlight: 'Efficiency, not just leads.',
              },
              {
                objection: '"My nephew can build one for free."',
                response: "Free is a great price! But usually 'free' doesn't come with Ongoing Management. If your site breaks on a Friday night, will your nephew be there? I provide professional-grade hosting, security, and monthly management so your business stays online without you ever lifting a finger.",
                highlight: "Ongoing management is the product.",
              },
              {
                objection: '"How much does it cost?"',
                response: 'Great question. Before I give you a number — how many new customers do you get per week? Our Starter plan at $149/month pays for itself if it brings in just one new client. And our Growth plan at $299 typically drives 5-10x ROI in the first 90 days.',
                highlight: 'Anchor with ROI, not price.',
              },
              {
                objection: '"I already tried a website. It didn\'t work."',
                response: "Most DIY sites don't work because they're just digital brochures. Our sites are built around Conversion — every page has a call-to-action, a booking flow, or a contact capture. We'll audit what went wrong for free before we pitch anything.",
                highlight: 'Audit first. Pitch second.',
              },
              {
                objection: '"I need to think about it."',
                response: "Absolutely — take your time. Can I send you a quick mockup of your homepage so you have something concrete to think about? It takes me 20 minutes and it's completely free. That way you're evaluating a real design, not just a conversation.",
                highlight: 'Give them something tangible.',
              },
            ].map((o) => (
              <div key={o.objection} className="bg-white p-8 rounded-3xl border border-slate-200 hover:-translate-y-1 transition-transform">
                <h4 className="font-bold text-slate-800 text-lg">{o.objection}</h4>
                <p className="text-[10px] font-bold text-red-500 uppercase mt-2 mb-4 tracking-widest">Reframing Strategy</p>
                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-200 pl-4 mb-4">{o.response}</p>
                <div className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl inline-block">
                  💡 {o.highlight}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
