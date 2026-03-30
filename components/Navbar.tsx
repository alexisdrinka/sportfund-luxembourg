'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="w-full bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <a href="/" className="text-orange-500 font-black text-xl">SportFund</a>
      <div className="flex items-center gap-6">
        <a href="/" className="text-sm text-gray-500 hover:text-orange-500 transition">Accueil</a>
        <a href="/campaigns" className="text-sm text-gray-500 hover:text-orange-500 transition">Campagnes</a>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-600 transition">← Retour</button>
        {user ? (
          <>
            <a href="/dashboard/profile" className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition">Mon profil</a>
            <button onClick={handleSignOut} className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition">Déconnexion</button>
          </>
        ) : (
          <a href="/auth/login" className="text-sm bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition">Connexion</a>
        )}
      </div>
    </nav>
  )
}