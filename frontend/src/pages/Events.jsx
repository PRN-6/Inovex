import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Card from '../components/Card';
import MobileCard from '../components/MobileCard';
import EventModal from '../components/EventModal';
import { eventsData } from '../data/eventsData';

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get('type') || 'all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state with search params
  useEffect(() => {
    const type = searchParams.get('type');
    if (type && ['all', 'technical', 'management', 'cultural'].includes(type)) {
      setActiveFilter(type);
    }
  }, [searchParams]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentCardIndex(0);
  }, [activeFilter]);

  // Get filtered event IDs
  const filteredEventIds = React.useMemo(() => {
    const allEventIds = Object.keys(eventsData).map(Number);
    return allEventIds.filter(id =>
      activeFilter === 'all' || eventsData[id].type === activeFilter
    );
  }, [activeFilter]);

  const handleFilterChange = (type) => {
    setActiveFilter(type);
    setSearchParams({ type });
  };

  // Calculate card positions based on current index and total filtered cards
  const getCardPosition = React.useCallback((cardIndexInArray, centerIndex, total) => {
    if (total === 0) return { x: 0, scale: 0, opacity: 0, zIndex: 0 };

    const offset = (cardIndexInArray - centerIndex + total) % total;

    // Normalize offset to find shortest path to center
    let normalizedOffset = offset;
    if (offset > total / 2) {
      normalizedOffset = offset - total;
    }

    // Define positions for cards relative to center
    const positions = {
      0: { x: 0, scale: 1, opacity: 1, zIndex: 20 }, // Center
      1: { x: 180, scale: 0.9, opacity: 1, zIndex: 15 }, // Right
      2: { x: 320, scale: 0.8, opacity: 0.9, zIndex: 10 }, // Far right
      3: { x: 420, scale: 0.7, opacity: 0.7, zIndex: 5 }, // Extra far right
      '-1': { x: -180, scale: 0.9, opacity: 1, zIndex: 15 }, // Left
      '-2': { x: -320, scale: 0.8, opacity: 0.9, zIndex: 10 }, // Far left
      '-3': { x: -420, scale: 0.7, opacity: 0.7, zIndex: 5 }, // Extra far left
    };

    return positions[normalizedOffset] || {
      x: normalizedOffset > 0 ? 600 : -600,
      scale: 0.6,
      opacity: 0,
      zIndex: 1
    };
  }, []);

  // Auto-rotate cards automatically
  useEffect(() => {
    if (filteredEventIds.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCardIndex((prev) => (prev + 1) % filteredEventIds.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [filteredEventIds.length]);

  // Handle card click to open modal
  const handleCardIndexClick = (indexInArray) => {
    if (indexInArray === currentCardIndex) {
      const eventId = filteredEventIds[indexInArray];
      setSelectedEvent(eventsData[eventId]);
      setIsModalOpen(true);
    } else {
      setCurrentCardIndex(indexInArray);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 300);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
    setSwipeOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    const currentTouch = e.targetTouches[0].clientX;
    const offset = currentTouch - touchStart;
    setSwipeOffset(offset);
  };

  const handleTouchEnd = (e) => {
    if (!isSwiping || filteredEventIds.length <= 1) return;
    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchStart - touchEnd;

    setIsSwiping(false);

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        setCurrentCardIndex((prev) => (prev + 1) % filteredEventIds.length);
      } else {
        setCurrentCardIndex((prev) => (prev - 1 + filteredEventIds.length) % filteredEventIds.length);
      }
    }
    setSwipeOffset(0);
  };

  return (
    <div
      id="events"
      className="min-h-screen relative flex items-center justify-center overflow-x-hidden overflow-y-auto"
      style={{
        background: 'linear-gradient(180deg, #000000, #030303)',
        touchAction: 'pan-y'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background INOVEX Text */}
      <div className="absolute inset-0 flex items-center justify-center md:pr-20 md:justify-end overflow-hidden pointer-events-none">
        <h1 className="text-[15rem] font-black text-white/5 tracking-tighter uppercase select-none md:rotate-0 rotate-90">
          INOVEX
        </h1>
      </div>

      {/* Geometric Shapes Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/5 rotate-12"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white/10 rotate-45"></div>
      </div>

      {/* Header Section */}
      <div className="absolute top-8 left-8 md:left-40 z-20 flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl font-black text-yellow-400 tracking-normal uppercase">
          Events
        </h1>

        {/* Filter Buttons - Mobile Scrollable Chips */}
        <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2 max-w-[calc(100vw-2rem)] -ml-6 md:ml-0 pr-4 md:pr-0">
          {['all', 'technical', 'management', 'cultural'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 border flex-shrink-0 ${activeFilter === type
                ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                : 'bg-black/40 text-white/60 border-white/10 hover:border-white/30 hover:text-white'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Container */}
      <div
        className="relative flex items-center justify-center w-full"
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {/* Mobile Version */}
        <div className="md:hidden relative z-20 w-full" style={{ height: '420px', overflow: 'hidden' }}>
          {filteredEventIds.map((eventId, indexInArray) => {
            const offset = (indexInArray - currentCardIndex + filteredEventIds.length) % filteredEventIds.length;

            // Only show neighboring cards
            if (filteredEventIds.length > 1) {
              if (offset > 1 && offset < filteredEventIds.length - 1) return null;
            } else if (offset !== 0) return null;

            let mobileX = 0;
            if (offset === 1) mobileX = 80;
            else if (offset === filteredEventIds.length - 1 && filteredEventIds.length > 1) mobileX = -80;

            const isCenter = offset === 0;

            return (
              <div
                key={eventId}
                className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%) translateX(${mobileX}px) scale(${isCenter ? 1 : 0.8})`,
                  opacity: isCenter ? 1 : 0.7,
                  zIndex: isCenter ? 20 : 15,
                  maxWidth: '256px',
                  width: '256px',
                }}
                onClick={() => handleCardIndexClick(indexInArray)}
              >
                <MobileCard isVisible={true} eventId={eventId} shouldSpin={false} setShouldSpin={() => { }} />
              </div>
            );
          })}
        </div>

        {/* Desktop Version */}
        <div className="hidden md:block relative w-full h-128">
          {filteredEventIds.map((eventId, indexInArray) => {
            const position = getCardPosition(indexInArray, currentCardIndex, filteredEventIds.length);
            return (
              <div
                key={eventId}
                className="absolute top-1/2 left-1/2 transition-all duration-700 ease-in-out cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%) translateX(${position.x}px) scale(${position.scale})`,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                }}
                onClick={() => handleCardIndexClick(indexInArray)}
              >
                <Card isVisible={true} eventId={eventId} shouldSpin={false} setShouldSpin={() => { }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Selector dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-white/60 font-medium capitalize">
            {activeFilter} Events ({filteredEventIds.length})
          </p>
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            {filteredEventIds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCardIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentCardIndex ? 'bg-yellow-400 scale-150 shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'bg-white/40 hover:bg-white/60'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Events;