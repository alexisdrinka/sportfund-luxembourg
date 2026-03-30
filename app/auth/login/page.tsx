'use client'

import { useState } from 'react'
import { signIn } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setMessage(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">Connexion</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Bon retour sur SportFund Luxembourg</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none"
              required
            />
          </div>

          {message && (
            <p className="text-sm text-center text-red-500 font-semibold">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition mt-2"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <a href="/auth/register" className="text-orange-500 font-bold hover:underline">
              S'inscrire
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
