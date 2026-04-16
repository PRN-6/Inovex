import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Card = ({ isVisible, index }) => {
  const cardRef = useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);

  // Animate first card on scroll
  useEffect(() => {
    if (cardRef.current && index === 0 && !hasAnimated) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Trigger when scrolled to Events section
        if (scrollPosition >= windowHeight * 0.5 && !hasAnimated) {
          setHasAnimated(true);
          
          // Set initial hidden state
          gsap.set(cardRef.current, {
            x: 200,
            opacity: 0,
            rotationY: 45,
            scale: 0.8
          });
          
          // Animate from right to left
          gsap.to(cardRef.current, {
            x: 0,
            opacity: 1,
            rotationY: 0,
            scale: 1,
            duration: 1.0,
            ease: "power3.out"
          });
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [index, hasAnimated]);

  // Animate card when clicked
  useEffect(() => {
    if (cardRef.current && isVisible && !(index === 0 && hasAnimated)) {
      // Set initial hidden state
      gsap.set(cardRef.current, {
        x: 200,
        opacity: 0,
        rotationY: 45,
        scale: 0.8
      });
      
      // Animate from right to left
      gsap.to(cardRef.current, {
        x: 0,
        opacity: 1,
        rotationY: 0,
        scale: 1,
        duration: 1.0,
        ease: "power3.out"
      });
    }
  }, [isVisible, index, hasAnimated]);

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Card */}
      <div
        ref={cardRef}
        className="md:hidden absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl h-96 relative overflow-hidden">
          {/* Card image from public folder */}
          <div className="absolute inset-0">
            <img 
              src="/images/card1.png" 
              alt="Event card" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Mobile card content - optimized for small screens */}
         
        </div>
      </div>

      {/* Desktop Card */}
      <div
        ref={cardRef}
        className="hidden md:block absolute left-auto right-40 top-1/2 transform -translate-y-1/2 w-96"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl h-144 relative overflow-hidden">
          {/* Card image from public folder */}
          <div className="absolute inset-0">
            <img 
              src="/images/card1.png" 
              alt="Event card" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Desktop card content - larger layout */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-8">
           
            
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
