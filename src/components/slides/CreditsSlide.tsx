import { motion } from 'framer-motion'
import { useForm } from '@formspree/react'
import { useLang } from '../../hooks/useLang'

interface Props {
  active: boolean
  index: number
}

export default function CreditsSlide({ active, index }: Props) {
  const { lang } = useLang()
  const [state, handleSubmit] = useForm('mdapylbn')

  return (
    <section
      data-slide={index}
      className="relative h-screen w-full flex-shrink-0 snap-start overflow-hidden bg-[#030014]"
    >
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 sm:px-8 text-center">
        {/* Logo/title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c084fc 40%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          GENESIS
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/40 text-sm font-display tracking-[0.15em] uppercase mb-8"
        >
          {lang === 'it'
            ? "La Storia dell'Intelligenza Artificiale"
            : 'The History of Artificial Intelligence'}
        </motion.p>

        {/* Personal note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-md mb-8 border-l-2 border-white/10 pl-4 text-left"
        >
          <p className="text-white/50 text-sm leading-relaxed italic">
            {lang === 'it'
              ? '"Ho costruito questo progetto per capire se potevo raccontare 76 anni di storia con il codice. Il risultato e\' quello che vedi. Spero ti abbia emozionato quanto ha emozionato me costruirlo."'
              : '"I built this project to see if I could tell 76 years of history through code. The result is what you see. I hope it moved you as much as building it moved me."'}
          </p>
          <p className="text-white/30 text-xs mt-2 font-mono">— Luca</p>
        </motion.div>

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-8 mb-8"
        >
          <div>
            <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mb-1">
              {lang === 'it' ? 'Concept & Sviluppo' : 'Concept & Development'}
            </p>
            <p className="text-white/70 text-sm font-display">Luca De Angelis</p>
          </div>
          <div>
            <p className="text-white/25 text-[10px] font-mono uppercase tracking-widest mb-1">
              {lang === 'it' ? 'Costruito con' : 'Built with'}
            </p>
            <p className="text-white/70 text-sm font-display">Claude Code + React + Canvas</p>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent mb-8"
        />

        {/* Newsletter form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="w-full max-w-sm"
        >
          {state.succeeded ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg">✦</span>
              <p className="text-white/60 text-sm font-display">
                {lang === 'it' ? 'Grazie! Ti terremo aggiornato.' : 'Thanks! We\'ll keep you updated.'}
              </p>
            </div>
          ) : (
            <>
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-[0.2em] mb-3">
                {lang === 'it' ? 'Resta aggiornato sul prossimo progetto' : 'Stay updated on the next project'}
              </p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={lang === 'it' ? 'La tua email' : 'Your email'}
                  className="flex-1 bg-white/5 border border-white/15 rounded-md px-3 py-2 text-sm text-white placeholder-white/25 font-mono focus:outline-none focus:border-white/40 transition-colors"
                />
                <button
                  type="submit"
                  disabled={state.submitting}
                  className="px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {state.submitting
                    ? '...'
                    : lang === 'it' ? 'Iscriviti' : 'Subscribe'}
                </button>
              </form>
              <p className="text-white/15 text-[9px] font-mono mt-2">
                {lang === 'it' ? 'Niente spam. Solo progetti come questo.' : 'No spam. Only projects like this one.'}
              </p>
            </>
          )}
        </motion.div>

        {/* Year */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="absolute bottom-6 text-white/10 text-xs font-mono"
        >
          MMXXVI
        </motion.p>
      </div>
    </section>
  )
}
