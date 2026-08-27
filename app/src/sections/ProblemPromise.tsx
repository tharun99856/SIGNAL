import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ProblemPromise() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      )
      gsap.fromTo(
        bodyRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 0.2,
          ease: 'power3.out',
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-signal-deep py-40 md:py-52"
    >
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <h2
          ref={headingRef}
          className="font-display text-[clamp(28px,4vw,52px)] font-medium uppercase leading-[1.15] tracking-[-0.02em] text-signal-text"
          style={{ opacity: 0 }}
        >
          Every candidate deserves a response. Most never get one.
        </h2>

        <p
          ref={bodyRef}
          className="mx-auto mt-8 max-w-2xl text-base leading-[1.7] text-signal-muted md:text-lg"
          style={{ opacity: 0 }}
        >
          The invisible cost of ghosting is staggering. Employer brand erodes.
          Top talent withdraws. Glassdoor fills with horror stories. Signal
          integrates with your existing ATS to ensure zero candidates are left in
          the dark — automatically, at scale, without adding a single minute to
          your recruiters' day.
        </p>
      </div>
    </section>
  )
}
