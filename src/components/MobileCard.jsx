import React, { useState, useEffect, useRef } from 'react';

const MobileCard = ({ isVisible, selectedIndex, shouldSpin, setShouldSpin }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(selectedIndex || 0);
  const [isSpinning, setIsSpinning] = useState(false);
  const mobileCardRef = useRef(null);

  useEffect(() => {
    if (shouldSpin && !isSpinning) {
      setIsSpinning(true);
      const spinInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % 12);
      }, 100);

      const stopSpinTimeout = setTimeout(() => {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setShouldSpin(false);
        setCurrentImageIndex(selectedIndex || 0);
      }, 2000);

      return () => {
        clearInterval(spinInterval);
        clearTimeout(stopSpinTimeout);
      };
    }
  }, [shouldSpin, isSpinning, selectedIndex, setShouldSpin]);

  useEffect(() => {
    if (!isSpinning) {
      setCurrentImageIndex(selectedIndex || 0);
    }
  }, [selectedIndex, isSpinning]);

  const handleMouseMove = (e, cardElement) => {
    if (!cardElement) return;
    
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    cardElement.style.transition = 'transform 0.5s ease';
  };

  const handleMouseLeave = (cardElement) => {
    if (!cardElement) return;
    
    cardElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    cardElement.style.transition = 'transform 0.5s ease';
  };

  if (!isVisible) return null;

  return (
    <div
      ref={mobileCardRef}
      className="md:hidden relative w-56"
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      onMouseMove={(e) => handleMouseMove(e, mobileCardRef.current)}
      onMouseLeave={() => handleMouseLeave(mobileCardRef.current)}
    >
      <div className="bg-white rounded-2xl shadow-2xl h-80 relative overflow-hidden">
        {/* Card image from public folder */}
        <div className="absolute inset-0">
          <img 
            src={`/images/card${currentImageIndex + 1}.png`} 
            alt="Event card" 
            className="w-full h-full object-cover"
          />
        </div>
        
     
       
      </div>
    </div>
  );
};

export default MobileCard;
