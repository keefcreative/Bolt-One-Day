'use client'

import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import DesignForGoodHero from '@/components/designForGood/DesignForGoodHero'
import DesignForGoodMission from '@/components/designForGood/DesignForGoodMission'
import DesignForGoodProblems from '@/components/designForGood/DesignForGoodProblems'
import DesignForGoodAdvantage from '@/components/designForGood/DesignForGoodAdvantage'
import DesignForGoodProcess from '@/components/designForGood/DesignForGoodProcess'
import DesignForGoodPricing from '@/components/designForGood/DesignForGoodPricing'
import DesignForGoodFounder from '@/components/designForGood/DesignForGoodFounder'
import DesignForGoodComparison from '@/components/designForGood/DesignForGoodComparison'
import { PremiumFaq } from '@/components/PremiumFaq'
import dfgFaqData from '@/data/designForGood/faq.json'
import DesignForGoodFinalCta from '@/components/designForGood/DesignForGoodFinalCta'

const Navigation = dynamic(() => import('@/components/Navigation'), {
  ssr: false
})

export default function DesignForGoodPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <section id="dfg-hero">
        <DesignForGoodHero />
      </section>
      <section id="dfg-mission">
        <DesignForGoodMission />
      </section>
      <section id="dfg-problems">
        <DesignForGoodProblems />
      </section>
      <section id="dfg-advantage">
        <DesignForGoodAdvantage />
      </section>
      <section id="dfg-process">
        <DesignForGoodProcess />
      </section>
      <section id="dfg-pricing">
        <DesignForGoodPricing />
      </section>
      <section id="dfg-founder">
        <DesignForGoodFounder />
      </section>
      <section id="dfg-comparison">
        <DesignForGoodComparison />
      </section>
      <section id="dfg-faq">
        <PremiumFaq 
          showSearch={false}
          showCategories={false}
          initialOpenIndex={0}
          data={{
            title: dfgFaqData.faq.title,
            subtitle: dfgFaqData.faq.description,
            items: dfgFaqData.faq.questions.map(q => ({
              ...q,
              category: 'general' // Add default category
            }))
          }}
        />
      </section>
      <section id="dfg-cta">
        <DesignForGoodFinalCta />
      </section>
      <Footer />
    </main>
  )
}