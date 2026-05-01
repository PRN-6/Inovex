import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  Phone, Mail, MapPin, Send, Activity, Shield,
  Terminal, Radio, AlertTriangle, ExternalLink, AtSign, Link2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://inovex-backend01.onrender.com';

const contactCards = [
  {
    icon: Mail,
    label: 'Comms Channel',
    value: 'inovex@ajiet.edu.in',
    sub: 'General Inquiries',
    color: 'text-red-500',
    bg: 'bg-red-600/10',
    border: 'hover:border-red-600/40',
    href: 'mailto:inovex@ajiet.edu.in',
  },
  {
    icon: Phone,
    label: 'Direct Line',
    value: '+91 00000 00000',
    sub: 'Mon–Sat, 9 AM – 6 PM',
    color: 'text-jurassic-yellow',
    bg: 'bg-jurassic-yellow/10',
    border: 'hover:border-jurassic-yellow/40',
    href: 'tel:+910000000000',
  },
  {
    icon: MapPin,
    label: 'Sector Origin',
    value: 'AJ Institute of Engg & Tech',
    sub: 'Mangalore, Karnataka – 575006',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'hover:border-green-500/40',
    href: 'https://maps.google.com/?q=AJ+Institute+of+Engineering+and+Technology+Mangalore',
  },
];

const socialLinks = [
  { icon: AtSign,    label: 'Instagram', handle: '@inovex_ajiet',  href: 'https://instagram.com/', color: 'hover:text-pink-500' },
  { icon: Link2,     label: 'LinkedIn',  handle: 'INOVEX AJIET',   href: 'https://linkedin.com/', color: 'hover:text-blue-400' },
  { icon: ExternalLink, label: 'Website', handle: 'ajiet.edu.in', href: 'https://ajiet.edu.in',  color: 'hover:text-jurassic-yellow' },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', type: 'feedback', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo(headerRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo(
      cardsRef.current.filter(Boolean),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo(formRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.4 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', type: 'feedback', message: '' });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (error) {
      console.error("Transmission error:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 overflow-hidden relative md:pl-16">

      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/scanlines.png')] mix-blend-overlay opacity-20" />

      {/* BG watermark text */}
      <div className="absolute top-32 -right-10 text-[16vw] font-black italic opacity-[0.02] pointer-events-none select-none leading-none z-0">
        CONTACT
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div ref={headerRef} className="mb-16 border-l-4 border-jurassic-yellow pl-6">
          <div className="flex items-center gap-3 text-jurassic-yellow mb-2">
            <Radio size={16} className="animate-pulse" />
            <span className="text-xs font-black tracking-[0.4em] uppercase">Open Transmission</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            Contact <span className="text-red-600">Us</span>
          </h1>
          <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
            Secure Channel Active · Response within 24 Hours
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {contactCards.map((card, i) => (
            <a
              key={i}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              ref={(el) => (cardsRef.current[i] = el)}
              className={`group flex items-start gap-5 p-6 bg-[#0a0a0a] border border-white/10 ${card.border} transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`p-3 rounded-sm ${card.bg} shrink-0`}>
                <card.icon size={22} className={card.color} />
              </div>
              <div>
                <p className="text-xs font-black tracking-[0.3em] uppercase text-white/30 mb-1">{card.label}</p>
                <p className="font-bold text-white text-sm leading-snug mb-0.5">{card.value}</p>
                <p className="text-xs text-white/40">{card.sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Main Grid: Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Contact Form */}
          <div ref={formRef} className="lg:col-span-2">
            <div className="bg-[#0a0a0a] border border-white/10 relative overflow-hidden">

              {/* Scanning line */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/40 shadow-[0_0_10px_rgba(220,38,38,0.4)] z-10 animate-[scan_4s_linear_infinite]" />

              {/* Form Header */}
              <div className="flex items-center gap-3 p-6 border-b border-white/10 bg-gradient-to-r from-red-950/20 to-transparent">
                <div className="p-2 bg-red-600/10 rounded-sm">
                  <Terminal size={18} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-lg font-black italic uppercase tracking-wide">Send Transmission</h2>
                  <p className="text-[10px] font-bold text-red-500/50 tracking-[0.3em] uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block" />
                    Encrypted · End-to-End
                  </p>
                </div>
              </div>

              {/* Form Body */}
              <div className="p-8">
                {status === 'success' ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                      <Shield size={40} className="text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase mb-2">Transmission Received</h3>
                    <p className="text-white/40 text-sm">Your message has been logged. We'll respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">
                          Personnel Name *
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="YOUR NAME"
                          className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm focus:outline-none focus:border-red-600/50 transition-colors placeholder:text-zinc-700 font-medium"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">
                          Comms ID (Email) *
                        </label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="YOUR EMAIL"
                          className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm focus:outline-none focus:border-red-600/50 transition-colors placeholder:text-zinc-700 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">
                        Message Type *
                      </label>
                      <select 
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm focus:outline-none focus:border-red-600/50 transition-colors font-medium appearance-none"
                      >
                        <option value="feedback">GENERAL FEEDBACK</option>
                        <option value="bug">SYSTEM GLITCH / BUG</option>
                        <option value="idea">INNOVATION IDEA</option>
                        <option value="other">OTHER ENQUIRY</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">
                        Message *
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="TYPE YOUR MESSAGE HERE..."
                        className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm focus:outline-none focus:border-red-600/50 transition-colors placeholder:text-zinc-700 font-medium resize-none"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 p-3 border border-red-800/50 bg-red-950/20 text-red-400 text-xs font-bold tracking-wider">
                        <AlertTriangle size={14} />
                        Transmission failed. Please try again or reach us directly via email.
                      </div>
                    )}

                    <button
                      type="submit"
                      id="contact-submit-btn"
                      disabled={status === 'sending'}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-4 flex items-center justify-center gap-3 font-black italic uppercase tracking-widest transition-all disabled:opacity-50 group"
                    >
                      {status === 'sending' ? (
                        <>
                          <Activity size={18} className="animate-spin" />
                          ENCRYPTING...
                        </>
                      ) : (
                        <>
                          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          SEND TRANSMISSION
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Footer bar */}
              <div className="px-6 py-3 bg-zinc-950/50 border-t border-white/5 flex items-center justify-between text-[8px] font-black tracking-[0.3em] text-zinc-600 uppercase">
                <span>Protocol: INOVEX-2026</span>
                <span>Security: End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* Right: Sidebar Info */}
          <div className="space-y-6">

            {/* Social Links */}
            <div className="bg-[#0a0a0a] border border-white/10 p-6">
              <h3 className="text-xs font-black tracking-[0.4em] uppercase text-white/40 mb-5 flex items-center justify-between">
                <span>Network Links</span>
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </h3>
              <div className="space-y-3">
                {socialLinks.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-4 p-3 border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all group ${s.color}`}
                  >
                    <s.icon size={18} className="transition-colors shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-wider">{s.label}</p>
                      <p className="text-sm font-semibold text-white">{s.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-red-900/10 border border-red-900/30 p-6">
              <h3 className="text-xs font-black tracking-[0.4em] uppercase text-red-500/70 mb-5">
                Operations Window
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
                  { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
                  { day: 'Sunday', hours: 'OFFLINE' },
                ].map((row, i) => (
                  <li key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-white/40 text-xs">{row.day}</span>
                    <span className={`font-bold text-xs ${row.hours === 'OFFLINE' ? 'text-red-500' : 'text-white'}`}>
                      {row.hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Caution Banner */}
            <div className="border border-jurassic-yellow/30 bg-black overflow-hidden relative p-6 text-center">
              <div className="absolute top-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,#ca8a04_8px,#ca8a04_16px)] opacity-50" />
              <div className="absolute bottom-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,#ca8a04_8px,#ca8a04_16px)] opacity-50" />
              <p className="text-jurassic-yellow font-black text-xs uppercase tracking-widest pt-2">
                For urgent matters during the event, contact coordinators listed on each event's detail page.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
