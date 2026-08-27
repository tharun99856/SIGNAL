import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * ▶ TO CAPTURE REAL LEADS: paste your endpoint URL below.
 *   Easiest options (2-minute setup, no backend needed):
 *     • Formspree  → https://formspree.io  (free tier, gives you a URL like https://formspree.io/f/abcd)
 *     • Tally      → https://tally.so      (form → integrations → webhook)
 *     • Google Sheet via https://sheetmonkey.io or a Google Apps Script web app
 *   Leave it as '' and submissions are stored in the browser (localStorage key "signal_waitlist")
 *   so the form still works for demos — just not collected centrally.
 */
const WAITLIST_ENDPOINT = ''

type Status = 'idle' | 'submitting' | 'success' | 'error'

const teamSizes = [
  '1–5 recruiters',
  '6–20 recruiters',
  '21–50 recruiters',
  '50+ recruiters',
]

export default function GetStarted() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [teamSize, setTeamSize] = useState(teamSizes[1])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-cta-reveal]',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return

    setStatus('submitting')
    const lead = {
      email,
      company,
      teamSize,
      submittedAt: new Date().toISOString(),
      source: 'landing-get-started',
    }

    try {
      if (WAITLIST_ENDPOINT) {
        const res = await fetch(WAITLIST_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(lead),
        })
        if (!res.ok) throw new Error('Request failed')
      } else {
        const existing = JSON.parse(
          localStorage.getItem('signal_waitlist') || '[]'
        )
        existing.push(lead)
        localStorage.setItem('signal_waitlist', JSON.stringify(existing))
      }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="get-started"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-signal-surface py-32 md:py-44"
    >
      {/* accent glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #3E54D3 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-2xl px-6 text-center md:px-12">
        <p
          data-cta-reveal
          className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-signal-glow"
          style={{ opacity: 0 }}
        >
          Early Access
        </p>
        <h2
          data-cta-reveal
          className="mt-5 font-display text-[clamp(30px,4.5vw,56px)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-signal-text"
          style={{ opacity: 0 }}
        >
          Start your free trial
        </h2>
        <p
          data-cta-reveal
          className="mx-auto mt-6 max-w-lg text-base leading-[1.7] text-signal-muted"
          style={{ opacity: 0 }}
        >
          We're onboarding mid-market talent teams now. Tell us where to reach
          you and we'll set up your trial within one business day.
        </p>

        {status === 'success' ? (
          <div
            className="mx-auto mt-12 max-w-md rounded-2xl border border-signal-accent/40 bg-signal-deep/60 p-10"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal-accent">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-[0.05em] text-signal-text">
              You're on the list
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-signal-muted">
              We'll reach out to <span className="text-signal-text">{email}</span>{' '}
              within one business day to set up your trial.
            </p>
          </div>
        ) : (
          <form
            data-cta-reveal
            onSubmit={handleSubmit}
            className="mx-auto mt-12 max-w-md space-y-4 text-left"
            style={{ opacity: 0 }}
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-signal-muted">
                Work email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-lg border border-white/15 bg-signal-deep/60 px-4 py-3 text-sm text-signal-text placeholder:text-signal-muted/60 outline-none transition-colors focus:border-signal-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-signal-muted">
                Company <span className="normal-case text-signal-muted/50">(optional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Inc."
                className="w-full rounded-lg border border-white/15 bg-signal-deep/60 px-4 py-3 text-sm text-signal-text placeholder:text-signal-muted/60 outline-none transition-colors focus:border-signal-accent"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.1em] text-signal-muted">
                Team size
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full rounded-lg border border-white/15 bg-signal-deep/60 px-4 py-3 text-sm text-signal-text outline-none transition-colors focus:border-signal-accent"
              >
                {teamSizes.map((size) => (
                  <option key={size} value={size} className="bg-signal-deep">
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-signal-accent px-8 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-all duration-400 hover:bg-signal-glow disabled:opacity-60"
            >
              {status === 'submitting' ? 'Sending…' : 'Request access'}
              {status !== 'submitting' && (
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>

            {status === 'error' && (
              <p className="text-center text-sm text-red-400">
                Something went wrong. Please try again or email us directly.
              </p>
            )}

            <p className="pt-1 text-center text-xs leading-relaxed text-signal-muted/70">
              No credit card · 14-day trial · We'll never share your email.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
