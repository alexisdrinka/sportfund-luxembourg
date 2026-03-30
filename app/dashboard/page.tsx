'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [donationsByCampaign, setDonationsByCampaign] = useState<any[]>([])
  const [totalCollected, setTotalCollected] = useState(0)
  const [totalDonors, setTotalDonors] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: athleteProfile } = await supabase
        .from('athlete_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (athleteProfile) {
        const { data: campaignsData } = await supabase
          .from('campaigns')
          .select('*')
          .eq('athlete_id', athleteProfile.id)
          .order('created_at', { ascending: false })

        setCampaigns(campaignsData || [])

        const campaignIds = (campaignsData || []).map((c: any) => c.id)

        if (campaignIds.length > 0) {
          const { data: donations } = await supabase
            .from('donations')
            .select('amount, donor_id, campaign_id')
            .in('campaign_id', campaignIds)

          if (donations) {
            setTotalCollected(donations.reduce((sum: number, d: any) => sum + d.amount, 0))
            setTotalDonors(new Set(donations.map((d: any) => d.donor_id)).size)

            const byCampaign = (campaignsData || []).map((c: any) => ({
              name: c.title.length > 20 ? c.title.substring(0, 20) + '...' : c.title,
              id: c.id,
              montant: donations
                .filter((d: any) => d.campaign_id === c.id)
                .reduce((sum: number, d: any) => sum + d.amount, 0)
            }))
            setDonationsByCampaign(byCampaign)
          }
        }
      }

      setLoading(false)
    }
    init()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-400 font-semibold">Chargement...</div>
    </div>
  )

  const activeCampaigns = campaigns.filter((c: any) => c.is_active)

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-black text-orange-500">SportFund</h1>
          <p className="text-xs text-gray-400 mt-1">Luxembourg</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-orange-50 text-orange-600 font-semibold text-sm">Tableau de bord</a>
          <a href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">Mon profil</a>
          <a href="/dashboard/campaigns" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">Mes campagnes</a>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-900 truncate mb-2">{user.email}</p>
          <button onClick={handleSignOut} className="w-full text-sm text-gray-500 hover:text-red-500 font-semibold py-2 rounded-lg hover:bg-red-50 transition">Deconnexion</button>
        </div>
      </div>

      {/* CONTENU */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <p className="text-sm text-gray-400 font-semibold">Bonjour</p>
          <h2 className="text-2xl font-black text-gray-900">{user.user_metadata?.full_name || user.email}</h2>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <h3 className="text-lg font-black text-gray-900 mb-2">Lancez votre premiere campagne</h3>
            <p className="text-gray-400 text-sm mb-6">Creez votre profil sportif et commencez a collecter des fonds.</p>
            <a href="/dashboard/campaigns/new" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition inline-block">Nouvelle campagne</a>
          </div>
        ) : (
          <>
            {/* STATS */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="text-2xl font-black text-orange-500">{totalCollected}€</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Collectes</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="text-2xl font-black text-green-500">{totalDonors}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Donateurs</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="text-2xl font-black text-purple-500">{activeCampaigns.length}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Campagnes actives</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="text-2xl font-black text-blue-500">{campaigns.length}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Total campagnes</div>
              </div>
            </div>

            {/* GRAPHIQUE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
              <h3 className="font-black text-gray-900 mb-6">Montant collecté par campagne</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={donationsByCampaign}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value: any) => [`${value}€`, 'Montant']} />
                  <Bar dataKey="montant" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* LISTE DES CAMPAGNES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-black text-gray-900">Mes campagnes</h3>
                <a href="/dashboard/campaigns/new" className="bg-orange-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm">+ Nouvelle</a>
              </div>
              <div className="divide-y divide-gray-100">
                {campaigns.map((campaign: any) => {
                  const collected = donationsByCampaign.find((d: any) => d.id === campaign.id)?.montant || 0
                  return (
                    <div key={campaign.id} className="p-5 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${campaign.type === 'continuous' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                            {campaign.type === 'continuous' ? 'Soutien continu' : 'Objectif cible'}
                          </span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${campaign.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            {campaign.is_active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                        <div className="font-black text-gray-900">{campaign.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{campaign.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-orange-500">{collected}€</div>
                        <div className="text-xs text-gray-400">collectés</div>
                        {campaign.target_amount && (
                          <div className="text-xs text-gray-400">sur {campaign.target_amount}€</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
