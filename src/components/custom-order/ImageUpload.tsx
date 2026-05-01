'use client'

import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploadProps {
  preview: string | null
  uploading: boolean
  error: string | null
  onChange: (file: File | null) => void
}

export function ImageUpload({ preview, uploading, error, onChange }: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="image-upload"
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
          preview ? 'border-brand-500/60' : 'border-zinc-700 hover:border-zinc-500'
        } bg-zinc-900`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-300" />
            <span className="text-sm">Enviando imagem...</span>
          </div>
        ) : preview ? (
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image src={preview} alt="Preview" fill className="object-cover opacity-70" />
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onChange(null) }}
              className="absolute top-2 right-2 bg-zinc-900/80 p-1 rounded-full text-white hover:text-red-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500">
            <Upload className="w-8 h-8" />
            <span className="text-sm">Clique para enviar uma imagem de referência</span>
            <span className="text-xs">PNG, JPG, WEBP até 5MB</span>
          </div>
        )}
        <input
          id="image-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
