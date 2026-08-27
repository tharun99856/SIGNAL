import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.4'
      )

    return () => {
      tl.kill()
    }
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  const scrollToEcosystem = () => {
    const el = document.getElementById('ecosystem')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        muted
        loop
        playsInline
        autoPlay
        style={{ opacity: 0.7 }}
      />

      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.2) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 40%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-end px-6 pb-24 md:px-12 lg:px-20">
        <div className="max-w-2xl">
          <h1
            ref={titleRef}
            className="font-display text-[clamp(42px,6vw,84px)] font-bold uppercase leading-[1.05] tracking-[-0.03em] text-signal-text text-shadow-hero"
            style={{ opacity: 0 }}
          >
            Communication is the Foundation of Hiring
          </h1>

          <p
            ref={subtitleRef}
            className="mt-6 max-w-lg text-base leading-relaxed text-signal-muted md:text-lg"
            style={{ opacity: 0 }}
          >
            Stop losing top talent to silence. Signal automates the candidate
            journey with intelligent, empathetic updates that respect their time.
          </p>

          <button
            ref={ctaRef}
            onClick={scrollToEcosystem}
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-white/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-signal-text transition-all duration-500 hover:border-signal-accent hover:text-white"
            style={{ opacity: 0 }}
          >
            Watch the Ecosystem
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
