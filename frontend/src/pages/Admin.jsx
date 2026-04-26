import React, { useState, useEffect, useMemo } from 'react';
import { Database, ShieldCheck, Download, Trash2, Search, ExternalLink, Filter, TrendingUp, Users, CreditCard, Terminal, Lock, ChevronRight, Activity, FileSpreadsheet, FileText } from 'lucide-react';
import { gsap } from 'gsap';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEvent, setFilterEvent] = useState('all');
  const [clearanceLevel, setClearanceLevel] = useState(0); // 0: None, 1: Admin, 2: Super Admin

  const ADMIN_CODE = import.meta.env.VITE_ADMIN_SECRET_KEY || "INOVEX2026_ADMIN";
  const SUPER_ADMIN_CODE = import.meta.env.VITE_SUPER_ADMIN_SECRET_KEY || "INOVEX2026_SUPER";

  // Dynamic API URL for Local/Production
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : 'https://inovex-backend01.onrender.com';

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    }
  }, [isAuthenticated]);

  const fetchRegistrations = async () => {
    if (!accessCode) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/registrations`, {
        headers: {
          'x-admin-key': accessCode
        }
      });
      const data = await response.json();
      if (data && data.success && Array.isArray(data.data)) {
        setRegistrations(data.data);
      } else {
        setRegistrations([]);
        if (response.status === 401) {
          setIsAuthenticated(false);
          alert("SESSION EXPIRED OR INVALID KEY");
        }
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setRegistrations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (accessCode === SUPER_ADMIN_CODE) {
      setClearanceLevel(2);
      setIsAuthenticated(true);
    } else if (accessCode === ADMIN_CODE) {
      setClearanceLevel(1);
      setIsAuthenticated(true);
    } else {
      alert("ACCESS DENIED: INVALID CLEARANCE CODE");
    }
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

      return matchesSearch && matchesFilter;
    });
  }, [registrations, searchQuery, filterEvent]);

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
          ? ` (Squad: ${ev.teammates.map(t => `${t.name} [${t.usn}]`).join(", ")})` 
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`PROTOCOL OVERRIDE: Are you sure you want to purge asset ${name} from the database?`)) return;

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
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("CRITICAL ERROR: PURGE FAILED");
    }
  };

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
                <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-black border ${clearanceLevel >= 2 ? 'bg-red-600 text-white border-red-400' : 'bg-white/5 text-white/40 border-white/10'
                  }`}>
                  {clearanceLevel >= 2 ? 'SUPER ADMIN' : 'LEVEL 1 ACCESS'}
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
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 space-y-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-white/40 tracking-widest">TOTAL TRIBUTE</span>
              <TrendingUp size={16} className="text-green-500" />
            </div>
            <p className="text-3xl font-black italic">₹{stats.totalRevenue.toLocaleString()}</p>
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
          <div className="p-6 border border-white/5 bg-white/[0.02] space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-white/40 tracking-widest">SECURE LINK</span>
              <ShieldCheck size={16} className="text-green-500" />
            </div>
            <p className="text-3xl font-black italic text-green-500">STABLE</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-white/5 bg-white/[0.01] overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <h3 className="text-xs font-black tracking-[0.3em] flex items-center gap-3">
              <Database size={14} className="text-red-600" />
              ASSET DATABASE
            </h3>
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-white/30" />
              <select
                className="bg-black text-[10px] font-black border border-white/10 px-2 py-1 outline-none"
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
              >
                <option value="all">ALL QUESTS</option>
                {Object.keys(stats.eventBreakdown).map(ev => (
                  <option key={ev} value={ev}>{ev.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">PARTICIPANT</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">IDENTIFICATION (USN)</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">GUILD / DEPT</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">QUESTS</th>
                  <th className="p-4 text-[10px] font-black tracking-widest text-white/30">TRIBUTE</th>
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
                    <tr key={reg._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-xs font-black text-white">{reg.name || 'UNKNOWN'}</p>
                          <p className="text-[9px] font-bold text-white/30">{reg.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] font-black tracking-widest bg-white/5 px-2 py-1 rounded-sm border border-white/5">{reg.usn || 'N/A'}</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-white/60">{reg.college || 'EXTERNAL'}</p>
                          <p className="text-[9px] font-bold text-red-900/40">{reg.department || 'N/A'} // YEAR {reg.year || '?'}</p>
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
                          <p className="text-[8px] font-bold text-green-500/50 tracking-tighter truncate max-w-[100px]" title={reg.transactionId}>
                            ID: {reg.transactionId || 'CASH/OFFLINE'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-white/40 hover:text-white transition-colors" title="VIEW DETAILS">
                            <ExternalLink size={14} />
                          </button>
                          {clearanceLevel >= 2 && (
                            <button
                              onClick={() => handleDelete(reg._id, reg.name)}
                              className="p-2 text-white/40 hover:text-red-500 transition-colors"
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
