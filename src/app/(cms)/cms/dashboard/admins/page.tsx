import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { AdminProfile } from '@/lib/supabase/types'
import { AdminsListView } from './_features/AdminsList/view'

export const metadata: Metadata = {
  title: 'Administradores — NEXORA CMS',
}

export default async function AdminsPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  const admins: AdminProfile[] = data ?? []

  return <AdminsListView admins={admins} />
}
