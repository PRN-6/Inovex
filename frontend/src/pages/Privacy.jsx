import React, { useEffect } from 'react';
import { ShieldCheck, Lock, Eye, Database, Globe, Server, FileText } from 'lucide-react';

const Privacy = () => {
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
              <ShieldCheck size={32} />
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">DATA PROTOCOL</h1>
            </div>
            <p className="text-gray-500 text-xs font-black tracking-[0.5em]">
              INOVEX PRIVACY POLICY // VERSION 1.0.4-B
            </p>
          </div>

          {/* Section 1: Collection */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <Database size={20} />
              01. DATA ACQUISITION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <div className="p-6 border border-white/5 bg-white/[0.02] space-y-4">
                <h3 className="font-black text-white uppercase italic">Direct Inputs</h3>
                <p>We collect essential biological and academic data points including your Full Name, Email, USN, and Institution details during the registration phase. This data is required for asset identification and site access.</p>
              </div>
              <div className="p-6 border border-white/5 bg-white/[0.02] space-y-4">
                <h3 className="font-black text-white uppercase italic">Technical Logs</h3>
                <p>Automated systems log your entry coordinates (IP address), browser signature, and interaction timestamps to maintain containment stability and prevent unauthorized breaches.</p>
              </div>
            </div>
          </section>

          {/* Section 2: Usage */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <Server size={20} />
              02. PROCESSING LOGIC
            </h2>
            <div className="space-y-4 text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>All extracted data is utilized exclusively for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Validation of participant credentials for INOVEX 2026.</li>
                <li>Generation of secure access tokens and digital certifications.</li>
                <li>Transmission of critical mission updates and emergency alerts.</li>
                <li>Refinement of system UX through anonymized telemetry.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Third Party */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <Globe size={20} />
              03. EXTERNAL TRANSFERS
            </h2>
            <div className="p-6 border border-white/5 bg-white/[0.02] text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>INOVEX does not trade biological assets with external entities. Data is only shared with authorized partners (e.g., Razorpay for financial clearance) under strict non-disclosure protocols. We do not sell your data to black-market aggregators.</p>
            </div>
          </section>

          {/* Section 4: Security */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <Lock size={20} />
              04. CONTAINMENT MEASURES
            </h2>
            <div className="space-y-4 text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>Your data is encrypted using military-grade AES-256 protocols and stored on isolated servers. In the event of a containment breach, all affected assets will be notified within 72 hours as per international data safety laws.</p>
            </div>
          </section>

          {/* Section 5: Contact */}
          <section className="pt-8 border-t border-white/10 text-center space-y-6">
            <p className="text-[10px] font-black tracking-[0.4em] text-white/30">
              QUESTIONS REGARDING DATA INTEGRITY?
            </p>
            <a href="mailto:inovex2026@gmail.com" className="inline-block px-8 py-3 border border-red-600/50 hover:bg-red-600 transition-all text-xs font-black tracking-widest italic">
              CONTACT SECURITY DIVISION
            </a>
          </section>
        </div>
      </main>

      {/* Decorative Watermark */}
      <div className="fixed bottom-0 right-0 text-[20vw] font-black italic opacity-[0.02] pointer-events-none translate-y-20 select-none">
        SECURE
      </div>
    </div>
  );
};

export default Privacy;
