'use client'

import { ArrowRight, Rocket, Palette, Globe, Handshake } from 'lucide-react'
import teamData from '@/data/team.json'

export default function TeamCollective() {
  const { team } = teamData

  const iconMap = {
    'Strategy That Sticks': Rocket,
    'Design That Delivers': Palette,
    'Digital Done Right': Globe,
    'Partnership, Not Vendor-ship': Handshake
  }

  return (
    <section id="team" className="py-16 md:py-20 bg-pearl">
      <div className="container-premium">
        {/* Header - Compact */}
        <div className="text-center mb-12">
          <p className="mb-3 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {team.eyebrow}
          </p>
          <h2 className="mb-4 text-4xl md:text-5xl font-light tracking-[-0.03em] text-ink">
            {team.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-2xl mx-auto">
            {team.description}
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">

          {/* Left: Intro & Capabilities */}
          <div>
            <p className="text-lg font-light text-ink leading-[1.7] mb-8">
              {team.collective_experience.intro}
            </p>

            <div className="space-y-4">
              {team.collective_experience.capabilities.map((capability, index) => {
                const Icon = iconMap[capability.area as keyof typeof iconMap]
                return (
                  <div
                    key={index}
                    className="group flex gap-4 p-4 hover:bg-white transition-all duration-300"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-flame/10 group-hover:bg-flame transition-all duration-300">
                      {Icon && <Icon className="w-5 h-5 text-flame group-hover:text-white" strokeWidth={1.5} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-ink mb-1 group-hover:text-flame transition-colors duration-300">
                        {capability.area}
                      </h3>
                      <p className="text-smoke font-light text-sm leading-[1.5]">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Stats & CTA */}
          <div>
            {/* Stats Grid - Compact */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {team.collective_experience.stats.map((stat, index) => (
                <div key={index} className="bg-white p-6 text-center">
                  <div className="text-3xl font-light text-flame mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-[0.1em] text-smoke">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Approach Box */}
            <div className="bg-ink text-white p-8">
              <p className="text-base font-light leading-[1.7] text-pearl/90 mb-6">
                {team.collective_experience.approach}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-flame hover:bg-ember text-white px-6 py-3 text-sm font-medium transition-all duration-300 group"
              >
                Let's Work Together
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}