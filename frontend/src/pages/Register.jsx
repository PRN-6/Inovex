import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { gsap } from 'gsap';
import { User, Mail, School, Phone, ChevronRight, ShieldCheck, Database, Flame, Hash, GraduationCap, BookOpen, Shield, CreditCard, CheckCircle } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Event Pricing & Squad Sizes
  const eventPrices = {
    "Techsaurus": 200,
    "Spy vs Spy": 300,
    "Rex Rampage": 150,
    "Cinesaur": 150,
    "Dinox": 200,
    "RexHack": 500,
    "Battle Nexus": 400,
    "Genesis Reborn": 250
  };

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

  const calculateTotal = () => {
    return selectedEvents.reduce((total, event) => total + (eventPrices[event] || 0), 0);
  };

  const getTeamSize = (eventName) => eventTeamSizes[eventName] || 1;

  const formRef = useRef(null);
  const containerRef = useRef(null);
  const embersRef = useRef([]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    window.scrollTo(0, 0);

    // Entrance animation
    const tl = gsap.timeline();
    tl.fromTo(containerRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });

    // Embers
    embersRef.current.forEach((ember) => {
      if (ember) {
        gsap.set(ember, { x: Math.random() * window.innerWidth, y: window.innerHeight + 50, opacity: 0 });
        gsap.to(ember, { y: -100, x: `+=${Math.random() * 200 - 100}`, opacity: [0, 0.8, 0], duration: Math.random() * 5 + 5, repeat: -1, delay: Math.random() * 10, ease: "none" });
      }
    });
  }, []);

  const handlePayment = async (formData) => {
    setIsLoading(true);
    const amount = calculateTotal();

    try {
      // 1. Create Order on Backend
      const orderRes = await fetch('https://inovex-backend01.onrender.com/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      const { order } = await orderRes.json();

      // 2. Open Razorpay Checkout
      const options = {
        key: "rzp_test_placeholder", // Replace with your actual Key ID
        amount: order.amount,
        currency: order.currency,
        name: "INOVEX 2026",
        description: `Registration for ${selectedEvents.length} Quests`,
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify Payment & Register
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
            amount,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          };

          const regRes = await fetch('https://inovex-backend01.onrender.com/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalPayload)
          });

          if (regRes.ok) {
            setIsSubmitted(true);
            gsap.fromTo(".success-overlay", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" });
          } else {
            alert("Payment verified but registration failed. Contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: { color: "#b45309" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment Initiation Error:", error);
      alert("Could not connect to payment gateway.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(180,83,9,0.05)_0%,rgba(0,0,0,1)_70%)]" />

      <div className="relative z-10 w-full min-h-screen px-6 md:px-20 lg:px-40 lg:pl-56 pt-28 pb-20 overflow-y-auto">
        <div className="w-full flex flex-col lg:flex-row gap-12 items-center lg:items-start transition-all duration-700">

          {/* STICKY MAIN FORM */}
          <div ref={containerRef} className="w-full max-w-md lg:sticky lg:top-28 lg:z-30 border border-amber-900/20 rounded-3xl p-8 bg-zinc-900/30 backdrop-blur-xl">
            <h2 className="text-2xl font-black text-amber-500 uppercase tracking-[0.4em] mb-10 text-center">Identity</h2>

            <form ref={formRef} onSubmit={handleSubmit(handlePayment)} className="space-y-5">
              <div className="form-field space-y-1 group">
                <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1">FULL NAME</label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/30" />
                  <input {...register("name", { required: true })} placeholder="E.G. DRAKE FIREBORN" className="w-full bg-black/60 border border-amber-900/20 rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100" />
                </div>
              </div>

              <div className="form-field space-y-1 group">
                <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1">EMAIL SCROLL</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/30" />
                  <input {...register("email", { required: true })} type="email" placeholder="HERO@LEGENDS.COM" className="w-full bg-black/60 border border-amber-900/20 rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100" />
                </div>
              </div>

              <div className="form-field space-y-1 group">
                <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1">SIGNAL / PHONE</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/30" />
                  <input {...register("phone", { required: true })} placeholder="10-DIGIT NUMBER" className="w-full bg-black/60 border border-amber-900/20 rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100" />
                </div>
              </div>

              <div className="form-field space-y-1 group">
                <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1">GUILD / COLLEGE</label>
                <div className="relative">
                  <School size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/30" />
                  <input {...register("college", { required: true })} placeholder="INSTITUTION NAME" className="w-full bg-black/60 border border-amber-900/20 rounded-lg py-2.5 pl-10 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-field space-y-1 group">
                  <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1">USN</label>
                  <input {...register("usn", { required: true })} placeholder="USN" className="w-full bg-black/60 border border-amber-900/20 rounded-lg py-2.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100" />
                </div>
                <div className="form-field space-y-1 group">
                  <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1">YEAR</label>
                  <select {...register("year", { required: true })} className="w-full bg-black/60 border border-amber-900/20 rounded-lg py-2.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100">
                    <option value="">YEAR</option>
                    <option value="1">1ST</option><option value="2">2ND</option><option value="3">3RD</option>
                  </select>
                </div>
              </div>

              <div className="form-field space-y-1 group">
                <label className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.2em] ml-1">DEPARTMENT</label>
                <input {...register("department", { required: true })} placeholder="E.G. CSE" className="w-full bg-black/60 border border-amber-900/20 rounded-lg py-2.5 px-4 text-xs font-bold tracking-widest focus:outline-none focus:border-amber-600 transition-all text-amber-100" />
              </div>

              <div className="form-field space-y-4 pt-4 border-t border-amber-900/10">
                <label className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em] ml-1">Select Your Quests</label>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.keys(eventPrices).map((eventName) => (
                    <label key={eventName} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedEvents.includes(eventName) ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-black/40 border-amber-900/10 text-white/40 hover:border-amber-500/20'}`}>
                      <input type="checkbox" value={eventName} {...register("events", { required: "Select one" })} className="hidden" />
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${selectedEvents.includes(eventName) ? 'bg-amber-500 border-amber-500' : 'border-amber-900/30'}`}>
                        {selectedEvents.includes(eventName) && <Database size={10} className="text-black" />}
                      </div>
                      <span className="text-[8px] font-black uppercase truncate tracking-tighter">{eventName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-amber-900/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">Total Tribute</span>
                  <span className="text-xl font-black text-amber-500 tracking-tighter">₹{calculateTotal()}</span>
                </div>
                <button type="submit" disabled={isLoading} className={`w-full ${isLoading ? 'bg-amber-900 cursor-not-allowed' : 'bg-amber-700 hover:bg-amber-600'} text-white font-black italic tracking-[0.3em] uppercase py-4 rounded-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-white/10 skew-x-[-45deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  {isLoading ? <Database size={18} className="animate-pulse" /> : <Flame size={18} />}
                  <span>{isLoading ? 'INITIATING...' : 'PAY & REGISTER'}</span>
                </button>
              </div>
            </form>

            {isSubmitted && (
              <div className="success-overlay absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-8 text-center z-50 rounded-xl">
                <CheckCircle size={64} className="text-amber-500 mb-4" />
                <h3 className="text-2xl font-black italic tracking-tight uppercase mb-2 text-amber-500">QUEST FORGED</h3>
                <p className="text-[10px] font-bold tracking-widest text-amber-200/40 uppercase">Identity and Payment confirmed.<br />Welcome to the expedition.</p>
              </div>
            )}
          </div>

          {/* SQUAD PANEL */}
          <div className="flex-1 w-full max-w-3xl space-y-12">
            {selectedEvents.filter(e => getTeamSize(e) > 1).length === 0 && (
              <div className="hidden lg:flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-amber-900/10 rounded-3xl p-12 text-center opacity-30">
                <Shield size={64} className="text-amber-500 mb-6" />
                <h3 className="text-xl font-black uppercase tracking-[0.4em] text-amber-500">Squad Intelligence</h3>
                <p className="text-[10px] font-bold tracking-widest uppercase mt-4 max-w-xs text-amber-200/50">Select team-based quests to unlock squad formation protocols.</p>
              </div>
            )}

            {selectedEvents.map((eventName) => {
              const teamSize = getTeamSize(eventName);
              if (teamSize <= 1) return null;
              return (
                <div key={eventName} className="animate-in fade-in slide-in-from-right-12 duration-1000 ease-out">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="h-px w-12 bg-amber-500/30"></div>
                    <h3 className="text-base font-black text-amber-500 tracking-[0.5em] uppercase">{eventName} <span className="text-[10px] text-amber-500/40 ml-2">SQUAD</span></h3>
                    <div className="h-px flex-1 bg-amber-500/30"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(teamSize - 1)].map((_, i) => (
                      <div key={i} className="p-8 rounded-3xl bg-zinc-900/30 backdrop-blur-xl border border-amber-900/10 hover:border-amber-500/30 transition-all group">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 font-black text-xs">{i + 2}</div>
                            <span className="text-[11px] font-black text-amber-500/60 uppercase tracking-[0.3em]">Partner</span>
                          </div>
                          <User size={14} className="text-amber-500/20" />
                        </div>
                        <div className="space-y-4">
                          <input {...register(`teammates.${eventName}.${i}.name`, { required: true })} placeholder="NAME" className="w-full bg-black/40 border border-amber-900/10 rounded-xl py-3 px-5 text-[11px] font-bold tracking-widest focus:border-amber-600 transition-all text-amber-100" />
                          <input {...register(`teammates.${eventName}.${i}.usn`, { required: true })} placeholder="USN" className="w-full bg-black/40 border border-amber-900/10 rounded-xl py-3 px-5 text-[11px] font-bold tracking-widest focus:border-amber-600 transition-all text-amber-100" />
                          <input {...register(`teammates.${eventName}.${i}.email`, { required: true })} placeholder="EMAIL" className="w-full bg-black/40 border border-amber-900/10 rounded-xl py-3 px-5 text-[11px] font-bold tracking-widest focus:border-amber-600 transition-all text-amber-100" />
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

      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div key={i} ref={el => embersRef.current[i] = el} className="absolute w-1 h-1 bg-amber-500 rounded-full blur-[1px]" />
        ))}
      </div>
    </div>
  );
};

export default Register;
