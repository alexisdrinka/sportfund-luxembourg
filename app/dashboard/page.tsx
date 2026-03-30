'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { signOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-black text-orange-500">SportFund</h1>
          <p className="text-xs text-gray-400 mt-1">Luxembourg</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">Menu</p>
          <a href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-orange-50 text-orange-600 font-semibold text-sm">
            Tableau de bord
          </a>
          <a href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">
            Mon profil
          </a>
          <a href="/dashboard/campaigns" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 font-semibold text-sm">
            Mes campagnes
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-900 truncate mb-2">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full text-sm text-gray-500 hover:text-red-500 font-semibold py-2 rounded-lg hover:bg-red-50 transition"
          >
            Deconnexion
          </button>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="mb-8">
          <p className="text-sm text-gray-400 font-semibold">Bonjour</p>
          <h2 className="text-2xl font-black text-gray-900">{user.user_metadata?.full_name || user.email}</h2>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-orange-500">0€</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Collectes</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-green-500">0</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Donateurs</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-blue-500">0</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Vues profil</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="text-2xl font-black text-purple-500">0</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Campagnes actives</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 text-center">
          <h3 className="text-lg font-black text-gray-900 mb-2">Lancez votre premiere campagne</h3>
          <p className="text-gray-400 text-sm mb-6">Creez votre profil sportif et commencez a collecter des fonds.</p>
          
           <a href="/dashboard/campaigns/new"
            className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition inline-block">
            Nouvelle campagne
          </a>
        </div>
      </div>
    </div>
  )
}

