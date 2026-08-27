import { useEffect, useRef, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StarVisualization from '../components/StarVisualization'

gsap.registerPlugin(ScrollTrigger)

export default function AnalyticsArchitecture() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-signal-deep"
    >
      {/* Star Visualization Background */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-accent border-t-transparent" />
            </div>
          }
        >
          <StarVisualization />
        </Suspense>
      </div>

      {/* Text Overlay */}
      <div
        ref={textRef}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ opacity: 0 }}
      >
        <div className="mb-4 rounded-full border border-signal-accent/30 bg-signal-accent/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-signal-accent">
          Analytics Architecture
        </div>
        <h2 className="max-w-xl font-display text-[clamp(28px,4vw,48px)] font-medium uppercase leading-[1.15] tracking-[-0.02em] text-signal-text">
          Real-time Intelligence
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-signal-muted">
          Understand your hiring velocity, communication compliance, and
          candidate sentiment at a glance. Signal surfaces insights that help
          you hire faster and fairer.
        </p>

        {/* Stats Row */}
        <div className="mt-12 grid grid-cols-3 gap-8 md:gap-16">
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-signal-text md:text-4xl">
              98.7%
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-signal-muted">
              SLA Compliance
            </div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-signal-accent md:text-4xl">
              3.2x
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-signal-muted">
              Response Rate
            </div>
          </div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-signal-text md:text-4xl">
              12min
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-signal-muted">
              Avg. Update Time
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
