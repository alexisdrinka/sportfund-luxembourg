'use client'

import { useAuth } from '@/lib/useAuth'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DonationsPage() {
  const { user, profile, loading } = useAuth()
  const [donations, setDonations] = useState<any[]>([])
  const [donationsLoading, setDonationsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    const fetchDonations = async () => {
      const { data } = await supabase
        .from('donations')
        .select(`
          *,
          campaigns (
            title,
            type,
            is_active,
            target_amount,
            athlete_profiles (
              sport,
              profiles (full_name)
            )
          )
        `)
        .eq('donor_id', user.id)
        .order('created_at', { ascending: false })

      setDonations(data || [])
      setDonationsLoading(false)
    }
    fetchDonations()
  }, [user])

  if (loading || donationsLoading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-400 font-semibold">Chargement...</div>
    </div>
  )

  const totalDonne = donations.reduce((sum, d) => sum + d.amount, 0)
  const campagnesUniques = new Set(donations.map(d => d.campaign_id)).size

  const sidebarLinks = [
    { href: '/campaigns', label: 'Campagnes' },
    { href: '/dashboard/profile', label: 'Mon profil' },
    { href: '/dashboard/donations', label: 'Mes dons', active: true },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-black text-orange-500">SportFund</h1>
          <p className="text-xs text-gray-400 mt-1">Luxembourg</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {sidebarLinks.map(link => (
            <a key={link.href} href={link.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm ${link.active ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* CONTENU */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">Mes dons</h2>
          <p className="text-gray-400 text-sm mt-1">Suivi de vos contributions aux sportifs luxembourgeois</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-orange-500">{totalDonne}€</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Total donné</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-green-500">{donations.length}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Dons effectués</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-blue-500">{campagnesUniques}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Sportifs soutenus</div>
          </div>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Aucun don pour le moment</h3>
            <p className="text-gray-400 text-sm mb-6">Explorez les campagnes et soutenez les sportifs luxembourgeois.</p>
            <a href="/campaigns" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition inline-block">Explorer les campagnes</a>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-black text-gray-900">Historique des dons</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {donations.map((donation: any) => (
                <div key={donation.id} className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">
                      {donation.campaigns?.type === 'continuous' ? '🔄' : '🎯'}
                    </div>
                    <div>
                      <div className="font-black text-gray-900">{donation.campaigns?.title || 'Campagne supprimée'}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {donation.campaigns?.athlete_profiles?.profiles?.full_name} · {donation.campaigns?.athlete_profiles?.sport}
                      </div>
                      <div className="text-xs text-gray-400">{new Date(donation.created_at).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-orange-500 text-lg">{donation.amount}€</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${donation.campaigns?.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {donation.campaigns?.is_active ? 'Active' : 'Terminée'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
