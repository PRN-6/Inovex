import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Card = ({ isVisible, selectedIndex, shouldSpin, setShouldSpin }) => {
  const mobileCardRef = useRef(null);
  const cardRef = useRef(null);
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(selectedIndex !== null ? selectedIndex : 0);

  // Update currentImageIndex when selectedIndex changes
  React.useEffect(() => {
    if (selectedIndex !== null && !shouldSpin) {
      setCurrentImageIndex(selectedIndex);
    }
  }, [selectedIndex, shouldSpin]);

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
      ease: "power2.Out"
    });
  };

  // Animate first card on scroll
  useEffect(() => {
    if (cardRef.current && selectedIndex === 0 && !hasAnimated) {
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
  }, [selectedIndex, hasAnimated]);

  // Animate card when clicked
  useEffect(() => {
    if (cardRef.current && isVisible && !(selectedIndex === 0 && hasAnimated)) {
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
  }, [isVisible, selectedIndex, hasAnimated]);

  // Handle spinning animation when shouldSpin changes
  useEffect(() => {
    if (shouldSpin && (mobileCardRef.current || cardRef.current)) {
      const timeline = gsap.timeline();
      
      // Spin mobile card
      if (mobileCardRef.current) {
        timeline
          .to(mobileCardRef.current, {
            rotationY: 180,
            duration: 0.6,
            ease: "power1.inOut",
            onUpdate: function() {
              // Change image when card is facing away (around 180 degrees)
              if (this.progress() > 0.4 && this.progress() < 0.6) {
                setCurrentImageIndex(selectedIndex);
              }
            }
          })
          .to(mobileCardRef.current, {
            rotationY: 360,
            duration: 0.6,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(mobileCardRef.current, { rotationY: 0 });
            }
          }, "-=0.6");
      }
      
      // Spin desktop card
      if (cardRef.current) {
        timeline
          .to(cardRef.current, {
            rotationY: 180,
            duration: 0.6,
            ease: "power1.inOut"
          }, "-=1.2")
          .to(cardRef.current, {
            rotationY: 360,
            duration: 0.6,
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(cardRef.current, { rotationY: 0 });
              setShouldSpin(false);
            }
          }, "-=0.6");
      }
    }
  }, [shouldSpin, selectedIndex, setShouldSpin]);

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Card */}
      <div
        ref={mobileCardRef}
        className="md:hidden relative w-64"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        onMouseMove={(e) => handleMouseMove(e, mobileCardRef.current)}
        onMouseLeave={() => handleMouseLeave(mobileCardRef.current)}
      >
        <div className="bg-white rounded-2xl shadow-2xl h-96 relative overflow-hidden">
          {/* Card image from public folder */}
          <div className="absolute inset-0">
            <img 
              src={`/images/card${currentImageIndex + 1}.png`} 
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
        className="hidden md:block relative w-96"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        onMouseMove={(e) => handleMouseMove(e, cardRef.current)}
        onMouseLeave={() => handleMouseLeave(cardRef.current)}
      >
        <div className="bg-white rounded-2xl shadow-2xl h-144 relative overflow-hidden">
          {/* Card image from public folder */}
          <div className="absolute inset-0">
            <img 
              src={`/images/card${currentImageIndex + 1}.png`} 
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
