'use client'

import { ArrowRight, Check, X } from 'lucide-react'

interface FinalCTASectionProps {
  campaign: any
  spotsRemaining: number
  totalSpots: number
  onBookCallClick: () => void
  onEnrollClick: () => void
  finalCTA: {
    lockInNow: Array<string | { text: string; description: string; bold: boolean }>
    waitUntil2026: Array<string | { text: string; description: string; bold: boolean }>
    afterDeadline: string[]
  }
}

export default function FinalCTASection({
  campaign,
  spotsRemaining,
  totalSpots,
  onBookCallClick,
  onEnrollClick,
  finalCTA,
}: FinalCTASectionProps) {
  return (
    <>
      {/* SECTION 1: THE TRADE-OFF (DARK BACKGROUND) */}
      <section className="py-16 sm:py-24 px-6 sm:px-8 bg-gradient-to-br from-ink to-[#1A1A1A]">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-8 text-pearl">
              Enrollment Closes March 31, 2026
            </h2>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-black border border-flame/30">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-pearl uppercase tracking-[0.1em]">
                  {totalSpots} total spots available
                </span>
              </div>
              <div className="w-px h-4 bg-pearl/20" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-flame rounded-full animate-pulse" />
                <span className="text-xs font-medium text-flame uppercase tracking-[0.1em]">
                  {spotsRemaining} spots remaining
                </span>
              </div>
            </div>
          </div>

          {/* Comparison Table - Lock In Now vs Wait */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
            {/* Lock In Now */}
            <div className="p-8 sm:p-10 bg-white border-2 border-flame shadow-lg">
              <h3 className="text-2xl font-normal text-flame mb-6 tracking-tight">Lock In Now</h3>
              <ul className="list-none p-0 m-0 space-y-3 text-base font-light text-ink leading-relaxed">
                {finalCTA.lockInNow.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    {typeof item === 'string' ? (
                      <span>{item}</span>
                    ) : (
                      <span>
                        <strong className="font-medium">{item.text}</strong> {item.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Wait Until 2026 */}
            <div className="p-8 sm:p-10 bg-smoke/50 border border-pearl/20 shadow-lg">
              <h3 className="text-2xl font-normal text-pearl/70 mb-6 tracking-tight">
                Wait Until 2026
              </h3>
              <ul className="list-none p-0 m-0 space-y-3 text-base font-light text-pearl/60 leading-relaxed">
                {finalCTA.waitUntil2026.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                    {typeof item === 'string' ? (
                      <span>{item}</span>
                    ) : (
                      <span>
                        <strong className="font-medium">{item.text}</strong> {item.description}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The Trade-off */}
          <div className="text-center mb-12">
            <p className="text-xl sm:text-2xl font-light text-pearl mb-2">
              The trade-off is clear:
            </p>
            <p className="text-2xl sm:text-3xl font-normal text-flame">
              Lock £999/month now, or pay £1,449/month later.
            </p>
          </div>

          {/* Primary CTA */}
          <div className="text-center">
            <button
              onClick={onBookCallClick}
              className="inline-flex items-center justify-center gap-3 px-12 sm:px-16 py-5 sm:py-6 bg-flame text-white text-sm sm:text-base font-medium uppercase tracking-widest border-0 cursor-pointer transition-all duration-400 ease-out hover:bg-ember hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(255,107,53,0.3)] mb-4"
            >
              Book Discovery Call
              <ArrowRight size={20} strokeWidth={1.5} />
            </button>
            <p className="text-sm text-pearl/60 max-w-2xl mx-auto leading-relaxed">
              Questions? Email:{' '}
              <a
                href={`mailto:${campaign.urls?.email || 'hello@designworksbureau.co.uk'}`}
                className="text-flame hover:text-ember transition-colors duration-300 no-underline hover:underline"
              >
                {campaign.urls?.email || 'hello@designworksbureau.co.uk'}
              </a>
              <br />
              Cancel anytime with 30 days notice. No long-term commitment.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
