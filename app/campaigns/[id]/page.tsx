import { createClient } from '@/lib/supabase'

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*, athlete_profiles (sport, level, location, bio, achievements, user_id)')
    .eq('id', id)
    .single()

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-black text-gray-900">Campagne introuvable</h2>
          <a href="/" className="mt-4 inline-block text-orange-500 font-bold hover:underline">Retour a l'accueil</a>
        </div>
      </div>
    )
  }

  const athlete = campaign.athlete_profiles

  let fullName = ''
  if (athlete?.user_id) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', athlete.user_id)
      .single()
    fullName = profileData?.full_name || ''
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-black text-orange-500">SportFund Luxembourg</a>
        <div className="flex items-center gap-3">
          <a href="/auth/login" className="text-sm font-semibold text-gray-600 hover:text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-50 transition">Connexion</a>
          <a href="/auth/register" className="bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition">S'inscrire</a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-orange-50 h-40 flex items-center justify-center text-8xl">🏆</div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xl">
                    {fullName?.[0] || 'S'}
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-gray-900">{fullName}</h1>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-orange-100 text-orange-600">{athlete?.sport}</span>
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500">{athlete?.level}</span>
                      {athlete?.location && <span className="text-xs text-gray-400">📍 {athlete.location}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${campaign.type === 'continuous' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                    {campaign.type === 'continuous' ? '🔄 Soutien continu' : '🎯 Objectif cible'}
                  </span>
                  {campaign.event_name && <span className="text-xs text-gray-500 font-semibold">{campaign.event_name}</span>}
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">{campaign.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed">{campaign.description}</p>
              </div>
            </div>

            {athlete?.bio && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-black text-gray-900 mb-3">Presentation</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{athlete.bio}</p>
              </div>
            )}

            {athlete?.achievements && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-black text-gray-900 mb-3">Palmares</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{athlete.achievements}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="font-black text-gray-900 mb-4">Soutenir {fullName}</h3>

              {campaign.target_amount && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Objectif</span>
                    <span className="font-black text-orange-500">{campaign.target_amount}€</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: '0%'}}></div>
                  </div>
                  {campaign.deadline && (
                    <div className="text-xs text-gray-400 mt-2">Limite: {new Date(campaign.deadline).toLocaleDateString('fr-FR')}</div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[10, 25, 50, 100, 250, 500].map(amount => (
                  <button key={amount} className="border-2 border-gray-200 rounded-lg py-2 text-sm font-bold text-gray-700 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition">
                    {amount}€
                  </button>
                ))}
              </div>

              <input
                type="number"
                placeholder="Montant personnalise"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-400 focus:outline-none mb-4"
              />

              <a href={`/donate/${campaign.id}`} className="block w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition text-center">
                Faire un don
              </a>

              <p className="text-xs text-gray-400 text-center mt-3">Paiement securise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
