import { motion } from 'framer-motion'

const ERA_COLORS = [
  '#ffffff',   // 0 Genesis
  '#4c1d95',   // 1 Il Vuoto
  '#f59e0b',   // 2 Quote Turing
  '#f59e0b',   // 3 Big Bang
  '#ea580c',   // 4 Prime Stelle
  '#0ea5e9',   // 5 Quote Minsky
  '#0ea5e9',   // 6 Ere Glaciali
  '#10b981',   // 7 Quote persistenza
  '#10b981',   // 8 Esplosione
  '#a855f7',   // 9 Intelligenza
  '#eab308',   // 10 Quote transformer
  '#eab308',   // 11 Singolarita
  '#a855f7',   // 12 Quote Hinton exit
  '#34d399',   // 13 Genealogia
  '#e879f9',   // 14 L'Orizzonte
  '#c084fc',   // 15 I Numeri
  '#8b5cf6',   // 16 La Mappa
  '#ffffff',   // 17 Credits
]

interface TimelineBarProps {
  activeSlide: number
  totalSlides: number
}

export function TimelineBar({ activeSlide, totalSlides }: TimelineBarProps) {
  const progress = totalSlides > 1 ? activeSlide / (totalSlides - 1) : 0

  return (
    <div className="fixed right-0 top-0 h-full z-40 flex items-center max-md:hidden">
      <div className="relative mr-3 h-[70vh] w-[2px]">
        {/* Background track */}
        <div className="absolute inset-0 bg-white/10 rounded-full" />

        {/* Filled portion */}
        <motion.div
          className="absolute top-0 left-0 w-full rounded-full origin-top"
          style={{
            background: `linear-gradient(to bottom, ${ERA_COLORS[0]}, ${ERA_COLORS[activeSlide] || '#ffffff'})`,
          }}
          animate={{ height: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Era dots */}
        {Array.from({ length: totalSlides }, (_, i) => {
          const top = totalSlides > 1 ? (i / (totalSlides - 1)) * 100 : 0
          const isActive = i === activeSlide

          return (
            <motion.div
              key={i}
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: `${top}%` }}
              animate={{
                width: isActive ? 10 : 5,
                height: isActive ? 10 : 5,
                boxShadow: isActive
                  ? `0 0 8px 2px ${ERA_COLORS[i]}`
                  : '0 0 0px 0px transparent',
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-full h-full rounded-full"
                animate={{
                  backgroundColor: isActive ? ERA_COLORS[i] : 'rgba(255,255,255,0.3)',
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
