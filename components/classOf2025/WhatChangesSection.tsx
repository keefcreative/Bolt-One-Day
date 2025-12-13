'use client'

import { useRef } from 'react'
import { useScrollProgress, useScrollReveal } from '@/lib/classOf2025/animations'
import ConstellationBackgroundTimeline from './ConstellationBackgroundTimeline'

interface TimelineStage {
  stage: string
  title: string
  description: string
}

interface WhatChangesSectionProps {
  stages: TimelineStage[]
}

export default function WhatChangesSection({ stages }: WhatChangesSectionProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(timelineRef as React.RefObject<HTMLElement>)
  const { ref: sectionRef, isVisible } = useScrollReveal(0.2)

  return (
    <section
      id="what-changes"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="py-16 sm:py-24 px-6 sm:px-8 bg-gradient-to-b from-ink via-smoke to-ink relative overflow-hidden"
    >
      {/* Constellation Background */}
      <ConstellationBackgroundTimeline />

      <div className="max-w-6xl mx-auto relative z-10" ref={timelineRef}>
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-4 text-pearl">
            What Changes When Design Isn't a Bottleneck
          </h2>
          <p className="text-base sm:text-lg font-light text-pearl/70 max-w-3xl mx-auto">
            The transformation from rationing to velocity
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 sm:left-1/2 top-0 w-0.5 bg-pearl/10 h-full sm:-translate-x-1/2 hidden sm:block">
            <div
              className="w-full bg-flame transition-all duration-500 ease-out"
              style={{
                height: isVisible ? `${progress}%` : '0%',
              }}
            />
          </div>

          {/* Timeline Stages */}
          <div className="flex flex-col gap-12 sm:gap-16">
            {stages.map((stage, index) => {
              const isLeft = index % 2 === 0
              const delay = index * 0.2

              return (
                <div
                  key={index}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isLeft ? 'sm:justify-start' : 'sm:justify-end'
                  } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{
                    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${delay}s`,
                  }}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-6 sm:left-1/2 top-0 sm:-translate-x-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-ink border-2 border-flame flex items-center justify-center text-flame font-medium text-xs sm:text-sm z-10">
                    {index + 1}
                  </div>

                  {/* Content Card */}
                  <div
                    className={`ml-16 sm:ml-0 sm:w-[calc(50%-3rem)] p-6 sm:p-8 bg-smoke/60 border border-flame/30 backdrop-blur-sm ${
                      isLeft ? '' : 'sm:text-right'
                    }`}
                  >
                    {/* Stage Label */}
                    <div className="text-xs sm:text-sm uppercase tracking-[0.1em] text-flame font-medium mb-2">
                      {stage.stage}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-normal text-pearl mb-4 tracking-tight">
                      {stage.title}
                    </h3>

                    {/* Description */}
                    <p className="text-base sm:text-lg font-light leading-relaxed text-pearl/80 m-0">
                      {stage.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
