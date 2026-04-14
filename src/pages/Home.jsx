import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Home Component - Jurassic Park Theme
 * Features a seamless layered reveal for a premium scroll experience.
 */
const Home = () => {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const videoRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // LAYERED REVEAL:
      // Removed pinSpacing so the next section is revealed behind.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100%', 
          scrub: 1,
          pin: true,
          pinSpacing: false // Critical for the "Reveal" effect
        }
      })

      // Logo Zoom Animation
      tl.to(textRef.current, {
        scale: 90,
        opacity: 0,
        force3D: true,
        ease: 'power1.in',
        duration: 0.8
      }, 0)

      // Background Video Fade Animation
      tl.to(videoRef.current, {
        opacity: 0,
        ease: 'none',
        duration: 0.6
      }, 0.2)

      // Container Fade (The Reveal)
      // As the logo swallows the screen, the entire Home layer disappears.
      tl.to(containerRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        ease: 'none',
        duration: 0.2
      }, 0.8)
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="hero-container">
      {/* Cinematic Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="video-bg"
      >
        <source src="/myvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Stylized 3D Text Overlay */}
      <div className="overlay-wrapper">
        <h1 ref={textRef} className="jurassic-text">
          INOVEX
        </h1>
      </div>
    </div>
  )
}

export default Home
