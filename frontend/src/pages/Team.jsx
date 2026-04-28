import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Shield, Fingerprint, Activity } from 'lucide-react';
import { FaLinkedin, FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import { teamData } from '../data/teamData';

const Team = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Initial entrance animation
    gsap.fromTo(cardsRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 overflow-hidden relative md:pl-16 flex flex-col items-center">

      {/* Background Grid & Scanlines */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/scanlines.png')] mix-blend-overlay opacity-20"></div>

      {/* Extreme Background Text */}
      <div className="absolute top-40 -left-20 text-[20vw] font-black italic opacity-[0.02] pointer-events-none select-none leading-none z-0">
        PERSONNEL
      </div>

      <div className="w-full max-w-7xl px-6 lg:px-12 relative z-10" ref={containerRef}>

        {/* Header */}
        <div className="mb-16 border-l-4 border-red-600 pl-6">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            <span className="text-xs font-black tracking-[0.4em] uppercase">Security Clearance Req.</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4">
            Personnel <br /> <span className="text-white/40">Database</span>
          </h1>
          <div className="flex items-center gap-6 text-xs font-black tracking-widest text-white/30 uppercase">
            <span className="flex items-center gap-2"><Activity size={14} className="text-jurassic-yellow" /> Status: Active</span>
            <span className="hidden md:inline">|</span>
            <span>Access Level: Omega</span>
          </div>
        </div>

        {/* Helper function to render a team member card */}
        {(() => {
          const renderMemberCard = (member, customClass = "") => {
            const index = teamData.findIndex(m => m.id === member.id);
            return (
              <div
                key={member.id}
                ref={el => cardsRef.current[index] = el}
                className={`group relative bg-[#0a0a0a] border border-white/10 overflow-hidden 
                           hover:border-red-600/50 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] 
                           transition-all duration-500 ease-out perspective-1000
                           hover:[transform:rotateX(5deg)_rotateY(-5deg)_translateY(-5px)] ${customClass}`}
              >

                {/* Holographic Shimmer Effect */}
                <div className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent w-[200%] animate-holo"></div>
                </div>

                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-black">

                  {/* actual Image */}
                  <div className="w-full h-full relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-110 group-hover:brightness-110"
                    />

                    {/* Cyber Mesh Overlay */}
                    <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-20 pointer-events-none bg-[radial-gradient(circle,rgba(220,38,38,0.2)_1px,transparent_1px)] bg-[size:10px_10px]"></div>

                    {/* Moving Scan line */}
                    <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 pointer-events-none overflow-hidden">
                      <div className="w-full h-[50%] bg-gradient-to-b from-transparent via-red-600/5 to-transparent animate-scan-line"></div>
                    </div>
                  </div>

                  {/* Contrast Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-20"></div>
                </div>

                {/* Data Context */}
                <div className="p-5 relative z-10">
                  <div className="mb-4">
                    <h3 className="text-lg font-black italic tracking-wide text-white group-hover:text-white transition-colors">{member.name}</h3>
                    <span className="text-[10px] font-black tracking-widest text-red-500 uppercase block mt-1">{member.role}</span>
                  </div>

                  {/* Social Feed Links */}
                  {member.socials && Object.keys(member.socials).length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 justify-end">
                      {member.socials.linkedin && (
                        <a href={member.socials.linkedin} target="_blank" rel="noreferrer" className="text-[12px] text-[#0a66c2] hover:text-white bg-[#0a66c2]/10 hover:bg-[#0a66c2] p-1.5 rounded-sm transition-all flex items-center justify-center">
                          <FaLinkedin />
                        </a>
                      )}
                      {member.socials.github && (
                        <a href={member.socials.github} target="_blank" rel="noreferrer" className="text-[12px] text-white hover:text-black bg-white/10 hover:bg-white p-1.5 rounded-sm transition-all flex items-center justify-center">
                          <FaGithub />
                        </a>
                      )}
                      {member.socials.instagram && (
                        <a href={member.socials.instagram} target="_blank" rel="noreferrer" className="text-[12px] text-[#E1306C] hover:text-white bg-[#E1306C]/10 hover:bg-[#E1306C] p-1.5 rounded-sm transition-all flex items-center justify-center">
                          <FaInstagram />
                        </a>
                      )}
                      {member.socials.twitter && (
                        <a href={member.socials.twitter} target="_blank" rel="noreferrer" className="text-[12px] text-[#1DA1F2] hover:text-white bg-[#1DA1F2]/10 hover:bg-[#1DA1F2] p-1.5 rounded-sm transition-all flex items-center justify-center">
                          <FaTwitter />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Decorative Corner Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          };

          return (
            <>
              {/* Faculty Coordinators Section */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-black italic tracking-wide text-white mb-8 border-l-4 border-red-600 pl-4 uppercase">
                  Faculty <span className="text-white/40">Coordinators</span>
                </h2>
                {/* Flex container to center few faculty members, or match grid if many */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6">
                  {teamData.filter(m => m.category === 'faculty').map(member =>
                    renderMemberCard(member, "w-[calc(50%-6px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]")
                  )}
                </div>
              </div>

              {/* Event & Student Heads Section */}
              <div>
                <h2 className="text-2xl md:text-3xl font-black italic tracking-wide text-white mb-8 border-l-4 border-red-600 pl-4 uppercase">
                  Core <span className="text-white/40">Committee</span>
                </h2>
                {/* Standard grid for students */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
                  {teamData.filter(m => m.category === 'student').map(member =>
                    renderMemberCard(member)
                  )}
                </div>
              </div>
            </>
          );
        })()}

      </div>
    </div>
  );
};

export default Team;


// Faculty Coordinators
// member1.jpg — Dr. Vijesh Krishnan
// member2.jpg — Mr. Ragesh Raju
// member3.jpg — Mrs. Jayashree J
// Core Committee
// member4.jpg — Rohit Durgappa Kattimani
// member5.jpg — Venisha Rizal D'souza
// member6.jpg — Deeksha S Shetty
// member7.jpg — Deeksha Shetty
// member8.jpg — Ruchita R Jadhav
// member9.jpg — Sanjana S R
// member10.jpg — Abhiram
// member11.jpg — Harshith
// member12.jpg — Kushi P
// member13.jpg — Harshita A
// member14.jpg — Durgashree S
// member15.jpg — Niyam Shetty
// member16.jpg — Darshan Prabhakar
// member17.jpg — Joycil Britto