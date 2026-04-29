'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/supabase/storage'

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File | null) {
    if (!file) {
      setPreview(null)
      setUploadedUrl(null)
      return
    }
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file)
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
