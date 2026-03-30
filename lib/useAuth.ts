import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export function useAuth(requiredRole?: 'athlete' | 'donor' | 'sponsor') {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setUser(user)
      setProfile(profileData)

      // Si un rôle est requis et que l'utilisateur n'a pas ce rôle
      if (requiredRole && profileData?.role !== requiredRole) {
        router.push('/dashboard')
        return
      }

      setLoading(false)
    }
    init()
  }, [])

  return { user, profile, loading }
}
