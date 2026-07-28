import { createClient } from '@/lib/supabase/server'
import { BookingsTable } from '@/components/admin/booking/BookingsTable'
import type { Booking, Service } from '@/types/booking'

interface BookingWithService extends Booking {
  service: Service
}

export default async function AdminAgendaPage() {
  const supabase = await createClient()

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(*)
    `)
    .order('starts_at', { ascending: true })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Agenda</h1>
        <p className="text-zinc-400 mt-1">{bookings?.length ?? 0} agendamento{bookings?.length !== 1 ? 's' : ''}</p>
      </div>

      <BookingsTable bookings={(bookings ?? []) as BookingWithService[]} />
    </div>
  )
}
