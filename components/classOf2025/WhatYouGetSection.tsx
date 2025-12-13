'use client'

import { Zap, Target, Calendar, Users, Lock, Check, LucideIcon } from 'lucide-react'
import { useStaggeredReveal } from '@/lib/classOf2025/animations'

interface Benefit {
  icon: string
  title: string
  description: string
  enablesWhat: string
  included: string[]
}

interface WhatYouGetSectionProps {
  benefits: Benefit[]
}

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Target,
  Calendar,
  Users,
  Lock,
  Check,
}

export default function WhatYouGetSection({ benefits }: WhatYouGetSectionProps) {
  const { ref, visibleIndices } = useStaggeredReveal(benefits.length, 150)

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 sm:py-24 px-6 sm:px-8 bg-pearl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-ink">
            What You Get:
            <br />
            The Strategic Design Partnership
          </h2>
          <p className="text-base sm:text-lg font-light text-ink/70 max-w-3xl mx-auto">
            Three core capabilities that transform design from expense to strategic edge
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((benefit, index) => {
            const Icon = iconMap[benefit.icon]
            const isVisible = visibleIndices.has(index)

            return (
              <div
                key={index}
                className={`group p-6 sm:p-8 bg-white border border-ink/10 transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                } hover:border-flame/50 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]`}
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
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-base font-light leading-relaxed text-smoke mb-6">
                  {benefit.description}
                </p>

                {/* Included List */}
                <div>
                  <p className="text-sm font-normal text-ink mb-3">Included:</p>
                  <ul className="list-none p-0 m-0 flex flex-col gap-2">
                    {benefit.included.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-2 text-sm font-light text-smoke"
                      >
                        <span className="w-1 h-1 bg-flame rounded-full mt-2 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <p className="text-lg sm:text-xl font-light text-ink/80 mb-6 max-w-3xl mx-auto">
            This is what strategic design partnership looks like.
          </p>
          <button
            onClick={() => {
              const section = document.getElementById('investment')
              section?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 sm:px-12 py-4 sm:py-5 bg-flame text-white text-xs sm:text-sm font-medium uppercase tracking-[0.1em] border-none cursor-pointer transition-all duration-400 ease-out hover:bg-ember hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(255,107,53,0.3)]"
          >
            See Pricing & Enroll
          </button>
        </div>
      </div>
    </section>
  )
}
