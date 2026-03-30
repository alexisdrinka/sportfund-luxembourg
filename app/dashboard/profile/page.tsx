'use client'

import { useAuth } from '@/lib/useAuth'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, profile, loading } = useAuth()
  const [sport, setSport] = useState('')
  const [level, setLevel] = useState('regional')
  const [location, setLocation] = useState('')
  const [bio, setBio] = useState('')
  const [achievements, setAchievements] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [message, setMessage] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('athlete_profiles')
      .upsert({ user_id: user.id, sport, level, location, bio, achievements })
    setMessage(error ? error.message : 'Profil sauvegarde avec succes !')
    setSaving(false)
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    await supabase.from('athlete_profiles').delete().eq('user_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-gray-400 font-semibold">Chargement...</div>
    </div>
  )

  const isAthlete = profile?.role === 'athlete'

  const sidebarLinks = isAthlete ? [
    { href: '/dashboard', label: 'Tableau de bord' },
    { href: '/dashboard/profile', label: 'Mon profil', active: true },
    { href: '/dashboard/campaigns', label: 'Mes campagnes' },
  ] : [
    { href: '/campaigns', label: 'Campagnes' },
    { href: '/dashboard/profile', label: 'Mon profil', active: true },
    { href: '/dashboard/donations', label: 'Mes dons' },
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

      <div className="flex-1 p-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">Mon profil</h2>
          <p className="text-gray-400 text-sm mt-1">
            {isAthlete ? 'Ces informations seront visibles par les donateurs' : 'Informations de votre compte'}
          </p>
        </div>

        {/* PROFIL SPORTIF */}
        {isAthlete ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4">Informations sportives</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Sport pratique</label>
                  <input type="text" placeholder="Ex: Athletisme, Natation..." value={sport} onChange={e => setSport(e.target.value)}
                    className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-400 focus:outline-none" required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Niveau</label>
                  <select value={level} onChange={e => setLevel(e.target.value)}
                    className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-400 focus:outline-none">
                    <option value="regional">Regional</option>
                    <option value="national">National</option>
                    <option value="international">International</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Localisation</label>
                  <input type="text" placeholder="Ex: Luxembourg-Ville..." value={location} onChange={e => setLocation(e.target.value)}
                    className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-400 focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4">Presentation</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Bio</label>
                  <textarea placeholder="Presentez-vous..." value={bio} onChange={e => setBio(e.target.value)} rows={4}
                    className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-400 focus:outline-none resize-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Palmares et resultats</label>
                  <textarea placeholder="Ex: Champion du Luxembourg 2024..." value={achievements} onChange={e => setAchievements(e.target.value)} rows={3}
                    className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:border-orange-400 focus:outline-none resize-none" />
                </div>
              </div>
            </div>
            {message && <p className="text-sm text-center text-orange-600 font-semibold">{message}</p>}
            <button type="submit" disabled={saving}
              className="bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">
              {saving ? 'Sauvegarde...' : 'Sauvegarder mon profil'}
            </button>
          </form>
        ) : (
          // PROFIL DONATEUR / SPONSOR
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4">Informations du compte</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Nom</label>
                  <p className="font-semibold text-gray-900">{user?.user_metadata?.full_name || '—'}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Email</label>
                  <p className="font-semibold text-gray-900">{user?.email || '—'}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Role</label>
                  <p className="font-semibold text-gray-900 capitalize">{profile?.role || '—'}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Membre depuis</label>
                  <p className="font-semibold text-gray-900">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ZONE DANGER */}
        <div className="mt-10 bg-white rounded-2xl p-6 shadow-sm border-2 border-red-100">
          <h3 className="font-black text-red-600 mb-1">Zone dangereuse</h3>
          <p className="text-sm text-gray-400 mb-4">La suppression de votre compte est irreversible.</p>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)}
              className="text-sm font-bold text-red-500 border-2 border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition">
              Supprimer mon compte
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-red-600">Etes-vous sur ? Cette action est irreversible.</p>
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} disabled={deleting}
                  className="text-sm font-bold text-white bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition">
                  {deleting ? 'Suppression...' : 'Oui, supprimer mon compte'}
                </button>
                <button onClick={() => setConfirmDelete(false)}
                  className="text-sm font-bold text-gray-500 border-2 border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
