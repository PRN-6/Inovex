import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Clock, Tag, X, ShieldCheck, Flame } from 'lucide-react';

const EventModal = ({ event, isOpen, onClose }) => {
  const isBackendDisabled = import.meta.env.VITE_DISABLE_BACKEND === 'true';
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    if (isOpen && event) {
      // Set initial states
      gsap.set(backdropRef.current, { opacity: 0 });
      gsap.set(contentRef.current, {
        scale: 0.3,
        rotation: 15,
        x: -200,
        y: -200,
        opacity: 0
      });
      gsap.set(modalRef.current, { display: 'flex' });

      // Create timeline
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.to(backdropRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        })
          .to(contentRef.current, {
            scale: 1,
            rotation: 0,
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.2)"
          }, "-=0.2");
      });
      return () => ctx.revert();
    } else if (!isOpen) {
      // Close animation
      const tl = gsap.timeline();

      tl.to(contentRef.current, {
        scale: 0.3,
        rotation: -15,
        x: 200,
        y: -200,
        opacity: 0,
        duration: 0.5,
        ease: "back.in(1.2)"
      })
        .to(backdropRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        }, "-=0.3")
        .set(modalRef.current, { display: 'none' });
    }
  }, [isOpen, event]);

  if (!event) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 hidden items-center justify-center p-4"
    >
      {/* Transparent Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative max-w-7xl w-full max-h-[95vh] overflow-y-auto bg-black/80 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl mx-4 md:mx-0 scrollbar-hide"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 p-6 z-10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Events</span>
          </button>

          {/* Eligibility Badge */}
          {event.participants?.includes('UG Students') && (
            <div className="px-4 py-1.5 bg-red-600/20 border border-red-500/50 rounded-full flex items-center gap-2 animate-pulse">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span className="text-[10px] font-black tracking-[0.2em] text-red-500">ONLY FOR UG STUDENTS</span>
            </div>
          )}
          {event.participants?.includes('PG Students') && (
            <div className="px-4 py-1.5 bg-green-600/20 border border-green-500/50 rounded-full flex items-center gap-2 animate-pulse">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span className="text-[10px] font-black tracking-[0.2em] text-green-500">ONLY FOR PG STUDENTS</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Image and Basic Info */}
            <div>
              <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full md:h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* Quick Info */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-jurassic-yellow" />
                    <div>
                      <p className="text-xs text-white/60">Date</p>
                      <p className="text-sm font-semibold">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-jurassic-yellow" />
                    <div>
                      <p className="text-xs text-white/60">Time</p>
                      <p className="text-sm font-semibold">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-jurassic-yellow" />
                    <div>
                      <p className="text-xs text-white/60">Location</p>
                      <p className="text-sm font-semibold">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-jurassic-yellow" />
                    <div>
                      <p className="text-xs text-white/60">Participants</p>
                      <p className="text-sm font-semibold">{event.participants}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-jurassic-yellow">About {event.title}</h2>
                <p className="text-white/80 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Rounds Data */}
              {event.roundsData && event.roundsData.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center justify-between text-jurassic-yellow">
                    <span>Event Rounds</span>
                    <span className="text-sm font-normal text-white/50 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                      Total: {event.roundsConducted || event.roundsData.length}
                    </span>
                  </h2>
                  <div className="space-y-4">
                    {event.roundsData.map((round, index) => (
                      <div key={index} className="bg-black/40 border border-white/10 rounded-xl p-4 relative overflow-hidden group hover:border-jurassic-yellow/50 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-jurassic-yellow/50 group-hover:bg-jurassic-yellow transition-colors"></div>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 pl-2">
                          <h3 className="font-bold text-white text-md">{round.name}</h3>
                          {round.time && (
                            <span className="text-xs px-2 py-1 bg-jurassic-yellow/10 text-jurassic-yellow border border-jurassic-yellow/20 rounded-md whitespace-nowrap flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" />
                              {round.time}
                            </span>
                          )}
                        </div>
                        <p className="text-white/70 text-sm pl-2 leading-relaxed">{round.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rules */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-jurassic-yellow">Rules & Regulations</h2>
                <ul className="space-y-2">
                  {event.rules?.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-jurassic-red/20 border border-jurassic-red/50 rounded-full flex items-center justify-center text-xs font-bold text-jurassic-red shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-white/80">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coordinator */}
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8">
                <h3 className="text-lg font-bold mb-3 text-jurassic-yellow">
                  {event.coordinators && event.coordinators.length > 1 ? "Event Coordinators" : "Event Coordinator"}
                </h3>
                <div className="space-y-4">
                  {event.coordinators ? (
                    event.coordinators.map((coord, idx) => (
                      <div key={idx} className={idx !== 0 ? "pt-4 border-t border-white/5" : ""}>
                        <p className="font-semibold text-white">{coord.name}</p>
                        <p className="text-white/60 text-sm">Contact: {coord.contact}</p>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p className="font-semibold text-white">{event.coordinator}</p>
                      <p className="text-white/60 text-sm">Contact: {event.contact}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {!isBackendDisabled && (
                <div className="pt-2">
                  <Link 
                    to="/register"
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black text-sm font-black italic tracking-[0.3em] uppercase rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-amber-900/40 transform hover:-translate-y-1 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 skew-x-[-45deg] -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    <Flame size={20} className="group-hover:animate-pulse" />
                    Register For {event.title.toUpperCase()}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
