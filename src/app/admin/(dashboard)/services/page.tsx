import { createClient } from '@/lib/supabase/server'
import { ServiceForm } from '@/components/admin/booking/ServiceForm'
import { ServicesTable } from '@/components/admin/booking/ServicesTable'
import { Plus } from 'lucide-react'
import type { Service } from '@/types/booking'

export default async function AdminServicesPage() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Serviços</h1>
        <p className="text-zinc-400 mt-1">{services?.length ?? 0} serviço{services?.length !== 1 ? 's' : ''} cadastrado{services?.length !== 1 ? 's' : ''}</p>
      </div>

      <ServicesTable services={(services ?? []) as Service[]} />
    </div>
  )
}
