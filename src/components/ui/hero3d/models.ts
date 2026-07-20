'use client'

import { useGLTF } from '@react-three/drei'

/**
 * Manifesto dos modelos GLB que o time-lapse cicla. Fonte única — o código de
 * carregamento (`PrintedObject.tsx`) e o relógio (`usePrintLoop.ts`) não hardcodam
 * paths, só leem daqui. Trocar um asset é só atualizar a `url` (e o `LICENSES.md`).
 *
 * Todos os modelos são normalizados em tempo de execução por bounding box
 * (ver `useNormalizedModel` em `PrintedObject.tsx`), então a escala/orientação
 * de origem de cada arquivo não importa — qualquer GLB "cresce" para a mesma
 * altura de cena (`PRINT_OBJECT_HEIGHT`, em `shapes.ts`).
 */
export type PrintModelId = 'vaso' | 'escultura' | 'geometrico'

export const PRINT_MODEL_IDS: PrintModelId[] = ['vaso', 'escultura', 'geometrico']

interface PrintModelDef {
  id: PrintModelId
  url: string
}

// Peças escolhidas para refletir produtos reais do catálogo (docs/database/seed/001_products.sql):
// vaso decorativo, escultura low-poly de raposa e peça geométrica facetada.
export const PRINT_MODELS: Record<PrintModelId, PrintModelDef> = {
  vaso: { id: 'vaso', url: '/models/vaso.glb' },
  escultura: { id: 'escultura', url: '/models/escultura-raposa.glb' },
  geometrico: { id: 'geometrico', url: '/models/geometrico.glb' },
}

// Preload assim que este módulo é importado — o hero já é lazy (`next/dynamic`,
// `ssr:false`), então isso dispara só no cliente, sem custo de rede no SSR.
PRINT_MODEL_IDS.forEach((id) => useGLTF.preload(PRINT_MODELS[id].url))
