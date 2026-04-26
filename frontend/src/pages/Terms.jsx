import React, { useEffect } from 'react';
import { FileText, AlertTriangle, Scale, Zap, ShieldAlert, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden uppercase font-jurassic">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(223,31,38,0.05)_0%,rgba(0,0,0,1)_70%)]" />
      <div className="absolute top-0 left-0 w-full h-[6px] bg-[repeating-linear-gradient(45deg,#df1f26,#df1f26_10px,#000_10px,#000_20px)] opacity-20"></div>

      <Navbar />

      <main className="relative z-10 container mx-auto px-6 pt-32 pb-20 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4 text-red-600">
              <FileText size={32} />
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">ENGAGEMENT TERMS</h1>
            </div>
            <p className="text-gray-500 text-xs font-black tracking-[0.5em]">
              INOVEX USER AGREEMENT // CODE-ALPHA-9
            </p>
          </div>

          {/* Section 1: Acceptance */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <AlertTriangle size={20} />
              01. MANDATORY ACCEPTANCE
            </h2>
            <div className="p-6 border border-white/5 bg-white/[0.02] text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>By accessing the INOVEX portal or registering for any tactical quest, you agree to comply with all safety protocols and behavioral guidelines. Failure to adhere to these terms results in immediate asset termination and removal from the premises.</p>
            </div>
          </section>

          {/* Section 2: Registration */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <Zap size={20} />
              02. REGISTRATION & TRIBUTE
            </h2>
            <div className="space-y-4 text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>Tributes (Registration Fees) are mandatory for all participants. Once a payment is cleared through the Razorpay gateway:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>No refunds will be processed under any circumstances (including containment failure).</li>
                <li>Transfers of registration to other biological assets are strictly prohibited without authorization.</li>
                <li>You must provide accurate identifying data to ensure proper site clearance.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Liability */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <ShieldAlert size={20} />
              03. LIABILITY WAIVER
            </h2>
            <div className="p-6 border border-white/5 bg-white/[0.02] text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>INOVEX 2026 and its organizing committee assume zero liability for data loss, hardware failure, or any physical incidents occurring during high-intensity tactical events. Participants engage with the server and site at their own risk.</p>
            </div>
          </section>

          {/* Section 4: Conduct */}
          <section className="space-y-6">
            <h2 className="text-xl font-black text-red-600 flex items-center gap-3">
              <Scale size={20} />
              04. CODE OF CONDUCT
            </h2>
            <div className="space-y-4 text-[11px] leading-relaxed tracking-widest text-gray-400 normal-case">
              <p>All participants must exhibit professional integrity. Harassment, unauthorized system access, or disruption of competition flow will be met with immediate expulsion and potential legal action under cyber-security laws.</p>
            </div>
          </section>

          {/* Section 5: Jurisdiction */}
          <section className="pt-8 border-t border-white/10 text-center space-y-6">
            <p className="text-[10px] font-black tracking-[0.4em] text-white/30">
              LEGAL JURISDICTION: SITE-B // ISLA NUBLAR
            </p>
            <div className="flex justify-center gap-8">
              <BookOpen size={24} className="text-red-600 opacity-50" />
              <ShieldAlert size={24} className="text-red-600 opacity-50" />
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* Decorative Watermark */}
      <div className="fixed bottom-0 right-0 text-[20vw] font-black italic opacity-[0.02] pointer-events-none translate-y-20 select-none">
        LEGAL
      </div>
    </div>
  );
};

export default Terms;
