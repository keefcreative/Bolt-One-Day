import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import LogoCarousel from '@/components/LogoCarousel'
import Services from '@/components/Services'
import WeBelieve from '@/components/WeBelieve'
import Team from '@/components/Team'
import PortfolioServer from '@/components/PortfolioServer'
import Testimonials from '@/components/Testimonials'
import BrandedPricingSection from '@/components/BrandedPricingSection'
import SingleProject from '@/components/SingleProject'
import Solutions from '@/components/Solutions'
import { PremiumCta } from '@/components/PremiumCta'
import { PremiumFaq } from '@/components/PremiumFaq'
import { PremiumDesignProcess } from '@/components/PremiumDesignProcess'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
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
        <Team />
      </section>
      <section id="portfolio">
        <PortfolioServer />
      </section>
      <section id="process">
        <PremiumDesignProcess />
      </section>
      <section id="testimonials">
        <Testimonials />
      </section>
      <section id="pricing">
        <BrandedPricingSection />
      </section>
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