import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Sub-component for a single scrambling digit
const ScrambleDigit = ({ value, isSyncing }) => {
  const [displayValue, setDisplayValue] = useState(value)
  const prevValue = useRef(value)

  useEffect(() => {
    if (value !== prevValue.current || isSyncing) {
      let iterations = 0
      const maxIterations = isSyncing ? 15 : 5
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 10))
        iterations++
        if (iterations >= maxIterations) {
          clearInterval(interval)
          setDisplayValue(value)
          prevValue.current = value
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [value, isSyncing])

  return <span>{displayValue}</span>
}

const InovexSection = () => {
  const containerRef = useRef(null)
  const dashboardRef = useRef(null)

  const beamRef = useRef(null)

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState("Park Status: Secure")
  const [telemetry, setTelemetry] = useState({ stability: 99.98, integrity: 'Secure' })

  // Target Date: May 15, 2026
  useEffect(() => {
    const targetDate = new Date('2026-05-15T00:00:00').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        clearInterval(timer)
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {


      // Dashboard Entrance
      gsap.from(dashboardRef.current, {
        y: 60,
        opacity: 0,
        duration: 2,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: dashboardRef.current,
          start: 'top 85%',
        }
      })
    })

    return () => ctx.revert()
  }, [])

  const handleSync = () => {
    if (isSyncing) return

    setIsSyncing(true)
    setSyncStatus("SCANNING ASSETS...")

    setTelemetry({ stability: 82.4, integrity: 'SCANNING' })

    const tl = gsap.timeline({
      onComplete: () => {
        setIsSyncing(false)
        setSyncStatus("Park Status: Secure")
        setTelemetry({ stability: 99.98, integrity: 'Secure' })
      }
    })

    tl.to(beamRef.current, {
      left: '100%',
      duration: 2,
      ease: 'power2.inOut',
    })
      .set(beamRef.current, { left: '-10%' })

    tl.to(dashboardRef.current, {
      x: 2,
      y: -1,
      repeat: 5,
      yoyo: true,
      duration: 0.05,
      clearProps: 'all'
    }, 0.2)
  }


  const format = (num) => String(num).padStart(2, '0').split('')

  return (
    <section
      id="timeline"
      ref={containerRef}
      className="relative py-16 md:py-32 overflow-hidden min-h-screen flex items-center justify-center font-sans tracking-tight bg-cover bg-center"
      style={{ backgroundImage: `url('/images/heros/hero5.webp')` }}
    >
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* Vignette Effect (Dark Corners) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)] opacity-70 z-0 pointer-events-none"></div>



      {/* Calibration Dashboard Container */}
      <div ref={dashboardRef} className="container mx-auto md:ml-[10%] px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto relative group">

          {/* Scanner Beam */}
          <div
            ref={beamRef}
            className={`absolute top-0 bottom-0 w-1 bg-jurassic-red z-50 pointer-events-none shadow-[0_0_20px_#df1f26] ${isSyncing ? 'opacity-100' : 'opacity-0'}`}
            style={{ left: '-10%' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-jurassic-red rotate-45"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-jurassic-red rotate-45"></div>
          </div>

          {/* Header Metadata */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 border-b-2 border-black/5 pb-6">
            <div className="flex flex-col mb-4 md:mb-0">
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-2 transition-colors duration-300 ${isSyncing ? 'text-jurassic-yellow animate-pulse' : 'text-jurassic-red'}`}>
                {syncStatus}
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">Asset Monitoring</h2>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-8 text-[9px] md:text-[10px] font-bold text-white/40">
              <div className="flex flex-col items-start md:items-end">
                <span>LOCATION ID</span>
                <span className="text-white">ISLA NUBLAR</span>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span>ASSET SYNC</span>
                <span className={`tracking-widest uppercase ${isSyncing ? 'text-jurassic-yellow animate-pulse' : 'text-white opacity-40'}`}>
                  {isSyncing ? 'Syncing...' : 'Online'}
                </span>
              </div>
              <div className="flex flex-col items-start md:items-end">
                <span>DATA BUFFER</span>
                <div className="w-16 h-1 mt-1 bg-white/10 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 h-full bg-white transition-all duration-300 ${isSyncing ? 'w-full animate-shimmer' : 'w-[75%]'}`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-1 border border-black/10 bg-black/5 p-1 transition-transform duration-75 ${isSyncing ? 'skew-x-[0.2deg]' : ''}`}>

            {/* Countdown Blocks */}
            <div className="lg:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-1">
              {[
                { label: 'DAYS', val: timeLeft.days },
                { label: 'HOURS', val: timeLeft.hours },
                { label: 'MINUTES', val: timeLeft.mins },
                { label: 'SECONDS', val: timeLeft.secs }
              ].map((item, i) => (
                <div key={i} className="bg-black/60 backdrop-blur-md p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden group border border-white/5">
                  <span className="absolute top-2 md:top-4 left-4 md:left-6 text-[8px] md:text-[10px] font-black text-white/20 tracking-widest">{item.label}</span>
                  <div className={`text-5xl md:text-8xl font-black text-white tracking-tighter flex tabular-nums transition-all ${isSyncing ? 'scale-105 blur-[0.5px]' : ''}`}>
                    {format(item.val).map((digit, idx) => (
                      <ScrambleDigit key={idx} value={digit} isSyncing={isSyncing} />
                    ))}
                  </div>
                  <div className={`absolute bottom-0 left-0 w-0 h-1 bg-jurassic-yellow transition-all duration-1000 ${isSyncing ? 'w-full' : 'group-hover:w-full'}`}></div>
                </div>
              ))}
            </div>

            {/* Sidebar Metrics */}
            <div className="lg:col-span-3 bg-black/80 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 p-4 opacity-10 hidden md:block">
                <svg width="60" height="60" viewBox="0 0 100 100" className={`animate-spin-slow ${isSyncing ? 'animate-spin' : ''}`}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 5" />
                </svg>
              </div>

              <div>
                <h3 className="text-[10px] md:text-xs font-black tracking-widest text-white/30 mb-6 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full transition-colors ${isSyncing ? 'bg-jurassic-red animate-ping' : 'bg-white'}`}></span>
                  BIO-ANALYTIC DATA
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span>Genetic Stability</span>
                      <span>{telemetry.stability}%</span>
                    </div>
                    <div className="w-full h-1 bg-black/5 overflow-hidden">
                      <div className="h-full bg-black transition-all duration-1000" style={{ width: `${telemetry.stability}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase">
                      <span>Fence Integrity</span>
                      <span className={isSyncing ? 'text-jurassic-red' : ''}>{telemetry.integrity}</span>
                    </div>
                    <div className="flex gap-0.5 h-3">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 transition-all ${isSyncing ? (i % 2 === 0 ? 'bg-jurassic-yellow' : 'bg-jurassic-red') : (i < 8 ? 'bg-jurassic-red' : 'bg-black/10')} animate-pulse`}
                          style={{ animationDelay: `${i * 100}ms` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={`w-full py-4 transition-all duration-300 text-[10px] md:text-[11px] font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3 group relative overflow-hidden
                    ${isSyncing ? 'bg-jurassic-yellow text-black' : 'bg-white text-black hover:bg-jurassic-red hover:text-white'}
                  `}
                >
                  <span className="relative z-10">{isSyncing ? 'Scanning Assets...' : 'Initialize Sync'}</span>
                  {!isSyncing && (
                    <div className="w-4 h-4 relative group-hover:translate-x-1 transition-transform z-10">
                      <div className="absolute inset-0 border-t-2 border-r-2 border-white rotate-45"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Enclosure Map (Timeline) */}
          <div className="mt-1 flex flex-col md:flex-row border border-white/10 bg-black/60 backdrop-blur-md">
            <div className="w-full md:w-32 bg-white text-black p-4 flex flex-col items-center justify-center">
              <span className="text-[8px] font-black tracking-[0.4em] opacity-50 mb-1 leading-none uppercase">Enclosure</span>
              <span className="text-xs font-black tracking-widest leading-none">MAP.v1</span>
            </div>
            <div className="flex-1 p-6 md:pl-48 relative overflow-hidden flex flex-col justify-center min-h-[120px] md:min-h-[100px]">
              {/* Grid Lines */}
              <div className="absolute inset-x-6 md:left-48 top-1/2 h-[1px] bg-white/10"></div>
              {/* Progress Bar Container */}
              <div className="relative mx-2 md:mx-6 md:ml-20 h-8 flex items-center">
                <div className="absolute left-0 w-2 h-2 rounded-full bg-white -translate-x-1/2"></div>
                <div className="absolute right-0 w-2 h-2 rounded-full bg-white/20 translate-x-1/2"></div>

                {/* Dates */}
                <div className="absolute left-0 -top-6 text-[9px] md:text-[10px] font-black text-white">04.17</div>
                <div className="absolute right-0 -top-6 text-[9px] md:text-[10px] font-black opacity-30 text-white">05.14</div>

                {/* Moving Scanner */}
                <div className={`absolute top-0 bottom-0 w-[1px] h-full z-10 shadow-[0_0_8px_rgba(223,31,38,0.5)] flex items-center transition-all ${isSyncing ? 'bg-jurassic-yellow left-full' : 'bg-jurassic-red left-[35%]'}`}>
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 ${isSyncing ? 'bg-jurassic-yellow' : 'bg-jurassic-red'}`}></div>
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 ${isSyncing ? 'bg-jurassic-yellow' : 'bg-jurassic-red'}`}></div>
                  <div className={`ml-2 md:ml-3 text-white text-[6px] md:text-[7px] font-black px-1 py-0.5 tracking-tighter uppercase whitespace-nowrap ${isSyncing ? 'bg-jurassic-yellow text-black' : 'bg-jurassic-red'}`}>
                    {isSyncing ? 'Scanning Perimeter...' : 'Current Status: PADDOCK 9'}
                  </div>
                </div>

                {/* Segmented Track */}
                <div className="w-full flex gap-1 h-0.5 opacity-20">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="flex-1 bg-white"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full md:w-64 p-6 bg-white/5 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 overflow-hidden text-white">
              <div className={`flex items-center gap-4 transition-all ${isSyncing ? 'translate-x-4 opacity-50' : ''}`}>
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/20 flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 md:w-4 md:h-4 bg-white rotate-45"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-white/40">Isla Nublar Coords</span>
                  <span className="text-[10px] md:text-xs font-black tracking-tighter text-white uppercase">Lat: 09.25 / Long: -84.07</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Decals */}
          <div className="mt-6 md:mt-8 flex flex-col md:flex-row justify-between items-center opacity-30 text-[7px] md:text-[8px] font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase gap-2 md:gap-0 text-center md:text-left">
            <span>// [ InGen Security Protocol 7.0.2 ]</span>
            <span>// [ Clearance Level 5 Verified ] //</span>
          </div>

        </div>
      </div>
    </section>
  )
}

export default InovexSection
