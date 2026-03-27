'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead, OutreachStatus } from '@/lib/types'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('score', { ascending: false })
      if (error) throw error
      setLeads(data as Lead[])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()

    const channel = supabase
      .channel('leads-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        setLeads((prev) => {
          const exists = prev.find((l) => l.id === payload.new.id)
          if (exists) return prev
          return [payload.new as Lead, ...prev]
        })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leads' }, (payload) => {
        setLeads((prev) =>
          prev.map((l) => (l.id === payload.new.id ? (payload.new as Lead) : l))
        )
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          setTimeout(() => channel.subscribe(), 3000)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchLeads])

  const updateOutreach = useCallback(async (id: string, status: OutreachStatus) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, outreach: status } : l))
    )
    const { error } = await supabase
      .from('leads')
      .update({ outreach: status })
      .eq('id', id)
    if (error) {
      await fetchLeads()
    }
  }, [fetchLeads])

  const updateNotes = useCallback(async (id: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes } : l))
    )
    const { error } = await supabase
      .from('leads')
      .update({ notes })
      .eq('id', id)
    if (error) {
      await fetchLeads()
    }
  }, [fetchLeads])

  return { leads, loading, error, updateOutreach, updateNotes }
}
