'use client'

'use client'

import React from 'react'
import { useState } from 'react'
import { scrollToElement } from '@/lib/utils'
import navigationData from '@/data/navigation.json'
import contactData from '@/data/contact.json'
import heroData from '@/data/hero.json'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { contact } = contactData
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Simulate API call - replace with actual newsletter signup logic
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          email: email,
          company: '',
          message: 'Newsletter subscription request',
          service: 'Newsletter',
          listType: 'new'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to subscribe')
      }

      setSubmitStatus('success')
      setEmail('')
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <footer className="section-padding bg-ink text-white">
      <div className="container-premium">
        {/* Newsletter CTA */}
        <div className="mb-16 pb-16 border-b border-pearl/20">
          <div className="max-w-2xl">
            <h3 className="text-section font-light text-white mb-4 leading-tight">
              Stay Inspired<br />
              with DesignWorks
            </h3>
            <p className="text-pearl/80 font-light mb-6 leading-relaxed">
              Get weekly design tips, industry trends, and exclusive content delivered to your inbox.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-flame text-white font-medium text-sm tracking-wider transition-all duration-300 hover:bg-ember disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? 'Signing up...' : 'I want to stay in touch'}
                </button>
              </div>
              
              {submitStatus === 'success' && (
                <p className="text-coral text-sm font-medium">
                  ✓ Thanks for subscribing! Check your email to confirm.
                </p>
              )}
              
              {submitStatus === 'error' && (
                <p className="text-coral text-sm font-medium">
                  ✗ Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <div 
              className="font-semibold text-2xl mb-6 cursor-pointer hover:text-coral transition-colors"
              onClick={() => scrollToElement('#hero')}
            >
              {navigationData.brand.name}
            </div>
            <p className="text-pearl/80 font-light leading-[1.6] max-w-md mb-8">{heroData.hero.description}</p>
            <div className="space-y-2 text-pearl/80">
              <div>{contact.email}</div>
              <div>{contact.phone}</div>
              <div>{contact.address}</div>
            </div>
          </div>

          {/* Main Page */}
          <div>
            <h3 className="font-medium text-white mb-6 text-[0.875rem] tracking-[0.1em] uppercase">
              Main Page
            </h3>
            <ul className="space-y-4">
              {navigationData.items.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToElement(item.href)}
                    className="text-pearl/80 hover:text-coral transition-colors font-light"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Design For Good */}
          <div>
            <h3 className="font-medium text-white mb-6 text-[0.875rem] tracking-[0.1em] uppercase">
              Design For Good
            </h3>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => window.location.href = '/design-for-good#dfg-mission'}
                  className="text-pearl/80 hover:text-coral transition-colors font-light"
                >
                  Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/design-for-good#dfg-problems'}
                  className="text-pearl/80 hover:text-coral transition-colors font-light"
                >
                  Problems We Solve
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/design-for-good#dfg-advantage'}
                  className="text-pearl/80 hover:text-coral transition-colors font-light"
                >
                  Our Advantage
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/design-for-good#dfg-process'}
                  className="text-pearl/80 hover:text-coral transition-colors font-light"
                >
                  Our Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/design-for-good#dfg-pricing'}
                  className="text-pearl/80 hover:text-coral transition-colors font-light"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/design-for-good#dfg-founder'}
                  className="text-pearl/80 hover:text-coral transition-colors font-light"
                >
                  Meet the Founder
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/design-for-good#dfg-comparison'}
                  className="text-pearl/80 hover:text-coral transition-colors font-light"
                >
                  Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => window.location.href = '/design-for-good#dfg-faq'}
                  className="text-pearl/80 hover:text-coral transition-colors font-light"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-medium text-white mb-6 text-[0.875rem] tracking-[0.1em] uppercase">
              Services
            </h3>
            <ul className="space-y-4 text-pearl/80 font-light">
              <li><span className="hover:text-coral transition-colors cursor-pointer">Brand Identity</span></li>
              <li><span className="hover:text-coral transition-colors cursor-pointer">Web Design</span></li>
              <li><span className="hover:text-coral transition-colors cursor-pointer">Digital Marketing</span></li>
              <li><span className="hover:text-coral transition-colors cursor-pointer">Print Design</span></li>
              <li><span className="hover:text-coral transition-colors cursor-pointer">UI/UX Design</span></li>
              <li><span className="hover:text-coral transition-colors cursor-pointer">Packaging Design</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-12 border-t border-pearl/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-pearl/60 font-light text-center md:text-left">
              © {currentYear} DesignWorks Bureau Ltd. Company number 14847378. All rights reserved.
            </div>
            
            <div className="flex gap-8 text-pearl/60 font-light">
              <button
                onClick={() => window.location.href = '/privacy-policy'}
                className="hover:text-coral transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => window.location.href = '/terms-of-service'}
                className="hover:text-coral transition-colors"
              >
                Terms of Service
              </button>
              <button
                onClick={() => window.location.href = '/cookie-policy'}
                className="hover:text-coral transition-colors"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}