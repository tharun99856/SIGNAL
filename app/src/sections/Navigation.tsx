import { useEffect, useRef, useState } from 'react'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display text-lg font-bold tracking-[0.15em] text-signal-text uppercase"
        >
          SIGNAL
        </button>

        <div className="hidden items-center gap-10 md:flex">
          <button
            onClick={() => scrollTo('ecosystem')}
            className="text-xs font-semibold uppercase tracking-[0.05em] text-signal-muted transition-colors duration-300 hover:text-signal-text"
          >
            Product
          </button>
          <button
            onClick={() => scrollTo('ingestion')}
            className="text-xs font-semibold uppercase tracking-[0.05em] text-signal-muted transition-colors duration-300 hover:text-signal-text"
          >
            Ecosystem
          </button>
          <button
            onClick={() => scrollTo('compliance')}
            className="text-xs font-semibold uppercase tracking-[0.05em] text-signal-muted transition-colors duration-300 hover:text-signal-text"
          >
            Enterprise
          </button>
          <button
            onClick={() => scrollTo('pricing')}
            className="text-xs font-semibold uppercase tracking-[0.05em] text-signal-muted transition-colors duration-300 hover:text-signal-text"
          >
            Pricing
          </button>
        </div>

        <div className="flex items-center gap-6">
          <button className="hidden text-xs font-semibold uppercase tracking-[0.05em] text-signal-muted transition-colors duration-300 hover:text-signal-text md:block">
            Sign In
          </button>
          <button
            onClick={() => window.location.href = '/agent'}
            className="rounded-full border border-signal-accent px-5 py-2 text-xs font-semibold uppercase tracking-[0.05em] text-signal-accent transition-all duration-400 hover:bg-signal-accent hover:text-white"
          >
            Agent Dashboard
          </button>
          <button
            onClick={() => scrollTo('get-started')}
            className="rounded-full bg-signal-accent px-5 py-2 text-xs font-semibold uppercase tracking-[0.05em] text-white transition-all duration-400 hover:bg-signal-glow"
          >
            Start for Free
          </button>
        </div>
      </div>
    </nav>
  )
}
