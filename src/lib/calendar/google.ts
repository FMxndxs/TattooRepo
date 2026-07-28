import 'server-only'
import { google } from 'googleapis'

/**
 * Espelho no Google Calendar via Service Account (sem fluxo OAuth na UI).
 * Requer que o e-mail da Service Account seja adicionado como convidado/editor
 * do calendário (GOOGLE_CALENDAR_ID) no Google Calendar do artista.
 *
 * ponytail: um calendário, uma Service Account. Multi-artista exigiria OAuth
 * por artista — YAGNI agora.
 */

function getAuth() {
  const email = process.env.GOOGLE_SA_EMAIL
  const key = process.env.GOOGLE_SA_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!email || !key) throw new Error('GOOGLE_SA_EMAIL / GOOGLE_SA_PRIVATE_KEY não configurados')
  return new google.auth.JWT(email, undefined, key, ['https://www.googleapis.com/auth/calendar'])
}

function calendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID
  if (!id) throw new Error('GOOGLE_CALENDAR_ID não configurado')
  return id
}

export async function createCalendarEvent(params: {
  summary: string
  description?: string
  startsAt: string
  endsAt: string
}): Promise<string> {
  const calendar = google.calendar({ version: 'v3', auth: getAuth() })
  const { data } = await calendar.events.insert({
    calendarId: calendarId(),
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: { dateTime: params.startsAt },
      end: { dateTime: params.endsAt },
    },
  })
  if (!data.id) throw new Error('Google Calendar não retornou id do evento')
  return data.id
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const calendar = google.calendar({ version: 'v3', auth: getAuth() })
  try {
    await calendar.events.delete({ calendarId: calendarId(), eventId })
  } catch (err: unknown) {
    // Evento já removido manualmente no Google Calendar — não é erro fatal.
    const status = (err as { code?: number })?.code
    if (status !== 404 && status !== 410) throw err
  }
}

export async function updateCalendarEvent(
  eventId: string,
  params: { startsAt: string; endsAt: string },
): Promise<void> {
  const calendar = google.calendar({ version: 'v3', auth: getAuth() })
  await calendar.events.patch({
    calendarId: calendarId(),
    eventId,
    requestBody: {
      start: { dateTime: params.startsAt },
      end: { dateTime: params.endsAt },
    },
  })
}
