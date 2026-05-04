import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNotification } from '../context/NotificationContext';
import { gsap } from 'gsap';
import { User, Database, Flame, Shield, CheckCircle, UserPlus } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const { showNotify } = useNotification();

  // Dynamic API URL for Local/Production
  const API_URL = import.meta.env.VITE_API_URL || 'https://inovex-backend01.onrender.com';



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
    if (selectedEvents.length === 0) {
      showNotify("MISSION CRITICAL: You must select at least one event.", "error");
      return;
    }

    setIsLoading(true);
    try {
      // Check if user is already registered for selected events
      const checkRes = await fetch(`${API_URL}/api/check-registration/${formData.usn}`);
      const checkData = await checkRes.json();

      if (checkData.success && checkData.registeredEvents.length > 0) {
        const alreadyRegistered = selectedEvents.filter(e => checkData.registeredEvents.includes(e));
        if (alreadyRegistered.length > 0) {
          showNotify(`MISSION ABORTED: You are already registered for: ${alreadyRegistered.join(", ")}.`, 'error');
          setIsLoading(false);
          return;
        }
      }

      // Prepare registrations data
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

      // Submit Registration
      const submissionData = {
        ...formData,
        registrations
      };

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const result = await response.json();
        setParticipantId(result.participantId);
        setIsSubmitted(true);
        gsap.fromTo(".success-overlay", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });

        // Auto-download ticket after 1 second
        setTimeout(() => {
          downloadTicket(result.participantId, formData.name, selectedEvents);
        }, 1000);

      } else {
        const error = await response.json();
        showNotify(error.message || "Registration failed. Please try again.", 'error');
      }
    } catch (err) {
      console.error("Registration Error:", err);
      showNotify("System Offline: Could not connect to the registration server.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTicket = (pid, userName, events) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Inner Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    // Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'italic bold 32px Arial';
    ctx.fillText('INOVEX 2026 - ACCESS PASS', 40, 60);

    // Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.fillText(`ASSET: ${userName.toUpperCase()}`, 40, 110);

    // Quests
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '14px Arial';
    ctx.fillText(`QUESTS: ${events.join(', ')}`, 40, 145);

    // PID Label
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('PARTICIPANT ID', 40, 220);

    // PID Value
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'italic bold 42px Arial';
    ctx.fillText(pid, 40, 260);

    // Instruction Text
    ctx.textAlign = 'right';
    ctx.fillStyle = '#aaaaaa';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('PRESENT THIS ID AT THE ENTRANCE', 560, 245);
    ctx.fillText('FOR PAYMENT VERIFICATION.', 560, 260);
    ctx.textAlign = 'left';

    // Trigger Download
    const link = document.createElement('a');
    link.download = `INOVEX_PASS_${pid}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };


  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-amber-500/30">
      {/* Immersive Background - Now with more vibrant depth */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,rgba(0,0,0,1)_70%)]" />
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      <div className="relative z-10 w-full min-h-screen px-4 md:px-20 lg:px-40 lg:pl-56 pt-24 pb-20 overflow-y-auto">
        <div className="w-full flex flex-col lg:flex-row gap-8 items-center lg:items-start transition-all duration-700">


          {/* REGISTRATION FORM */}
          <div ref={containerRef} className="w-full max-w-md lg:sticky lg:top-28 lg:z-30 border border-amber-500/20 rounded-3xl p-8 bg-zinc-900/40 backdrop-blur-2xl shadow-2xl shadow-amber-900/5 relative">

            {isMaintenance ? (
              <div className="flex flex-col items-center py-12 text-center animate-in fade-in zoom-in duration-500">
                <Shield size={64} className="text-amber-500 mb-6 animate-pulse" />
                <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-4">Expedition Halted</h2>
                <p className="text-xs font-bold text-amber-500/80 tracking-widest uppercase leading-relaxed mb-10">
                  The registration protocol is currently offline for maintenance.<br />Please check back shortly.
                </p>

                {(timeLeft.h > 0 || timeLeft.m > 0 || timeLeft.s > 0) && (
                  <div className="grid grid-cols-3 gap-4 mb-10 w-full px-6">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black italic text-white leading-none">{String(timeLeft.h).padStart(2, '0')}</span>
                      <span className="text-[10px] font-black text-amber-500 tracking-[0.3em] mt-1 uppercase">Hours</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black italic text-white leading-none">{String(timeLeft.m).padStart(2, '0')}</span>
                      <span className="text-[10px] font-black text-amber-500 tracking-[0.3em] mt-1 uppercase">Mins</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black italic text-white leading-none animate-pulse">{String(timeLeft.s).padStart(2, '0')}</span>
                      <span className="text-[10px] font-black text-amber-500 tracking-[0.3em] mt-1 uppercase">Secs</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></div>
                  <span className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase italic">Syst-Sync Active</span>
                </div>

                <button onClick={() => window.location.href = '/'} className="px-8 py-3 border border-amber-500/40 text-amber-500 text-[10px] font-black tracking-widest hover:bg-amber-500 hover:text-white transition-all uppercase rounded-lg">
                  Return to Base
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-8">
                  <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <UserPlus size={28} className="text-amber-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em]">Register</h2>
                  <div className="h-1 w-12 bg-amber-500 mt-2 rounded-full"></div>
                  <p className="text-[10px] font-bold text-amber-500/80 tracking-widest mt-3 uppercase">Secure your spot in the expedition</p>
                </div>

                <form onSubmit={handleSubmit(handleRegistration)} className="space-y-5">
                  {/* Honeypot field to catch bots - MUST REMAIN HIDDEN */}
                  <input
                    {...register("hp_field")}
                    type="text"
                    className="hidden"
                    tabIndex="-1"
                    autoComplete="off"
                  />
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-500' : 'text-white/30 group-focus-within:text-amber-500'}`} />
                      <input
                        {...register("name", { required: "Full name is required" })}
                        placeholder="E.G. ALEX DRIVER"
                        className={`w-full bg-white/5 border rounded-xl py-4 pl-12 pr-4 text-[13px] font-bold tracking-widest focus:outline-none focus:bg-white/10 transition-all text-white placeholder:text-white/20 ${errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500/50'}`}
                      />
                    </div>
                    {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter ml-1">{errors.name.message}</p>}
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">Email</label>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
                        })}
                        type="email"
                        placeholder="EMAIL ADDRESS"
                        className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:bg-white/10 transition-all text-white placeholder:text-white/20 ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500/50'}`}
                      />
                      {errors.email && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">Phone</label>
                      <input
                        {...register("phone", {
                          required: "Phone is required",
                          pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" }
                        })}
                        placeholder="10-DIGIT NUMBER"
                        className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:bg-white/10 transition-all text-white placeholder:text-white/20 ${errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500/50'}`}
                      />
                      {errors.phone && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">College / Institution</label>
                    <input
                      {...register("college", { required: "College name is required" })}
                      placeholder="COLLEGE NAME"
                      className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:bg-white/10 transition-all text-white placeholder:text-white/20 ${errors.college ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500/50'}`}
                    />
                    {errors.college && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{errors.college.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">USN / ID</label>
                      <input
                        {...register("usn", { required: "USN is required" })}
                        placeholder="USN"
                        className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:bg-white/10 transition-all text-white placeholder:text-white/20 ${errors.usn ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500/50'}`}
                      />
                      {errors.usn && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{errors.usn.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">Year</label>
                      <select
                        {...register("year", { required: "Required" })}
                        className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:bg-white/10 transition-all text-white ${errors.year ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500/50'}`}
                      >
                        <option value="1" className="bg-zinc-900">1ST YEAR</option>
                        <option value="2" className="bg-zinc-900">2ND YEAR</option>
                        <option value="3" className="bg-zinc-900">3RD YEAR</option>
                        <option value="4" className="bg-zinc-900">4TH YEAR</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest ml-1">Department</label>
                    <input
                      {...register("department", { required: "Department is required" })}
                      placeholder="E.G. COMPUTER SCIENCE"
                      className={`w-full bg-white/5 border rounded-xl py-3.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:bg-white/10 transition-all text-white placeholder:text-white/20 ${errors.department ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-amber-500/50'}`}
                    />
                    {errors.department && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tighter ml-1">{errors.department.message}</p>}
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <label className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] mb-4 block">Select Quests</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {Object.keys(eventTeamSizes).map((eventName) => (
                        <label key={eventName} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer touch-manipulation ${selectedEvents.includes(eventName) ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-white/5 border-white/5 text-white/40 hover:border-white/20'}`}>
                          <input type="checkbox" value={eventName} {...register("events", { required: "Select one" })} className="hidden" />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedEvents.includes(eventName) ? 'bg-amber-500 border-amber-500' : 'border-white/30'}`}>
                            {selectedEvents.includes(eventName) && <Database size={14} className="text-black" />}
                          </div>
                          <span className="text-[11px] font-black uppercase truncate tracking-tight">{eventName}</span>
                        </label>
                      ))}
                    </div>
                  </div>


                  <button type="submit" disabled={isLoading} className={`w-full mt-6 py-4.5 rounded-2xl font-black italic tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${isLoading ? 'bg-zinc-800 text-white/20' : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-900/20'}`}>
                    <div className="absolute inset-0 bg-white/20 skew-x-[-45deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    {isLoading ? <Database size={20} className="animate-spin" /> : <Flame size={20} />}
                    <span>{isLoading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}</span>
                  </button>
                </form>
              </>
            )}

            {isSubmitted && (
              <div className="success-overlay absolute inset-0 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center z-50 rounded-3xl">
                <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/40 animate-bounce">
                  <CheckCircle size={48} className="text-amber-500" />
                </div>
                <h3 className="text-3xl font-black italic tracking-tight uppercase mb-4 text-white">QUEST FORGED</h3>
                <p className="text-xs font-bold tracking-[0.1em] text-white/60 uppercase leading-relaxed mb-6">
                  Your identity has been verified and your spot is secured.<br />Welcome to INOVEX 2026.
                </p>
                {participantId && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 w-full mb-8">
                    <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest mb-2">Participant ID</p>
                    <p className="text-2xl font-black text-amber-500 tracking-[0.2em]">{participantId}</p>
                    <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-2">Keep this ID safe for verification & payment</p>
                  </div>
                )}
                <button onClick={() => window.location.href = '/'} className="mt-2 px-8 py-3 bg-amber-500 text-black text-[10px] font-black tracking-[0.3em] rounded-full hover:bg-amber-400 transition-colors uppercase">RETURN TO BASE</button>
              </div>
            )}
          </div>

          {/* SQUAD SELECTION SIDEBAR */}
          <div className="flex-1 w-full max-w-3xl">
            {selectedEvents.filter(e => getTeamSize(e) > 1).length === 0 ? (
              <div className="hidden lg:flex flex-col items-center justify-center h-[70vh] border-2 border-dashed border-amber-500/10 rounded-3xl p-12 text-center group">
                <div className="p-8 rounded-full bg-amber-500/5 border border-amber-500/10 mb-8 group-hover:scale-110 transition-transform duration-700">
                  <Shield size={64} className="text-amber-500/20" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-white/40">Squad Formation</h3>
                <p className="text-[11px] font-bold tracking-widest uppercase mt-4 max-w-xs leading-loose text-white/20">Select team-based quests to unlock squad synchronization protocols.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {selectedEvents.map((eventName) => {
                  const teamSize = getTeamSize(eventName);
                  if (teamSize <= 1) return null;
                  return (
                    <div key={eventName} className="animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="h-px w-12 bg-amber-500/30"></div>
                        <h3 className="text-sm font-black text-amber-500 tracking-[0.5em] uppercase">{eventName} <span className="text-[10px] text-white/20 ml-2 italic">SQUAD CONFIG</span></h3>
                        <div className="h-px flex-1 bg-amber-500/30"></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(teamSize - 1)].map((_, i) => (
                          <div key={i} className="p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-2xl border border-white/5 hover:border-amber-500/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-3xl -mr-12 -mt-12 group-hover:bg-amber-500/10 transition-colors"></div>
                            <div className="flex items-center justify-between mb-6">
                              <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Partner {i + 2}</span>
                              <div className="p-2 bg-white/5 rounded-lg">
                                <User size={14} className="text-amber-500/40" />
                              </div>
                            </div>
                            <div className="space-y-4">
                              <input {...register(`teammates.${eventName}.${i}.name`, { required: true })} placeholder="PARTNER NAME" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:border-amber-500/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20" />
                              <input {...register(`teammates.${eventName}.${i}.usn`, { required: true })} placeholder="PARTNER USN" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:border-amber-500/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20" />
                              <input {...register(`teammates.${eventName}.${i}.email`, { required: true })} placeholder="PARTNER EMAIL" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold tracking-widest focus:border-amber-500/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20" />
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

      {/* Decorative Embers Layer - Now Amber */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div key={i} ref={el => embersRef.current[i] = el} className="absolute w-1.5 h-1.5 bg-amber-500/60 rounded-full blur-[1px]" />
        ))}
      </div>
    </div>
  );
};

export default Register;
