'use client'

import { Monitor, Megaphone, FileText, Package, Palette, Smartphone } from 'lucide-react'
import servicesData from '@/data/services.json'

const iconMap = {
  Monitor,
  Megaphone,
  FileText,
  Package,
  Palette,
  Smartphone
}

export default function Services() {
  const { services } = servicesData

  // Ensure we have valid services data
  if (!servicesData || !servicesData.services || !servicesData.services.items) {
    return (
      <section className="py-32 px-16 bg-silk">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center">
            <div className="text-smoke">Loading services...</div>
          </div>
        </div>
      </section>
    )
  }


  return (
    <section id="services" className="py-32 px-16 bg-silk">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="mb-4 font-medium text-flame text-[0.875rem] tracking-[0.1em] uppercase">
            {services.eyebrow}
          </div>
          <h2 className="mb-8 text-[3.5rem] font-light tracking-[-0.03em] text-ink leading-[1.2]">
            {services.title}
          </h2>
          <p className="text-xl font-light text-smoke leading-[1.6] max-w-[640px] mx-auto">
            {services.description}
          </p>
        </div>

        {/* Services Grid - Premium 3x2 Layout */}
        <div className="services-grid">
          {services.items.map((service, index) => {
            const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Monitor

            return (
              <div key={index} className="service-card group">
                <div className="service-number text-flame font-medium mb-6">
                  {service.number}
                </div>
                
                <h3 className="text-[1.75rem] font-light text-ink mb-6 leading-[1.3] group-hover:text-flame transition-colors duration-600">
                  {service.title}
                </h3>
                
                <p className="text-smoke font-light leading-[1.6] text-[1rem]">
                  {service.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-flame transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}