import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { gsap } from 'gsap';
import { User, Mail, School, Phone, ChevronRight, ShieldCheck, Database, Flame, Hash, GraduationCap, BookOpen, Shield, CheckCircle, UserPlus } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  // Dynamic API URL for Local/Production
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://inovex-backend01.onrender.com';

  // Event Pricing & Squad Sizes
  const eventPrices = {
    "Techsaurus": 200, "Spy vs Spy": 300, "Rex Rampage": 150, "Cinesaur": 150,
    "Dinox": 200, "RexHack": 500, "Battle Nexus": 400, "Genesis Reborn": 250
  };

  const eventTeamSizes = {
    "Techsaurus": 1, "Spy vs Spy": 4, "Rex Rampage": 2, "Cinesaur": 2,
    "Dinox": 2, "RexHack": 4, "Battle Nexus": 4, "Genesis Reborn": 2
  };

  const selectedEvents = watch("events") || [];
  const getTeamSize = (eventName) => eventTeamSizes[eventName] || 1;

  const containerRef = useRef(null);
  const embersRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check Maintenance Status
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/api/status`);
        const data = await res.json();
        if (data.maintenance) {
          setIsMaintenance(true);
          if (data.maintenanceUntil) {
            const target = new Date(data.maintenanceUntil).getTime();
            const interval = setInterval(() => {
              const now = new Date().getTime();
              const diff = target - now;
              if (diff <= 0) {
                clearInterval(interval);
                setIsMaintenance(false);
              } else {
                setTimeLeft({
                  h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                  m: Math.floor((diff / 1000 / 60) % 60),
                  s: Math.floor((diff / 1000) % 60)
                });
              }
            }, 1000);
            return () => clearInterval(interval);
          }
        } else {
          setIsMaintenance(false);
        }
      } catch (err) {
        console.error("Status Check Failed:", err);
      }
    };
    checkStatus();

    // Entrance animation
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });

    // Animated Embers Background
    const activeAnimations = [];
    embersRef.current.forEach((ember) => {
      if (ember) {
        gsap.set(ember, { x: Math.random() * window.innerWidth, y: window.innerHeight + 50, opacity: 0 });
        const anim = gsap.to(ember, { 
          y: -100, 
          x: `+=${Math.random() * 200 - 100}`, 
          opacity: [0, 0.8, 0], 
          duration: Math.random() * 5 + 5, 
          repeat: -1, 
          delay: Math.random() * 10, 
          ease: "none" 
        });
        activeAnimations.push(anim);
      }
    });

    return () => {
      tl.kill();
      activeAnimations.forEach(a => a.kill());
    };
  }, []);

  const handleRegistration = async (formData) => {
    setIsLoading(true);
    
    try {
      // Package registration data with teammates
      const registrations = selectedEvents.map(eventName => {
        const teamSize = getTeamSize(eventName);
        const teammates = [];
        if (teamSize > 1) {
          for (let i = 0; i < teamSize - 1; i++) {
            const tName = formData.teammates?.[eventName]?.[i]?.name;
            const tUsn = formData.teammates?.[eventName]?.[i]?.usn;
            const tEmail = formData.teammates?.[eventName]?.[i]?.email;
            if (tName) teammates.push({ name: tName, usn: tUsn, email: tEmail });
          }
        }
        return { eventName, teammates };
      });

      const finalPayload = {
        ...formData,
        registrations,
        amount: selectedEvents.reduce((total, e) => total + (eventPrices[e] || 0), 0),
        transactionId: `REG_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalPayload)
      });

      if (response.ok) {
        setIsSubmitted(true);
        gsap.fromTo(".success-overlay", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
      } else {
        const error = await response.json();
        alert(error.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("System Offline: Could not connect to the registration server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.05)_0%,rgba(0,0,0,1)_70%)]" />

      <div className="relative z-10 w-full min-h-screen px-6 md:px-20 lg:px-40 lg:pl-56 pt-28 pb-20 overflow-y-auto">
        <div className="w-full flex flex-col lg:flex-row gap-12 items-center lg:items-start transition-all duration-700">

          {/* REGISTRATION FORM */}
          <div ref={containerRef} className="w-full max-w-md lg:sticky lg:top-28 lg:z-30 border border-red-900/20 rounded-3xl p-8 bg-zinc-900/30 backdrop-blur-xl shadow-2xl shadow-red-950/10">
            {isMaintenance ? (
              <div className="flex flex-col items-center py-12 text-center animate-in fade-in zoom-in duration-500">
                <Shield size={64} className="text-red-500 mb-6 animate-pulse" />
                <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-4">Expedition Halted</h2>
                <p className="text-[10px] font-bold text-red-500/60 tracking-widest uppercase leading-relaxed mb-10">
                  The registration protocol is currently offline for maintenance.<br/>Please check back shortly.
                </p>

                {(timeLeft.h > 0 || timeLeft.m > 0 || timeLeft.s > 0) && (
                  <div className="grid grid-cols-3 gap-4 mb-10 w-full px-6">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black italic text-white leading-none">{String(timeLeft.h).padStart(2, '0')}</span>
                      <span className="text-[7px] font-black text-red-500 tracking-[0.3em] mt-1 uppercase">Hours</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black italic text-white leading-none">{String(timeLeft.m).padStart(2, '0')}</span>
                      <span className="text-[7px] font-black text-red-500 tracking-[0.3em] mt-1 uppercase">Mins</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black italic text-white leading-none animate-pulse">{String(timeLeft.s).padStart(2, '0')}</span>
                      <span className="text-[7px] font-black text-red-500 tracking-[0.3em] mt-1 uppercase">Secs</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></div>
                  <span className="text-[8px] font-black text-white/20 tracking-[0.4em] uppercase italic">Syst-Sync Active</span>
                </div>

                <button onClick={() => window.location.href = '/'} className="px-8 py-3 border border-red-500/20 text-red-500 text-[9px] font-black tracking-widest hover:bg-red-500 hover:text-white transition-all uppercase">
                  Return to Base
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-8">
                  <div className="w-12 h-12 bg-red-600/10 rounded-full flex items-center justify-center mb-4 border border-red-600/20">
                    <UserPlus size={24} className="text-red-500" />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Registration</h2>
                  <p className="text-[9px] font-bold text-red-500/60 tracking-widest mt-2">SECURE YOUR SPOT IN THE EXPEDITION</p>
                </div>

                <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-red-500 transition-colors" />
                  <input {...register("name", { required: true })} placeholder="E.G. ALEX DRIVER" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">Email</label>
                  <input {...register("email", { required: true })} type="email" placeholder="EMAIL" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">Phone</label>
                  <input {...register("phone", { required: true })} placeholder="PHONE" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">College / Institution</label>
                <input {...register("college", { required: true })} placeholder="COLLEGE NAME" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">USN / ID</label>
                  <input {...register("usn", { required: true })} placeholder="USN" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">Year</label>
                  <select {...register("year", { required: true })} className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all text-white">
                    <option value="1">1ST YEAR</option><option value="2">2ND YEAR</option><option value="3">3RD YEAR</option><option value="4">4TH YEAR</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-1">Department</label>
                <input {...register("department", { required: true })} placeholder="E.G. COMPUTER SCIENCE" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
              </div>

              <div className="pt-6 border-t border-white/5">
                <label className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] mb-4 block">Select Quests</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.keys(eventPrices).map((eventName) => (
                    <label key={eventName} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedEvents.includes(eventName) ? 'bg-red-600/10 border-red-600/40 text-red-500' : 'bg-black/40 border-white/5 text-white/20 hover:border-white/20'}`}>
                      <input type="checkbox" value={eventName} {...register("events", { required: "Select one" })} className="hidden" />
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${selectedEvents.includes(eventName) ? 'bg-red-600 border-red-600' : 'border-white/20'}`}>
                        {selectedEvents.includes(eventName) && <Database size={10} className="text-white" />}
                      </div>
                      <span className="text-[8px] font-black uppercase truncate tracking-tight">{eventName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isLoading} className={`w-full mt-6 py-4 rounded-2xl font-black italic tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${isLoading ? 'bg-zinc-800 text-white/20' : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/20'}`}>
                <div className="absolute inset-0 bg-white/10 skew-x-[-45deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                {isLoading ? <Database size={18} className="animate-spin" /> : <Flame size={18} />}
                <span>{isLoading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}</span>
              </button>
            </form>
          </>
        )}

            {isSubmitted && (
              <div className="success-overlay absolute inset-0 bg-black/98 flex flex-col items-center justify-center p-8 text-center z-50 rounded-3xl">
                <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mb-6 border border-red-600/40 animate-pulse">
                  <CheckCircle size={40} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-black italic tracking-tight uppercase mb-4 text-white">QUEST FORGED</h3>
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase leading-relaxed">
                  Your identity has been verified and your spot is secured.<br />Welcome to INOVEX 2026.
                </p>
                <button onClick={() => window.location.href = '/'} className="mt-8 text-[10px] font-black text-red-500 underline underline-offset-8 tracking-[0.3em] hover:text-white transition-colors">RETURN TO BASE</button>
              </div>
            )}
          </div>

          {/* SQUAD SELECTION SIDEBAR */}
          <div className="flex-1 w-full max-w-3xl">
            {selectedEvents.filter(e => getTeamSize(e) > 1).length === 0 ? (
              <div className="hidden lg:flex flex-col items-center justify-center h-[70vh] border-2 border-dashed border-white/5 rounded-3xl p-12 text-center opacity-20">
                <Shield size={64} className="text-white mb-6" />
                <h3 className="text-xl font-black uppercase tracking-[0.4em]">Squad Formation</h3>
                <p className="text-[10px] font-bold tracking-widest uppercase mt-4 max-w-xs leading-loose">Select team-based quests to unlock squad synchronization protocols.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {selectedEvents.map((eventName) => {
                  const teamSize = getTeamSize(eventName);
                  if (teamSize <= 1) return null;
                  return (
                    <div key={eventName} className="animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="h-px w-12 bg-red-600/30"></div>
                        <h3 className="text-sm font-black text-red-500 tracking-[0.5em] uppercase">{eventName} <span className="text-[10px] text-white/20 ml-2 italic">SQUAD CONFIG</span></h3>
                        <div className="h-px flex-1 bg-red-600/30"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(teamSize - 1)].map((_, i) => (
                          <div key={i} className="p-6 rounded-3xl bg-zinc-900/30 backdrop-blur-xl border border-white/5 hover:border-red-600/30 transition-all group">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Partner {i + 2}</span>
                              <User size={12} className="text-white/10" />
                            </div>
                            <div className="space-y-3">
                              <input {...register(`teammates.${eventName}.${i}.name`, { required: true })} placeholder="NAME" className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 px-4 text-[10px] font-bold tracking-widest focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
                              <input {...register(`teammates.${eventName}.${i}.usn`, { required: true })} placeholder="USN" className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 px-4 text-[10px] font-bold tracking-widest focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
                              <input {...register(`teammates.${eventName}.${i}.email`, { required: true })} placeholder="EMAIL" className="w-full bg-black/40 border border-white/5 rounded-xl py-2.5 px-4 text-[10px] font-bold tracking-widest focus:border-red-600/50 transition-all text-white placeholder:text-white/10" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Embers Layer */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div key={i} ref={el => embersRef.current[i] = el} className="absolute w-1 h-1 bg-red-500 rounded-full blur-[1px]" />
        ))}
      </div>
    </div>
  );
};

export default Register;
