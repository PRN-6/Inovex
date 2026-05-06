import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { eventsData } from '../data/eventsData';

const Card = ({ isVisible, eventId, shouldSpin, setShouldSpin }) => {
  const mobileCardRef = useRef(null);
  const cardRef = useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [currentEventId, setCurrentEventId] = React.useState(eventId || 1);

  const event = eventsData[currentEventId];

  // Update currentEventId when eventId changes
  useEffect(() => {
    if (eventId !== null && !shouldSpin) {
      setCurrentEventId(eventId);
    }
  }, [eventId, shouldSpin]);

  // Handle tilt animation on hover
  const handleMouseMove = (e, cardElement) => {
    if (!cardElement) return;

    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    gsap.to(cardElement, {
      rotationX: rotateX,
      rotationY: rotateY,
      scale: 1.05,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (cardElement) => {
    if (!cardElement) return;

    gsap.to(cardElement, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  // Animate card when visibility changes
  useEffect(() => {
    if (cardRef.current && isVisible && !hasAnimated) {
      setHasAnimated(true);
      gsap.fromTo(cardRef.current,
        { x: 200, opacity: 0, rotationY: 45, scale: 0.8 },
        { x: 0, opacity: 1, rotationY: 0, scale: 1, duration: 1.0, ease: "power3.out" }
      );
    }
  }, [isVisible, hasAnimated]);

  // Handle spinning animation
  useEffect(() => {
    if (shouldSpin && (mobileCardRef.current || cardRef.current)) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        if (mobileCardRef.current) {
          tl.to(mobileCardRef.current, {
            rotationY: 180,
            duration: 0.6,
            ease: "power1.inOut",
            onUpdate: function () {
              if (this.progress() > 0.45) setCurrentEventId(eventId);
            }
          })
            .to(mobileCardRef.current, {
              rotationY: 360,
              duration: 0.6,
              ease: "power1.inOut",
              onComplete: () => gsap.set(mobileCardRef.current, { rotationY: 0 })
            });
        }

        if (cardRef.current) {
          tl.to(cardRef.current, {
            rotationY: 360,
            duration: 1.2,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(cardRef.current, { rotationY: 0 });
              setShouldSpin(false);
            }
          }, 0);
        }
      });
      return () => ctx.revert();
    }
  }, [shouldSpin, eventId, setShouldSpin]);

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Card */}
      <div
        ref={mobileCardRef}
        className="md:hidden relative w-64 will-change-transform"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        onMouseMove={(e) => handleMouseMove(e, mobileCardRef.current)}
        onMouseLeave={() => handleMouseLeave(mobileCardRef.current)}
      >
        <div className="bg-white rounded-2xl shadow-2xl h-96 relative overflow-hidden">
          <img
            src={event?.image || `/images/cards/card${currentEventId}.webp`}
            alt={event?.title || "Event card"}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* Eligibility Ribbon */}
          {event?.participants?.includes('PG Students') && (
            <div className="absolute top-4 right-[-35px] bg-blue-600 text-white text-[10px] font-black px-10 py-1 rotate-45 shadow-lg">
              PG ONLY
            </div>
          )}
        </div>
      </div>

      {/* Desktop Card */}
      <div
        ref={cardRef}
        className="hidden md:block relative w-80 will-change-transform"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        onMouseMove={(e) => handleMouseMove(e, cardRef.current)}
        onMouseLeave={() => handleMouseLeave(cardRef.current)}
      >
        <div className="bg-white rounded-2xl shadow-2xl h-120 relative overflow-hidden">
          <img
            src={event?.image || `/images/cards/card${currentEventId}.webp`}
            alt={event?.title || "Event card"}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* Eligibility Ribbon */}
          {event?.participants?.includes('PG Students') && (
            <div className="absolute top-6 right-[-45px] bg-blue-600 text-white text-[12px] font-black px-12 py-2 rotate-45 shadow-lg z-10">
              PG ONLY
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
