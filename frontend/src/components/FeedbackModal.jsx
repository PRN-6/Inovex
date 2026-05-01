import React, { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Activity, Shield, Terminal } from 'lucide-react';
import { gsap } from 'gsap';

const FeedbackModal = ({ isOpen, onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL || "https://inovex-backend01.onrender.com";
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'feedback',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      gsap.fromTo(".feedback-modal-overlay", { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(".feedback-modal-content", 
        { scale: 0.9, opacity: 0, y: 20 }, 
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setFormData({ name: '', email: '', type: 'feedback', message: '' });
        }, 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="feedback-modal-content relative w-full max-w-lg bg-[#0a0a0a] border border-red-900/30 rounded-none overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)]">
        
        {/* Scanning Line Effect */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-red-600/50 shadow-[0_0_10px_rgba(220,38,38,0.5)] z-20 animate-[scan_3s_linear_infinite]"></div>

        {/* Header */}
        <div className="relative p-6 border-b border-red-900/30 bg-gradient-to-r from-red-950/20 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/10 rounded-sm">
                <Terminal size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">Transmission</h2>
                <div className="flex items-center gap-2 text-[10px] font-bold text-red-500/50 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                  Encrypted Feedback Channel
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-600/10 text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <Shield size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black italic uppercase mb-2">Transmission Received</h3>
              <p className="text-gray-500 text-sm font-medium tracking-wide">Your data has been logged into the INOVEX core system.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">Personnel Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="ENTER NAME"
                    className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm focus:outline-none focus:border-red-600/50 transition-colors placeholder:text-zinc-700 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">Comms ID</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="EMAIL ADDRESS"
                    className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm focus:outline-none focus:border-red-600/50 transition-colors placeholder:text-zinc-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">Message Type</label>
                <select 
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

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/70">Data Input</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="TYPE YOUR MESSAGE HERE..."
                  className="w-full bg-zinc-900/50 border border-white/5 p-3 text-sm focus:outline-none focus:border-red-600/50 transition-colors placeholder:text-zinc-700 font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
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

        {/* Footer info */}
        <div className="p-4 bg-zinc-950/50 border-t border-white/5 flex items-center justify-between text-[8px] font-black tracking-[0.3em] text-zinc-600 uppercase">
          <span>Protocol: INOVEX-2026-BETA</span>
          <span>Security: End-to-End Encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
