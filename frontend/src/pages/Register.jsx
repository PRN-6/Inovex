import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNotification } from '../context/NotificationContext';
import { gsap } from 'gsap';
import { User, Database, Flame, Shield, CheckCircle, UserPlus, Users, Info, ArrowRight, Zap } from 'lucide-react';
import { eventsData } from '../data/eventsData';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    defaultValues: {
      category: "Technical",
      events: []
    }
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [participantId, setParticipantId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  const [step, setStep] = useState(0); // 0: Details, 1: Payment
  const [screenshot, setScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { showNotify } = useNotification();

  // Dynamic API URL for Local/Production
  const API_URL = import.meta.env.VITE_API_URL || 'https://inovex-backend01.onrender.com';

  const getTeamMetrics = (eventName) => {
    const event = Object.values(eventsData).find(e => e.title === eventName);
    if (!event) return { min: 1, max: 1 };
    const matches = event.participants?.match(/\d+/g);
    if (!matches) return { min: 1, max: 1 };
    const nums = matches.map(n => parseInt(n, 10));
    return { min: nums[0], max: nums[nums.length - 1] };
  };

  const getEventFee = (eventName) => {
    const event = Object.values(eventsData).find(e => e.title === eventName);
    if (!event) return 0;
    const feeStr = event.entryFee || "₹0";
    return parseInt(feeStr.replace(/[^\d]/g, ''), 10) || 0;
  };

  const selectedEvents = watch("events") || [];
  const leaderName = watch("name") || "TEAM LEADER";

  const totalFee = useMemo(() => {
    return selectedEvents.reduce((sum, eventName) => sum + getEventFee(eventName), 0);
  }, [selectedEvents]);

  // Filter and group events from data
  const { technicalEvents, managementEvents, culturalEvents } = useMemo(() => {
    const tech = [];
    const mgmt = [];
    const cult = [];
    Object.values(eventsData).forEach(event => {
      if (!event.title) return;
      if (event.type === 'technical') tech.push(event.title);
      else if (event.type === 'management') mgmt.push(event.title);
      else if (event.type === 'cultural') cult.push(event.title);
    });
    return { technicalEvents: tech, managementEvents: mgmt, culturalEvents: cult };
  }, []);

  const containerRef = useRef(null);
  const embersRef = useRef([]);
  const squadRef = useRef(null);

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
  }, [API_URL]);

  // Animate squad slots when events change
  useEffect(() => {
    if (squadRef.current) {
      gsap.fromTo(".squad-card",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "back.out(1.2)" }
      );
    }
  }, [selectedEvents]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotify("FILE OVERLOAD: Maximum size is 5MB.", "error");
        return;
      }
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const nextStep = async (e) => {
    e.preventDefault();
    if (selectedEvents.length === 0) {
      showNotify("MISSION CRITICAL: You must select at least one event.", "error");
      return;
    }

    // Check required fields before moving to payment
    const isValid = await handleSubmit(() => { })();
    // Wait, handleSubmit returns undefined. I should use trigger() from react-hook-form
    // But I'll just let the native validation handle it for now or use trigger
  };

  // Re-define handleSubmit logic to support steps
  const onFormSubmit = (data) => {
    if (step === 0) {
      setStep(1);
      window.scrollTo(0, 0);
      return;
    }
    handleRegistration(data);
  };

  const handleRegistration = async (formData) => {
    if (!screenshot) {
      showNotify("INTEL MISSING: Please upload the payment screenshot.", "error");
      return;
    }

    setIsLoading(true);
    try {
      // Check if user is already registered for selected events
      const checkRes = await fetch(`${API_URL}/api/check-registration/${formData.email}`);
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
        const { max } = getTeamMetrics(eventName);
        const teammates = [];
        for (let i = 0; i < max; i++) {
          const tName = formData.teammates?.[eventName]?.[i]?.name;
          const tPhone = formData.teammates?.[eventName]?.[i]?.phone;
          if (tName) teammates.push({ name: tName, phone: tPhone });
        }
        return { eventName, teammates };
      });

      // Submit Registration using FormData
      const formDataToSend = new FormData();

      // We need to pass the registration data as a JSON string because Multer doesn't parse nested arrays easily
      const registrationData = {
        ...formData,
        registrations
      };

      formDataToSend.append('data', JSON.stringify(registrationData));
      formDataToSend.append('screenshot', screenshot);

      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const result = await response.json();
        setParticipantId(result.participantId);
        setIsSubmitted(true);
        gsap.fromTo(".success-overlay", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });

        // Auto-download ticket after 1 second
        setTimeout(() => {
          downloadTicket(result.participantId, formData.name, registrations, formData);
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

  const downloadTicket = (pid, userName, registrations, userDetails) => {
    const canvas = document.createElement('canvas');
    const scale = 2.0; // Increased scale for higher resolution

    // Dynamic height calculation with better spacing
    let baseHeight = 450;
    registrations.forEach(reg => {
      baseHeight += 80; // More space per event
      if (reg.teammates && reg.teammates.length > 0) {
        baseHeight += reg.teammates.length * 35;
      } else {
        baseHeight += 40;
      }
    });

    const width = 700;
    const height = Math.max(baseHeight, 650);
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');

    ctx.scale(scale, scale);

    // 1. Background & Base Layer
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Decorative gradients
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#111111');
    grad.addColorStop(0.5, '#0a0a0a');
    grad.addColorStop(1, '#151515');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle Grid Pattern
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 30) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
    }
    for (let i = 0; i < height; i += 30) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }

    // Border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(25, 25, width - 50, height - 50);

    // 2. Header Section
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'italic 900 52px Arial';
    ctx.fillText('A J ASTRIX 2026', 60, 100);

    ctx.font = 'bold 16px Arial';
    ctx.letterSpacing = '2px';
    ctx.fillText('OFFICIAL EXPEDITION ACCESS MANIFEST', 60, 130);
    ctx.letterSpacing = '0px';

    // 3. Participant Info
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px Arial';
    ctx.fillText(userName.toUpperCase(), 60, 200);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 18px Arial';
    ctx.fillText(userDetails.college.toUpperCase(), 60, 235);

    ctx.fillStyle = '#888888';
    ctx.font = 'bold 15px Arial';
    ctx.fillText(`${userDetails.category?.toUpperCase() || 'GENERAL'} STREAM`, 60, 260);

    // Divider Line
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(60, 290);
    ctx.lineTo(width - 60, 290);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Deployment Section
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 20px Arial';
    ctx.fillText('DEPLOYMENT MANIFEST', 60, 335);

    let yPos = 385;
    registrations.forEach((reg, idx) => {
      // Event Badge Background
      ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.roundRect ? ctx.roundRect(60, yPos - 30, width - 120, 45, 8) : ctx.fillRect(60, yPos - 30, width - 120, 45);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 22px Arial';
      ctx.fillText(`${idx + 1}. ${reg.eventName.toUpperCase()}`, 80, yPos);
      yPos += 55;

      if (reg.teammates && reg.teammates.length > 0) {
        reg.teammates.forEach((t, tIdx) => {
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = '#f59e0b';
          ctx.fillText('  ›', 85, yPos);

          ctx.fillStyle = '#bbbbbb';
          ctx.font = 'bold 16px Arial';
          const tText = `SQUAD MEMBER ${tIdx + 2}: ${t.name.toUpperCase()}`;
          ctx.fillText(tText, 115, yPos);

          if (t.phone) {
            ctx.font = '14px Arial';
            ctx.fillStyle = '#666666';
            ctx.fillText(` [PH: ${t.phone}]`, 115 + ctx.measureText(tText).width + 12, yPos);
          }
          yPos += 35;
        });
      } else {
        ctx.font = 'italic bold 15px Arial';
        ctx.fillStyle = '#555555';
        ctx.fillText('  › SOLO OPERATION PROTOCOL ACTIVE', 90, yPos);
        yPos += 35;
      }
      yPos += 25; // Gap between events
    });

    // 5. Footer Section (Pinned to bottom)
    const footerTop = height - 160;

    ctx.fillStyle = 'rgba(245, 158, 11, 0.05)';
    ctx.fillRect(25, footerTop, width - 50, 135);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(25, footerTop, width - 50, 135);

    // Left Side of Footer: Identifier
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f59e0b';
    ctx.font = '900 14px Arial';
    ctx.fillText('PARTICIPANT IDENTIFIER', 55, footerTop + 40);

    ctx.font = 'italic 900 64px Arial';
    ctx.fillText(pid, 55, footerTop + 105);

    // Right Side of Footer: Institutional Info
    ctx.textAlign = 'right';
    ctx.font = '900 12px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText('A J INSTITUTE OF ENGINEERING AND TECHNOLOGY', width - 55, footerTop + 35);
    ctx.fillText('PRESENT AT BASE CAMP FOR INTEL VERIFICATION', width - 55, footerTop + 55);

    ctx.fillStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('VALID FOR ASTRIX 2026 ONLY', width - 55, footerTop + 75);

    // Add a small "Generated on" timestamp at the very bottom
    ctx.fillStyle = '#333333';
    ctx.font = '8px Arial';
    ctx.fillText(`TRANS-LINK SECURED: ${new Date().toLocaleString()}`, width - 55, footerTop + 115);

    // Reset alignment for safety
    ctx.textAlign = 'left';

    const link = document.createElement('a');
    link.download = `AJ_ASTRIX_26_PASS_${pid}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-amber-500/30 pb-20">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,rgba(0,0,0,1)_70%)]" />
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Zap size={14} className="text-amber-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-amber-500">Expedition Protocol 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            <span className="text-white">Secure</span> <span className="text-amber-500">Access</span>
          </h1>
          <p className="text-sm font-bold text-white/40 tracking-[0.4em] uppercase">Initialize Mission Registration</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* MAIN FORM COLUMN */}
          <div ref={containerRef} className="w-full lg:w-[450px] shrink-0">
            <div className="border border-amber-500/20 rounded-3xl p-8 bg-zinc-900/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-20 bg-amber-500"></div>

              {isMaintenance ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <Shield size={64} className="text-amber-500 mb-6 animate-pulse" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-4">Expedition Halted</h2>
                  <p className="text-xs font-bold text-amber-500/80 tracking-widest uppercase leading-relaxed mb-10">
                    System maintenance in progress.
                  </p>
                  <button onClick={() => window.location.href = '/'} className="px-8 py-3 border border-amber-500/40 text-amber-500 text-[10px] font-black tracking-widest hover:bg-amber-500 hover:text-white transition-all uppercase rounded-lg">
                    Return to Base
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                  {step === 0 ? (
                    <>
                      {/* Step 0: Information */}
                      {/* Leader Branding */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                          <UserPlus size={24} className="text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase tracking-widest leading-none mb-1">Team Leader</h3>
                          <p className="text-[10px] font-bold text-amber-500 tracking-widest italic">Official Leader of the team</p>
                        </div>
                      </div>

                      {/* Honeypot */}
                      <input {...register("hp_field")} type="text" className="hidden" tabIndex="-1" autoComplete="off" />

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Identity Manifest (Full Name)</label>
                          <input
                            {...register("name", { required: "Name is required" })}
                            placeholder="ENTER FULL NAME"
                            className={`w-full bg-white/5 border rounded-xl py-4 px-5 text-sm font-bold tracking-widest focus:outline-none focus:bg-white/10 transition-all text-white placeholder:text-white/10 ${errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-amber-500/50'}`}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Comms (Email)</label>
                            <input
                              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                              type="email"
                              placeholder="EMAIL"
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-[11px] font-bold tracking-widest focus:border-amber-500/50 transition-all text-white placeholder:text-white/10"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Terminal (Phone)</label>
                            <input
                              {...register("phone", { required: true, pattern: /^[0-9]{10}$/ })}
                              placeholder="10-DIGIT"
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-[11px] font-bold tracking-widest focus:border-amber-500/50 transition-all text-white placeholder:text-white/10"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Base of Operations (College)</label>
                          <input
                            {...register("college", { required: true })}
                            placeholder="COLLEGE NAME"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 text-sm font-bold tracking-widest focus:border-amber-500/50 transition-all text-white placeholder:text-white/10"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Stream Selection</label>
                          <div className="grid grid-cols-2 gap-4">
                            <label className={`flex items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${watch("category") === 'Technical' ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}>
                              <input type="radio" value="Technical" {...register("category", { required: true })} className="hidden" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Technical</span>
                            </label>
                            <label className={`flex items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${watch("category") === 'Management' ? 'bg-amber-500/20 border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'}`}>
                              <input type="radio" value="Management" {...register("category", { required: true })} className="hidden" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Management</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Event Selection */}
                      <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-xs font-black text-amber-500 uppercase tracking-[0.2em]">Select Quests</label>
                          <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{selectedEvents.length} SELECTED</span>
                        </div>

                        <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                          {/* TECH */}
                          <div className="space-y-3">
                            <p className="text-[9px] font-black text-white/30 tracking-[0.3em] uppercase italic">// Technical</p>
                            <div className="grid grid-cols-1 gap-2">
                              {technicalEvents.map(e => (
                                <label key={e} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${selectedEvents.includes(e) ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'bg-white/5 border-white/5 text-white/30 hover:border-white/10'}`}>
                                  <input type="checkbox" value={e} {...register("events")} className="hidden" />
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedEvents.includes(e) ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                                    {selectedEvents.includes(e) && <CheckCircle size={12} className="text-black" />}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-wider truncate">{e}</span>
                                  <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 text-[8px] font-black border border-white/5">
                                    <Users size={10} /> {getTeamMetrics(e).max}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* MGMT */}
                          <div className="space-y-3">
                            <p className="text-[9px] font-black text-white/30 tracking-[0.3em] uppercase italic">// Management</p>
                            <div className="grid grid-cols-1 gap-2">
                              {managementEvents.map(e => (
                                <label key={e} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${selectedEvents.includes(e) ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'bg-white/5 border-white/5 text-white/30 hover:border-white/10'}`}>
                                  <input type="checkbox" value={e} {...register("events")} className="hidden" />
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedEvents.includes(e) ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                                    {selectedEvents.includes(e) && <CheckCircle size={12} className="text-black" />}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-wider truncate">{e}</span>
                                  <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 text-[8px] font-black border border-white/5">
                                    <Users size={10} /> {getTeamMetrics(e).max}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* CULTURAL */}
                          <div className="space-y-3">
                            <p className="text-[9px] font-black text-white/30 tracking-[0.3em] uppercase italic">// Cultural</p>
                            <div className="grid grid-cols-1 gap-2">
                              {culturalEvents.map(e => (
                                <label key={e} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${selectedEvents.includes(e) ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'bg-white/5 border-white/5 text-white/30 hover:border-white/10'}`}>
                                  <input type="checkbox" value={e} {...register("events")} className="hidden" />
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedEvents.includes(e) ? 'bg-amber-500 border-amber-500' : 'border-white/20'}`}>
                                    {selectedEvents.includes(e) && <CheckCircle size={12} className="text-black" />}
                                  </div>
                                  <span className="text-[10px] font-black uppercase tracking-wider truncate">{e}</span>
                                  <div className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 text-[8px] font-black border border-white/5">
                                    <Users size={10} /> {getTeamMetrics(e).max}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="w-full py-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black italic tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 shadow-xl shadow-amber-900/40">
                        <span>PROCEED TO PAYMENT</span>
                        <ArrowRight size={20} />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Step 1: Payment */}
                      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <button
                          type="button"
                          onClick={() => setStep(0)}
                          className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"
                        >
                          <ArrowRight size={14} className="rotate-180" /> BACK TO DETAILS
                        </button>

                        <div className="text-center p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Total Amount Due</p>
                          <p className="text-4xl font-black text-amber-500 italic">₹{totalFee}</p>
                        </div>

                        <div className="flex flex-col items-center gap-4 py-4">
                          <div className="p-4 bg-white rounded-2xl shadow-2xl">
                            {/* Dynamic UPI QR Code */}
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=prinsonroyal11@okaxis&pn=AJ%20ASTRIX&am=${totalFee}&cu=INR`}
                              alt="Payment QR"
                              className="w-48 h-48"
                            />
                          </div>
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] text-center max-w-[200px]">
                            Scan this QR with any UPI app (GPay, PhonePe, Paytm)
                          </p>
                        </div>

                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Upload Payment Screenshot</label>
                          <div className="relative group">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all ${screenshot ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 bg-white/5 group-hover:border-amber-500/30'}`}>
                              {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-white/20" />
                              ) : (
                                <Database size={32} className="text-white/20" />
                              )}
                              <div className="text-center">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                  {screenshot ? 'SCREENSHOT UPLOADED' : 'DROP SCREENSHOT HERE'}
                                </p>
                                <p className="text-[8px] font-bold text-white/20 uppercase mt-1">
                                  {screenshot ? screenshot.name : 'JPEG, PNG OR WEBP UP TO 5MB'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full py-5 rounded-2xl font-black italic tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 group relative overflow-hidden ${isLoading ? 'bg-zinc-800 text-white/20' : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-xl shadow-emerald-900/40'}`}
                        >
                          {isLoading ? <Database size={20} className="animate-spin" /> : <Shield size={20} />}
                          <span>{isLoading ? 'VERIFYING...' : 'CONFIRM PAYMENT'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* SQUAD CONFIG COLUMN (DYNAMIC POP UP) */}
          <div ref={squadRef} className="flex-1 w-full space-y-8">
            {selectedEvents.length === 0 ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-12 text-center opacity-50">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8">
                  <Users size={32} className="text-white/20" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-[0.3em] text-white/40 mb-4">Squad Matrix Empty</h3>
                <p className="text-[10px] font-bold tracking-widest uppercase max-w-xs leading-loose text-white/20">Select an event from the manifest to initialize squad synchronization protocols.</p>
              </div>
            ) : (
              <div className="space-y-12">
                {selectedEvents.map((eventName) => {
                  const { min, max } = getTeamMetrics(eventName);
                  return (
                    <div key={eventName} className="squad-card animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-6 mb-6">
                        <div className="px-4 py-1 bg-amber-500 text-black text-[9px] font-black tracking-widest uppercase rounded">Quest Intel</div>
                        <h3 className="text-sm font-black text-white tracking-[0.4em] uppercase truncate">{eventName}</h3>
                        <div className="h-px flex-1 bg-white/10"></div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-amber-500/60 uppercase tracking-widest">
                          <Users size={14} />
                          <span>{min === max ? `${max} Participants Required` : `${min}-${max} Participants Required`}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {/* All Slots are now editable */}
                        {[...Array(max)].map((_, i) => (
                          <div key={i} className="p-6 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 hover:border-amber-500/30 transition-all group relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-5">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 font-black text-xs group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-colors">
                                {i === 0 ? 'LDR' : String(i + 1).padStart(2, '0')}
                              </div>
                              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-amber-500/60">
                                {i === 0 ? 'Squad Leader' : 'Participant'} {i >= min && <span className="opacity-50 italic">(Optional)</span>}
                              </span>
                            </div>
                            <div className="space-y-3">
                              <input
                                {...register(`teammates.${eventName}.${i}.name`, { required: i < min })}
                                placeholder={i < min ? "FULL NAME (REQUIRED)" : "FULL NAME (OPTIONAL)"}
                                className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-[11px] font-bold tracking-widest focus:border-amber-500/50 focus:bg-white/10 transition-all text-white placeholder:text-white/10 ${errors.teammates?.[eventName]?.[i]?.name ? 'border-red-500/50' : 'border-white/5'}`}
                              />
                              <input
                                {...register(`teammates.${eventName}.${i}.phone`, { required: i < min, pattern: /^[0-9]{10}$/ })}
                                placeholder={i < min ? "PHONE (REQUIRED)" : "PHONE (OPTIONAL)"}
                                className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-[11px] font-bold tracking-widest focus:border-amber-500/50 focus:bg-white/10 transition-all text-white placeholder:text-white/10 ${errors.teammates?.[eventName]?.[i]?.phone ? 'border-red-500/50' : 'border-white/5'}`}
                              />
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

      {/* Decorative Elements */}
      <div className="fixed top-1/2 -right-40 w-96 h-96 bg-amber-500/10 blur-[150px] -z-10 rounded-full animate-pulse"></div>
      <div className="fixed bottom-0 -left-40 w-80 h-80 bg-amber-500/5 blur-[120px] -z-10 rounded-full"></div>

      {/* Success Overlay */}
      {isSubmitted && (
        <div className="success-overlay fixed inset-0 bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center z-[100]">
          <div className="w-32 h-32 bg-amber-500/20 rounded-full flex items-center justify-center mb-10 border border-amber-500/40 relative">
            <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping"></div>
            <CheckCircle size={64} className="text-amber-500 relative z-10" />
          </div>
          <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-6 text-white">Identity <span className="text-amber-500">Forge-Confirmed</span></h3>
          <p className="text-sm font-bold tracking-[0.2em] text-white/40 uppercase leading-relaxed mb-12 max-w-xl">
            Your credentials have been uploaded to the mainframe. Your digital pass is being generated.
          </p>

          {participantId && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-10 w-full max-w-md mb-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                <Database size={100} />
              </div>
              <p className="text-[11px] font-black text-amber-500/60 uppercase tracking-[0.4em] mb-4">Primary Identifier</p>
              <p className="text-5xl font-black text-amber-500 tracking-[0.3em] mb-4 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">{participantId}</p>
              <div className="h-px w-20 bg-amber-500/30 mx-auto mb-4"></div>
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Authorization Token Secured</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => window.location.href = '/'} className="px-12 py-4 bg-amber-500 text-black text-[11px] font-black tracking-[0.4em] rounded-xl hover:bg-amber-400 transition-all uppercase shadow-lg shadow-amber-900/40">Return to Nexus</button>
            <button onClick={() => window.location.reload()} className="px-12 py-4 border border-white/10 text-white text-[11px] font-black tracking-[0.4em] rounded-xl hover:bg-white/5 transition-all uppercase">New Intel Entry</button>
          </div>
        </div>
      )}

      {/* Animated Embers */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div key={i} ref={el => embersRef.current[i] = el} className="absolute w-1 h-1 bg-amber-500/40 rounded-full blur-[1px]" />
        ))}
      </div>
    </div>
  );
};

export default Register;
