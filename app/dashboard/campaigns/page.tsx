'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const { data: athleteProfile } = await supabase
        .from('athlete_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!athleteProfile) { setLoading(false); return }

      const { data } = await supabase
        .from('campaigns')
        .select('*')
        .eq('athlete_id', athleteProfile.id)
        .order('created_at', { ascending: false })

      setCampaigns(data || [])
      setLoading(false)
    }
    fetchCampaigns()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-black text-orange-500">SportFund</h1>
          <p className="text-xs text-gray-400 mt-1">Luxembourg</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">Tableau de bord</a>
          <a href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">Mon profil</a>
          <a href="/dashboard/campaigns" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-orange-50 text-orange-600 font-semibold text-sm">Mes campagnes</a>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Mes campagnes</h2>
            <p className="text-gray-400 text-sm mt-1">{campaigns.length} campagne(s)</p>
          </div>
          <a href="/dashboard/campaigns/new" className="bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-600 transition text-sm">Nouvelle campagne</a>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">Chargement...</div>
        ) : campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Aucune campagne</h3>
            <p className="text-gray-400 text-sm mb-6">Lancez votre premiere campagne de financement.</p>
            <a href="/dashboard/campaigns/new" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition inline-block text-sm">Creer une campagne</a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{campaign.type === 'continuous' ? '🔄' : '🎯'}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${campaign.type === 'continuous' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                        {campaign.type === 'continuous' ? 'Soutien continu' : 'Objectif cible'}
                      </span>
                    </div>
                    <h3 className="font-black text-gray-900 text-lg">{campaign.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{campaign.description}</p>
                  </div>
                  <div className="text-right">
                    {campaign.target_amount && (
                      <div className="font-black text-orange-500 text-xl">{campaign.target_amount} EUR</div>
                    )}
                    {campaign.deadline && (
                      <div className="text-xs text-gray-400 mt-1">Limite: {new Date(campaign.deadline).toLocaleDateString('fr-FR')}</div>
                    )}
                  </div>
                </div>
                {campaign.event_name && (
                  <div className="mt-3 text-xs font-semibold text-gray-500">Evenement: {campaign.event_name}</div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="text-xs text-gray-400">Creee le {new Date(campaign.created_at).toLocaleDateString('fr-FR')}</div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${campaign.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    {campaign.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
 