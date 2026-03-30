'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [sport, setSport] = useState('')
  const [level, setLevel] = useState('regional')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [achievements, setAchievements] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    const { error } = await supabase
      .from('athlete_profiles')
      .upsert({
        user_id: user.id,
        sport,
        level,
        location,
        bio,
        achievements,
      })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Profil sauvegarde avec succes !')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-black text-orange-500">SportFund</h1>
          <p className="text-xs text-gray-400 mt-1">Luxembourg</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">
            Tableau de bord
          </a>
          <a href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-orange-50 text-orange-600 font-semibold text-sm">
            Mon profil
          </a>
          <a href="/dashboard/campaigns" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">
            Mes campagnes
          </a>
        </nav>
      </div>

      <div className="flex-1 p-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">Mon profil sportif</h2>
          <p className="text-gray-400 text-sm mt-1">Ces informations seront visibles par les donateurs</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-4">Informations sportives</h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Sport pratique</label>
                <input
                  type="text"
                  placeholder="Ex: Athletisme, Natation, Cyclisme..."
                  value={sport}
                  onChange={e => setSport(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Niveau</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
                >
                  <option value="regional">Regional</option>
                  <option value="national">National</option>
                  <option value="international">International</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Localisation</label>
                <input
                  type="text"
                  placeholder="Ex: Luxembourg-Ville, Esch-sur-Alzette..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-4">Presentation</h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Bio</label>
                <textarea
                  placeholder="Presentez-vous, votre parcours, vos objectifs..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Palmares et resultats</label>
                <textarea
                  placeholder="Ex: Champion du Luxembourg 2024, Finaliste Championnat Europe..."
                  value={achievements}
                  onChange={e => setAchievements(e.target.value)}
                  rows={3}
                  className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {message && (
            <p className="text-sm text-center text-orange-600 font-semibold">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition"
          >
            {loading ? 'Sauvegarde...' : 'Sauvegarder mon profil'}
          </button>
        </form>
      </div>
    </div>
  )
}
