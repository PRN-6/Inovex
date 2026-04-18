import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowLeft, Calendar, MapPin, Users, Trophy, Clock, Tag, X } from 'lucide-react';

const EventModal = ({ event, isOpen, onClose }) => {
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
      const tl = gsap.timeline();
      
      // Animate backdrop
      tl.to(backdropRef.current, { 
        opacity: 1, 
        duration: 0.3, 
        ease: "power2.out" 
      })
      
      // Animate content coming from card position
      .to(contentRef.current, { 
        scale: 1, 
        rotation: 0, 
        x: 0, 
        y: 0,
        opacity: 1, 
        duration: 0.8, 
        ease: "back.out(1.2)" 
      }, "-=0.2");

      return () => {
        tl.kill();
      };
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
      style={{ display: 'none' }}
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
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 p-6 z-10">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group mb-4"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Events</span>
          </button>
          
          {/* <h1 className="text-3xl md:text-4xl font-black bg-linear-to-r from-white to-jurassic-yellow bg-clip-text text-transparent">
            {event.title}
          </h1> */}
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Image and Basic Info */}
            <div>
              {/* Event Image */}
              <div className="mb-6 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full md:h-full object-cover"
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
                
                <div className="mt-6 pt-6 border-t border-white/10">
                  {/* <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-jurassic-yellow" />
                      <div>
                        <p className="text-xs text-white/60">Prize Pool</p>
                        <p className="text-xl font-bold text-jurassic-yellow">{event.prize}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-jurassic-red" />
                      <span className="px-3 py-1 bg-jurassic-red/20 border border-jurassic-red/50 rounded-full text-xs font-semibold">
                        {event.category}
                      </span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-jurassic-yellow">About the Event</h2>
                <p className="text-white/80 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Rules */}
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-3 text-jurassic-yellow">Rules & Regulations</h2>
                <ul className="space-y-2">
                  {event.rules.map((rule, index) => (
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
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-bold mb-3 text-jurassic-yellow">Event Coordinator</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">{event.coordinator}</p>
                    <p className="text-white/60 text-sm">Contact: {event.contact}</p>
                  </div>
                  {/* <button className="bg-jurassic-red hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 active:scale-95">
                    Register Now
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
