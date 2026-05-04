import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { HelpCircle, ChevronDown, AlertTriangle, Radio, FileText } from 'lucide-react';

const faqs = [
  {
    category: 'GENERAL PROTOCOL',
    icon: '🦖',
    items: [
      {
        q: 'What is INOVEX?',
        a: 'INOVEX is the premier annual techno-cultural symposium hosted by AJ Institute of Engineering & Technology. It is a multi-day expedition into technology, innovation, and culture — engineered for the next generation of visionaries.',
      },
      {
        q: 'When and where does INOVEX take place?',
        a: 'INOVEX is a 3-day event held on the main campus of AJ Institute of Engineering & Technology, Mangalore. Exact dates and venue specifics will be broadcast via official communication channels.',
      },
      {
        q: 'Who can attend INOVEX?',
        a: 'INOVEX is open to all students — UG and PG — from colleges across the region. Some events are restricted to specific student categories (UG or PG only); this will be clearly indicated on each event\'s detail panel.',
      },
    ],
  },
  {
    category: 'REGISTRATION INTEL',
    icon: '🔐',
    items: [
      {
        q: 'How do I register for events?',
        a: 'Navigate to the Registration terminal via the "Register Now" portal. Fill in your details and select your events. Upon submission, you will receive a unique Participant ID (PID). Show this PID at the college entrance desk to complete your physical payment via QR code.',
      },
      {
        q: 'What is the registration fee?',
        a: 'The registration fee is ₹100 per event. Your total amount due will be displayed on the registration success screen and sent to your registered email address.',
      },
      {
        q: 'Can I register for multiple events?',
        a: 'Affirmative. You can register for multiple events. Every registration (even with the same email) is treated as a unique entry to ensure all team participants are correctly logged.',
      },
      {
        q: 'Is my registration data safe?',
        a: 'Your data is stored on a secured MongoDB Atlas cluster with strict access control. We prioritize participant privacy and data integrity.',
      },
    ],
  },
  {
    category: 'EVENT OPERATIONS',
    icon: '⚡',
    items: [
      {
        q: 'How do I know my registration is confirmed?',
        a: 'Upon successful registration, a confirmation email with your Participant ID (PID) is dispatched. After you complete the payment at the physical desk, your status will be updated to "PAID" in our systems, and you will receive a final payment verification email.',
      },
      {
        q: 'Can I participate in events without prior registration?',
        a: 'Spot registrations may be available for select events at the discretion of coordinators. However, pre-registration guarantees your slot and is strongly recommended to avoid capacity issues.',
      },
      {
        q: 'What should I bring on event day?',
        a: 'Carry a valid college ID, your registration confirmation email/screenshot, and any event-specific materials mentioned in the event briefing. Report to the designated venue at least 15 minutes before your event start time.',
      },
      {
        q: 'Are there prizes?',
        a: 'Absolutely. Top performers across all events receive trophies, certificates, and prize money. Specific prize details are listed in each event\'s detail panel. Winners also earn eternal bragging rights.',
      },
    ],
  },
  {
    category: 'TECHNICAL SUPPORT',
    icon: '🛠️',
    items: [
      {
        q: 'I\'m facing issues with the registration portal. Who do I contact?',
        a: 'Use the Feedback terminal (accessible via the navigation sidebar) to report technical issues. Alternatively, contact the event coordinators listed on each event\'s detail page directly.',
      },
      {
        q: 'The website is not loading properly. What should I do?',
        a: 'Try clearing your browser cache and reloading. INOVEX is optimized for modern browsers (Chrome, Firefox, Edge). If issues persist, try disabling browser extensions or switching to a different device/network.',
      },
    ],
  },
];

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef(null);
  const itemRef = useRef(null);

  useEffect(() => {
    if (answerRef.current) {
      if (isOpen) {
        gsap.fromTo(
          answerRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.35, ease: 'power3.out' }
        );
      } else {
        gsap.to(answerRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'power3.in',
        });
      }
    }
  }, [isOpen]);

  return (
    <div
      ref={itemRef}
      className={`border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-red-600/50 bg-red-950/10'
          : 'border-white/10 bg-[#0a0a0a] hover:border-white/20'
      }`}
    >
      <button
        id={`faq-item-${index}`}
        className="w-full flex items-center justify-between px-6 py-5 text-left group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <span className="text-red-500 font-black text-xs tracking-[0.3em] shrink-0 w-8">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`font-semibold text-sm md:text-base leading-snug transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
            {question}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-red-500 shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div ref={answerRef} style={{ height: 0, overflow: 'hidden', opacity: 0 }}>
        <div className="px-6 pb-5 pl-[4.5rem] text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const headerRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    gsap.fromTo(
      headerRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo(
      sectionsRef.current.filter(Boolean),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  let globalIndex = 0;

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

      {/* Background text */}
      <div className="absolute top-32 -right-10 text-[18vw] font-black italic opacity-[0.02] pointer-events-none select-none leading-none z-0">
        FAQ
      </div>

      <div className="w-full max-w-4xl mx-auto px-6 lg:px-12 relative z-10">

        {/* Header */}
        <div ref={headerRef} className="mb-16 border-l-4 border-jurassic-yellow pl-6">
          <div className="flex items-center gap-3 text-jurassic-yellow mb-2">
            <HelpCircle size={16} className="animate-pulse" />
            <span className="text-xs font-black tracking-[0.4em] uppercase">Intel Briefing</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            Frequently <span className="text-red-600">Asked</span>
          </h1>
          <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
            Authorized Access Only · Clearance Level: Public
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center gap-6 mb-12 px-5 py-3 border border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Radio size={12} className="text-red-500 animate-pulse" />
            <span className="text-xs font-black tracking-widest text-red-500 uppercase">Live Briefing</span>
          </div>
          <div className="flex items-center gap-2 text-white/30">
            <FileText size={12} />
            <span className="text-xs tracking-wider">
              {faqs.reduce((acc, cat) => acc + cat.items.length, 0)} Questions Logged
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/30">
            <AlertTriangle size={12} className="text-jurassic-yellow" />
            <span className="text-xs tracking-wider">Click any entry to expand</span>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqs.map((category, catIdx) => {
            const startIndex = globalIndex;
            globalIndex += category.items.length;
            return (
              <div
                key={catIdx}
                ref={(el) => (sectionsRef.current[catIdx] = el)}
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-xs font-black tracking-[0.4em] text-white/40 uppercase">
                    {category.category}
                  </h2>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Questions */}
                <div className="space-y-2">
                  {category.items.map((item, itemIdx) => (
                    <FAQItem
                      key={itemIdx}
                      question={item.q}
                      answer={item.a}
                      index={startIndex + itemIdx}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 border border-jurassic-yellow/20 bg-jurassic-yellow/5 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,#ca8a04_8px,#ca8a04_16px)] opacity-40" />
          <p className="text-white/50 text-xs tracking-widest uppercase mb-2">Still have questions?</p>
          <p className="text-white font-bold text-lg mb-4">
            Reach out via the <span className="text-jurassic-yellow">Feedback Terminal</span>
          </p>
          <p className="text-white/30 text-xs">
            Use the feedback icon in the sidebar navigation — our coordinators will respond promptly.
          </p>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
