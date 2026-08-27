import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from '../sections/Navigation'
import Hero from '../sections/Hero'
import ProblemPromise from '../sections/ProblemPromise'
import EcosystemReel from '../sections/EcosystemReel'
import IngestionFlow from '../sections/IngestionFlow'
import AnalyticsArchitecture from '../sections/AnalyticsArchitecture'
import CandidatePortal from '../sections/CandidatePortal'
import ComplianceSurface from '../sections/ComplianceSurface'
import Pricing from '../sections/Pricing'
import GetStarted from '../sections/GetStarted'
import Footer from '../sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.15,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf as any)
    }
  }, [])

  return (
    <div className="relative bg-signal-deep">
      <Navigation />
      <Hero />
      <ProblemPromise />
      <EcosystemReel />
      <IngestionFlow />
      <AnalyticsArchitecture />
      <CandidatePortal />
      <ComplianceSurface />
      <Pricing />
      <GetStarted />
      <Footer />
    </div>
  )
}
