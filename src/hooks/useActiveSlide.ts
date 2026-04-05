import { useState, useEffect, useCallback, useRef } from 'react'

export function useActiveSlide(totalSlides: number) {
  const [activeSlide, setActiveSlide] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const initialJumpDone = useRef(false)

  const scrollToSlide = useCallback((index: number) => {
    const container = containerRef.current
    if (!container) return
    const slides = container.querySelectorAll<HTMLElement>('[data-slide]')
    slides[index]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // Jump to slide from URL on first load
  useEffect(() => {
    if (initialJumpDone.current) return
    const params = new URLSearchParams(window.location.search)
    const slide = parseInt(params.get('slide') || '', 10)
    if (!isNaN(slide) && slide > 0 && slide < totalSlides) {
      setTimeout(() => {
        const container = containerRef.current
        if (!container) return
        const slides = container.querySelectorAll<HTMLElement>('[data-slide]')
        slides[slide]?.scrollIntoView({ behavior: 'auto' })
        initialJumpDone.current = true
      }, 100)
    } else {
      initialJumpDone.current = true
    }
  }, [totalSlides])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = Number(entry.target.getAttribute('data-slide'))
            if (!isNaN(idx)) {
              setActiveSlide(idx)
              // Sync URL without adding to history
              if (initialJumpDone.current) {
                const url = new URL(window.location.href)
                if (idx === 0) {
                  url.searchParams.delete('slide')
                } else {
                  url.searchParams.set('slide', String(idx))
                }
                window.history.replaceState(null, '', url.toString())
              }
            }
          }
        }
      },
      { root: container, threshold: 0.5 }
    )

    const slides = container.querySelectorAll('[data-slide]')
    slides.forEach((s) => observer.observe(s))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        if (activeSlide < totalSlides - 1) scrollToSlide(activeSlide + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        if (activeSlide > 0) scrollToSlide(activeSlide - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeSlide, totalSlides, scrollToSlide])

  return { activeSlide, scrollToSlide, containerRef }
}
