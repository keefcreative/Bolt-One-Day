'use client'

import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'

const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false
})

interface LegalSection {
  heading: string
  content: string
  subsections?: Array<{
    subheading: string
    content: string
  }>
  list?: string[]
  contactDetails?: {
    company: string
    email: string
    address: string
    companyNumber: string
  }
}

interface LegalData {
  title: string
  lastUpdated: string
  effectiveDate: string
  sections: LegalSection[]
}

interface LegalPageLayoutProps {
  data: LegalData
}

export default function LegalPageLayout({ data }: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <section className="section-padding bg-white">
        <div className="container-premium max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-light tracking-[-0.03em] text-ink mb-6">
              {data.title}
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-smoke">
              <span>Last Updated: {data.lastUpdated}</span>
              <span className="hidden sm:block">•</span>
              <span>Effective Date: {data.effectiveDate}</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            {data.sections.map((section, index) => (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-medium text-ink mb-6 border-b border-mist pb-3">
                  {section.heading}
                </h2>
                
                <div className="text-smoke leading-relaxed space-y-6">
                  <p>{section.content}</p>
                  
                  {/* Render list if present */}
                  {section.list && (
                    <ul className="space-y-3 ml-6">
                      {section.list.map((item, listIndex) => (
                        <li key={listIndex} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-flame mt-3 flex-shrink-0 rounded-full" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Render subsections if present */}
                  {section.subsections && (
                    <div className="space-y-6 ml-4">
                      {section.subsections.map((subsection, subIndex) => (
                        <div key={subIndex}>
                          <h3 className="text-lg font-medium text-ink mb-3">
                            {subsection.subheading}
                          </h3>
                          <p className="text-smoke leading-relaxed">
                            {subsection.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Render contact details if present */}
                  {section.contactDetails && (
                    <div className="bg-silk p-6 border border-mist mt-6">
                      <div className="space-y-2 text-smoke">
                        <div className="font-medium text-ink">{section.contactDetails.company}</div>
                        <div>Email: <a href={`mailto:${section.contactDetails.email}`} className="text-flame hover:underline">{section.contactDetails.email}</a></div>
                        <div>Address: {section.contactDetails.address}</div>
                        <div>Company Number: {section.contactDetails.companyNumber}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Back to Top */}
          <div className="text-center mt-16 pt-16 border-t border-mist">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-flame hover:text-ember transition-colors font-medium"
            >
              ↑ Back to Top
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}