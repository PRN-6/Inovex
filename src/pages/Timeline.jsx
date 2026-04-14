import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Timeline Component - Jurassic Park Theme
 * Features GSAP staggered animations for the countdown timer.
 */
const Timeline = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const boxesRef = useRef([])

  // Target date: May 15, 2026
  const targetDate = new Date('2026-05-15T00:00:00').getTime()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        clearInterval(timer)
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Create an entrance animation that triggers when revealed
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 20%', // Triggers as the Hero layer begins to disappear
          toggleActions: 'play none none reverse'
        }
      })

      // Header slide-down reveal
      tl.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      })

      // Staggered popup for countdown boxes
      tl.from(boxesRef.current, {
        scale: 0.5,
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      }, '-=0.5')

      // Slow floating ambient animation for the grid
      gsap.to(boxesRef.current, {
        y: '+=10',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 0.5,
          repeat: -1,
          yoyo: true
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="timeline-section" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <div className="max-width-6xl mx-auto text-center">
        
        {/* Header - Animated */}
        <header ref={headerRef} className="timeline-header" style={{ marginBottom: '3rem' }}>
          <h1 className="timeline-title" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
            The Countdown <br />
            <span className="highlight-text">Begins</span>
          </h1>
        </header>

        {/* Counter Grid - Staggered Reveal */}
        <div className="countdown-grid">
          {Object.entries(timeLeft).map(([unit, value], idx) => (
            <div 
              key={unit} 
              ref={el => boxesRef.current[idx] = el}
              className="countdown-item"
            >
              <div className="countdown-box">
                {String(value).padStart(2, '0')}
              </div>
              <span className="countdown-label">
                {unit}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Timeline
