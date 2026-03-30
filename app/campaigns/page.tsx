import { createClient } from '@/lib/supabase'

export default async function CampaignsPage() {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 py-16 max-w-6xl mx-auto">

        <div className="mb-10">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Toutes les campagnes</p>
          <h1 className="text-4xl font-black text-gray-900">Sportifs a soutenir</h1>
          <p className="text-gray-400 mt-2">Découvrez et soutenez les sportifs luxembourgeois.</p>
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
    </div>
  )
}