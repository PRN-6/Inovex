import React, { useEffect } from 'react';
import { FileText, CheckSquare, AlertTriangle, Clock, ShieldAlert, Mail } from 'lucide-react';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden uppercase font-jurassic">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(223,31,38,0.05)_0%,rgba(0,0,0,1)_70%)]" />
      <div className="absolute top-0 left-0 w-full h-[6px] bg-[repeating-linear-gradient(45deg,#df1f26,#df1f26_10px,#000_10px,#000_20px)] opacity-20"></div>

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4 text-red-600">
              <FileText size={32} />
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">OPERATING TERMS</h1>
            </div>
            <p className="text-gray-500 text-xs font-black tracking-[0.5em]">
              INOVEX TERMS & CONDITIONS // VERSION 2.1.0-A
            </p>
          </div>

          {/* Section 1: Acceptance */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <CheckSquare size={20} />
              01. PARTICIPANT AGREEMENT
            </h2>
            <div className="p-6 border border-white/5 bg-white/[0.02] text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>By accessing the INOVEX 2026 terminal and registering for designated quests, you legally bind yourself to these operational protocols. Unauthorized tampering, false identity usage, or violation of these terms will result in immediate termination of access and potential exclusion from future INOVEX operations.</p>
            </div>
          </section>

          {/* Section 2: Conduct */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <AlertTriangle size={20} />
              02. BEHAVIORAL PROTOCOLS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <div className="p-6 border border-white/5 bg-white/[0.02] space-y-4">
                <h3 className="font-black text-white uppercase italic">Fair Play</h3>
                <p>All participants must adhere to strict ethical coding and competition guidelines. The use of unauthorized external algorithms, sabotage of rival teams, or exploitation of system vulnerabilities is strictly prohibited.</p>
              </div>
              <div className="p-6 border border-white/5 bg-white/[0.02] space-y-4">
                <h3 className="font-black text-white uppercase italic">Asset Interaction</h3>
                <p>Respect for event hardware, venue infrastructure, and coordination personnel is mandatory. Any physical or digital damage to INOVEX property will result in severe penalties and institutional notification.</p>
              </div>
            </div>
          </section>

          {/* Section 3: Modifications */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <Clock size={20} />
              03. SCHEDULE ADJUSTMENTS
            </h2>
            <div className="space-y-4 text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>The INOVEX control center reserves the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify quest timelines without prior external notice.</li>
                <li>Alter problem statements or evaluation criteria based on real-time operational needs.</li>
                <li>Cancel specific events in case of catastrophic system failures or insufficient participant registration.</li>
                <li>Replace designated coordinators or judges dynamically.</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Liability */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <ShieldAlert size={20} />
              04. RISK ASSUMPTION
            </h2>
            <div className="p-6 border border-white/5 bg-white/[0.02] text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>Participation in INOVEX 2026 is strictly at your own risk. The organizing committee, affiliated institution, and INOVEX corporate sponsors shall not be held liable for personal injury, hardware failure, data loss, or emotional distress experienced during the execution of high-stress competitive tasks.</p>
            </div>
          </section>

          {/* Section 5: Contact */}
          <section className="pt-8 border-t border-white/10 text-center space-y-6">
            <p className="text-[10px] font-black tracking-[0.4em] text-white/30">
              REQUIRE CLARIFICATION ON PROTOCOLS?
            </p>
            <a href="mailto:inovex2026@gmail.com" className="inline-block px-8 py-3 border border-red-600/50 hover:bg-red-600 transition-all text-xs font-black tracking-widest italic">
              CONTACT LEGAL DIVISION
            </a>
          </section>
        </div>
      </main>

      {/* Decorative Watermark */}
      <div className="fixed bottom-0 right-0 text-[18vw] font-black italic opacity-[0.02] pointer-events-none translate-y-20 select-none">
        MANDATE
      </div>
    </div>
  );
};

export default Terms;
