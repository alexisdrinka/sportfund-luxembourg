'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewCampaignPage() {
  const [type, setType] = useState<'continuous' | 'targeted'>('targeted')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [eventName, setEventName] = useState('')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data: athleteProfile } = await supabase
      .from('athlete_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!athleteProfile) {
      setMessage('Veuillez dabord completer votre profil sportif.')
      setLoading(false)
      return
    }

    const { error } = await supabase
      .from('campaigns')
      .insert({
        athlete_id: athleteProfile.id,
        type,
        title,
        description,
        target_amount: type === 'targeted' ? parseFloat(targetAmount) : null,
        event_name: type === 'targeted' ? eventName : null,
        deadline: type === 'targeted' ? deadline : null,
      })

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard/campaigns')
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
          <a href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">
            Mon profil
          </a>
          <a href="/dashboard/campaigns" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-orange-50 text-orange-600 font-semibold text-sm">
            Mes campagnes
          </a>
        </nav>
      </div>

      <div className="flex-1 p-8 max-w-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-900">Nouvelle campagne</h2>
          <p className="text-gray-400 text-sm mt-1">Choisissez votre type de financement</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* TYPE SELECTOR */}
          <div className="grid grid-cols-2 gap-4">
            <div
              onClick={() => setType('continuous')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                type === 'continuous'
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🔄</div>
              <div className="font-black text-gray-900 mb-1">Soutien continu</div>
              <div className="text-xs text-gray-400">Sans objectif financier, vos supporters vous accompagnent tout au long de votre carriere</div>
              {type === 'continuous' && <div className="text-orange-500 font-bold text-xs mt-2">Selectionne</div>}
            </div>

            <div
              onClick={() => setType('targeted')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition ${
                type === 'targeted'
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-black text-gray-900 mb-1">Objectif cible</div>
              <div className="text-xs text-gray-400">Un evenement precis a financer avec un montant cible et une date limite</div>
              {type === 'targeted' && <div className="text-orange-500 font-bold text-xs mt-2">Selectionne</div>}
            </div>
          </div>

          {/* COMMON FIELDS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-900 mb-4">Informations generales</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Titre de la campagne</label>
                <input
                  type="text"
                  placeholder="Ex: Championnats Europe 2025, Saison 2025-2026..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  placeholder="Decrivez vos besoins et pourquoi vous avez besoin de soutien..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* TARGETED FIELDS */}
          {type === 'targeted' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-black text-gray-900 mb-4">Details de l'objectif</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-700">Nom de l'evenement</label>
                  <input
                    type="text"
                    placeholder="Ex: Championnats Europe Berlin, Coupe du Monde XCO..."
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Montant cible (EUR)</label>
                    <input
                      type="number"
                      placeholder="Ex: 5000"
                      value={targetAmount}
                      onChange={e => setTargetAmount(e.target.value)}
                      className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none"
                      required
                    />
                    {targetAmount && (
                      <p className="text-xs text-gray-400">
                        Commission 5% = {(parseFloat(targetAmount) * 0.05).toFixed(0)}EUR
                        · Vous recevrez {(parseFloat(targetAmount) * 0.95).toFixed(0)}EUR
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-700">Date limite</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTINUOUS FIELDS */}
          {type === 'continuous' && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5">
              <p className="text-sm text-orange-700 font-semibold">
                Votre campagne sera active en permanence. Les donateurs pourront vous soutenir avec des dons uniques ou mensuels.
              </p>
            </div>
          )}

          {message && (
            <p className="text-sm text-center text-red-500 font-semibold">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition"
          >
            {loading ? 'Creation...' : 'Lancer ma campagne'}
          </button>
        </form>
      </div>
    </div>
  )
}
