import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  {
    front: '/images/portal-front.jpg',
    back: '/images/portal-back.jpg',
    label: 'Timeline View',
  },
  {
    front: '/images/portal-back.jpg',
    back: '/images/portal-front.jpg',
    label: 'Status Detail',
  },
  {
    front: '/images/portal-front.jpg',
    back: '/images/portal-back.jpg',
    label: 'Feedback Request',
  },
]

export default function CandidatePortal() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const deckRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column sticky text entrance
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, y: 40 },
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

      // Card stack scroll effect
      deckRefs.current.forEach((deck) => {
        if (!deck) return
        const card = deck.querySelector('.card') as HTMLElement
        const content = deck.querySelector('.card__content') as HTMLElement
        const frontFace = deck.querySelector('.card__face--front') as HTMLElement
        const backFace = deck.querySelector('.card__face--back') as HTMLElement
        if (!card || !content || !frontFace || !backFace) return

        ScrollTrigger.create({
          trigger: deck,
          start: 'top 60%',
          end: 'bottom 20%',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            gsap.set(card, {
              rotationY: 180 * progress,
              rotationZ: 10 * progress,
              scale: 1 - 0.2 * progress,
              yPercent: 20 * progress,
            })
            gsap.set(content, {
              yPercent: -100 * progress,
              rotationZ: -10 * progress,
              scale: 1 - 0.05 * progress,
            })
            gsap.set(frontFace, {
              filter: `brightness(${1 - 0.5 * progress})`,
            })
            gsap.set(backFace, {
              filter: `brightness(${0.5 + 0.5 * progress})`,
              rotationY: 180,
            })
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-signal-deep py-32 md:py-40"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          {/* Left Column - Sticky Text */}
          <div
            ref={leftColRef}
            className="md:sticky md:top-[30vh] md:self-start"
            style={{ opacity: 0 }}
          >
            <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-signal-accent">
              Candidate Portal
            </div>
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-medium uppercase leading-[1.15] tracking-[-0.02em] text-signal-text">
              No More Black Boxes
            </h2>
            <p className="mt-6 max-w-md text-base leading-[1.7] text-signal-muted">
              Candidates track their progress like a premium delivery. Every
              stage is transparent, every delay is explained, and every outcome
              is communicated with dignity. People tolerate waiting when they
              know where they are.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 shrink-0 rounded-full bg-signal-accent/20 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-signal-accent" />
                </div>
                <p className="text-sm text-signal-muted">
                  Real-time status updates across all channels
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 shrink-0 rounded-full bg-signal-accent/20 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-signal-accent" />
                </div>
                <p className="text-sm text-signal-muted">
                  Personalized feedback on request
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-4 w-4 shrink-0 rounded-full bg-signal-accent/20 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-signal-accent" />
                </div>
                <p className="text-sm text-signal-muted">
                  Expected decision timelines at every stage
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - 3D Card Stack */}
          <div className="decks-container space-y-32">
            {cards.map((card, index) => (
              <div
                key={index}
                ref={(el) => { deckRefs.current[index] = el }}
                className="deck"
              >
                <div
                  className="card"
                  style={{
                    position: 'sticky',
                    top: '10vh',
                    width: '100%',
                    aspectRatio: '2/3',
                    maxWidth: '360px',
                    margin: '0 auto',
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                  }}
                >
                  <div
                    className="card__content"
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      className="card__face card__face--front"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      }}
                    >
                      <img
                        src={card.front}
                        alt={card.label}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div
                      className="card__face card__face--back"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transform: 'rotateY(180deg)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                      }}
                    >
                      <img
                        src={card.back}
                        alt={`${card.label} back`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-signal-muted">
                    {card.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
