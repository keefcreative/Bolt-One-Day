'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, ArrowRight } from 'lucide-react'
import Footer from '@/components/Footer'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<string | null>(null)

  useEffect(() => {
    setSessionId(searchParams.get('session_id'))
    setCampaign(searchParams.get('campaign'))
  }, [searchParams])

  const isClassOf2026 = campaign === 'classOf2026'
  const brevoCallLink = 'https://meet.brevo.com/designworksbureau/class-of-2025-discovery-call'

  return (
    <main className="min-h-screen bg-gradient-to-br from-ink via-smoke to-ink text-pearl">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full mb-6">
            <Check size={48} className="text-green-500" strokeWidth={2} />
          </div>

          {isClassOf2026 ? (
            <>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-4">
                Welcome to Class of 2026!
              </h1>
              <p className="text-xl sm:text-2xl font-light text-pearl/80 mb-2">
                Your £999/month rate is locked for 12 months
              </p>
              <p className="text-base sm:text-lg font-light text-pearl/60">
                You're now part of an exclusive cohort of 10 growth-stage companies
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight mb-4">
                Subscription Confirmed!
              </h1>
              <p className="text-xl sm:text-2xl font-light text-pearl/80">
                Thank you for partnering with DesignWorks Bureau
              </p>
            </>
          )}
        </div>

        {/* What Happens Next */}
        <div className="bg-smoke/60 border border-flame/30 p-8 sm:p-12 mb-12">
          <h2 className="text-2xl sm:text-3xl font-normal text-pearl mb-8 text-center tracking-tight">
            What Happens Next
          </h2>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-flame text-white flex items-center justify-center text-lg font-light">
                1
              </div>
              <div>
                <h3 className="text-lg font-normal text-pearl mb-2">Check Your Email</h3>
                <p className="text-base font-light text-pearl/70 m-0">
                  You'll receive a confirmation email with your subscription details and receipt
                  within the next few minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-flame text-white flex items-center justify-center text-lg font-light">
                2
              </div>
              <div>
                <h3 className="text-lg font-normal text-pearl mb-2">
                  We'll Reach Out Within 24 Hours
                </h3>
                <p className="text-base font-light text-pearl/70 m-0">
                  {isClassOf2026
                    ? 'Our team will email you to schedule your onboarding call and introduce you to your dedicated design team.'
                    : 'Our team will email you to schedule your onboarding call and get you set up.'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-flame text-white flex items-center justify-center text-lg font-light">
                3
              </div>
              <div>
                <h3 className="text-lg font-normal text-pearl mb-2">Start Submitting Requests</h3>
                <p className="text-base font-light text-pearl/70 m-0">
                  After your onboarding call, you can submit your first design request immediately.
                  Most requests are delivered within 48 hours.
                </p>
              </div>
            </div>
          </div>

          {sessionId && (
            <p className="text-sm text-pearl/50 text-center border-t border-pearl/10 pt-6">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        {/* Book Onboarding Call CTA */}
        {isClassOf2026 && (
          <div className="bg-black border-2 border-flame p-8 sm:p-12 text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-normal text-pearl mb-4">
              Want to Get Started Faster?
            </h2>
            <p className="text-base sm:text-lg font-light text-pearl/80 mb-6 max-w-2xl mx-auto">
              Don't wait 24 hours—book your onboarding call right now and start submitting requests
              today.
            </p>
            <a
              href={brevoCallLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-5 bg-flame text-white text-sm font-medium uppercase tracking-widest border-none cursor-pointer transition-all duration-400 ease-out hover:bg-ember hover:-translate-y-0.5 hover:shadow-[0_25px_50px_rgba(255,107,53,0.3)] no-underline"
            >
              Book Onboarding Call Now
              <ArrowRight size={20} strokeWidth={2.5} />
            </a>
          </div>
        )}

        {/* Additional Info */}
        <div className="text-center space-y-4">
          {isClassOf2026 && (
            <>
              <p className="text-base font-light text-pearl/70">
                <strong className="font-medium text-pearl">Your Founding Member Benefits:</strong>
              </p>
              <ul className="list-none p-0 m-0 space-y-2 text-sm text-pearl/70 inline-block text-left">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-flame flex-shrink-0" />
                  <span>£999/month rate locked for 12 months</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-flame flex-shrink-0" />
                  <span>Same-week delivery guaranteed</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-flame flex-shrink-0" />
                  <span>Monthly strategy sessions with cohort insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-flame flex-shrink-0" />
                  <span>Unlimited design requests</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-flame flex-shrink-0" />
                  <span>Cancel anytime with 30 days notice</span>
                </li>
              </ul>
            </>
          )}

          <p className="text-sm text-pearl/60 pt-6 border-t border-pearl/10 mt-8">
            Questions? Email us at{' '}
            <a
              href="mailto:hello@designworks.com"
              className="text-flame underline hover:text-ember transition-colors"
            >
              hello@designworks.com
            </a>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
