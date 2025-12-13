'use client'

import { Clock, Layers, DollarSign, UserX, LucideIcon } from 'lucide-react'
import { useStaggeredReveal } from '@/lib/classOf2025/animations'

interface Problem {
  icon: string
  title: string
  description: string
}

interface CompetitiveRealitySectionProps {
  problems: Problem[]
}

const iconMap: Record<string, LucideIcon> = {
  Clock,
  Layers,
  DollarSign,
  UserX,
}

export default function CompetitiveRealitySection({
  problems,
}: CompetitiveRealitySectionProps) {
  const { ref, visibleIndices } = useStaggeredReveal(problems.length, 150)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 sm:py-24 px-6 sm:px-8 bg-pearl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-ink">
            The Competitive Reality:
            <br />
            Design Is Either a Weapon or a Weakness
          </h2>
          <p className="text-base sm:text-lg font-light text-ink/70 max-w-3xl mx-auto">
            The companies that dominate 2025 won't have better products. They'll have faster
            creative execution.
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {problems.map((problem, index) => {
            const Icon = iconMap[problem.icon]
            const isVisible = visibleIndices.has(index)

            return (
              <div
                key={index}
                className={`group p-6 sm:p-8 bg-white border-l-4 border-flame transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                } hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(255,107,53,0.15)]`}
                style={{
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                {/* Icon */}
                {Icon && (
                  <div className="mb-6">
                    <Icon
                      size={48}
                      strokeWidth={1}
                      className="text-flame transition-transform duration-400 group-hover:scale-110"
                    />
                  </div>
                )}

                {/* Title */}
                <h3 className="text-xl font-normal mb-4 text-ink tracking-tight">
                  {problem.title}
                </h3>

                {/* Description */}
                <p className="text-base font-light leading-relaxed text-smoke m-0">
                  {problem.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
