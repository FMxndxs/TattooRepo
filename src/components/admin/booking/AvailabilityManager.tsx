'use client'

import { useState } from 'react'
import { AvailabilityRulesPanel } from './AvailabilityRulesPanel'
import { TimeOffPanel } from './TimeOffPanel'
import type { AvailabilityRule, TimeOff } from '@/types/booking'

interface AvailabilityManagerProps {
  initialRules: AvailabilityRule[]
  initialTimeOffs: TimeOff[]
}

export function AvailabilityManager({
  initialRules,
  initialTimeOffs,
}: AvailabilityManagerProps) {
  const [tab, setTab] = useState<'rules' | 'timeoff'>('rules')

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('rules')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'rules'
              ? 'bg-brand-700 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Horários semanais
        </button>
        <button
          onClick={() => setTab('timeoff')}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === 'timeoff'
              ? 'bg-brand-700 text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Folgas
        </button>
      </div>

      {/* Content */}
      {tab === 'rules' ? (
        <AvailabilityRulesPanel initialRules={initialRules} />
      ) : (
        <TimeOffPanel initialTimeOffs={initialTimeOffs} />
      )}
    </div>
  )
}
