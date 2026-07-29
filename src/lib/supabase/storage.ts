import { createClient } from './browser'

export async function uploadImage(file: File, bucket = 'custom-orders'): Promise<string> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Faça login para enviar uma imagem')

  const ext = file.name.split('.').pop()
  // Prefixo `${uid}/...` é exigido pelas policies de storage (104_harden_rls.sql):
  // cada usuário só grava/apaga dentro da própria pasta.
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
