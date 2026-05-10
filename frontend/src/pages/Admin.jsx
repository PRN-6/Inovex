import React, { useState, useEffect, useMemo } from 'react';
import { Database, ShieldCheck, Download, Trash2, Search, ExternalLink, Filter, TrendingUp, Users, CreditCard, Terminal, Lock, ChevronRight, Activity, FileSpreadsheet, FileText, Calendar, X, CheckCircle, Info, User, Mail, Phone, GraduationCap, Building2, Ticket, Copy, Printer, Flame, Image, MessageSquare, Power, Send, RotateCcw } from 'lucide-react';
import { technicalEventsData } from '../data/technicalEventsData';
import { managementEventsData } from '../data/managementEventsData';
import { culturalEventsData } from '../data/culturalEventsData';
import { gsap } from 'gsap';

// Create a consolidated fee lookup mapping
const ALL_EVENTS = {
  ...technicalEventsData,
  ...managementEventsData,
  ...culturalEventsData
};

const EVENT_FEE_MAP = Object.values(ALL_EVENTS).reduce((acc, ev) => {
  if (ev && ev.title) {
    // Extract number from "₹300" string
    const feeStr = ev.entryFee || "₹0";
    const fee = parseInt(feeStr.replace(/[^\d]/g, ''), 10) || 0;
    acc[ev.title.toUpperCase()] = fee;
  }
  return acc;
}, {});

const calculateTotalFee = (regs) => {
  if (!regs || !Array.isArray(regs)) return 0;
  return regs.reduce((sum, ev) => {
    const eventName = ev.eventName?.toUpperCase();
    return sum + (EVENT_FEE_MAP[eventName] || 0);
  }, 0);
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState(0); // 0: None, 0.5: Event Head, 1: Admin, 2: Super Admin
  const [restrictedEvent, setRestrictedEvent] = useState(null);
  const [selectedReg, setSelectedReg] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);
  const [activeTab, setActiveTab] = useState('registrations');
  const [feedback, setFeedback] = useState([]);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error'|'info', message: string }
  const [confirmingIds, setConfirmingIds] = useState(new Set()); // track in-progress confirm requests

  // Registration Fee configuration
  const FEE_PER_EVENT = 100; // Change this value to match your actual per-event fee

  const API_URL = import.meta.env.VITE_API_URL || 'https://inovex-backend01.onrender.com';

  const CalendarPicker = ({ value, onChange, onClear }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = React.useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (calendarRef.current && !calendarRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handleDateClick = (day) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      // Adjust for timezone to ensure YYYY-MM-DD format
      const offset = date.getTimezoneOffset();
      const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
      onChange(adjustedDate.toISOString().split('T')[0]);
      setIsOpen(false);
    };

    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

    const days = [];
    const totalDays = daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const startOffset = firstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

    return (
      <div className="relative calendar-picker" ref={calendarRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 bg-white/5 text-[10px] font-black border rounded-full px-4 py-2 transition-all 
            ${isOpen ? 'border-red-600 text-white' : 'border-white/10 text-white/50 hover:border-white/20'}`}
        >
          <Calendar size={14} className={value ? 'text-red-600' : ''} />
          <span>{value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'FILTER BY DATE'}</span>
          <ChevronRight size={12} className={`transition-transform ml-1 ${isOpen ? 'rotate-90' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-4 w-72 bg-black/95 border border-white/10 p-6 z-[100] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex justify-between items-center mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight className="rotate-180" size={16} /></button>
              <div className="text-center">
                <p className="text-[10px] font-black tracking-[0.3em] text-white">{monthNames[currentMonth.getMonth()]}</p>
                <p className="text-[8px] font-black text-white/20 tracking-widest mt-1">{currentMonth.getFullYear()}</p>
              </div>
              <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={16} /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <span key={d} className="text-[8px] font-black text-white/10">{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((day, i) => {
                const isSelected = value && day && new Date(value).getDate() === day &&
                  new Date(value).getMonth() === currentMonth.getMonth() &&
                  new Date(value).getFullYear() === currentMonth.getFullYear();

                return (
                  <button
                    key={i}
                    onClick={() => day && handleDateClick(day)}
                    disabled={!day}
                    className={`aspect-square text-[9px] font-black flex items-center justify-center rounded-sm transition-all
                      ${!day ? 'opacity-0 cursor-default' : 'hover:bg-red-600 hover:text-white'}
                      ${isSelected ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(223,31,38,0.3)]' : 'text-white/40'}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {value && (
              <button
                onClick={() => { onClear(); setIsOpen(false); }}
                className="w-full mt-6 py-3 border-t border-white/5 text-[8px] font-black text-red-600 hover:text-red-500 transition-colors tracking-[0.4em] uppercase"
              >
                RESET TEMPORAL FILTER
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const RegistrationDetailModal = ({ reg, onClose }) => {
    if (!reg) return null;

    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text);
      alert("INTEL COPIED TO CLIPBOARD");
    };

    return (
      <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
        {/* Cinematic Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(223,31,38,0.05)_0%,rgba(0,0,0,1)_100%)]"></div>
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_20px_rgba(223,31,38,0.5)]"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Immersive Background Texture */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full"></div>

          <div className="relative z-10 flex flex-col flex-1">
            {/* Modal Header */}
            {/* Top Navigation Bar */}
            <div className="p-6 md:px-12 border-b border-white/5 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-6">
                <button
                  onClick={onClose}
                  className="group flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-red-600/10 border border-white/10 hover:border-red-600/30 rounded-xl transition-all"
                >
                  <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase">Return to Terminal</span>
                </button>
                <div className="hidden md:block h-8 w-[1px] bg-white/10"></div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black italic text-white tracking-tight leading-none">{reg.name?.toUpperCase()}</h3>
                    <p className="text-[9px] font-black text-red-600/60 tracking-[0.3em] uppercase mt-1">ASSET_ID: {reg.participantId || 'PENDING'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => resendEmail(reg._id)} className="p-3 bg-white/5 hover:bg-amber-600/10 border border-white/10 hover:border-amber-600/30 rounded-xl text-amber-500 transition-all" title="RESEND ENCRYPTED CONFIRMATION"><Mail size={18} /></button>
                <button onClick={() => window.print()} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all" title="GENERATE HARDCOPY"><Printer size={18} /></button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
              <div className="grid lg:grid-cols-12 gap-12">
                {/* Left Column: Identity & Contact */}
                <div className="lg:col-span-4 space-y-10">
                  <section className="animate-in slide-in-from-left duration-500">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-600/10 rounded-lg"><User size={16} className="text-red-600" /></div>
                      <h4 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Representative Intel</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-red-600/30 transition-all shadow-xl">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-2">Internal USN / ID</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-red-600 tracking-widest">{reg.usn || 'NOT_PROVIDED'}</span>
                          <button onClick={() => copyToClipboard(reg.usn)} className="p-2 hover:bg-white/5 rounded-lg transition-all opacity-40 hover:opacity-100"><Copy size={14} className="text-white" /></button>
                        </div>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 shadow-xl">
                        <div>
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-3">Communication Matrix</p>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-black/40 rounded-2xl border border-white/5 group hover:border-red-600/20 transition-all">
                              <div className="flex items-center gap-3">
                                <Mail size={14} className="text-red-600/40" />
                                <span className="text-sm font-bold text-white/90">{reg.email}</span>
                              </div>
                              <button onClick={() => copyToClipboard(reg.email)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} className="text-white/40" /></button>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-black/40 rounded-2xl border border-white/5 group hover:border-amber-600/20 transition-all">
                              <div className="flex items-center gap-3">
                                <Phone size={14} className="text-amber-500/40" />
                                <span className="text-sm font-bold text-amber-500">{reg.phone}</span>
                              </div>
                              <button onClick={() => copyToClipboard(reg.phone)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} className="text-white/40" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="animate-in slide-in-from-left duration-500 delay-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-red-600/10 rounded-lg"><Building2 size={16} className="text-red-600" /></div>
                      <h4 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Institutional Roots</h4>
                    </div>
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-8 shadow-xl">
                      <div className="space-y-2">
                        <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Origin (College)</p>
                        <p className="text-lg font-black text-white italic tracking-tight leading-tight">{reg.college?.toUpperCase()}</p>
                      </div>
                      <div className="pt-6 border-t border-white/5">
                        <div className="space-y-2">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Intel Sector / Category</p>
                          <p className="text-lg font-black text-red-600">{reg.category?.toUpperCase() || (reg.year ? `YEAR ${reg.year} // ${reg.department}` : 'GENERAL')}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Quests & Squads */}
                <div className="lg:col-span-8 space-y-10">
                  <section className="animate-in slide-in-from-right duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-600/10 rounded-lg"><Ticket size={16} className="text-red-600" /></div>
                        <h4 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Mission Manifest</h4>
                      </div>
                      <span className="text-[9px] font-black px-3 py-1 bg-red-600 text-white rounded-full">{reg.registrations?.length || 0} ACTIVE QUESTS</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {reg.registrations?.map((ev, i) => (
                        <div key={i} className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl relative overflow-hidden group hover:border-red-600/30 transition-all shadow-2xl">
                          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all group-hover:scale-110">
                            <Flame size={80} className="text-red-600" />
                          </div>
                          <h5 className="text-lg font-black text-white mb-6 italic tracking-tight leading-none group-hover:text-red-500 transition-colors">{ev.eventName?.toUpperCase()}</h5>

                          <div className="space-y-4">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Squad Composition</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-red-600/5 rounded-2xl border border-red-600/10">
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-red-600"></div>
                                  <span className="text-xs font-black text-white/90">LEADER: {reg.name}</span>
                                </div>
                              </div>
                              {ev.teammates?.map((t, ti) => (
                                <div key={ti} className="flex flex-col p-4 bg-black/40 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                                  <div className="flex justify-between items-center">
                                    <p className="text-[11px] font-black text-white/70 flex items-center gap-2">
                                      <span className="text-red-600/40 text-[9px]">SQUAD_0{ti + 1}:</span> {t.name?.toUpperCase()}
                                    </p>
                                    {t.phone && <Phone size={10} className="text-white/20" />}
                                  </div>
                                  <div className="flex gap-4 mt-2">
                                    {t.phone && <p className="text-[8px] font-bold text-white/30 tracking-widest">{t.phone}</p>}
                                    {t.usn && <p className="text-[8px] font-bold text-red-900/40 tracking-widest">{t.usn}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="animate-in slide-in-from-right duration-500 delay-100">
                    <div className="p-8 bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center">
                          <CreditCard size={32} className="text-amber-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase mb-2">Clearance Status</p>
                          <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${reg.paymentStatus === 'Paid' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${reg.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                            <span className="text-[10px] font-black tracking-widest uppercase">{reg.paymentStatus === 'Paid' ? 'AUTHORIZED' : 'PENDING_VERIFICATION'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase mb-2">Total Allocation</p>
                        <p className="text-5xl font-black text-emerald-400 tracking-tighter italic">
                          ₹{calculateTotalFee(reg.registrations)}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Payment Evidence Section */}
                  {reg.screenshotUrl && (
                    <section className="animate-in slide-in-from-right duration-500 delay-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-600/10 rounded-lg"><Image size={16} className="text-emerald-600" /></div>
                        <h4 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Evidence Verification</h4>
                      </div>
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 shadow-xl relative overflow-hidden group">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                          <img
                            src={reg.screenshotUrl}
                            alt="Payment Evidence"
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                            <a
                              href={reg.screenshotUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black text-[10px] font-black tracking-widest rounded-xl hover:bg-emerald-400 transition-colors uppercase"
                            >
                              Open Full Intelligence <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">
                            // SECURE_LINK_ACTIVE: Payment Receipt Hash verified
                          </p>
                          {reg.paymentStatus !== 'Paid' && (
                            <button
                              onClick={() => handleStatusUpdate(reg._id, 'Paid')}
                              className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white text-[10px] font-black tracking-widest rounded-xl transition-all uppercase"
                            >
                              Approve Payment
                            </button>
                          )}
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer: Controls */}
            <div className="p-12 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-[8px] font-black text-white/20 tracking-widest uppercase mb-2">Registry Timestamp</p>
                  <p className="text-xs font-black text-white/60 tracking-widest">{new Date(reg.registrationDate).toLocaleString()}</p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p className="text-[8px] font-bold text-white/10 tracking-[0.5em] mb-2 uppercase">Core Database Reference</p>
                <p className="text-[10px] font-black text-red-600/40 tracking-tighter italic">{reg._id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    // Immediate Session Recovery
    const savedKey = localStorage.getItem('inovex_admin_key');
    if (savedKey) {
      setAccessCode(savedKey); // Sync state immediately
      verifySession(savedKey);
    } else {
      setIsVerifyingSession(false);
    }
  }, []);

  const verifySession = async (key) => {
    if (!key) {
      setIsVerifyingSession(false);
      return;
    }

    setIsLoading(true);
    try {
      // Direct call with key to bypass state delay
      const success = await fetchRegistrations(key);
      if (success) {
        setIsAuthenticated(true);
      } else {
        // Only remove if explicitly unauthorized (401), not on network errors
        // localStorage.removeItem('inovex_admin_key'); 
      }
    } catch (err) {
      console.error("Session Verification Failed:", err);
    } finally {
      setIsVerifyingSession(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const fetchRegistrations = async (forcedKey = null) => {
    const keyToUse = forcedKey || accessCode;
    if (!keyToUse) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/registrations`, {
        headers: {
          'x-admin-key': keyToUse
        }
      });
      const data = await response.json();
      if (data && data.success && Array.isArray(data.data)) {
        setRegistrations(data.data);

        // Update role info based on backend response
        if (data.role) {
          setClearanceLevel(data.role.clearance);
          setRestrictedEvent(data.role.restrictedEvent);
          if (data.role.restrictedEvent) {
            setFilterEvent(data.role.restrictedEvent);
          }
        }

        return true; // Success
      } else {
        setRegistrations([]);
        if (response.status === 401) {
          setIsAuthenticated(false);
          alert("ACCESS DENIED: INVALID OR EXPIRED CLEARANCE KEY");
        }
        return false;
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setRegistrations([]);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedback = async () => {
    if (!accessCode) return;
    setIsFeedbackLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        headers: { 'x-admin-key': accessCode }
      });
      const data = await response.json();
      if (data.success) {
        setFeedback(data.data);
      }
    } catch (error) {
      console.error("Feedback Fetch Error:", error);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'feedback') {
      fetchFeedback();
    }
  }, [activeTab, isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!accessCode) return;

    const success = await fetchRegistrations(accessCode);
    if (success) {
      localStorage.setItem('inovex_admin_key', accessCode);
      setIsAuthenticated(true);
    } else {
      alert("INVALID ACCESS KEY: TERMINAL CONNECTION REFUSED");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('inovex_admin_key');
    setIsAuthenticated(false);
    setAccessCode('');
    setRegistrations([]);
    setClearanceLevel(0);
  };

  useEffect(() => {
    if (isAuthenticated) {
      const ctx = gsap.context(() => {
        const target = document.querySelector(".admin-dashboard");
        if (target) {
          gsap.fromTo(target,
            { opacity: 0, scale: 0.98 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
          );
        }
      });
      return () => ctx.revert();
    }
  }, [isAuthenticated]);

  const filteredData = useMemo(() => {
    if (!Array.isArray(registrations)) return [];
    return registrations.filter(reg => {
      if (!reg) return false;
      const name = String(reg.name || '');
      const email = String(reg.email || '');
      const pid = String(reg.participantId || '');

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pid.toLowerCase().includes(searchQuery.toLowerCase());


      const matchesFilter = filterEvent === 'all' ||
        (reg.registrations && Array.isArray(reg.registrations) && reg.registrations.some(r => r && String(r.eventName) === filterEvent));

      const matchesRestricted = !restrictedEvent ||
        (reg.registrations && Array.isArray(reg.registrations) && reg.registrations.some(r => r && String(r.eventName) === restrictedEvent));

      const matchesDate = !filterDate || (reg.registrationDate && new Date(reg.registrationDate).toDateString() === new Date(filterDate).toDateString());

      const matchesCategory = filterCategory === 'all' || reg.category === filterCategory;

      return matchesSearch && matchesFilter && matchesRestricted && matchesDate && matchesCategory;
    });
  }, [registrations, searchQuery, filterEvent, filterDate, restrictedEvent, filterCategory]);

  const stats = useMemo(() => {
    const safeRegs = Array.isArray(filteredData) ? filteredData : [];
    return {
      totalParticipants: safeRegs.length,
      totalRevenue: safeRegs.filter(r => r.paymentStatus === 'Paid').reduce((acc, r) => acc + calculateTotalFee(r.registrations), 0),
      eventBreakdown: safeRegs.reduce((acc, r) => {
        if (r && r.registrations && Array.isArray(r.registrations)) {
          r.registrations.forEach(ev => {
            if (ev && ev.eventName) {
              const name = String(ev.eventName);
              acc[name] = (acc[name] || 0) + 1;
            }
          });
        }
        return acc;
      }, {})
    };
  }, [registrations]);

  const toggleMaintenance = async () => {
    if (!window.confirm("WARNING: Are you sure you want to toggle the global maintenance mode? This will affect all users immediately.")) return;
    try {
      const res = await fetch(`${API_URL}/api/status/toggle`, {
        method: 'POST',
        headers: { 'x-admin-key': accessCode }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      } else {
        alert("ERROR: " + data.message);
      }
    } catch (err) {
      alert("CRITICAL ERROR: Could not toggle maintenance.");
    }
  };

  const exportCSV = () => {
    const headers = [
      "PID", "Name", "Email", "Phone", "College", "Category",
      "Events", "Squad Details", "Status", "Amount", "Date", "Screenshot"
    ];

    const csvData = filteredData.map(r => {
      const eventList = r.registrations.map(ev => ev.eventName).join(" | ");
      const squadDetails = r.registrations.map(ev => {
        if (!ev.teammates || ev.teammates.length === 0) return `${ev.eventName}: SOLO`;
        const members = ev.teammates.map(t => `${t.name}(${t.phone || 'N/A'})`).join("; ");
        return `${ev.eventName}: [${members}]`;
      }).join(" || ");

      return [
        r.participantId || 'PENDING',
        `"${r.name}"`,
        r.email,
        r.phone,
        `"${r.college}"`,
        r.category || (r.year ? `${r.year}yr - ${r.department}` : 'GENERAL'),
        `"${eventList}"`,
        `"${squadDetails}"`,
        r.paymentStatus || 'Pending',
        calculateTotalFee(r.registrations),
        new Date(r.registrationDate).toLocaleString().replace(/,/g, ''),
        r.screenshotUrl || 'N/A'
      ];
    });

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + csvData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = filterEvent === 'all' ? 'FULL_DATABASE' : filterEvent.toLowerCase().replace(/\s+/g, '_');
    link.setAttribute("download", `INOVEX_INTEL_${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const exportToExcel = () => {
    const tableHeader = [
      "PID", "NAME", "EMAIL", "PHONE", "COLLEGE", "CATEGORY",
      "EVENTS ENROLLED", "SQUAD INTEL", "PAYMENT STATUS",
      "TOTAL FEE", "REGISTRATION DATE", "PROOF OF PAYMENT"
    ];

    const rows = filteredData.map(r => [
      r.participantId || 'PENDING',
      r.name?.toUpperCase(),
      r.email,
      r.phone,
      r.college?.toUpperCase(),
      r.category?.toUpperCase() || (r.year ? `${r.year}YR - ${r.department}` : 'GENERAL'),

      // Events
      r.registrations?.map(ev => ev.eventName?.toUpperCase()).join("<br>"),

      // Squad Details
      r.registrations?.map(ev => {
        const teamInfo = ev.teammates?.length > 0
          ? ` (Squad: ${ev.teammates.map(t => `${t.name} [${t.phone || 'N/A'}]`).join(" | ")})`
          : " (Solo Participation)";
        return `• ${ev.eventName?.toUpperCase()}${teamInfo}`;
      }).join("<br>"),

      r.paymentStatus?.toUpperCase() || 'PENDING',
      `₹${calculateTotalFee(r.registrations)}`,
      new Date(r.registrationDate).toLocaleString(),
      r.screenshotUrl ? `<a href="${r.screenshotUrl}">VIEW PROOF</a>` : 'NO PROOF'
    ]);

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          th { background-color: #df1f26; color: white; font-weight: bold; border: 1px solid #000; padding: 10px; font-size: 12px; }
          td { border: 1px solid #ccc; padding: 10px; font-size: 11px; vertical-align: top; }
        </style>
      </head>
      <body>
        <h2 style="color: #df1f26; text-align: center;">INOVEX 2026: OFFICIAL EXPEDITION MANIFEST</h2>
        <p style="text-align: center; font-size: 10px;">Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>${tableHeader.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = filterEvent === 'all' ? 'MASTER_DATABASE' : `${filterEvent.toUpperCase()}_SECTOR_LOG`;
    link.download = `INOVEX_${fileName}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };


  const exportToWord = () => {
    const now = new Date().toLocaleString();
    const html = `
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; line-height: 1.6; }
          .page-header { border-bottom: 3px solid #df1f26; margin-bottom: 30px; padding-bottom: 10px; }
          .title { color: #df1f26; font-size: 26pt; font-weight: bold; margin: 0; text-align: center; }
          .subtitle { font-size: 10pt; color: #666; margin: 0; text-transform: uppercase; letter-spacing: 3px; text-align: center; }
          .meta { font-size: 8pt; color: #999; text-align: right; margin-top: 5px; }
          
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #f4f4f4; color: #333; border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 10pt; text-transform: uppercase; }
          td { border: 1px solid #eee; padding: 10px; font-size: 9pt; vertical-align: top; }
          
          .pid-badge { color: #df1f26; font-weight: bold; font-family: monospace; }
          .category-tag { font-size: 8pt; background: #eee; padding: 2px 5px; border-radius: 3px; color: #555; }
          .squad-list { margin-top: 5px; padding-left: 10px; border-left: 2px solid #df1f26; }
          .squad-member { font-size: 8pt; color: #555; }
          .status-paid { color: #10b981; font-weight: bold; }
          .status-pending { color: #f59e0b; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="page-header">
          <p class="title">INOVEX 2026</p>
          <p class="subtitle">OFFICIAL EXPEDITION MANIFESTO</p>
          <p class="meta">GENERATED: ${now} | SECTOR: ${filterEvent.toUpperCase()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th width="15%">IDENTIFICATION</th>
              <th width="25%">REPRESENTATIVE</th>
              <th width="20%">INSTITUTIONAL INFO</th>
              <th width="30%">QUESTS & SQUADS</th>
              <th width="10%">FINANCIALS</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(r => `
              <tr>
                <td>
                  <span class="pid-badge">${r.participantId || 'PENDING'}</span><br>
                  <span class="status-${r.paymentStatus === 'Paid' ? 'paid' : 'pending'}">${r.paymentStatus?.toUpperCase() || 'PENDING'}</span>
                </td>
                <td>
                  <b>${r.name?.toUpperCase()}</b><br>
                  ${r.email}<br>
                  ${r.phone}
                </td>
                <td>
                  ${r.college?.toUpperCase()}<br>
                  <span class="category-tag">${r.category?.toUpperCase() || (r.year ? `${r.year}YR - ${r.department}` : 'GENERAL')}</span>
                </td>
                <td>
                  ${r.registrations?.map(ev => `
                    <div style="margin-bottom: 8px;">
                      <b>• ${ev.eventName?.toUpperCase()}</b>
                      <div class="squad-list">
                        ${ev.teammates?.length > 0 ?
        ev.teammates.map(t => `<div class="squad-member">${t.name} (${t.phone || 'N/A'})</div>`).join('') :
        '<div class="squad-member italic">Solo Entry</div>'
      }
                      </div>
                    </div>
                  `).join('')}
                </td>
                <td>
                  <b>₹${calculateTotalFee(r.registrations)}</b><br>
                  <a href="${r.screenshotUrl || '#'}" style="font-size: 7pt; color: #df1f26;">View Proof</a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="margin-top: 50px; text-align: center; font-size: 8pt; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
          INOVEX CORE SYSTEM v2.4.0 // END OF TRANSMISSION
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = filterEvent === 'all' ? 'FULL_MANIFESTO' : `${filterEvent.toUpperCase()}_SECTOR_MANIFEST`;
    link.download = `INOVEX_${fileName}_${new Date().toISOString().split('T')[0]}.doc`;
    link.click();
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/registrations/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': accessCode
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setRegistrations(prev => prev.map(r => r._id === id ? { ...r, paymentStatus: newStatus } : r));
        if (selectedReg && selectedReg._id === id) {
          setSelectedReg({ ...selectedReg, paymentStatus: newStatus });
        }
        // Simple confirmation of status change
        console.log(`Status updated to ${newStatus}`);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("CRITICAL ERROR: STATUS UPDATE FAILED");
    }
  };

  const resendEmail = async (id) => {
    if (!window.confirm("RESEND EMAIL: Are you sure you want to send the confirmation email to this user?")) return;

    try {
      const response = await fetch(`${API_URL}/api/registrations/${id}/resend-email`, {
        method: 'POST',
        headers: {
          'x-admin-key': accessCode
        }
      });
      const data = await response.json();
      if (data.success) {
        alert("SUCCESS: Confirmation email sent.");
      } else {
        alert(`ERROR: ${data.message}`);
      }
    } catch (error) {
      console.error("Resend Error:", error);
      alert("CRITICAL ERROR: EMAIL SEND FAILED");
    }
  };
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const confirmPaymentAndEmail = async (e, id) => {
    e.stopPropagation();
    if (confirmingIds.has(id)) return;

    setConfirmingIds(prev => new Set([...prev, id]));
    try {
      const response = await fetch(`${API_URL}/api/registrations/${id}/confirm-payment`, {
        method: 'POST',
        headers: { 'x-admin-key': accessCode }
      });
      const data = await response.json();

      if (data.success) {
        // Update local state so the badge flips to AUTHORIZED immediately
        setRegistrations(prev => prev.map(r => r._id === id ? { ...r, paymentStatus: 'Paid' } : r));
        if (selectedReg && selectedReg._id === id) {
          setSelectedReg(prev => ({ ...prev, paymentStatus: 'Paid' }));
        }
        if (data.emailSent === false) {
          showToast('info', `Payment confirmed, but email failed: ${data.message}`);
        } else {
          showToast('success', 'Payment confirmed ✓ and confirmation email sent!');
        }
      } else {
        showToast('error', `Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Confirm Payment Error:', error);
      showToast('error', 'Network error — could not confirm payment.');
    } finally {
      setConfirmingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`BULK PROTOCOL: Verify ${selectedIds.length} assets as ${newStatus.toUpperCase()}?`)) return;

    setIsBulkLoading(true);
    try {
      const updatePromises = selectedIds.map(id =>
        fetch(`${API_URL}/api/registrations/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-key': accessCode
          },
          body: JSON.stringify({ status: newStatus })
        }).then(res => res.json())
      );

      const results = await Promise.all(updatePromises);
      const successCount = results.filter(r => r.success).length;

      setRegistrations(prev => prev.map(r => {
        if (selectedIds.includes(r._id)) {
          return { ...r, paymentStatus: newStatus };
        }
        return r;
      }));

      setSelectedIds([]);
      alert(`PROTOCOLS COMPLETE: ${successCount} assets synchronized.`);
    } catch (error) {
      console.error("Bulk Update Error:", error);
      alert("CRITICAL ERROR: BULK UPDATE FAILED");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`SECURITY OVERRIDE: Purge asset for ${name?.toUpperCase()} from the database permanently?`)) return;

    try {
      const response = await fetch(`${API_URL}/api/registrations/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': accessCode
        }
      });
      const data = await response.json();
      if (data.success) {
        setRegistrations(prev => prev.filter(r => r._id !== id));
        alert("PROTOCOL COMPLETE: Asset purged.");
      } else {
        alert(`ERROR: ${data.message}`);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("CRITICAL ERROR: PURGE FAILED");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`SECURITY OVERRIDE: Purge ${selectedIds.length} assets from the database permanently?`)) return;

    setIsBulkLoading(true);
    try {
      const deletePromises = selectedIds.map(id =>
        fetch(`${API_URL}/api/registrations/${id}`, {
          method: 'DELETE',
          headers: {
            'x-admin-key': accessCode
          }
        }).then(res => res.json())
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(r => r.success).length;

      setRegistrations(prev => prev.filter(r => !selectedIds.includes(r._id)));
      setSelectedIds([]);
      alert(`PROTOCOLS COMPLETE: ${successCount} assets purged.`);
    } catch (error) {
      console.error("Bulk Delete Error:", error);
      alert("CRITICAL ERROR: BULK PURGE FAILED");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredData.map(r => r._id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const ChartWidget = ({ data, title, type = 'bar' }) => {
    const maxVal = Math.max(...Object.values(data), 1);
    const sortedKeys = Object.keys(data).sort((a, b) => data[b] - data[a]);

    return (
      <div className="p-6 border border-white/5 bg-white/[0.01] rounded-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">{title}</h4>
          <Activity size={14} className="text-red-600/40" />
        </div>
        <div className="space-y-4">
          {sortedKeys.map((key, i) => {
            const percentage = (data[key] / maxVal) * 100;
            return (
              <div key={key} className="space-y-1.5 group">
                <div className="flex justify-between text-[8px] font-black tracking-widest">
                  <span className="text-white/60 group-hover:text-white transition-colors">{key.toUpperCase()}</span>
                  <span className="text-red-500">{data[key]}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-800 to-red-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%`, transitionDelay: `${i * 100}ms` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isVerifyingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] font-black tracking-[0.5em] text-red-600 animate-pulse uppercase">Verifying Security Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 font-jurassic uppercase overflow-hidden relative">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(223,31,38,0.1)_0%,rgba(0,0,0,1)_70%)]" />

        <div className="relative z-10 w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-red-600/10 border border-red-600/20 animate-pulse">
                <Terminal size={48} className="text-red-600" />
              </div>
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white">CENTRAL TERMINAL</h1>
            <p className="text-[10px] font-black tracking-[0.4em] text-red-600/60">INOVEX ASSET MANAGEMENT SYSTEM</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black tracking-widest text-white/40 ml-1">ACCESS CODE</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="********"
                  className="w-full bg-black border border-white/10 rounded-sm py-4 pl-12 pr-4 text-sm tracking-[0.5em] focus:outline-none focus:border-red-600 transition-all text-red-500 font-black"
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white font-black py-4 text-xs tracking-[0.3em] flex items-center justify-center gap-2 transition-all">
              INITIALIZE UPLINK <ChevronRight size={16} />
            </button>
          </form>

          <p className="text-center text-[8px] font-bold text-white/20 tracking-widest leading-relaxed">
            UNAUTHORIZED ACCESS IS LOGGED AND TRACED BY INOVEX SECURITY.<br />SITE-B PROTOCOLS IN EFFECT.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-jurassic uppercase overflow-x-hidden admin-dashboard">
      {/* Decorative Sidebar Bar */}
      <div className="fixed top-0 left-0 w-1 h-full bg-red-600/20 z-50"></div>

      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <ShieldCheck className="text-red-600" size={24} />
            <div>
              <h2 className="text-xl font-black italic tracking-tighter">INOVEX ADMIN</h2>
              <div className="flex items-center gap-2">
                <p className="text-[8px] font-black tracking-widest text-red-600/60">SYSTEM STATUS: 100% OPERATIONAL</p>
                <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-black border ${clearanceLevel >= 2 ? 'bg-red-600 text-white border-red-400' :
                  clearanceLevel >= 1 ? 'bg-white/10 text-white/80 border-white/20' :
                    'bg-blue-600/20 text-blue-400 border-blue-500/30'
                  }`}>
                  {clearanceLevel >= 2 ? 'SUPER ADMIN' : clearanceLevel >= 1 ? 'LEVEL 1 ACCESS' : `EVENT LEAD: ${restrictedEvent?.toUpperCase()}`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Event Filter - Only for Admins/Superadmins */}
            {clearanceLevel >= 1 && (
              <>
                <div className="relative hidden lg:block">
                  <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <select
                    value={filterEvent}
                    onChange={(e) => setFilterEvent(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-8 text-[10px] tracking-widest focus:outline-none focus:border-red-600/50 appearance-none cursor-pointer"
                  >
                    <option value="all" className="text-black bg-white">ALL MISSIONS</option>
                    {Object.values(ALL_EVENTS).map(ev => (
                      <option key={ev.title} value={ev.title} className="text-black bg-white">{ev.title?.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="relative hidden xl:block">
                  <Activity size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-8 text-[10px] tracking-widest focus:outline-none focus:border-red-600/50 appearance-none cursor-pointer"
                  >
                    <option value="all" className="text-black bg-white">ALL STREAMS</option>
                    <option value="Technical" className="text-black bg-white">TECHNICAL</option>
                    <option value="Management" className="text-black bg-white">MANAGEMENT</option>
                  </select>
                </div>
              </>
            )}

            {/* Date Filter */}
            <CalendarPicker
              value={filterDate}
              onChange={setFilterDate}
              onClear={() => setFilterDate('')}
            />

            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="SEARCH ASSETS (NAME/ID)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[10px] tracking-widest focus:outline-none focus:border-red-600/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              {clearanceLevel >= 2 && (
                <button onClick={toggleMaintenance} className="p-2 border border-white/10 hover:border-amber-600/50 hover:text-amber-500 transition-all bg-white/5 rounded-full" title="TOGGLE SYSTEM MAINTENANCE">
                  <Power size={18} />
                </button>
              )}
              <button onClick={exportToExcel} className="p-2 border border-white/10 hover:border-green-600/50 hover:text-green-500 transition-all bg-white/5 rounded-full" title="EXPORT EXCEL (.XLS)">
                <FileSpreadsheet size={18} />
              </button>
              <button onClick={exportToWord} className="p-2 border border-white/10 hover:border-blue-600/50 hover:text-blue-500 transition-all bg-white/5 rounded-full" title="EXPORT WORD (.DOC)">
                <FileText size={18} />
              </button>
              <button onClick={exportCSV} className="p-2 border border-white/10 hover:border-red-600/50 hover:text-red-500 transition-all bg-white/5 rounded-full" title="EXPORT CSV">
                <Download size={18} />
              </button>
              <button onClick={handleLogout} className="ml-2 px-4 py-2 border border-red-600/30 text-red-600 text-[9px] font-black tracking-widest hover:bg-red-600 hover:text-white transition-all rounded-lg uppercase">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-10">
        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-3 p-1 bg-white/[0.03] border border-white/10 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all ${activeTab === 'registrations' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-white/40 hover:text-white/70'}`}
          >
            <Users size={16} />
            Mission Control
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all ${activeTab === 'feedback' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-white/40 hover:text-white/70'}`}
          >
            <MessageSquare size={16} />
            Intelligence Feed
          </button>
        </div>

        {activeTab === 'registrations' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-white/40 tracking-widest">ACTIVE ASSETS</span>
                  <Users size={16} className="text-red-500" />
                </div>
                <p className="text-3xl font-black italic">{stats.totalParticipants}</p>
              </div>
              <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-white/40 tracking-widest">GROSS REVENUE</span>
                  <CreditCard size={16} className="text-emerald-500" />
                </div>
                <p className="text-3xl font-black italic">₹{stats.totalRevenue}</p>
              </div>
              <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-black text-white/40 tracking-widest">EVENT DENSITY</span>
                  <Activity size={16} className="text-blue-500" />
                </div>
                <p className="text-3xl font-black italic">{Object.keys(stats.eventBreakdown).length}</p>
              </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 gap-6">
              <ChartWidget title="QUEST DISTRIBUTION" data={stats.eventBreakdown} />
            </div>

            {/* Bulk Action Bar - Sticky */}
            {selectedIds.length > 0 && (
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] bg-zinc-900 border border-red-600/50 p-4 rounded-2xl shadow-[0_20px_50px_rgba(223,31,38,0.3)] flex items-center gap-6 animate-in slide-in-from-bottom-10 duration-300">
                <div className="flex items-center gap-3 pr-6 border-r border-white/10">
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-xs">
                    {selectedIds.length}
                  </div>
                  <p className="text-[10px] font-black tracking-widest text-white">ASSETS SELECTED</p>
                </div>
                <div className="flex gap-2">
                  {clearanceLevel >= 2 && (
                    <button
                      onClick={handleBulkDelete}
                      disabled={isBulkLoading}
                      className="px-6 py-2 bg-red-800 hover:bg-red-700 text-white text-[10px] font-black tracking-widest uppercase rounded-lg transition-all flex items-center gap-2"
                    >
                      {isBulkLoading ? <Activity size={12} className="animate-spin" /> : <Database size={14} />}
                      PURGE SELECTED ASSETS
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setSelectedIds([])}
                  className="ml-2 p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Data Table */}
            <div className="border border-white/5 bg-white/[0.01]">
              <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <h3 className="text-xs font-black tracking-[0.3em] flex items-center gap-3">
                  <Database size={14} className="text-red-600" />
                  ASSET DATABASE
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter size={12} className="text-white/30" />
                    <select
                      className={`bg-black text-[10px] font-black border border-white/10 px-2 py-1 outline-none transition-opacity ${restrictedEvent ? 'opacity-50 cursor-not-allowed' : ''}`}
                      value={filterEvent}
                      onChange={(e) => !restrictedEvent && setFilterEvent(e.target.value)}
                      disabled={!!restrictedEvent}
                    >
                      <option value="all">ALL QUESTS</option>
                      {Object.keys(stats.eventBreakdown).map(ev => (
                        <option key={ev} value={ev}>{ev.toUpperCase()}</option>
                      ))}
                    </select>
                    {restrictedEvent && (
                      <span className="text-[8px] font-black text-blue-400/50 ml-1 tracking-widest">LOCKED</span>
                    )}
                  </div>
                  <CalendarPicker
                    value={filterDate}
                    onChange={setFilterDate}
                    onClear={() => setFilterDate('')}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.03]">
                      <th className="p-5 w-12">
                        <button
                          onClick={toggleSelectAll}
                          className={`w-5 h-5 border rounded-lg transition-all flex items-center justify-center ${selectedIds.length === filteredData.length && filteredData.length > 0 ? 'bg-red-600 border-red-500 shadow-[0_0_10px_rgba(223,31,38,0.3)]' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
                        >
                          {selectedIds.length === filteredData.length && filteredData.length > 0 && <CheckCircle size={12} className="text-white" />}
                        </button>
                      </th>
                      <th className="p-5 text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Identification</th>
                      <th className="p-5 text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Representative</th>
                      <th className="p-5 text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Contact Matrix</th>
                      <th className="p-5 text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Institutional Roots</th>
                      <th className="p-5 text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Mission Manifest</th>
                      <th className="p-5 text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Fee Status</th>
                      <th className="p-5 text-[9px] font-black tracking-[0.2em] text-white/30 uppercase text-center">Authorization</th>
                      <th className="p-5 text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Timeline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {isLoading ? (
                      <tr>
                        <td colSpan="10" className="p-20 text-center">
                          <div className="inline-block w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="mt-4 text-[10px] font-black tracking-[0.5em] text-red-600 animate-pulse">SYNCHRONIZING...</p>
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="p-20 text-center text-white/20 italic tracking-widest text-xs">
                          NO ASSETS FOUND IN THE CURRENT SECTOR.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((reg) => (
                        <tr
                          key={reg._id}
                          onClick={() => setSelectedReg(reg)}
                          className={`hover:bg-white/[0.03] border-b border-white/[0.02] transition-all group cursor-pointer ${selectedIds.includes(reg._id) ? 'bg-red-600/[0.03]' : ''}`}
                        >
                          <td className="p-5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => toggleSelect(reg._id)}
                              className={`w-5 h-5 border rounded-lg transition-all flex items-center justify-center ${selectedIds.includes(reg._id) ? 'bg-red-600 border-red-500 shadow-[0_0_10px_rgba(223,31,38,0.3)]' : 'border-white/10 group-hover:border-white/30 bg-white/5'}`}
                            >
                              {selectedIds.includes(reg._id) && <CheckCircle size={12} className="text-white" />}
                            </button>
                          </td>
                          <td className="p-5">
                            <div className="inline-flex items-center">
                              <p className="text-[10px] font-black text-amber-500 tracking-[0.2em] bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                {reg.participantId || 'PENDING'}
                              </p>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1.5">
                              <p className="text-xs font-black text-white italic tracking-tight group-hover:text-red-500 transition-colors">{reg.name?.toUpperCase() || 'UNKNOWN'}</p>
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                                <p className="text-[9px] font-black tracking-[0.2em] text-white/30">{reg.usn || 'NO USN'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-white/80 group/contact">
                                <Phone size={10} className="text-red-600/40 group-hover/contact:text-red-600 transition-colors" />
                                <p className="text-[10px] font-black tracking-widest">{reg.phone || 'NO PHONE'}</p>
                              </div>
                              <div className="flex items-center gap-2 text-white/30 group/contact">
                                <Mail size={10} className="text-red-600/40 group-hover/contact:text-red-600 transition-colors" />
                                <p className="text-[9px] font-bold normal-case truncate max-w-[120px]">{reg.email || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-black text-white/50 truncate max-w-[150px] leading-tight" title={reg.college}>{reg.college || 'EXTERNAL ASSET'}</p>
                              <p className="text-[8px] font-black text-red-600/40 uppercase tracking-[0.1em] bg-red-600/5 px-2 py-0.5 rounded border border-red-600/10 inline-block">
                                {reg.category?.toUpperCase() || (reg.year ? `YEAR ${reg.year} // ${reg.department}` : 'GENERAL')}
                              </p>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex flex-col gap-2 min-w-[220px] max-h-[140px] overflow-y-auto custom-scrollbar pr-2">
                              {reg.registrations?.map((ev, i) => (
                                <div key={i} className="group/event bg-white/[0.02] border border-white/5 rounded-lg p-2 hover:border-red-600/30 transition-all">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[9px] font-black text-white/90 italic">
                                      {ev.eventName?.toUpperCase()}
                                    </span>
                                    {ev.teammates?.length > 0 && (
                                      <span className="text-[7px] font-black bg-red-600/20 text-red-500 px-1.5 py-0.5 rounded-full border border-red-600/20">
                                        +{ev.teammates.length}
                                      </span>
                                    )}
                                  </div>
                                  {ev.teammates?.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-white/[0.03] flex flex-wrap gap-x-2 gap-y-1">
                                      {ev.teammates.map((t, ti) => (
                                        <p key={ti} className="text-[7px] font-bold text-white/20 flex items-center gap-1">
                                          <span className="w-1 h-1 rounded-full bg-red-600/40"></span>
                                          {t.name}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="flex flex-col">
                              <p className="text-[10px] font-black text-emerald-400 tracking-widest bg-emerald-400/5 border border-emerald-400/10 px-2 py-1 rounded-md text-center">
                                ₹{calculateTotalFee(reg.registrations)}
                              </p>
                            </div>
                          </td>
                          <td className="p-5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex flex-col gap-2">
                              {/* Toggle Status button */}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(reg._id, reg.paymentStatus === 'Paid' ? 'Pending' : 'Paid'); }}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl w-full transition-all duration-300 ${reg.paymentStatus === 'Paid'
                                    ? 'text-green-500 bg-green-500/10 border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:bg-green-500/20'
                                    : 'text-amber-500 bg-amber-500/10 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:bg-amber-500/20'
                                  }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${reg.paymentStatus === 'Paid' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]'}`}></div>
                                <span className="text-[9px] font-black tracking-[0.2em] uppercase">
                                  {reg.paymentStatus === 'Paid' ? 'AUTHORIZED' : 'PENDING'}
                                </span>
                              </button>

                              {/* Confirm + Email button — only show if not yet paid */}
                              {reg.paymentStatus !== 'Paid' ? (
                                <button
                                  onClick={(e) => confirmPaymentAndEmail(e, reg._id)}
                                  disabled={confirmingIds.has(reg._id)}
                                  title="Confirm payment & send email to user"
                                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl w-full transition-all duration-300 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  {confirmingIds.has(reg._id)
                                    ? <Activity size={12} className="animate-spin" />
                                    : <Send size={12} />}
                                  <span className="text-[9px] font-black tracking-[0.2em] uppercase">
                                    {confirmingIds.has(reg._id) ? 'SENDING...' : 'CONFIRM & EMAIL'}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => confirmPaymentAndEmail(e, reg._id)}
                                  disabled={confirmingIds.has(reg._id)}
                                  title="Resend confirmation email to user"
                                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl w-full transition-all duration-300 text-blue-400 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  {confirmingIds.has(reg._id)
                                    ? <Activity size={12} className="animate-spin" />
                                    : <RotateCcw size={12} />}
                                  <span className="text-[9px] font-black tracking-[0.2em] uppercase">
                                    {confirmingIds.has(reg._id) ? 'SENDING...' : 'RESEND EMAIL'}
                                  </span>
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1 text-center md:text-left">
                              <p className="text-[10px] font-black text-white/50 tracking-tighter">
                                {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '?? ???'}
                              </p>
                              <p className="text-[8px] font-bold text-white/20 tracking-widest uppercase">
                                {reg.registrationDate ? new Date(reg.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                              </p>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Intelligence Feed (Feedback) Sector */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tighter">Inbound Communications</h3>
                <p className="text-[10px] font-black text-red-600 tracking-[0.3em] uppercase mt-1">Intelligence logged from frontend terminals</p>
              </div>
              <button
                onClick={fetchFeedback}
                disabled={isFeedbackLoading}
                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <Activity size={18} className={isFeedbackLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isFeedbackLoading ? (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-[10px] font-black tracking-[0.5em] text-red-600 animate-pulse uppercase">Syncing Intel...</p>
                </div>
              ) : feedback.length === 0 ? (
                <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-3xl">
                  <p className="text-white/20 text-xs font-black tracking-widest uppercase italic">No transmissions detected in the sector.</p>
                </div>
              ) : (
                feedback.map((item, i) => (
                  <div key={item._id} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-red-600/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-all">
                      <Terminal size={64} className="text-red-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`px-2 py-1 text-[8px] font-black tracking-widest uppercase rounded ${item.type === 'bug' ? 'bg-red-600 text-white' :
                          item.type === 'idea' ? 'bg-amber-500 text-black' :
                            'bg-blue-600 text-white'
                        }`}>
                        {item.type}
                      </span>
                      <span className="text-[9px] font-bold text-white/20 tracking-widest uppercase">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-white mb-2 uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[10px] font-bold text-red-600/60 mb-6 tracking-wider italic">{item.email}</p>
                    <div className="p-4 bg-black/40 rounded-2xl border border-white/5 min-h-[100px]">
                      <p className="text-xs text-white/70 leading-relaxed italic">"{item.message}"</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <RegistrationDetailModal
        reg={selectedReg}
        onClose={() => setSelectedReg(null)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in slide-in-from-bottom-4 duration-300 ${toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' :
            toast.type === 'error' ? 'bg-red-950/90 border-red-500/40 text-red-300' :
              'bg-blue-950/90 border-blue-500/40 text-blue-300'
          }`}>
          {toast.type === 'success' && <CheckCircle size={18} className="shrink-0" />}
          {toast.type === 'error' && <X size={18} className="shrink-0" />}
          {toast.type === 'info' && <Info size={18} className="shrink-0" />}
          <p className="text-[11px] font-black tracking-wide max-w-xs">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-2 opacity-50 hover:opacity-100 transition-opacity">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Footer Meta */}
      <footer className="p-8 border-t border-white/5 text-center">
        <p className="text-[9px] font-black tracking-[0.5em] text-white/10">
          INOVEX CORE SYSTEM v2.4.0 // ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
};

export default Admin;
