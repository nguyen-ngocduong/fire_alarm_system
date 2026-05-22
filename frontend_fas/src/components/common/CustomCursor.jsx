import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect mobile/touch devices to disable custom cursor
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    if (isTouch) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
    };

    const handleMouseEnter = () => setHidden(false);
    const handleMouseLeave = () => setHidden(true);
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.card-hover') ||
        target.closest('input') ||
        target.closest('select') ||
        target.getAttribute('role') === 'button';
      
      setHovered(!!isInteractive);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [hidden]);

  if (isTouchDevice || hidden) return null;

  return (
    <>
      {/* Outer crosshair ring */}
      <div
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 transition-transform duration-75 ease-out ${
          clicked ? 'scale-75 border-primary' : hovered ? 'scale-125 border-primary' : 'scale-100'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '24px',
          height: '24px',
          boxShadow: hovered ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none',
        }}
      >
        {/* Crosshair lines */}
        <div className="absolute top-1/2 left-0 w-1 h-[1px] bg-primary/40 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-1 h-[1px] bg-primary/40 -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 w-[1px] h-1 bg-primary/40 -translate-x-1/2" />
        <div className="absolute left-1/2 bottom-0 w-[1px] h-1 bg-primary/40 -translate-x-1/2" />
      </div>
      {/* Inner dot */}
      <div
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80 transition-all duration-100 ${
          clicked ? 'scale-150 bg-primary' : hovered ? 'scale-75 bg-primary' : 'scale-100'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '6px',
          height: '6px',
          boxShadow: '0 0 4px rgba(59, 130, 246, 0.8)',
        }}
      />
    </>
  );
};

export default CustomCursor;
