export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Merci pour votre don !</h1>
        <p className="text-gray-400 text-sm mb-8">Votre soutien fait une vraie difference pour les sportifs luxembourgeois.</p>
        <a href="/" className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition inline-block">
          Retour a l'accueil
        </a>
      </div>
    </div>
  )
}
