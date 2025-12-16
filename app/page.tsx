import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import LogoCarousel from '@/components/LogoCarousel'
import Services from '@/components/Services'
import WeBelieve from '@/components/WeBelieve'
import TeamCollective from '@/components/TeamCollective'
import PortfolioServer from '@/components/PortfolioServer'
import SingleTestimonial from '@/components/SingleTestimonial'
import BrandedPricingSection from '@/components/BrandedPricingSection'
import DesignForGoodBanner from '@/components/DesignForGoodBanner'
import SingleProject from '@/components/SingleProject'
import Solutions from '@/components/Solutions'
import { PremiumCta } from '@/components/PremiumCta'
import { PremiumFaq } from '@/components/PremiumFaq'
import { PremiumDesignProcess } from '@/components/PremiumDesignProcess'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <ScrollToTop />
      <section id="hero">
        <Hero />
      </section>
      <LogoCarousel />
      <section id="services">
        <Services />
      </section>
      <section id="we-believe">
        <WeBelieve />
      </section>
      <section id="team">
        <TeamCollective />
      </section>
      <section id="portfolio">
        <PortfolioServer />
      </section>
      <section id="process">
        <PremiumDesignProcess />
      </section>
      <section id="testimonial">
        <SingleTestimonial />
      </section>
      <section id="pricing">
        <BrandedPricingSection />
      </section>
      {/* Design for Good Banner - Only shows during DFG campaign */}
      <DesignForGoodBanner />
      <section id="single-project">
        <SingleProject />
      </section>
      <section id="solutions">
        <Solutions />
      </section>
      <section id="cta">
        <PremiumCta />
      </section>
      <section id="faq">
        <PremiumFaq />
      </section>
      <section id="contact">
        <Contact />
      </section>
      <Footer />
    </main>
  )
}