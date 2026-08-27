import { useEffect, useRef, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RippleSurface from '../components/RippleSurface'

gsap.registerPlugin(ScrollTrigger)

const slaFeatures = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'SLA Monitoring',
    desc: 'Resume received \u2192 24h. Interview done \u2192 12h. Decision \u2192 48h.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'Auto-Escalation',
    desc: 'Miss an SLA? Signal alerts before the breach becomes a complaint.',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Compliance Analytics',
    desc: 'Audit trails, response time benchmarks, and employer brand scores.',
  },
]

export default function ComplianceSurface() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="compliance"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-signal-deep"
    >
      {/* Ripple Surface Background */}
      <div className="absolute inset-0 z-0">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-signal-accent border-t-transparent" />
            </div>
          }
        >
          <RippleSurface />
        </Suspense>
      </div>

      {/* Content Overlay */}
      <div
        ref={contentRef}
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-32"
        style={{ opacity: 0 }}
      >
        <div className="mb-4 rounded-full border border-signal-accent/30 bg-signal-accent/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-signal-accent">
          The Compliance Surface
        </div>

        <h2 className="max-w-lg text-center font-display text-[clamp(28px,4vw,48px)] font-medium uppercase leading-[1.15] tracking-[-0.02em] text-signal-text">
          Communication SLA
        </h2>

        <p className="mx-auto mt-6 max-w-md text-center text-base leading-relaxed text-signal-muted">
          Set your policies. We enforce them. The surface alerts before the
          breach — keeping your recruiters accountable and your candidates
          informed.
        </p>

        {/* Feature Cards */}
        <div className="mt-14 grid max-w-3xl gap-5 md:grid-cols-3">
          {slaFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/5 bg-black/30 p-6 backdrop-blur-xl transition-all duration-500 hover:border-signal-accent/30 hover:bg-black/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-signal-accent/10 text-signal-accent">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-display text-sm font-semibold uppercase tracking-[0.02em] text-signal-text">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-signal-muted">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="mb-6 text-sm text-signal-muted">
            Recruiters keep control. Candidates stay informed.
          </p>
          <button className="inline-flex items-center gap-2 rounded-full bg-signal-accent px-8 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-400 hover:bg-signal-glow">
            Explore Enterprise
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
