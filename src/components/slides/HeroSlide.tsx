import { useCallback, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from '@formspree/react'
import { SlideWrapper } from '../SlideWrapper'
import { useCanvas } from '../canvas/useCanvas'
import { useMouseParallax } from '../../hooks/useMouseParallax'
import { useLang } from '../../hooks/useLang'

interface HeroSlideProps {
  active: boolean
  index: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  drift: number
  orbitR: number
  orbitSpeed: number
}

export default function HeroSlide({ active, index }: HeroSlideProps) {
  const { lang } = useLang()
  const mouse = useMouseParallax(active)
  const particlesRef = useRef<Particle[]>([])
  const initedRef = useRef(false)
  const clickCountRef = useRef(0)
  const [easterEgg, setEasterEgg] = useState(false)
  const [formState, handleFormSubmit] = useForm('mdapylbn')

  const handleParticleClick = useCallback(() => {
    clickCountRef.current += 1
    if (clickCountRef.current >= 3) {
      setEasterEgg(true)
      clickCountRef.current = 0
      setTimeout(() => setEasterEgg(false), 5000)
    }
  }, [])

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    if (!initedRef.current) {
      particlesRef.current = Array.from({ length: 120 }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() * 1.8 + 0.2,
        alpha: Math.random() * 0.25 + 0.03,
        drift: Math.random() * Math.PI * 2,
        orbitR: 80 + Math.random() * 300,
        orbitSpeed: (0.05 + Math.random() * 0.15) * (i % 2 === 0 ? 1 : -1),
      }))
      initedRef.current = true
    }

    ctx.fillStyle = '#030014'
    ctx.fillRect(0, 0, w, h)

    const cx = w / 2
    const cy = h / 2
    const breathe = Math.sin(t * 0.6) * 0.5 + 0.5
    const breathe2 = Math.sin(t * 0.9 + 1.2) * 0.5 + 0.5
    const breathe3 = Math.sin(t * 0.4 + 2.5) * 0.5 + 0.5

    // Deep ambient glow — fills the space
    const ambR = Math.min(w, h) * 0.6
    const ambGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, ambR)
    ambGrad.addColorStop(0, `rgba(76, 29, 149, ${0.06 + breathe3 * 0.03})`)
    ambGrad.addColorStop(0.3, `rgba(88, 28, 135, ${0.03 + breathe * 0.02})`)
    ambGrad.addColorStop(0.6, `rgba(30, 10, 60, 0.02)`)
    ambGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = ambGrad
    ctx.fillRect(0, 0, w, h)

    // Orbital rings — thin, elegant, slowly rotating
    ctx.lineWidth = 0.5
    for (let ring = 0; ring < 3; ring++) {
      const ringR = 100 + ring * 90 + breathe * 15
      const ringAlpha = 0.04 + breathe2 * 0.02 - ring * 0.01
      const rot = t * (0.08 - ring * 0.02)
      const tilt = 0.3 + ring * 0.15

      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot + ring * 0.8)
      ctx.scale(1, tilt)
      ctx.strokeStyle = `rgba(168, 85, 247, ${ringAlpha})`
      ctx.beginPath()
      ctx.arc(0, 0, ringR, 0, Math.PI * 2)
      ctx.stroke()

      // Dashed inner ring
      ctx.setLineDash([4, 12])
      ctx.strokeStyle = `rgba(250, 204, 21, ${ringAlpha * 0.5})`
      ctx.beginPath()
      ctx.arc(0, 0, ringR - 20, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.restore()
    }

    // Core glow layers
    // Layer 1: outermost aura
    const auraR = 160 + breathe * 60
    const auraGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, auraR)
    auraGrad.addColorStop(0, `rgba(168, 85, 247, ${0.06 + breathe * 0.04})`)
    auraGrad.addColorStop(0.3, `rgba(139, 92, 246, ${0.03 + breathe2 * 0.02})`)
    auraGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = auraGrad
    ctx.beginPath()
    ctx.arc(cx, cy, auraR, 0, Math.PI * 2)
    ctx.fill()

    // Layer 2: warm gold shimmer
    const goldR = 50 + breathe2 * 30
    const goldGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, goldR)
    goldGrad.addColorStop(0, `rgba(250, 204, 21, ${0.1 + breathe2 * 0.08})`)
    goldGrad.addColorStop(0.4, `rgba(245, 158, 11, ${0.04 + breathe * 0.03})`)
    goldGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = goldGrad
    ctx.beginPath()
    ctx.arc(cx, cy, goldR, 0, Math.PI * 2)
    ctx.fill()

    // Layer 3: white hot core
    const coreR = 12 + breathe * 8
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
    coreGrad.addColorStop(0, `rgba(255, 255, 255, ${0.85 + breathe * 0.15})`)
    coreGrad.addColorStop(0.3, `rgba(250, 204, 21, ${0.5 + breathe * 0.2})`)
    coreGrad.addColorStop(0.6, `rgba(168, 85, 247, ${0.15})`)
    coreGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = coreGrad
    ctx.beginPath()
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
    ctx.fill()

    // Cross-flare on core
    const flareLen = 30 + breathe * 20
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + breathe * 0.06})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cx - flareLen, cy)
    ctx.lineTo(cx + flareLen, cy)
    ctx.moveTo(cx, cy - flareLen * 0.7)
    ctx.lineTo(cx, cy + flareLen * 0.7)
    ctx.stroke()

    // Particles — some orbit, some drift
    for (const p of particlesRef.current) {
      // Drift
      p.x += p.vx + Math.sin(t * 0.3 + p.drift) * 0.08
      p.y += p.vy + Math.cos(t * 0.25 + p.drift) * 0.08

      // Gentle attraction toward center
      const dx = cx - p.x, dy = cy - p.y
      const dist = Math.hypot(dx, dy)
      if (dist > 50) {
        p.x += (dx / dist) * 0.03
        p.y += (dy / dist) * 0.03
      }

      // Wrap
      if (p.x < -10) p.x = w + 10
      if (p.x > w + 10) p.x = -10
      if (p.y < -10) p.y = h + 10
      if (p.y > h + 10) p.y = -10

      const twinkle = 0.4 + Math.sin(t * 1.8 + p.drift) * 0.6
      const a = p.alpha * twinkle

      // Particle glow
      if (p.size > 1) {
        const pgR = p.size * 4
        const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pgR)
        pg.addColorStop(0, `rgba(192, 160, 255, ${a * 0.3})`)
        pg.addColorStop(1, 'transparent')
        ctx.fillStyle = pg
        ctx.beginPath()
        ctx.arc(p.x, p.y, pgR, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size * twinkle, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(220, 200, 255, ${a})`
      ctx.fill()
    }
  }, [])

  const canvasRef = useCanvas({ draw, active })

  return (
    <SlideWrapper
      index={index}
      active={active}
      canvas={<canvas ref={canvasRef} className="h-full w-full" style={{ display: 'block' }} />}
    >
      {/* Easter egg: click the center particle 3 times */}
      <button
        onClick={handleParticleClick}
        aria-label="Hidden"
        tabIndex={-1}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full z-[5] cursor-default opacity-0"
        style={{ pointerEvents: active ? 'auto' : 'none' }}
      />
      {/* Easter egg message */}
      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-[68%] -translate-x-1/2 z-[15] pointer-events-none text-center"
          >
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
              {lang === 'it' ? 'Ciao viaggiatore' : 'Hello traveler'}
            </p>
            <p className="font-display text-sm text-white/60 mt-1 italic">
              {lang === 'it' ? '"Can machines think?"' : '"Can machines think?"'}
            </p>
            <p className="font-mono text-[9px] text-white/25 mt-1">— Alan Turing, 1950</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="flex flex-col items-center justify-center text-center px-4"
        style={{ transform: `translate(${mouse.x * -20}px, ${mouse.y * -12}px)` }}
      >
        {/* Top decorative line */}
        <motion.div
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: { scaleX: 1, opacity: 1, transition: { delay: 0.1, duration: 1, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="w-16 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent mb-8"
        />

        {/* Date range */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="font-mono text-xs tracking-[0.4em] text-white/30 uppercase mb-6"
        >
          1950 — 2026
        </motion.p>

        {/* GENESIS title */}
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: 40, letterSpacing: '0.3em' },
            visible: {
              opacity: 1, y: 0, letterSpacing: '0.15em',
              transition: { delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none mb-4"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #e0ccff 25%, #c084fc 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          GENESIS
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="font-display text-base sm:text-lg md:text-xl text-white/50 tracking-[0.15em] uppercase mb-2"
        >
          {lang === 'it' ? "La Storia dell'Intelligenza Artificiale" : 'The History of Artificial Intelligence'}
        </motion.p>

        {/* Reading time */}
        <motion.p
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 1.1, duration: 0.6 } },
          }}
          className="font-mono text-[10px] tracking-[0.3em] text-white/25 uppercase"
        >
          {lang === 'it' ? 'un viaggio di 5 minuti' : 'a 5-minute journey'}
        </motion.p>

        {/* Bottom decorative line */}
        <motion.div
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: { scaleX: 1, opacity: 1, transition: { delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="w-24 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-6 mb-8"
        />

        {/* Newsletter CTA */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0, transition: { delay: 1.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="flex flex-col items-center w-full max-w-sm mb-6"
        >
          {formState.succeeded ? (
            <p className="text-white/50 text-sm font-display">
              {lang === 'it' ? 'Grazie! ✦' : 'Thanks! ✦'}
            </p>
          ) : (
            <>
              <p className="text-white/25 text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
                {lang === 'it' ? 'Resta aggiornato' : 'Stay updated'}
              </p>
              <form onSubmit={handleFormSubmit} className="flex gap-2 w-full max-w-xs">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="email"
                  className="flex-1 bg-white/5 border border-white/15 rounded-md px-3 py-1.5 text-xs text-white placeholder-white/20 font-mono focus:outline-none focus:border-white/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={formState.submitting}
                  className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 rounded-md transition-all disabled:opacity-40"
                >
                  {formState.submitting ? '...' : '→'}
                </button>
              </form>
            </>
          )}
        </motion.div>

        {/* Author + LinkedIn */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 1.6, duration: 0.6 } },
          }}
          className="flex items-center gap-3"
        >
          <span className="text-white/20 text-[10px] font-mono">
            {lang === 'it' ? 'di' : 'by'}
          </span>
          <a
            href="https://www.linkedin.com/in/luca-de-angelis/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors group"
          >
            <span className="text-xs font-display">Luca De Angelis</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-50 group-hover:opacity-100 transition-opacity">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 2, duration: 0.8 } },
          }}
          className="mt-6"
        >
          <motion.div
            className="w-[1px] h-6 bg-gradient-to-b from-white/30 to-transparent mx-auto"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </SlideWrapper>
  )
}
