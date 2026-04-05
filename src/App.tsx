import { useState, useCallback, useMemo } from 'react'
import { useActiveSlide } from './hooks/useActiveSlide'
import { useScrollProgress } from './hooks/useScrollProgress'
import { LangContext, type Lang } from './hooks/useLang'
import { ShootingStars } from './components/ShootingStars'
import { LangToggle } from './components/LangToggle'
import { AmbientPlayer } from './components/AmbientPlayer'
import { YearCounter } from './components/YearCounter'
import { TimelineBar } from './components/TimelineBar'
import { SlideProgress } from './components/SlideProgress'
import { CursorGlow } from './components/CursorGlow'
import { TransitionParticles } from './components/TransitionParticles'
import { Preloader } from './components/Preloader'
import HeroSlide from './components/slides/HeroSlide'
import VoidSlide from './components/slides/VoidSlide'
import BigBangSlide from './components/slides/BigBangSlide'
import FirstStarsSlide from './components/slides/FirstStarsSlide'
import IceAgeSlide from './components/slides/IceAgeSlide'
import CambrianSlide from './components/slides/CambrianSlide'
import IntelligenceSlide from './components/slides/IntelligenceSlide'
import SingularitySlide from './components/slides/SingularitySlide'
import LineageSlide from './components/slides/LineageSlide'
import HorizonSlide from './components/slides/HorizonSlide'
import NumbersSlide from './components/slides/NumbersSlide'
import GalaxyMapSlide from './components/slides/GalaxyMapSlide'
import CreditsSlide from './components/slides/CreditsSlide'
import QuoteSlide from './components/slides/QuoteSlide'

const TOTAL_SLIDES = 18

// Quote interludes at narrative pivots — real, verified historical quotes

const QUOTE_TURING = {
  quote: {
    it: 'Propongo di considerare la questione: le macchine possono pensare?',
    en: 'I propose to consider the question: can machines think?',
  },
  author: 'Alan Turing',
  year: 1950,
  context: {
    it: 'La domanda che ha dato inizio a tutto',
    en: 'The question that started it all',
  },
  accentColor: '#f59e0b', // bigbang gold
}

const QUOTE_MINSKY = {
  quote: {
    it: "Entro una generazione il problema di creare 'intelligenza artificiale' sara' sostanzialmente risolto.",
    en: "Within a generation the problem of creating 'artificial intelligence' will substantially be solved.",
  },
  author: 'Marvin Minsky',
  year: 1967,
  context: {
    it: "L'iperbole che precede la caduta",
    en: 'The hubris that precedes the fall',
  },
  accentColor: '#0ea5e9', // ice blue — warning of winter ahead
}

const QUOTE_PERSISTENCE = {
  quote: {
    it: "Se hai un'intuizione che qualcosa e' giusto, ma tutti gli altri ti dicono che e' una stupidaggine... allora sei davvero su qualcosa.",
    en: "If you have an intuition that something is right, and all the other people in the field tell you it's nonsense... then you're really onto something.",
  },
  author: 'Geoffrey Hinton',
  year: 2017,
  context: {
    it: "Durante gli inverni dell'AI, tre ricercatori non si arresero",
    en: 'During the AI winters, three researchers never gave up',
  },
  accentColor: '#10b981', // cambrian green — looking forward past winter
}

const QUOTE_TRANSFORMER = {
  quote: {
    it: 'Attention is all you need.',
    en: 'Attention is all you need.',
  },
  author: 'Vaswani et al., Google Brain',
  year: 2017,
  context: {
    it: "Il paper che ha cambiato per sempre l'intelligenza artificiale",
    en: 'The paper that forever changed artificial intelligence',
  },
  accentColor: '#eab308', // singularity gold — birth of the LLM era
}

const QUOTE_HINTON_EXIT = {
  quote: {
    it: 'Mi consolo con la solita scusa: se non l\'avessi fatto io, l\'avrebbe fatto qualcun altro.',
    en: 'I console myself with the normal excuse: if I hadn\'t done it, somebody else would have.',
  },
  author: 'Geoffrey Hinton',
  year: 2023,
  context: {
    it: 'Il padre del deep learning lascia Google per parlare dei rischi',
    en: 'The father of deep learning quits Google to speak about the risks',
  },
  accentColor: '#a855f7', // intelligence purple
}

function App() {
  const { activeSlide, containerRef } = useActiveSlide(TOTAL_SLIDES)
  const { progress: scrollProgress, velocity: scrollVelocity } = useScrollProgress(containerRef)
  const [lang, setLang] = useState<Lang>('it')
  const [loaded, setLoaded] = useState(false)
  const toggleLang = useCallback(() => setLang((l) => (l === 'it' ? 'en' : 'it')), [])

  // Subtle ambient glow color that crossfades between eras
  const ambientColor = useMemo(() => {
    const colors = [
      'rgba(76, 29, 149, 0.08)',   // 0 hero
      'rgba(76, 29, 149, 0.06)',   // 1 void
      'rgba(245, 158, 11, 0.06)',  // 2 quote turing
      'rgba(245, 158, 11, 0.06)',  // 3 bigbang
      'rgba(234, 88, 12, 0.05)',   // 4 stars
      'rgba(14, 165, 233, 0.06)',  // 5 quote minsky
      'rgba(14, 165, 233, 0.06)',  // 6 ice
      'rgba(16, 185, 129, 0.05)',  // 7 quote persistence
      'rgba(16, 185, 129, 0.05)',  // 8 cambrian
      'rgba(168, 85, 247, 0.06)',  // 9 intelligence
      'rgba(234, 179, 8, 0.06)',   // 10 quote transformer
      'rgba(234, 179, 8, 0.06)',   // 11 singularity
      'rgba(168, 85, 247, 0.06)',  // 12 quote hinton exit
      'rgba(52, 211, 153, 0.04)',  // 13 lineage
      'rgba(232, 121, 249, 0.05)', // 14 horizon
      'rgba(192, 132, 252, 0.05)', // 15 numbers
      'rgba(139, 92, 246, 0.04)',  // 16 galaxy
      'rgba(0, 0, 0, 0)',          // 17 credits
    ]
    return colors[activeSlide] || colors[0]
  }, [activeSlide])

  return (
    <LangContext.Provider value={{ lang, toggle: toggleLang }}>
      {/* Cinematic overlays */}
      <div className="film-grain" />
      <div className="vignette" />

      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      {/* Ambient color glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none transition-colors duration-[2000ms] ease-in-out"
        style={{ background: `radial-gradient(ellipse at 50% 40%, ${ambientColor}, transparent 70%)` }}
      />

      {/* Persistent particles that shift color with scroll */}
      <TransitionParticles scrollProgress={scrollProgress} scrollVelocity={scrollVelocity} totalSlides={TOTAL_SLIDES} />

      {/* Shooting stars streaking across the sky */}
      <ShootingStars />

      <CursorGlow />
      <LangToggle />
      <AmbientPlayer />
      <YearCounter activeSlide={activeSlide} />
      <TimelineBar activeSlide={activeSlide} totalSlides={TOTAL_SLIDES} />
      <SlideProgress activeSlide={activeSlide} totalSlides={TOTAL_SLIDES} />

      <div ref={containerRef} className="scroll-container">
        <HeroSlide index={0} active={activeSlide === 0} />
        <VoidSlide index={1} active={activeSlide === 1} />
        <QuoteSlide index={2} active={activeSlide === 2} {...QUOTE_TURING} />
        <BigBangSlide index={3} active={activeSlide === 3} />
        <FirstStarsSlide index={4} active={activeSlide === 4} />
        <QuoteSlide index={5} active={activeSlide === 5} {...QUOTE_MINSKY} />
        <IceAgeSlide index={6} active={activeSlide === 6} />
        <QuoteSlide index={7} active={activeSlide === 7} {...QUOTE_PERSISTENCE} />
        <CambrianSlide index={8} active={activeSlide === 8} />
        <IntelligenceSlide index={9} active={activeSlide === 9} />
        <QuoteSlide index={10} active={activeSlide === 10} {...QUOTE_TRANSFORMER} />
        <SingularitySlide index={11} active={activeSlide === 11} />
        <QuoteSlide index={12} active={activeSlide === 12} {...QUOTE_HINTON_EXIT} />
        <LineageSlide index={13} active={activeSlide === 13} />
        <HorizonSlide index={14} active={activeSlide === 14} />
        <NumbersSlide index={15} active={activeSlide === 15} />
        <GalaxyMapSlide index={16} active={activeSlide === 16} />
        <CreditsSlide index={17} active={activeSlide === 17} />
      </div>
    </LangContext.Provider>
  )
}

export default App
