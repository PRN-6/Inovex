import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { gsap } from 'gsap';
import { User, Mail, School, Phone, ChevronRight, ShieldCheck, Database, Flame, Hash, GraduationCap, BookOpen, Shield } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Event Team Size Mapping
  const eventTeamSizes = {
    "Techsaurus": 1,
    "Spy vs Spy": 4,
    "Rex Rampage": 2,
    "Cinesaur": 2,
    "Dinox": 2,
    "RexHack": 4,
    "Battle Nexus": 4,
    "Genesis Reborn": 2
  };

  const selectedEvents = watch("events") || [];

  const getTeamSize = (eventName) => eventTeamSizes[eventName] || 1;

  const formRef = useRef(null);
  const containerRef = useRef(null);
  const backgroundRef = useRef(null);
  const embersRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Initial entrance animation
    const tl = gsap.timeline();

    tl.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Animate form fields staggered
    const fields = formRef.current.querySelectorAll('.form-field');
    gsap.fromTo(fields,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.3 }
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

  const onSubmit = async (formData) => {
    setIsLoading(true);

    // Structure multiple registrations
    const registrations = selectedEvents.map(eventName => {
      const teamSize = getTeamSize(eventName);
      const teammates = [];

      if (teamSize > 1) {
        for (let i = 0; i < teamSize - 1; i++) {
          const tName = formData.teammates?.[eventName]?.[i]?.name;
          const tUsn = formData.teammates?.[eventName]?.[i]?.usn;
          const tEmail = formData.teammates?.[eventName]?.[i]?.email;

          if (tName) {
            teammates.push({ name: tName, usn: tUsn, email: tEmail });
          }
        }
      }

      return { eventName, teammates };
    });

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      usn: formData.usn,
      year: formData.year,
      department: formData.department,
      registrations
    };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(180,83,9,0.05)_0%,rgba(0,0,0,1)_70%)]" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full min-h-screen px-6 md:px-20 lg:px-40 lg:pl-56 pt-28 pb-20 overflow-y-auto">

        <div className={`w-full flex flex-col lg:flex-row gap-12 items-center lg:items-start transition-all duration-700 ease-in-out`}>

          {/* RIGHT SIDE: Main Form (Sticky) */}
          <div
            ref={containerRef}
            className="w-full max-w-md lg:sticky lg:top-28 lg:z-30 border border-amber-900/20 rounded-3xl p-8 bg-zinc-900/30 backdrop-blur-xl transition-all duration-500"
          >
            {/* Form Heading */}
            <h2 className="text-2xl font-black text-amber-500 uppercase tracking-[0.4em] mb-10 text-center">
              Identity
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

              {/* Event Selection (Checkboxes) */}
              <div className="form-field space-y-4 pt-4 border-t border-amber-900/10">
                <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] ml-1">
                  Select Your Quests
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.keys(eventTeamSizes).map((eventName) => (
                    <label
                      key={eventName}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${selectedEvents.includes(eventName)
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                        : 'bg-black/40 border-amber-900/10 text-white/40 hover:border-amber-500/20'
                        }`}
                    >
                      <input
                        type="checkbox"
                        value={eventName}
                        {...register("events", { required: "Select at least one quest" })}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedEvents.includes(eventName) ? 'bg-amber-500 border-amber-500' : 'border-amber-900/30'
                        }`}>
                        {selectedEvents.includes(eventName) && <Database size={10} className="text-black" />}
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase truncate">
                        {eventName} <span className="text-[8px] opacity-40 ml-2">({getTeamSize(eventName)} Slots)</span>
                      </span>
                    </label>
                  ))}
                </div>
                {errors.events && (
                  <span className="text-[8px] font-bold text-red-500 uppercase tracking-wider ml-1 block">
                    {errors.events.message}
                  </span>
                )}
              </div>

              {/* Mobile/Single-Column Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`form-field w-full lg:hidden ${isLoading ? 'bg-amber-900 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-600 active:scale-95'} text-white font-black italic tracking-[0.3em] uppercase py-3.5 rounded-lg mt-10 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 skew-x-[-45deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                {isLoading ? <Database size={18} className="animate-pulse" /> : <Flame size={18} className="group-hover:rotate-12 transition-transform" />}
                <span>{isLoading ? 'SECURE DATA...' : 'IGNITE QUEST'}</span>
              </button>

              {/* Desktop Sticky Submit Button (Only shows if team selected) */}
              <button
                type="submit"
                disabled={isLoading}
                className={`form-field w-full hidden lg:flex ${isLoading ? 'bg-amber-900 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-600 active:scale-95'} text-white font-black italic tracking-[0.3em] uppercase py-3.5 rounded-lg mt-10 transition-all duration-300 items-center justify-center gap-3 group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 skew-x-[-45deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                {isLoading ? <Database size={18} className="animate-pulse" /> : <Flame size={18} className="group-hover:rotate-12 transition-transform" />}
                <span>{isLoading ? 'FORGE ALL QUESTS' : 'FORGE ALL QUESTS'}</span>
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
          </div>

          {/* LEFT SIDE: Squad Panels (Scrollable) */}
          <div className="flex-1 w-full max-w-3xl space-y-12">
            {selectedEvents.filter(e => getTeamSize(e) > 1).length === 0 && (
              <div className="hidden lg:flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-amber-900/10 rounded-3xl p-12 text-center opacity-30">
                <Shield size={64} className="text-amber-500 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-[0.4em] text-amber-500">Squad Intelligence</h3>
                <p className="text-[10px] font-bold tracking-widest uppercase mt-4 max-w-xs">Select team-based quests to unlock squad formation protocols.</p>
              </div>
            )}

            {selectedEvents.map((eventName) => {
              const teamSize = getTeamSize(eventName);
              if (teamSize <= 1) return null;

              return (
                <div
                  key={eventName}
                  className="animate-in fade-in slide-in-from-right-12 duration-1000 ease-out"
                >
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-px w-12 bg-amber-500/30"></div>
                    <h3 className="text-base font-black text-amber-500 tracking-[0.5em] uppercase">
                      {eventName} <span className="text-[10px] text-amber-500/40 ml-2">SQUAD</span>
                    </h3>
                    <div className="h-px flex-1 bg-amber-500/30"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(teamSize - 1)].map((_, i) => (
                      <div
                        key={i}
                        className="p-8 rounded-3xl bg-zinc-900/30 backdrop-blur-xl border border-amber-900/10 hover:border-amber-500/30 transition-all duration-500 group"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xs">
                              {i + 2}
                            </div>
                            <span className="text-[11px] font-black text-amber-500/60 group-hover:text-amber-500 transition-colors uppercase tracking-[0.3em]">Partner</span>
                          </div>
                          <User size={14} className="text-amber-500/20 group-hover:text-amber-500/50 transition-colors" />
                        </div>

                        <div className="space-y-5">
                          <input
                            {...register(`teammates.${eventName}.${i}.name`, { required: true })}
                            placeholder="FULL NAME"
                            className="w-full bg-black/40 border border-amber-900/10 rounded-xl py-3.5 px-5 text-[11px] font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100"
                          />
                          <input
                            {...register(`teammates.${eventName}.${i}.usn`, { required: true })}
                            placeholder="USN / IDENTITY"
                            className="w-full bg-black/40 border border-amber-900/10 rounded-xl py-3.5 px-5 text-[11px] font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100"
                          />
                          <input
                            {...register(`teammates.${eventName}.${i}.email`, { required: true })}
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            className="w-full bg-black/40 border border-amber-900/10 rounded-xl py-3.5 px-5 text-[11px] font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
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
