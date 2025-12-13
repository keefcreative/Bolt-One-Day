'use client'

import { ArrowRight } from 'lucide-react'
import ConstellationBackground from './ConstellationBackground'

interface HeroSectionProps {
  campaign: any
  v2Content: {
    eyebrow: string
    headline: string
    subhead: string
    pricing: string
    enrollmentDeadline: string
    bullets: string[]
  }
  spotsRemaining: number
  onBookCallClick: () => void
  onEnrollClick: () => void
}

export default function HeroSection({
  campaign,
  v2Content,
  spotsRemaining,
  onBookCallClick,
  onEnrollClick,
}: HeroSectionProps) {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-br from-ink via-smoke to-ink relative overflow-hidden">
      {/* Constellation Background */}
      <ConstellationBackground />

      <div className="max-w-[1600px] mx-auto pt-32 pb-16 px-6 sm:px-12 lg:px-16 w-full relative z-10">
        <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
          {/* Eyebrow */}
          <div
            className="text-xs sm:text-sm font-medium text-flame uppercase tracking-[0.15em] opacity-0"
            style={{ animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards' }}
          >
            {v2Content.eyebrow}
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight tracking-tight max-w-5xl m-0 px-4 opacity-0"
            style={{ animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards' }}
          >
            {v2Content.headline}
          </h1>

          {/* Subheadline */}
          <p
            className="text-base sm:text-lg lg:text-xl font-light leading-relaxed text-pearl/90 max-w-3xl m-0 px-4 opacity-0"
            style={{ animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards' }}
          >
            {v2Content.subhead}
          </p>

          {/* Pricing */}
          <p
            className="text-lg sm:text-xl font-normal text-pearl m-0 opacity-0"
            style={{ animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards' }}
          >
            {v2Content.pricing}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center gap-4 opacity-0"
            style={{ animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards' }}
          >
            <button
              onClick={onBookCallClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-10 sm:px-14 py-4 sm:py-5 bg-flame text-white text-xs sm:text-sm font-medium uppercase tracking-[0.12em] border-none cursor-pointer transition-all duration-400 ease-bounce hover:bg-ember hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(255,107,53,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame"
              aria-label="Book discovery call for Class of 2025"
            >
              Book Discovery Call
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>

            <button
              onClick={() => {
                const section = document.getElementById('what-you-get')
                section?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-transparent text-pearl text-xs sm:text-sm font-medium uppercase tracking-[0.12em] border border-pearl/30 cursor-pointer transition-all duration-400 ease-out hover:bg-pearl/10 hover:border-pearl/50"
              aria-label="See how it works"
            >
              See How It Works
            </button>
          </div>

          {/* Key Bullets */}
          <ul
            className="list-none p-0 m-0 flex flex-col gap-2.5 text-sm sm:text-base text-pearl/80 max-w-2xl opacity-0"
            style={{ animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards' }}
          >
            {v2Content.bullets.map((bullet, index) => (
              <li key={index} className="flex items-center gap-2.5 justify-center">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* Enrollment Deadline */}
          <p
            className="text-sm sm:text-base font-light text-pearl/70 m-0 opacity-0"
            style={{ animation: 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 1.4s forwards' }}
          >
            {v2Content.enrollmentDeadline}
          </p>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
