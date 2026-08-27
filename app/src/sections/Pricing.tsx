import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Tier = {
  name: string
  tagline: string
  price: string
  unit: string
  cta: string
  featured?: boolean
  features: string[]
}

const tiers: Tier[] = [
  {
    name: 'Starter',
    tagline: 'For lean teams that refuse to ghost.',
    price: '$49',
    unit: '/ recruiter / mo',
    cta: 'Start free trial',
    features: [
      'Candidate status timeline',
      'AI-generated stage updates (email)',
      'Up to 250 active candidates',
      'Ashby integration',
      'Basic communication analytics',
    ],
  },
  {
    name: 'Growth',
    tagline: 'For mid-market teams hiring at volume.',
    price: '$99',
    unit: '/ recruiter / mo',
    cta: 'Start free trial',
    featured: true,
    features: [
      'Everything in Starter, plus:',
      'SMS + WhatsApp updates',
      'Communication SLA automation',
      'AI interview-feedback generation',
      'Ashby, Greenhouse & Lever integrations',
      'Ghost-rate benchmarks & full analytics',
      'Unlimited active candidates',
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'For talent orgs that live in audits.',
    price: 'Custom',
    unit: 'annual contract',
    cta: 'Talk to sales',
    features: [
      'Everything in Growth, plus:',
      'Workday & custom ATS integrations',
      'SSO, audit trails & data residency',
      'Multilingual communication',
      'White-label candidate portal',
      'Dedicated success manager + SLA',
    ],
  },
]

function Check({ muted }: { muted?: boolean }) {
  return (
    <svg
      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${muted ? 'text-signal-muted' : 'text-signal-glow'}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-pricing-reveal]',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const scrollToStart = () => {
    document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative w-full bg-signal-deep py-32 md:py-44"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p
            data-pricing-reveal
            className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-signal-glow"
            style={{ opacity: 0 }}
          >
            Pricing
          </p>
          <h2
            data-pricing-reveal
            className="mt-5 font-display text-[clamp(28px,4vw,52px)] font-medium uppercase leading-[1.12] tracking-[-0.02em] text-signal-text"
            style={{ opacity: 0 }}
          >
            Priced per recruiter. Scales with your pipeline.
          </h2>
          <p
            data-pricing-reveal
            className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-signal-muted"
            style={{ opacity: 0 }}
          >
            Start in minutes on the ATS you already use. Every plan begins with a
            14-day free trial — no credit card required.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              data-pricing-reveal
              style={{ opacity: 0 }}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-500 ${
                tier.featured
                  ? 'border-signal-accent bg-signal-surface shadow-[0_0_60px_-15px_rgba(62,84,211,0.5)] lg:-translate-y-4'
                  : 'border-white/10 bg-signal-surface/40 hover:border-white/20'
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-signal-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                  Most Popular
                </span>
              )}

              <h3 className="font-display text-lg font-bold uppercase tracking-[0.1em] text-signal-text">
                {tier.name}
              </h3>
              <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-signal-muted">
                {tier.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-signal-text">
                  {tier.price}
                </span>
                <span className="text-xs uppercase tracking-[0.05em] text-signal-muted">
                  {tier.unit}
                </span>
              </div>

              <button
                onClick={scrollToStart}
                className={`mt-8 w-full rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-400 ${
                  tier.featured
                    ? 'bg-signal-accent text-white hover:bg-signal-glow'
                    : 'border border-white/30 text-signal-text hover:border-signal-accent hover:text-white'
                }`}
              >
                {tier.cta}
              </button>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature, i) => {
                  const isHeader = feature.endsWith('plus:')
                  return (
                    <li
                      key={feature}
                      className={`flex gap-3 text-sm leading-snug ${
                        isHeader
                          ? 'font-medium text-signal-muted'
                          : 'text-signal-text/90'
                      }`}
                    >
                      {!isHeader && <Check muted={i === 0} />}
                      <span className={isHeader ? 'pt-0.5' : ''}>{feature}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <p
          data-pricing-reveal
          className="mt-12 text-center text-xs uppercase tracking-[0.1em] text-signal-muted"
          style={{ opacity: 0 }}
        >
          Annual billing · Cancel anytime · Volume discounts for 25+ seats
        </p>
      </div>
    </section>
  )
}
