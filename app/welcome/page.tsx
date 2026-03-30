'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [athleteProfile, setAthleteProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(profileData)

      if (profileData?.role === 'athlete') {
        const { data: athleteData } = await supabase
          .from('athlete_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setAthleteProfile(athleteData)
      }

      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 font-semibold">Chargement...</div>
      </div>
    )
  }

  const isAthlete = profile?.role === 'athlete'
  const isDonor = profile?.role === 'donor' || profile?.role === 'sponsor'
  const hasAthleteProfile = !!athleteProfile?.sport

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-lg w-full text-center">

        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">
          Bienvenue, {user?.user_metadata?.full_name || 'sur SportFund'} !
        </h1>

        <p className="text-gray-400 text-sm mb-8">
          Votre compte est confirmé. Vous faites maintenant partie de la communauté SportFund Luxembourg.
        </p>

        {isAthlete && !hasAthleteProfile && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
            <div className="text-3xl mb-3">🏃</div>
            <h2 className="font-black text-gray-900 mb-2">Completez votre profil sportif</h2>
            <p className="text-sm text-gray-400 mb-4">
              Ajoutez votre sport, votre niveau et votre bio pour commencer a recevoir des dons.
            </p>
            <a href="/dashboard/profile" className="block w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">Completer mon profil</a>
          </div>
        )}

        {isAthlete && hasAthleteProfile && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-6">
            <div className="text-3xl mb-3">🏆</div>
            <h2 className="font-black text-gray-900 mb-2">Votre profil est pret !</h2>
            <p className="text-sm text-gray-400 mb-4">
              Creez votre premiere campagne et commencez a collecter des fonds.
            </p>
            <a href="/dashboard" className="block w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">Aller a mon dashboard</a>
          </div>
        )}

        {isDonor && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
            <div className="text-3xl mb-3">💰</div>
            <h2 className="font-black text-gray-900 mb-2">Decouvrez les sportifs</h2>
            <p className="text-sm text-gray-400 mb-4">
              Explorez les campagnes et soutenez les sportifs luxembourgeois.
            </p>
            <a href="/" className="block w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition">Explorer les campagnes</a>
          </div>
        )}

        <a href="/" className="text-sm text-gray-400 hover:text-orange-500 transition">Retour a l'accueil</a>

      </div>
    </div>
  )
}
