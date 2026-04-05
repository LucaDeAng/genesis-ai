import { motion } from 'framer-motion'
import type { Lang } from '../../hooks/useLang'
import { useLang } from '../../hooks/useLang'

interface Props {
  active: boolean
  index: number
  quote: { it: string; en: string }
  author: string
  year: number
  context: { it: string; en: string }
  accentColor: string // hex color, matches the era this quote bridges
}

export default function QuoteSlide({ active, index, quote, author, year, context, accentColor }: Props) {
  const { lang } = useLang()

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden bg-[#030014]"
    >
      {/* Soft accent glow from era color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accentColor}15 0%, ${accentColor}08 30%, transparent 65%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 sm:px-12 md:px-20 text-center">
        {/* Accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-[1px] mb-12"
          style={{ backgroundColor: accentColor, opacity: 0.6 }}
        />

        {/* Context */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/30 mb-10 max-w-md"
        >
          {context[lang as Lang]}
        </motion.p>

        {/* Quote with decorative quote mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl"
        >
          <span
            className="absolute -top-8 -left-4 sm:-left-12 font-serif text-8xl sm:text-9xl leading-none opacity-[0.08] select-none"
            style={{ color: accentColor }}
          >
            &ldquo;
          </span>
          <blockquote
            className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.3] font-light text-white/90 relative"
          >
            {quote[lang as Lang]}
          </blockquote>
        </motion.div>

        {/* Author + year */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-10 flex items-center gap-3"
        >
          <span
            className="w-6 h-[1px]"
            style={{ backgroundColor: accentColor, opacity: 0.5 }}
          />
          <div className="flex flex-col items-start">
            <span className="font-display text-sm text-white/60">{author}</span>
            <span className="font-mono text-[10px] text-white/30 tracking-wider">{year}</span>
          </div>
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-12 h-[1px] mt-16"
          style={{ backgroundColor: accentColor, opacity: 0.3 }}
        />
      </div>
    </section>
  )
}
