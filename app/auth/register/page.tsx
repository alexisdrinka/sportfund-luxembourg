'use client'

import { useState } from 'react'
import { signUp } from '@/lib/auth'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('athlete')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signUp(email, password, fullName, role)

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Compte créé ! Vérifie ton email pour confirmer.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom complet"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
            required
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm"
          >
            <option value="athlete">🏃 Sportif</option>
            <option value="donor">💰 Donateur</option>
            <option value="sponsor">🏢 Entreprise sponsor</option>
          </select>

          {message && (
            <p className="text-sm text-center text-orange-600">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition"
          >
            {loading ? 'Création...' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  )
}
