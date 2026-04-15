import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Home Component - Jurassic Park Theme
 * Optimized for seamless transition to the Timeline section.
 */
const Home = () => {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const videoRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // TIGHTENED TRANSITION:
      // The section is pinned only for 30% of a viewport.
      // This eliminates the "dead air" after the zoom.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=30%',
          scrub: 1,
          pin: true,
          pinSpacing: true
        }
      })

      // Logo Zoom Animation
      // Completes precisely as the section unpins
      tl.to(textRef.current, {
        scale: 90,
        opacity: 0,
        force3D: true,
        ease: 'power1.in',
        duration: 1
      }, 0)

      // Background Video Fade Animation
      tl.to(videoRef.current, {
        opacity: 0,
        ease: 'none',
        duration: 0.9
      }, 0.1)
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
