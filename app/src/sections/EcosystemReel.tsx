import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function EcosystemReel() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // --- Live dashboard counters ---
  const [started, setStarted] = useState(false)
  const [pipelines, setPipelines] = useState(0)
  const [candidates, setCandidates] = useState(0)
  const [sla, setSla] = useState(0)

  // Start the count-up only when the card is actually on screen
  useEffect(() => {
    const node = cardRef.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  // Count up to the target numbers (easeOutCubic)
  useEffect(() => {
    if (!started) return
    const duration = 1500
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setPipelines(Math.round(14 * e))
      setCandidates(Math.round(1204 * e))
      setSla(Number((98.7 * e).toFixed(1)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started])

  // Keep it feeling live: nudge "updated today" upward after the count-up settles
  useEffect(() => {
    if (!started) return
    const id = window.setInterval(() => {
      setCandidates((c) => (c >= 1204 ? c + Math.floor(Math.random() * 3) + 1 : c))
    }, 2600)
    return () => window.clearInterval(id)
  }, [started])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        videoContainerRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.4,
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
      id="ecosystem"
      ref={sectionRef}
      className="relative w-full bg-signal-deep py-24 md:py-32"
    >
      <div className="mx-auto w-[90%] max-w-[1400px]">
        <div
          ref={videoContainerRef}
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio: '16/9', opacity: 0 }}
        >
          <video
            className="h-full w-full object-cover"
            src="/videos/ecosystem.mp4"
            muted
            loop
            playsInline
            autoPlay
          />

          {/* Glass UI Card Overlay */}
          <div
            ref={cardRef}
            className="absolute bottom-6 left-6 rounded-xl border border-white/10 bg-black/40 p-5 backdrop-blur-xl md:bottom-10 md:left-10 md:p-7"
            style={{ opacity: 0 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-signal-muted">
                Live Dashboard
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-signal-muted">
                  Active Pipelines
                </div>
                <div className="font-display text-2xl font-bold tabular-nums text-signal-text md:text-3xl">
                  {pipelines}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-signal-muted">
                  Candidates Updated Today
                </div>
                <div className="font-display text-2xl font-bold tabular-nums text-signal-accent md:text-3xl">
                  {candidates.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-signal-muted">
                  Communication SLA
                </div>
                <div className="font-display text-2xl font-bold tabular-nums text-signal-text md:text-3xl">
                  {sla.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
