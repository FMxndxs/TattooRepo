import { createClient } from '@/lib/supabase/browser'
import { getOrCreateSessionId } from './sessionId'

export async function trackProductClick(productId: string): Promise<void> {
  try {
    const sessionId = getOrCreateSessionId()
    if (!sessionId) return
    const supabase = createClient()
    await supabase.rpc('register_product_click', {
      p_product_id: productId,
      p_session_id: sessionId,
    })
  } catch (err) {
    console.warn('[analytics] Failed to track product click:', err)
  }
}
