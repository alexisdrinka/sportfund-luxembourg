import { createClient } from '@/lib/supabase'

export default async function HomePage() {
  const supabase = createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select(`
      *,
      athlete_profiles (
        sport,
        level,
        location,
        profiles (full_name)
      )
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="bg-white border-b border-gray-100 px-8 py-20 text-center">
        <div className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
          Luxembourg
        </div>
        <h2 className="text-5xl font-black text-gray-900 mb-4 leading-tight">
          Financez les champions<br />de demain
        </h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          Soutenez les sportifs luxembourgeois talentueux dans leur parcours vers l'excellence.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a href="/auth/register?role=athlete" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition">Je suis sportif</a>
          <a href="/auth/register?role=donor" className="bg-white text-gray-700 font-bold px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:text-orange-500 transition">Je veux soutenir</a>
        </div>

        {/* STATS */}
        <div className="flex items-center justify-center gap-12 mt-12">
          <div className="text-center">
            <div className="text-3xl font-black text-orange-500">142</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Sportifs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-orange-500">87K€</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Collectes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-orange-500">1.2K</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1">Donateurs</div>
          </div>
        </div>
      </div>

      {/* CAMPAIGNS */}
      <div className="px-8 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Campagnes actives</p>
            <h3 className="text-3xl font-black text-gray-900">Sportifs a soutenir</h3>
          </div>
        </div>

        {campaigns && campaigns.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {campaigns.map((campaign: any) => (
              <div key={campaign.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition">
                <div className="bg-orange-50 h-32 flex items-center justify-center text-6xl">
                  {campaign.athlete_profiles?.sport === 'Football' ? '⚽' :
                   campaign.athlete_profiles?.sport === 'Natation' ? '🏊' :
                   campaign.athlete_profiles?.sport === 'Cyclisme' ? '🚴' :
                   campaign.athlete_profiles?.sport === 'Athletisme' ? '🏃' : '🏆'}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${campaign.type === 'continuous' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {campaign.type === 'continuous' ? 'Soutien continu' : 'Objectif cible'}
                    </span>
                    {campaign.athlete_profiles?.level && (
                      <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                        {campaign.athlete_profiles.level}
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-gray-900 mb-1">{campaign.title}</h4>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{campaign.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-400">{campaign.athlete_profiles?.profiles?.full_name}</div>
                      <div className="text-xs text-gray-400">{campaign.athlete_profiles?.location}</div>
                    </div>
                    {campaign.target_amount && (
                      <div className="text-right">
                        <div className="font-black text-orange-500 text-sm">{campaign.target_amount}€</div>
                        <div className="text-xs text-gray-400">objectif</div>
                      </div>
                    )}
                  </div>
                  <a href={`/campaigns/${campaign.id}`} className="mt-3 block w-full bg-orange-500 text-white font-bold py-2 rounded-lg hover:bg-orange-600 transition text-sm text-center">Soutenir</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🏆</div>
            <p className="font-semibold">Aucune campagne active pour le moment.</p>
            <a href="/auth/register" className="mt-4 inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition">Creer une campagne</a>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 px-8 py-8 text-center">
        <div className="text-xl font-black text-orange-500 mb-2">SportFund Luxembourg</div>
        <p className="text-sm text-gray-400">Plateforme de financement participatif pour les sportifs luxembourgeois</p>
        <p className="text-xs text-gray-300 mt-4">2025 SportFund Luxembourg</p>
      </footer>
    </div>
  )
}
