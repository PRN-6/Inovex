import React, { useState, useEffect, useMemo } from 'react';
import { Database, ShieldCheck, Download, Trash2, Search, ExternalLink, Filter, TrendingUp, Users, CreditCard, Terminal, Lock, ChevronRight, Activity, FileSpreadsheet, FileText, Calendar, X, CheckCircle, Info, User, Mail, Phone, GraduationCap, Building2, Ticket, Copy, Printer, Flame } from 'lucide-react';
import { gsap } from 'gsap';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [clearanceLevel, setClearanceLevel] = useState(0); // 0: None, 0.5: Event Head, 1: Admin, 2: Super Admin
  const [restrictedEvent, setRestrictedEvent] = useState(null);
  const [selectedReg, setSelectedReg] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(true);

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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
        
        <div className="relative w-full max-w-3xl bg-zinc-950 border border-red-600/30 rounded-3xl shadow-[0_0_50px_rgba(223,31,38,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Immersive Background Texture */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 blur-[100px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-black italic text-white tracking-tight leading-none">{reg.name?.toUpperCase()}</h3>
                  <p className="text-[10px] font-black text-red-600/60 tracking-[0.4em] uppercase mt-1">Classification: Active Asset</p>
                </div>
              </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => resendEmail(reg._id)} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-amber-500 hover:text-amber-400 transition-all" title="RESEND CONFIRMATION EMAIL"><Mail size={18} /></button>
                  <button onClick={() => window.print()} className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all" title="PRINT INTEL"><Printer size={18} /></button>
                  <button onClick={onClose} className="p-2.5 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 rounded-xl text-red-500 hover:text-red-400 transition-all ml-2"><X size={18} /></button>
                </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Identity & Contact */}
                <div className="space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                       <User size={14} className="text-red-600" />
                       <h4 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Identity Intel</h4>
                    </div>
                    <div className="space-y-4">
                       <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-red-600/30 transition-all">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Asset ID / USN</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-white tracking-widest">{reg.usn}</span>
                            <button onClick={() => copyToClipboard(reg.usn)} className="opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} className="text-red-600" /></button>
                          </div>
                       </div>
                       <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-red-600/30 transition-all">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Contact Matrix</p>
                          <div className="space-y-2">
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-white flex items-center gap-2"><Mail size={14} className="text-red-600/40" /> {reg.email}</span>
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-amber-500 flex items-center gap-2"><Phone size={14} className="text-amber-500/40" /> {reg.phone}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center gap-2 mb-4">
                       <Building2 size={14} className="text-red-600" />
                       <h4 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Institutional Roots</h4>
                    </div>
                    <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl space-y-3">
                       <div>
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Guild (College)</p>
                          <p className="text-sm font-bold text-white">{reg.college}</p>
                       </div>
                       <div className="pt-3 border-t border-white/5 flex justify-between">
                          <div>
                             <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Sector</p>
                             <p className="text-xs font-bold text-red-600">{reg.department}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Generation</p>
                             <p className="text-xs font-bold text-white">Year {reg.year}</p>
                          </div>
                       </div>
                    </div>
                  </section>
                </div>

                {/* Right Column: Quests & Squads */}
                <div className="space-y-8">
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                       <Ticket size={14} className="text-red-600" />
                       <h4 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Mission Manifest</h4>
                    </div>
                    <div className="space-y-4">
                       {reg.registrations?.map((ev, i) => (
                         <div key={i} className="p-4 bg-red-600/5 border border-red-600/10 rounded-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                              <Flame size={40} className="text-red-600" />
                           </div>
                           <h5 className="text-sm font-black text-white mb-3 italic tracking-tight">{ev.eventName?.toUpperCase()}</h5>
                           
                           {ev.teammates?.length > 0 && (
                             <div className="space-y-3 pt-3 border-t border-red-600/10">
                                {ev.teammates.map((t, ti) => (
                                  <div key={ti} className="flex flex-col p-2 bg-black/40 rounded-lg border border-white/5">
                                    <p className="text-[10px] font-black text-white flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                      SQUAD {ti + 2}: {t.name}
                                    </p>
                                    <p className="text-[8px] font-bold text-white/30 ml-3.5 tracking-widest">{t.usn} // {t.email}</p>
                                  </div>
                                ))}
                             </div>
                           )}
                         </div>
                       ))}
                    </div>
                  </section>

                  <section>
                    {/* Transaction Intel */}
                    <div className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard size={14} className="text-amber-500" />
                        <h4 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Transaction Intel</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[8px] font-black text-white/20 tracking-widest uppercase mb-1">Tribute Amount</p>
                          <p className="text-xl font-black text-white italic">₹{reg.amount}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-white/20 tracking-widest uppercase mb-1">UTR / TRANS_ID</p>
                          <p className="text-xs font-black text-amber-500 tracking-wider font-mono">{reg.transactionId}</p>
                        </div>
                      </div>
                      
                      {reg.paymentScreenshot && (
                        <div className="pt-4 border-t border-white/5">
                          <p className="text-[8px] font-black text-white/20 tracking-widest uppercase mb-3">Verification Screenshot</p>
                          <a href={reg.paymentScreenshot} target="_blank" rel="noreferrer" className="block relative group overflow-hidden rounded-xl border border-white/10 aspect-video bg-black">
                            <img src={reg.paymentScreenshot} alt="Payment Proof" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                              <ExternalLink size={20} className="text-white" />
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Modal Footer: Controls */}
            <div className="p-8 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase">Security Status:</p>
                  <div className="flex gap-2">
                    {['pending', 'verified', 'failed'].map(status => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(reg._id, status)}
                        className={`px-5 py-2.5 text-[9px] font-black tracking-widest uppercase border rounded-xl transition-all ${reg.paymentStatus === status
                            ? (status === 'verified' ? 'bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' : status === 'failed' ? 'bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'bg-amber-600 border-amber-400 text-white shadow-[0_0_20px_rgba(217,119,6,0.3)]')
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:bg-white/[0.08]'
                          }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
               </div>
               
               <div className="text-right space-y-1">
                  <p className="text-[9px] font-black text-white/20 tracking-widest">ENROLLED: {new Date(reg.registrationDate).toLocaleString()}</p>
                  <p className="text-[8px] font-bold text-white/10 tracking-tighter">DATASET_ID: {reg._id}</p>
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
      const usn = String(reg.usn || '');
      const email = String(reg.email || '');

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        usn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter = filterEvent === 'all' ||
        (reg.registrations && Array.isArray(reg.registrations) && reg.registrations.some(r => r && String(r.eventName) === filterEvent));

      const matchesRestricted = !restrictedEvent ||
        (reg.registrations && Array.isArray(reg.registrations) && reg.registrations.some(r => r && String(r.eventName) === restrictedEvent));

      const matchesDate = !filterDate || (reg.registrationDate && new Date(reg.registrationDate).toDateString() === new Date(filterDate).toDateString());

      return matchesSearch && matchesFilter && matchesRestricted && matchesDate;
    });
  }, [registrations, searchQuery, filterEvent, filterDate, restrictedEvent]);

  const stats = useMemo(() => {
    const safeRegs = Array.isArray(registrations) ? registrations : [];
    return {
      totalRevenue: safeRegs.reduce((sum, r) => sum + (Number(r?.amount) || 0), 0),
      totalParticipants: safeRegs.length,
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

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "USN", "College", "Year", "Dept", "Amount", "Transaction ID", "Events"];
    const csvData = filteredData.map(r => [
      r.name, r.email, r.phone, r.usn, r.college, r.year, r.department, r.amount, r.transactionId,
      r.registrations.map(ev => ev.eventName).join(" | ")
    ]);

    let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + csvData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileName = filterEvent === 'all' ? 'all_registrations' : filterEvent.toLowerCase().replace(/\s+/g, '_');
    link.setAttribute("download", `inovex_${fileName}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const exportToExcel = () => {
    const tableHeader = ["NAME", "EMAIL", "PHONE", "USN", "COLLEGE", "YEAR", "DEPT", "AMOUNT", "TRANSACTION ID", "EVENTS"];
    const rows = filteredData.map(r => [
      r.name, r.email, r.phone, r.usn, r.college, r.year, r.department, r.amount, r.transactionId,
      r.registrations?.map(ev => {
        const teamInfo = ev.teammates?.length > 0
          ? ` (Squad: ${ev.teammates.map(t => `${t.name} [USN: ${t.usn}, Email: ${t.email}]`).join(" | ")})`
          : "";
        return `${ev.eventName}${teamInfo}`;
      }).join(" | ")
    ]);

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; }
          th { background-color: #df1f26; color: white; font-weight: bold; border: 1px solid #000; }
          td { border: 1px solid #ccc; padding: 5px; }
        </style>
      </head>
      <body>
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
    const fileName = filterEvent === 'all' ? 'ASSET_DATABASE' : `${filterEvent.toUpperCase()}_MANIFEST`;
    link.download = `INOVEX_${fileName}_${new Date().toISOString().split('T')[0]}.xls`;
    link.click();
  };

  const exportToWord = () => {
    const now = new Date().toLocaleString();
    let html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; }
          .page-header { border-bottom: 2px solid #df1f26; margin-bottom: 20px; padding-bottom: 10px; position: relative; }
          .title { color: #df1f26; font-size: 20pt; font-weight: bold; margin: 0; }
          .subtitle { font-size: 9pt; color: #666; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #df1f26; color: white; border: 1px solid #df1f26; padding: 8px; text-align: left; font-size: 10pt; }
          td { border: 1px solid #eee; padding: 6px; font-size: 9pt; vertical-align: top; }
          .squad { font-size: 8pt; color: #777; margin-top: 4px; border-left: 2px solid #df1f26; padding-left: 5px; }
        </style>
      </head>
      <body>
        <div class="page-header">
          <p class="title">INOVEX 2026</p>
          <p class="subtitle">${filterEvent === 'all' ? 'REGISTRATION MANIFESTO' : `MANIFEST: ${filterEvent.toUpperCase()}`}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>IDENTIFICATION</th>
              <th>COLLEGE / DEPT</th>
              <th>QUESTS & SQUADS</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(r => `
              <tr>
                <td><b>${r.name}</b><br>${r.email}</td>
                <td>${r.usn}</td>
                <td>${r.college}<br>${r.department} (Year ${r.year})</td>
                <td>
                  ${r.registrations?.map(ev => `
                    <div style="margin-bottom: 5px;">
                      <b>${ev.eventName}</b>
                      ${ev.teammates?.length > 0 ? `
                        <div class="squad">
                          ${ev.teammates.map(t => `${t.name} (${t.usn})`).join(", ")}
                        </div>
                      ` : ''}
                    </div>
                  `).join('')}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = filterEvent === 'all' ? 'MANIFESTO' : `${filterEvent.toUpperCase()}_MANIFEST`;
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
  };  const resendEmail = async (id) => {
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
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="SEARCH ASSETS (NAME/USN)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-[10px] tracking-widest focus:outline-none focus:border-red-600/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-white/40 tracking-widest">TOTAL TRIBUTE</span>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            {clearanceLevel >= 1 ? (
              <p className="text-3xl font-black italic">₹{stats.totalRevenue.toLocaleString()}</p>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-xl font-black italic text-white/20">ACCESS RESTRICTED</p>
                <p className="text-[8px] font-black text-red-600/40">ADMIN CLEARANCE REQUIRED</p>
              </div>
            )}
            {clearanceLevel < 1 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Lock size={16} className="text-white/20" />
              </div>
            )}
          </div>
          <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-white/40 tracking-widest">ACTIVE ASSETS</span>
              <Users size={16} className="text-red-500" />
            </div>
            <p className="text-3xl font-black italic">{stats.totalParticipants}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartWidget title="QUEST DISTRIBUTION" data={stats.eventBreakdown} />
          </div>
          <div className="p-6 border border-white/5 bg-white/[0.02] rounded-2xl space-y-6 flex flex-col justify-center">
            <div className="text-center space-y-2">
              <p className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase">Conversion Metrics</p>
              <div className="text-5xl font-black italic text-red-600">
                {stats.totalParticipants > 0 ? Math.round((registrations.filter(r => r.paymentStatus === 'verified').length / stats.totalParticipants) * 100) : 0}%
              </div>
              <p className="text-[9px] font-bold text-white/40 tracking-widest">ASSETS VERIFIED</p>
            </div>
            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[14px] font-black text-amber-500">{registrations.filter(r => r.paymentStatus === 'pending').length}</p>
                <p className="text-[7px] font-black text-white/20 tracking-widest">PENDING</p>
              </div>
              <div>
                <p className="text-[14px] font-black text-red-500">{registrations.filter(r => r.paymentStatus === 'failed').length}</p>
                <p className="text-[7px] font-black text-white/20 tracking-widest">FAILED</p>
              </div>
            </div>
          </div>
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
              <button 
                onClick={() => handleBulkStatusUpdate('verified')}
                disabled={isBulkLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-[9px] font-black tracking-widest uppercase rounded-lg transition-all flex items-center gap-2"
              >
                {isBulkLoading ? <Activity size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
                VERIFY ALL
              </button>
              <button 
                onClick={() => handleBulkStatusUpdate('failed')}
                disabled={isBulkLoading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-[9px] font-black tracking-widest uppercase rounded-lg transition-all flex items-center gap-2"
              >
                MARK FAILED
              </button>
              {clearanceLevel >= 2 && (
                <button 
                  onClick={handleBulkDelete}
                  disabled={isBulkLoading}
                  className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-[9px] font-black tracking-widest uppercase rounded-lg transition-all flex items-center gap-2"
                >
                  PURGE SELECTED
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
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 w-10">
                    <button
                      onClick={toggleSelectAll}
                      className={`w-4 h-4 border rounded transition-colors flex items-center justify-center ${selectedIds.length === filteredData.length && filteredData.length > 0 ? 'bg-red-600 border-red-500' : 'border-white/20 hover:border-white/40'}`}
                    >
                      {selectedIds.length === filteredData.length && filteredData.length > 0 && <CheckCircle size={10} className="text-white" />}
                    </button>
                  </th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">PARTICIPANT</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">CONTACT</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">GUILD / DEPT</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">QUESTS</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">TRIBUTE</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30 text-center">STATUS</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">DATE</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="p-20 text-center">
                      <div className="inline-block w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-[10px] font-black tracking-[0.5em] text-red-600 animate-pulse">SYNCHRONIZING...</p>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-20 text-center text-white/20 italic tracking-widest text-xs">
                      NO ASSETS FOUND IN THE CURRENT SECTOR.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((reg) => (
                    <tr key={reg._id} className={`hover:bg-white/[0.02] transition-colors group ${selectedIds.includes(reg._id) ? 'bg-red-600/5' : ''}`}>
                      <td className="p-4">
                        <button
                          onClick={() => toggleSelect(reg._id)}
                          className={`w-4 h-4 border rounded transition-colors flex items-center justify-center ${selectedIds.includes(reg._id) ? 'bg-red-600 border-red-500' : 'border-white/10 group-hover:border-white/30'}`}
                        >
                          {selectedIds.includes(reg._id) && <CheckCircle size={10} className="text-white" />}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-white">{reg.name || 'UNKNOWN'}</p>
                          <p className="text-[10px] font-black tracking-widest bg-white/5 px-2 py-0.5 rounded-sm border border-white/5 inline-block">{reg.usn || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/80 tracking-widest">{reg.phone || 'NO PHONE'}</p>
                          <p className="text-[9px] font-bold text-white/30 normal-case">{reg.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/60 truncate max-w-[150px]" title={reg.college}>{reg.college || 'EXTERNAL'}</p>
                          <p className="text-[8px] font-bold text-red-900/40 uppercase tracking-tighter">Year {reg.year || '?'} // {reg.department || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          {reg.registrations?.map((ev, i) => (
                            <div key={i} className="space-y-1">
                              <span className="text-[8px] font-black px-2 py-0.5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-full inline-block">
                                {ev.eventName}
                              </span>
                              {ev.teammates?.length > 0 && (
                                <div className="ml-2 pl-2 border-l border-red-900/30 flex flex-col gap-1">
                                  {ev.teammates.map((t, ti) => (
                                    <p key={ti} className="text-[7px] font-bold text-white/40 tracking-wider">
                                      <span className="text-red-500/60 mr-1">SQUAD {ti + 2}:</span> {t.name} [{t.usn}]
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-white">₹{reg.amount || 0}</p>
                          <p className="text-[9px] font-black text-amber-500 mt-1 tracking-wider font-mono bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 inline-block" title={reg.transactionId}>
                            UTR: {reg.transactionId || 'NOT PROVIDED'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-[10px] font-black tracking-widest">
                        <span className={`px-2 py-0.5 rounded-full border ${reg.paymentStatus === 'verified' ? 'bg-green-600/10 text-green-500 border-green-500/20' :
                            reg.paymentStatus === 'failed' ? 'bg-red-600/10 text-red-500 border-red-500/20' :
                              'bg-amber-600/10 text-amber-500 border-amber-500/20'
                          }`}>
                          {reg.paymentStatus?.toUpperCase() || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/60">
                            {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'N/A'}
                          </p>
                          <p className="text-[8px] font-bold text-white/20 tracking-tighter text-right">
                            {reg.registrationDate ? new Date(reg.registrationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="p-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all rounded-lg"
                            title="VIEW ASSET INTEL"
                          >
                            <ExternalLink size={14} />
                          </button>
                          {clearanceLevel >= 2 && (
                            <button
                              onClick={() => handleDelete(reg._id, reg.name)}
                              className="p-2.5 bg-white/5 border border-white/10 text-white/60 hover:text-red-600 hover:border-red-600/50 hover:bg-red-600/5 transition-all rounded-lg"
                              title="PURGE ASSET (SUPER ADMIN ONLY)"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <RegistrationDetailModal
        reg={selectedReg}
        onClose={() => setSelectedReg(null)}
      />

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
