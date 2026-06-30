'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/supabase/storage'

interface UseImageUploadOptions {
  bucket?: string
  initialUrl?: string | null
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { bucket = 'custom-orders', initialUrl } = options
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null)
  // null = removida, undefined = inalterada (só quando initialUrl estava presente)
  const [uploadedUrl, setUploadedUrl] = useState<string | null | undefined>(
    initialUrl ? undefined : null
  )
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | null) {
    if (!file) {
      setPreview(null)
      // se havia foto inicial, sinaliza remoção explícita com null;
      // se nunca houve foto, permanece null
      setUploadedUrl(null)
      return
    }
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file, bucket)
      setUploadedUrl(url)
    } catch {
      setError('Falha no upload da imagem. Tente novamente.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return { uploading, preview, uploadedUrl, error, handleFile }
}
