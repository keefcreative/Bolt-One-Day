'use client'

import { Check, AlertCircle } from 'lucide-react'
import { useScrollReveal } from '@/lib/classOf2025/animations'

interface InvestmentSectionProps {
  campaign: any
  spotsRemaining: number
  isCampaignAvailable: boolean
  comparisonTable: any
  onCheckoutClick: () => Promise<void>
  onBookCallClick: () => void
  isCheckoutLoading: boolean
  checkoutError: string | null
}

export default function InvestmentSection({
  campaign,
  spotsRemaining,
  isCampaignAvailable,
  comparisonTable,
  onCheckoutClick,
  onBookCallClick,
  isCheckoutLoading,
  checkoutError,
}: InvestmentSectionProps) {
  const { ref, isVisible } = useScrollReveal(0.2)

  return (
    <section
      id="investment"
      ref={ref as React.RefObject<HTMLElement>}
      className="py-16 sm:py-24 px-6 sm:px-8 bg-pearl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Eyebrow */}
        <p className="text-center text-xs font-medium uppercase tracking-[0.15em] text-flame mb-4">
          Join Us Today
        </p>

        {/* Headline */}
        <h2 className="text-center text-[clamp(2rem,4vw,2.5rem)] font-light leading-[1.2] tracking-tight mb-16 max-w-[600px] mx-auto text-ink">
          Ready for growth in 2026?
        </h2>

        {/* Premium Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:items-center mb-12 max-w-4xl mx-auto relative">
          {/* Class of 2025 - Featured */}
          <div className="relative py-12 px-8 text-center bg-ink text-white border border-ink transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 hover:border-flame hover:shadow-[0_30px_80px_rgba(255,107,53,0.2)] z-20 hover:z-30 sm:border-b-0">
            <div className="text-xs font-medium uppercase tracking-[0.15em] text-flame mb-6">
              Class of 2025
            </div>

            <div className="text-6xl font-extralight leading-none tracking-tight mb-2">
              £999
            </div>

            <div className="text-sm font-light text-white/60 tracking-wider mb-8">
              per month
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3 mb-6">
              <span className="text-sm font-light text-white/70 before:content-['✓_'] before:text-flame before:font-medium before:mr-2">
                Rate locked forever
              </span>
              <span className="text-sm font-light text-white/70 before:content-['✓_'] before:text-flame before:font-medium before:mr-2">
                48h turnaround
              </span>
              <span className="text-sm font-light text-white/70 before:content-['✓_'] before:text-flame before:font-medium before:mr-2">
                Priority support
              </span>
            </div>

            {/* Spots Badge - Animated */}
            <span className="inline-block bg-flame text-white px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] mt-6 animate-[pulse_2s_ease-in-out_infinite]">
              {spotsRemaining} Spot{spotsRemaining !== 1 ? 's' : ''} Left
            </span>
          </div>

          {/* Standard Plan - Subdued, Shorter, No Left Border */}
          <div className="relative py-8 px-6 text-center bg-white border border-pearl/20 opacity-70 z-10 sm:border-l-0">
            <div className="text-xs font-medium uppercase tracking-[0.15em] text-ink/60 mb-6">
              Standard Plan
            </div>

            <div className="text-5xl font-extralight leading-none tracking-tight text-ink mb-2">
              £1,449
            </div>

            <div className="text-sm font-light text-ink/60 tracking-wider mb-8">
              per month
            </div>

            {/* Features */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-light text-ink/60 before:content-['✓_'] before:text-ink/40 before:font-medium before:mr-2">
                From Jan 2026
              </span>
              <span className="text-sm font-light text-ink/60 before:content-['×_'] before:text-ink/40 before:font-medium before:mr-2">
                3-5 day turnaround
              </span>
              <span className="text-sm font-light text-ink/60 before:content-['×_'] before:text-ink/40 before:font-medium before:mr-2">
                Standard support
              </span>
            </div>
          </div>
        </div>

        {/* Savings Callout */}
        <p className="text-center text-lg font-light text-ink/60 mb-12">
          Enroll today and save <strong className="font-normal text-ink">£5,400 every year</strong>
        </p>

        {/* CTA & Social Proof */}
        <div className="text-center">
          {checkoutError && (
            <div className="max-w-md mx-auto mb-4 p-4 bg-red-50 border border-red-200 flex items-start gap-3 text-left">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm m-0 leading-normal">{checkoutError}</p>
            </div>
          )}

          {!isCampaignAvailable ? (
            <div className="max-w-md mx-auto p-6 bg-flame/10 border border-flame/30 text-center mb-16">
              <p className="text-flame text-base font-medium m-0 mb-2">
                Campaign Unavailable
              </p>
              <p className="text-ink/70 text-sm m-0">
                This campaign is no longer accepting new subscriptions
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={onCheckoutClick}
                disabled={isCheckoutLoading}
                className="inline-block px-10 py-[1.125rem] bg-ink text-white text-sm font-medium uppercase tracking-wider border-0 cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-flame hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] disabled:opacity-50 disabled:cursor-not-allowed mb-8"
              >
                {isCheckoutLoading ? 'Loading...' : 'Claim Your Seat'}
              </button>

              <p className="text-xs font-light text-ink/60 tracking-wider mb-16">
                <strong className="font-medium text-ink">3 companies</strong> locked their rate this week
              </p>
            </>
          )}
        </div>

        {/* Pulse animation for badge */}
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.4);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(255, 107, 53, 0);
            }
          }
        `}</style>
      </div>
    </section>
  )
}
