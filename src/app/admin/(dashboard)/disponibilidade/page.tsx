import { createClient } from '@/lib/supabase/server'
import { AvailabilityManager } from '@/components/admin/booking/AvailabilityManager'
import type { AvailabilityRule, TimeOff } from '@/types/booking'

export default async function AdminAvailabilityPage() {
  const supabase = await createClient()

  const [{ data: rules }, { data: timeOffs }] = await Promise.all([
    supabase
      .from('availability_rules')
      .select('*')
      .order('weekday'),
    supabase
      .from('time_off')
      .select('*')
      .order('starts_at', { ascending: false }),
  ])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Disponibilidade</h1>
        <p className="text-zinc-400 mt-1">Gerencie horários de atendimento e folgas</p>
      </div>

      <AvailabilityManager
        initialRules={(rules ?? []) as AvailabilityRule[]}
        initialTimeOffs={(timeOffs ?? []) as TimeOff[]}
      />
    </div>
  )
}
