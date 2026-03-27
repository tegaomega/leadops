export type OutreachStatus = 'new' | 'contacted' | 'follow-up' | 'closed' | 'lost'

export interface Lead {
  id: string
  place_id: string
  name: string
  category: string
  city: string
  zip: string
  address: string
  phone: string
  website: string
  rating: number | null
  reviews: number
  business_status: string
  types: string
  score: number
  score_label: string
  outreach: OutreachStatus
  notes: string
  created_at: string
}
