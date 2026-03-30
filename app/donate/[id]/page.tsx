'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ amount, campaignId }: { amount: number, campaignId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/success`,
      },
    })

    if (error) {
      setMessage(error.message || 'Une erreur est survenue')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {message && <p className="text-sm text-red-500 font-semibold">{message}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition mt-2">
        {loading ? 'Traitement...' : `Payer ${amount}€`}
      </button>
    </form>
  )
}

export default function DonatePage({ params }: { params: Promise<{ id: string }> }) {
  const [clientSecret, setClientSecret] = useState('')
  const [amount, setAmount] = useState(50)
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [campaignId, setCampaignId] = useState('')
  const [campaign, setCampaign] = useState<any>(null)
  const [donorId, setDonorId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState<'amount' | 'payment'>('amount')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { id } = await params
      setCampaignId(id)

      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()
      console.log('User:', user)
      console.log('User ID:', user?.id)

      if (!user) {
        router.push(`/auth/login?redirect=/donate/${id}`)
        return
      }

      setDonorId(user.id)
      console.log('Donor ID set:', user.id)

      const { data: campaignData } = await supabase
        .from('campaigns')
        .select('title, target_amount')
        .eq('id', id)
        .single()
      setCampaign(campaignData)

      setLoading(false)
    }
    init()
  }, [])

  const handleAmountSelect = (selectedAmt: number) => {
    setSelectedAmount(selectedAmt)
    setAmount(selectedAmt)
  }

  const handleContinue = async () => {
    console.log('handleContinue - donorId:', donorId)
    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, campaignId, donorId }),
    })
    const data = await res.json()
    setClientSecret(data.clientSecret)
    setStep('payment')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-400 font-semibold">Chargement...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-2">Faire un don</h2>
          {campaign && (
            <p className="text-sm text-gray-400 mb-6">{campaign.title}</p>
          )}

          {step === 'amount' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-2">
                {[10, 25, 50, 100, 250, 500].map(amt => (
                  <button
                    key={amt}
                    onClick={() => handleAmountSelect(amt)}
                    className={`border-2 rounded-lg py-2 text-sm font-bold transition ${selectedAmount === amt ? 'border-orange-400 bg-orange-50 text-orange-500' : 'border-gray-200 text-gray-700 hover:border-orange-300'}`}>
                    {amt}€
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Montant personnalise (EUR)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => { setAmount(Number(e.target.value)); setSelectedAmount(0) }}
                  className="border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:border-orange-400 focus:outline-none"
                  min="1" />
              </div>

              <button
                onClick={handleContinue}
                className="bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition">
                Continuer — {amount}€
              </button>
            </div>
          )}

          {step === 'payment' && clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm amount={amount} campaignId={campaignId} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  )
}
