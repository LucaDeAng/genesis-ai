import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { milestones, eras, t } from '../../data/aiHistory'
import type { Lang } from '../../hooks/useLang'
import { useLang } from '../../hooks/useLang'

interface Props {
  active: boolean
  index: number
}

interface CounterProps {
  value: number
  suffix?: string
  active: boolean
  duration?: number
  color: string
}

function BigCounter({ value, suffix = '', active, duration = 2000, color }: CounterProps) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!active) { setDisplay(0); return }
    const start = performance.now()
    let raf = 0
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 4) // ease out quart
      setDisplay(Math.round(value * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, value, duration])

  return (
    <div className="text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.5 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="block font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none glow-text"
        style={{ color }}
      >
        {display}{suffix}
      </motion.span>
    </div>
  )
}

export default function NumbersSlide({ active, index }: Props) {
  const { lang } = useLang()
  const [birthYear, setBirthYear] = useState<string>('')
  const [confirmedYear, setConfirmedYear] = useState<number | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const year = parseInt(params.get('birthYear') || '', 10)
    if (!isNaN(year) && year >= 1940 && year <= new Date().getFullYear()) {
      setBirthYear(String(year))
      setConfirmedYear(year)
    }
  }, [])

  const totalYears = new Date().getFullYear() - 1950
  const totalMilestones = milestones.length
  const totalEras = eras.length
  const latestYear = Math.max(...milestones.map(m => m.year))

  // Find milestone closest to birth year
  const birthMilestone = useMemo(() => {
    if (confirmedYear === null) return null
    // Find the most significant milestone within ±2 years of birth year
    const candidates = milestones
      .filter(m => Math.abs(m.year - confirmedYear) <= 2)
      .sort((a, b) => {
        const aDist = Math.abs(a.year - confirmedYear)
        const bDist = Math.abs(b.year - confirmedYear)
        if (aDist !== bDist) return aDist - bDist
        return b.significance - a.significance
      })
    return candidates[0] || null
  }, [confirmedYear])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const year = parseInt(birthYear, 10)
    if (!isNaN(year) && year >= 1940 && year <= new Date().getFullYear()) {
      setConfirmedYear(year)
    }
  }

  // Share logic
  const shareText = useMemo(() => {
    if (!confirmedYear || !birthMilestone) return ''
    const when =
      birthMilestone.year === confirmedYear
        ? (lang === 'it' ? 'quell\'anno' : 'that year')
        : birthMilestone.year < confirmedYear
          ? (lang === 'it' ? `${confirmedYear - birthMilestone.year} ${confirmedYear - birthMilestone.year === 1 ? 'anno prima' : 'anni prima'}` : `${confirmedYear - birthMilestone.year} ${confirmedYear - birthMilestone.year === 1 ? 'year before' : 'years before'}`)
          : (lang === 'it' ? `${birthMilestone.year - confirmedYear} ${birthMilestone.year - confirmedYear === 1 ? 'anno dopo' : 'anni dopo'}` : `${birthMilestone.year - confirmedYear} ${birthMilestone.year - confirmedYear === 1 ? 'year later' : 'years later'}`)

    return lang === 'it'
      ? `Quando sono nato nel ${confirmedYear}, ${when} ${birthMilestone.name} ha cambiato l'intelligenza artificiale per sempre.\n\nScopri il tuo anno AI: `
      : `When I was born in ${confirmedYear}, ${when} ${birthMilestone.name} changed artificial intelligence forever.\n\nDiscover your AI year: `
  }, [confirmedYear, birthMilestone, lang])

  const shareUrl = confirmedYear
    ? `https://lucadeang.github.io/genesis-ai/?birthYear=${confirmedYear}`
    : 'https://lucadeang.github.io/genesis-ai/'

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Genesis — The History of AI',
          text: shareText,
          url: shareUrl,
        })
      } catch { /* user cancelled */ }
    } else {
      // fallback: copy to clipboard
      navigator.clipboard.writeText(shareText + shareUrl)
    }
  }

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=600')
  }

  const shareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'width=600,height=600')
  }

  const shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(url, '_blank', 'width=600,height=600')
  }

  const stats = [
    { value: totalYears, suffix: '', color: '#c084fc', label: { it: 'anni di AI moderna', en: 'years of modern AI' }, delay: 0 },
    { value: totalMilestones, suffix: '+', color: '#fbbf24', label: { it: 'milestone', en: 'milestones' }, delay: 0.2 },
    { value: totalEras, suffix: '', color: '#34d399', label: { it: 'ere cosmiche', en: 'cosmic eras' }, delay: 0.4 },
    { value: latestYear, suffix: '', color: '#38bdf8', label: { it: 'e continua...', en: 'and counting...' }, delay: 0.6 },
  ]

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden bg-[#030014]"
    >
      {/* Subtle radial glow background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.08) 0%, rgba(0,0,0,0) 60%)',
        }}
      />

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-8 py-10">
        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/40 mb-8"
        >
          {lang === 'it' ? 'La storia in numeri' : 'The story in numbers'}
        </motion.p>

        {/* Numbers grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 max-w-5xl">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.8, delay: stat.delay, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <BigCounter value={stat.value} suffix={stat.suffix} active={active} color={stat.color} duration={2000 + i * 300} />
              <motion.span
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: stat.delay + 0.8 }}
                className="block mt-2 text-xs sm:text-sm text-white/50 font-display"
              >
                {stat.label[lang]}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-48 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-10 mb-6"
        />

        {/* Birth year input — personal connection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          className="flex flex-col items-center max-w-md"
        >
          <AnimatePresence mode="wait">
            {confirmedYear === null ? (
              <motion.form
                key="input"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-3"
              >
                <label className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                  {lang === 'it' ? 'In che anno sei nato?' : 'What year were you born?'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1940"
                    max={new Date().getFullYear()}
                    placeholder="1990"
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-24 bg-white/5 border border-white/15 rounded-md px-3 py-1.5 text-center font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/40 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!birthYear}
                    className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 rounded-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {lang === 'it' ? 'Scopri' : 'Reveal'}
                  </button>
                </div>
              </motion.form>
            ) : birthMilestone ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
                  {lang === 'it'
                    ? `Quando sei nato nel ${confirmedYear}...`
                    : `When you were born in ${confirmedYear}...`}
                </p>
                <p className="font-display text-lg sm:text-xl text-white/85 leading-snug mb-2">
                  {birthMilestone.year === confirmedYear
                    ? (lang === 'it' ? 'in quell\'anno ' : 'that year ')
                    : birthMilestone.year < confirmedYear
                      ? (lang === 'it' ? `${confirmedYear - birthMilestone.year} ${confirmedYear - birthMilestone.year === 1 ? 'anno prima ' : 'anni prima '}` : `${confirmedYear - birthMilestone.year} ${confirmedYear - birthMilestone.year === 1 ? 'year before ' : 'years before '}`)
                      : (lang === 'it' ? `${birthMilestone.year - confirmedYear} ${birthMilestone.year - confirmedYear === 1 ? 'anno dopo ' : 'anni dopo '}` : `${birthMilestone.year - confirmedYear} ${birthMilestone.year - confirmedYear === 1 ? 'year later ' : 'years later '}`)}
                  <span className="font-semibold" style={{ color: '#fbbf24' }}>{birthMilestone.name}</span>{' '}
                  {lang === 'it' ? 'ha cambiato tutto.' : 'changed everything.'}
                </p>
                <p className="text-xs sm:text-sm text-white/50 italic">
                  {t(birthMilestone.description, lang as Lang)}
                </p>

                {/* Share buttons */}
                <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/30 mr-1">
                    {lang === 'it' ? 'Condividi' : 'Share'}
                  </span>
                  <button
                    onClick={shareNative}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/25 text-white/60 hover:text-white transition-all"
                    aria-label="Share"
                    title={lang === 'it' ? 'Condividi' : 'Share'}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                    </svg>
                  </button>
                  <button
                    onClick={shareLinkedIn}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-[#0a66c2]/20 hover:border-[#0a66c2]/50 text-white/60 hover:text-white transition-all"
                    aria-label="Share on LinkedIn"
                    title="LinkedIn"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                  <button
                    onClick={shareTwitter}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/30 text-white/60 hover:text-white transition-all"
                    aria-label="Share on X"
                    title="X (Twitter)"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>
                  <button
                    onClick={shareFacebook}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-[#1877f2]/20 hover:border-[#1877f2]/50 text-white/60 hover:text-white transition-all"
                    aria-label="Share on Facebook"
                    title="Facebook"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => { setConfirmedYear(null); setBirthYear('') }}
                  className="mt-4 text-[10px] font-mono uppercase tracking-wider text-white/30 hover:text-white/60 transition-colors"
                >
                  {lang === 'it' ? '← Cambia anno' : '← Change year'}
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
