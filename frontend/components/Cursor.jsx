'use client';

import { useEffect, useRef, useState } from 'react';

const Cursor = () => {
  const cursorRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState('default');

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let animationFrameId;

    const updateCursor = () => {
      cursor.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      animationFrameId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [position]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      const cursorType = target.getAttribute('data-cursor') || 'default';
      setCursorType(cursorType);
      
      if (target.matches('button, a, [role="button"], input, select, textarea')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e) => {
      const target = e.target;
      if (target.matches('button, a, [role="button"], input, select, textarea')) {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Check if device supports hover (desktop)
    if (window.matchMedia('(hover: hover)').matches) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseenter', handleMouseEnter, true);
      document.addEventListener('mouseleave', handleMouseLeave, true);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Hide cursor on touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) {
    return null;
  }

  const getCursorIcon = () => {
    switch (cursorType) {
      case 'pointer':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2L10 6L6 8L5.5 10L2 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
          </svg>
        );
      case 'star':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1L7.5 4.5L11 5L8.5 7.5L9 11L6 9L3 11L3.5 7.5L1 5L4.5 4.5L6 1Z" fill="currentColor"/>
          </svg>
        );
      case 'moon':
        return (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 6C10 8.76142 7.76142 11 5 11C2.23858 11 0 8.76142 0 6C0 3.23858 2.23858 1 5 1C7.76142 1 10 3.23858 10 6Z" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-50 transition-all duration-150 ease-out ${
        isClicking ? 'scale-75' : isHovering ? 'scale-125' : 'scale-100'
      }`}
      aria-hidden="true"
    >
      <div className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
        isHovering 
          ? 'bg-gradient-to-r from-orange-400 to-yellow-500 shadow-lg shadow-orange-500/30' 
          : 'bg-gradient-to-r from-orange-300/80 to-yellow-400/80 backdrop-blur-sm'
      }`}>
        {/* Halo effect */}
        <div className={`absolute inset-0 rounded-full transition-all duration-200 ${
          isHovering 
            ? 'bg-gradient-to-r from-orange-400/20 to-yellow-500/20 scale-150 blur-sm' 
            : 'bg-gradient-to-r from-orange-300/10 to-yellow-400/10 scale-125 blur-sm'
        }`} />
        
        {/* Icon overlay */}
        {isHovering && getCursorIcon() && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            {getCursorIcon()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cursor;
