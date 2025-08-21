'use client'

import React from 'react'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Calendar } from 'lucide-react'
import contactData from '@/data/contact.json'

const Contact: React.FC = () => {
  const { contact } = contactData
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          listType: 'qualified'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', company: '', service: '', message: '' })
      } else {
        setSubmitStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error status when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle')
      setErrorMessage('')
    }
  }

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-premium">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="mb-4 font-medium text-flame text-sm tracking-[0.1em] uppercase">
            {contact.eyebrow}
          </p>
          <h2 className="mb-6 text-section font-light tracking-[-0.03em] text-ink">
            {contact.title}
          </h2>
          <p className="text-lg font-light text-smoke leading-[1.6] max-w-2xl mx-auto">
            {contact.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1: Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-silk">
                <Phone className="w-6 h-6 text-flame" strokeWidth={1.2} />
              </div>
              <div>
                <h3 className="text-ink font-medium mb-2 text-lg">Phone</h3>
                <a 
                  href={`tel:${contact.phone}`} 
                  className="text-smoke hover:text-flame transition-colors duration-base"
                >
                  {contact.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-silk">
                <Mail className="w-6 h-6 text-flame" strokeWidth={1.2} />
              </div>
              <div>
                <h3 className="text-ink font-medium mb-2 text-lg">Email</h3>
                <a 
                  href={`mailto:${contact.email}`} 
                  className="text-smoke hover:text-flame transition-colors duration-base"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 flex items-center justify-center bg-silk">
                <MapPin className="w-6 h-6 text-flame" strokeWidth={1.2} />
              </div>
              <div>
                <h3 className="text-ink font-medium mb-2 text-lg">Address</h3>
                <p className="text-smoke">{contact.address}</p>
              </div>
            </div>

            {/* Calendly Integration */}
            <div className="pt-6 border-t border-mist">
              <h3 className="text-ink font-medium mb-4 text-lg">Book a Consultation</h3>
              <p className="text-smoke mb-6 leading-relaxed">{contact.consultationDescription}</p>
              <a
                href={contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-flame text-white font-medium text-sm tracking-[0.05em] uppercase transition-all duration-base hover:bg-ember hover:shadow-card-hover hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" strokeWidth={1.2} />
                Book Free Consultation
              </a>
            </div>
          </div>

          {/* Column 2: Contact Form */}
          <div className="card-premium">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-ink font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-mist bg-white text-ink placeholder-smoke focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/20 transition-all duration-base"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-ink font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-mist bg-white text-ink placeholder-smoke focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/20 transition-all duration-base"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-ink font-medium mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-mist bg-white text-ink placeholder-smoke focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/20 transition-all duration-base"
                  placeholder="Your company"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-ink font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-mist bg-white text-ink placeholder-smoke focus:border-flame focus:outline-none focus:ring-2 focus:ring-flame/20 transition-all duration-base resize-none"
                  placeholder="Tell us about your project, goals, and how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-ink text-white font-medium text-sm tracking-[0.05em] uppercase transition-all duration-base hover:bg-flame disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-card-hover hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5" strokeWidth={1.2} />
                  </>
                )}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-sage/20 border border-sage text-ink text-center font-medium">
                  ✓ Thank you for your message! We'll get back to you within 24 hours.
                </div>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <div className="p-4 bg-coral/20 border border-coral text-ember text-center font-medium">
                  ✗ {errorMessage}
                </div>
              )}
            </form>
          </div>

          {/* Column 3: What Happens Next */}
          <div>
            <h3 className="text-xl font-medium text-ink mb-6">What Happens Next?</h3>
            <div className="space-y-6 text-smoke">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-flame text-white flex items-center justify-center text-sm font-medium mt-1">
                  1
                </div>
                <div>
                  <div className="font-medium text-ink mb-1">We Review Your Request</div>
                  <div className="text-sm">Our team will carefully review your message and project requirements within 24 hours.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-flame text-white flex items-center justify-center text-sm font-medium mt-1">
                  2
                </div>
                <div>
                  <div className="font-medium text-ink mb-1">Discovery Call</div>
                  <div className="text-sm">We'll schedule a 30-minute call to discuss your goals, timeline, and how we can best help you.</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-flame text-white flex items-center justify-center text-sm font-medium mt-1">
                  3
                </div>
                <div>
                  <div className="font-medium text-ink mb-1">Custom Proposal</div>
                  <div className="text-sm">You'll receive a tailored proposal with timeline, deliverables, and next steps to get started.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact