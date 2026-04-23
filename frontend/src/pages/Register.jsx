import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { gsap } from 'gsap';
import { User, Mail, School, Phone, ChevronRight, ShieldCheck, Database, Flame, Hash, GraduationCap, BookOpen } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef(null);
  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const embersRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Initial entrance animation
    const tl = gsap.timeline();

    tl.fromTo(backgroundRef.current,
      { opacity: 0, scale: 1.1 },
      { opacity: 0.8, scale: 1, duration: 1.5, ease: "power2.out" }
    );

    tl.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      "-=1"
    );

    // Animate form fields staggered
    const fields = formRef.current.querySelectorAll('.form-field');
    gsap.fromTo(fields,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.5 }
    );

    // Embers animation
    embersRef.current.forEach((ember, i) => {
      if (ember) {
        gsap.set(ember, {
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          opacity: 0
        });

        gsap.to(ember, {
          y: -100,
          x: `+=${Math.random() * 200 - 100}`,
          opacity: [0, 0.8, 0],
          duration: Math.random() * 5 + 5,
          repeat: -1,
          delay: Math.random() * 10,
          ease: "none"
        });
      }
    });
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://inovex-backend01.onrender.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Animate success overlay
        gsap.fromTo(".success-overlay",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        );

        setTimeout(() => {
          gsap.to(".success-overlay", {
            opacity: 0,
            duration: 0.5,
            onComplete: () => setIsSubmitted(false)
          });
        }, 3000);
      } else {
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error('Registration Error:', error);
      alert("Unable to connect to the server. Please check if the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden md:pl-16">

      {/* Background Image - Dragon Theme (Desktop Only) */}
      <div
        ref={backgroundRef}
        className="hidden md:block absolute inset-0 z-0 md:bg-center md:bg-cover no-repeat"
        style={{ backgroundImage: `url('/images/login-hero.webp')` }}
      />

      {/* Dark Overlay */}
      {/* <div className="absolute inset-0 z-0 bg-black/40" /> */}

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center md:justify-start px-6 md:px-20 lg:px-58">

        <div
          ref={containerRef}
          className="w-full max-w-md relative mt-20 md:mt-0 md:pt-43 md:-ml-1 border border-amber-900/30 rounded-2xl p-6 bg-zinc-900/40 backdrop-blur-md md:bg-transparent md:border-none md:p-0 md:backdrop-blur-none"
        >
          {/* Mobile Heading */}
          <h2 className="text-2xl font-black text-amber-500 uppercase tracking-[0.3em] mb-8 md:hidden text-center">
            Registration
          </h2>

          <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Field */}
            <div className="form-field space-y-1 group">
              <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-400 transition-colors">
                FULL NAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={14} className="text-amber-600/30 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  {...register("name", {
                    required: "Legend name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" }
                  })}
                  type="text"
                  placeholder="E.G. DRAKE FIREBORN"
                  className={`w-full bg-black/60 border ${errors.name ? 'border-red-500' : 'border-amber-900/20'} rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all placeholder:text-white/5 text-amber-100`}
                />
              </div>
              {errors.name && (
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-field space-y-1 group">
              <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-400 transition-colors">
                COMMUNICATION SCROLL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={14} className="text-amber-600/30 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  {...register("email", {
                    required: "Scroll address is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format"
                    }
                  })}
                  type="email"
                  placeholder="HERO@LEGENDS.COM"
                  className={`w-full bg-black/60 border ${errors.email ? 'border-red-500' : 'border-amber-900/20'} rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all placeholder:text-white/5 text-amber-100`}
                />
              </div>
              {errors.email && (
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-field space-y-1 group">
              <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-400 transition-colors">
                SIGNAL CHANNEL / PHONE
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={14} className="text-amber-600/30 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  {...register("phone", {
                    required: "Signal channel is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Must be a 10-digit number"
                    }
                  })}
                  type="tel"
                  placeholder="10-DIGIT NUMBER"
                  className={`w-full bg-black/60 border ${errors.phone ? 'border-red-500' : 'border-amber-900/20'} rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all placeholder:text-white/5 text-amber-100`}
                />
              </div>
              {errors.phone && (
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1 block">
                  {errors.phone.message}
                </span>
              )}
            </div>

            {/* College Field */}
            <div className="form-field space-y-1 group">
              <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-400 transition-colors">
                GUILD / INSTITUTION NAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <School size={14} className="text-amber-600/30 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  {...register("college", { required: "Guild name is required" })}
                  type="text"
                  placeholder="ACADEMIC GUILD"
                  className={`w-full bg-black/60 border ${errors.college ? 'border-red-500' : 'border-amber-900/20'} rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all placeholder:text-white/5 text-amber-100`}
                />
              </div>
              {errors.college && (
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1 block">
                  {errors.college.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* USN Field */}
              <div className="form-field space-y-1 group">
                <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-400 transition-colors">
                  USN / IDENTITY CODE
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash size={14} className="text-amber-600/30 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <input
                    {...register("usn", { required: "USN is required" })}
                    type="text"
                    placeholder="USN NUMBER"
                    className={`w-full bg-black/60 border ${errors.usn ? 'border-red-500' : 'border-amber-900/20'} rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all placeholder:text-white/5 text-amber-100`}
                  />
                </div>
                {errors.usn && (
                  <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1 block">
                    {errors.usn.message}
                  </span>
                )}
              </div>

              {/* Year of Study */}
              <div className="form-field space-y-1 group">
                <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-400 transition-colors">
                  YEAR OF STUDY
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <GraduationCap size={14} className="text-amber-600/30 group-focus-within:text-amber-500 transition-colors" />
                  </div>
                  <select
                    {...register("year", { required: "Select your year" })}
                    className={`w-full bg-black/60 border ${errors.year ? 'border-red-500' : 'border-amber-900/20'} rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all appearance-none cursor-pointer text-amber-100`}
                  >
                    <option value="">SELECT YEAR</option>
                    <option className="bg-zinc-900" value="1">1ST YEAR</option>
                    <option className="bg-zinc-900" value="2">2ND YEAR</option>
                    <option className="bg-zinc-900" value="3">3RD YEAR</option>
                    <option className="bg-zinc-900" value="4">4TH YEAR</option>
                  </select>
                </div>
                {errors.year && (
                  <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1 block">
                    {errors.year.message}
                  </span>
                )}
              </div>
            </div>

            {/* Department Field */}
            <div className="form-field space-y-1 group">
              <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-400 transition-colors">
                DEPARTMENT / GUILD BRANCH
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <BookOpen size={14} className="text-amber-600/30 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  {...register("department", { required: "Department is required" })}
                  type="text"
                  placeholder="E.G. COMPUTER SCIENCE"
                  className={`w-full bg-black/60 border ${errors.department ? 'border-red-500' : 'border-amber-900/20'} rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all placeholder:text-white/5 text-amber-100`}
                />
              </div>
              {errors.department && (
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1 block">
                  {errors.department.message}
                </span>
              )}
            </div>

            {/* Event Select */}
            <div className="form-field space-y-1 group">
              <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1 group-focus-within:text-amber-400 transition-colors">
                CHOOSE YOUR QUEST
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Database size={14} className="text-amber-600/30 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <select
                  {...register("event", { required: "A quest must be chosen" })}
                  className={`w-full bg-black/60 border ${errors.event ? 'border-red-500' : 'border-amber-900/20'} rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all appearance-none cursor-pointer text-amber-100`}
                >
                  <option value="">SELECT YOUR DESTINY</option>
                  <option className="bg-zinc-900" value="Techsaurus">TECHSAURUS (IT MANAGER)</option>
                  <option className="bg-zinc-900" value="Spy vs Spy">SPY VS SPY (TREASURE HUNT)</option>
                  <option className="bg-zinc-900" value="Rex Rampage">REX RAMPAGE (TECH SURPRISE)</option>
                  <option className="bg-zinc-900" value="Cinesaur">CINESAUR (REEL MAKING)</option>
                  <option className="bg-zinc-900" value="Dinox">DINOX (WEB DESIGN)</option>
                  <option className="bg-zinc-900" value="RexHack">REXHACK (HACKATHON)</option>
                  <option className="bg-zinc-900" value="Battle Nexus">BATTLE NEXUS (GAMING)</option>
                  <option className="bg-zinc-900" value="Genesis Reborn">GENESIS REBORN (PRODUCT LAUNCH)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronRight size={14} className="text-amber-500/40 rotate-90" />
                </div>
              </div>
              {errors.event && (
                <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 mt-1 block">
                  {errors.event.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`form-field w-full ${isLoading ? 'bg-amber-900 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-600 active:scale-95'} text-white font-black italic tracking-[0.3em] uppercase py-3.5 rounded-lg mt-4 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10 skew-x-[-45deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
              {isLoading ? (
                <Database size={18} className="animate-pulse" />
              ) : (
                <Flame size={18} className="group-hover:rotate-12 transition-transform" />
              )}
              <span>{isLoading ? 'SECURE DATA...' : 'IGNITE QUEST'}</span>
            </button>
          </form>
          {/* Success Overlay */}
          {isSubmitted && (
            <div className="success-overlay absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-8 text-center z-50 rounded-xl">
              <ShieldCheck size={64} className="text-amber-500 mb-4" />
              <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2 text-amber-500">LEGEND REGISTERED</h3>
              <p className="text-[10px] font-bold tracking-widest text-amber-200/40 uppercase">Your path is forged. Prepare for the expedition.</p>
            </div>
          )}
          <div className="mt-8 flex justify-between items-center px-2 opacity-20">
            <div className="text-[8px] font-black tracking-widest uppercase text-amber-500">
              © 2026 INOVEX LEGENDS
            </div>
            <div className="text-[8px] font-black tracking-widest uppercase text-amber-500">
              BORN FROM FIRE
            </div>
          </div>
        </div>
      </div>

      {/* Floating Embers Effect with GSAP */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            ref={el => embersRef.current[i] = el}
            className="absolute w-1 h-1 bg-amber-500 rounded-full blur-[1px]"
          />
        ))}
      </div>
    </div>
  );
};

export default Register;
