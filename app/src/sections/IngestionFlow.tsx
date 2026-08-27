import { useEffect, useRef, useState, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CurvedCarousel from '../components/CurvedCarousel'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    title: 'Connect your ATS.',
    description:
      'One-click integration with Greenhouse, Lever, Workday, Ashby, and more. No migration. No disruption. Signal reads your pipeline and begins working immediately.',
  },
  {
    number: '02',
    title: 'Define your communication DNA.',
    description:
      'Set your tone, SLA policies, and communication channels. Want warm and personal? Corporate and formal? Signal adapts to your brand voice across every touchpoint.',
  },
  {
    number: '03',
    title: 'We handle the silence.',
    description:
      'Every stage change triggers the right message. Delays get explained. Rejections get personalized. No candidate is ever left wondering. Your recruiters focus on hiring, not typing.',
  },
]

export default function IngestionFlow() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stickyTextRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section and progress through steps
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const stepIndex = Math.min(
            Math.floor(progress * steps.length),
            steps.length - 1
          )
          setActiveStep(stepIndex)

          if (ctaRef.current) {
            const ctaProgress = Math.max(0, (progress - 0.75) * 4)
            gsap.set(ctaRef.current, { opacity: ctaProgress })
          }
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="ingestion"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-signal-deep"
    >
      {/* 3D Carousel Background */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-accent border-t-transparent" />
            </div>
          }
        >
          <CurvedCarousel />
        </Suspense>
      </div>

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to right, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.5) 40%, rgba(10,10,10,0) 70%)',
        }}
      />

      {/* Text Content */}
      <div
        ref={stickyTextRef}
        className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-20"
      >
        <div className="max-w-lg">
          <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-signal-accent">
            The Ingestion Flow
          </div>

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="mb-8 transition-all duration-700"
              style={{
                opacity: activeStep === index ? 1 : 0.2,
                transform:
                  activeStep === index
                    ? 'translateX(0)'
                    : 'translateX(-20px)',
              }}
            >
              <div className="mb-2 font-display text-[10px] font-semibold uppercase tracking-[0.1em] text-signal-muted">
                {step.number}
              </div>
              <h3 className="mb-3 font-display text-2xl font-semibold uppercase leading-tight tracking-[-0.01em] text-signal-text md:text-3xl">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-signal-muted md:text-base">
                {step.description}
              </p>
            </div>
          ))}

          <button
            ref={ctaRef}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-signal-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-signal-accent transition-all duration-400 hover:bg-signal-accent hover:text-white"
            style={{ opacity: 0 }}
          >
            See the Architecture
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
