import React from 'react'
import Link from 'next/link'
import { Check, Calendar, Mail, Phone } from 'lucide-react'

export default function DesignForGoodSuccess() {
  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white p-12 shadow-premium">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" strokeWidth={2} />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-playfair font-bold text-ink mb-4">
              Welcome to the Founding Cohort!
            </h1>
            <p className="text-xl text-smoke font-light">
              Thank you for joining Design for Good. Your subscription has been activated.
            </p>
          </div>

          {/* What's Next */}
          <div className="border-t border-ash/20 pt-8 mb-8">
            <h2 className="text-2xl font-playfair font-bold text-ink mb-6">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-ink">Check Your Email</p>
                  <p className="text-sm text-smoke">
                    We've sent your welcome pack with login details and getting started guide.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-ink">Schedule Your Onboarding Call</p>
                  <p className="text-sm text-smoke">
                    Our team will reach out within 24 hours to schedule your strategy session.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 mt-0.5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-ink">Get Immediate Support</p>
                  <p className="text-sm text-smoke">
                    Questions? Email us at{' '}
                    <a href="mailto:designforgood@designworksbureau.co.uk" className="text-green-600 hover:underline">
                      designforgood@designworksbureau.co.uk
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Reminder */}
          <div className="bg-green-50 p-6 mb-8">
            <h3 className="font-playfair font-bold text-ink mb-3">Your Membership Includes:</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-smoke">Unlimited design requests starting immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-smoke">72-hour turnaround on all requests</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-smoke">Monthly strategy calls with your creative director</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-smoke">Access to our complete template library</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/design-for-good"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-white font-medium text-sm tracking-[0.05em] uppercase transition-all duration-400 hover:bg-green-600"
            >
              Return to Design for Good
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}