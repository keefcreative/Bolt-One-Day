'use client'

import { TrendingUp, Layers, Network, LucideIcon } from 'lucide-react'
import { useStaggeredReveal } from '@/lib/classOf2025/animations'

interface CohortReason {
  icon: string
  title: string
  description: string
  tradeOff: string
}

interface WhyLimitSectionProps {
  cohortReasons: CohortReason[]
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Layers,
  Network,
}

export default function WhyLimitSection({ cohortReasons }: WhyLimitSectionProps) {
  const { ref, visibleIndices } = useStaggeredReveal(cohortReasons.length, 200)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 sm:py-24 px-6 sm:px-8 bg-ink"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-pearl">
            Why Limit to 10 Companies?
          </h2>
          <p className="text-base sm:text-lg font-light text-pearl/70 max-w-3xl mx-auto">
            The cohort model creates strategic value you can't get elsewhere
          </p>
        </div>

        {/* 3 Column Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-16">
          {cohortReasons.map((reason, index) => {
            const Icon = iconMap[reason.icon]
            const isVisible = visibleIndices.has(index)

            return (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 0.2}s`,
                }}
              >
                {/* Flame accent line */}
                <div className="w-full h-px bg-flame mb-6" />

                {/* Icon */}
                {Icon && (
                  <div className="mb-6">
                    <Icon size={64} strokeWidth={1} className="text-flame" />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl font-normal text-pearl mb-4 tracking-tight">
                  {reason.title}
                </h3>

                {/* Description */}
                <p className="text-base font-light leading-relaxed text-pearl/80 mb-6">
                  {reason.description}
                </p>

                {/* Trade-off */}
                <p className="text-sm font-normal italic text-flame leading-relaxed">
                  The trade-off: {reason.tradeOff}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
