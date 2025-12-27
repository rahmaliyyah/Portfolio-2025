import { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { Scene3D } from '@/components/three/Scene3D';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { CertificatesSection } from '@/components/sections/CertificatesSection';
import { ContactSection } from '@/components/sections/ContactSection';

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isScrollingRef = useRef(false);
  const scrollProgressRef = useRef(0);
  const targetSectionRef = useRef(0);

  const totalSections = 6;

  // Enhanced smooth scrolling with GSAP + Lenis
  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 2.0,
      easing: (t) => {
        // Custom easing for ultra-smooth feel
        return t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
      },
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.35,
      touchMultiplier: 1.5,
    });

    let rafId: number;
    let lastTime = performance.now();

    function raf(time: number) {
      const delta = time - lastTime;
      lastTime = time;
      
      // Adaptive damping based on frame rate
      const dampingFactor = Math.min(delta / 16.67, 2);
      lenisRef.current?.raf(time * dampingFactor);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
    };
  }, []);

  // Smooth section transition animation
  const animateToSection = useCallback((targetSection: number) => {
    if (!contentRef.current || isScrollingRef.current) return;
    
    isScrollingRef.current = true;
    targetSectionRef.current = targetSection;

    // Kill any existing animations
    gsap.killTweensOf(scrollProgressRef);

    // Ultra-smooth GSAP animation
    gsap.to(scrollProgressRef, {
      current: targetSection,
      duration: 1.2,
      ease: "power4.inOut",
      onUpdate: () => {
        if (contentRef.current) {
          const progress = scrollProgressRef.current;
          const yOffset = -progress * 100;
          
          // Apply smooth transform with sub-pixel precision
          contentRef.current.style.transform = `translate3d(0, ${yOffset}vh, 0)`;
          contentRef.current.style.willChange = 'transform';
        }
      },
      onComplete: () => {
        isScrollingRef.current = false;
        setCurrentSection(targetSection);
        if (contentRef.current) {
          contentRef.current.style.willChange = 'auto';
        }
      }
    });

    // Immediate state update for UI responsiveness
    setCurrentSection(targetSection);
  }, []);

  // Handle wheel events with adaptive damping
  useEffect(() => {
    let wheelAccumulator = 0;
    let wheelTimeout: NodeJS.Timeout;
    const wheelThreshold = 50;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrollingRef.current) return;

      // Accumulate wheel delta for smoother detection
      wheelAccumulator += e.deltaY;

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        wheelAccumulator = 0;
      }, 100);

      if (Math.abs(wheelAccumulator) >= wheelThreshold) {
        const direction = wheelAccumulator > 0 ? 1 : -1;
        const nextSection = Math.max(0, Math.min(totalSections - 1, currentSection + direction));
        
        if (nextSection !== currentSection) {
          animateToSection(nextSection);
        }
        
        wheelAccumulator = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(wheelTimeout);
    };
  }, [currentSection, animateToSection]);

  // Touch handling for mobile
  useEffect(() => {
    let touchStartY = 0;
    let touchEndY = 0;
    const touchThreshold = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrollingRef.current) return;
      
      touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      if (Math.abs(diff) > touchThreshold) {
        const direction = diff > 0 ? 1 : -1;
        const nextSection = Math.max(0, Math.min(totalSections - 1, currentSection + direction));
        
        if (nextSection !== currentSection) {
          animateToSection(nextSection);
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentSection, animateToSection]);

  // Track mouse position for 3D effects with smoothing
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId: number;

    const smoothFactor = 0.08;

    const updateMouse = () => {
      currentX += (targetX - currentX) * smoothFactor;
      currentY += (targetY - currentY) * smoothFactor;
      
      setMousePosition({
        x: currentX,
        y: currentY,
      });
      
      rafId = requestAnimationFrame(updateMouse);
    };

    rafId = requestAnimationFrame(updateMouse);

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      setCursorPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavigate = useCallback((section: number) => {
    animateToSection(section);
  }, [animateToSection]);

  const handleEnter = useCallback(() => {
    animateToSection(1);
  }, [animateToSection]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-hidden"
    >
      {/* Cursor glow effect */}
      <div 
        className="cursor-glow hidden md:block"
        style={{ 
          left: cursorPosition.x,
          top: cursorPosition.y,
        }}
      />

      {/* 3D Background Scene */}
      <Scene3D 
        currentSection={currentSection} 
        mousePosition={mousePosition}
      />

      {/* Navigation */}
      <Navigation 
        currentSection={currentSection} 
        onNavigate={handleNavigate}
      />

      {/* Main Content */}
      <main className="relative z-10">
        <div 
          ref={contentRef}
          className="will-change-transform"
          style={{ 
            transform: `translate3d(0, -${currentSection * 100}vh, 0)`,
            backfaceVisibility: 'hidden',
            perspective: 1000,
          }}
        >
          <HeroSection onEnter={handleEnter} />
          <SkillsSection visible={currentSection === 1} />
          <ProjectsSection visible={currentSection === 2} />
          <ExperienceSection visible={currentSection === 3} />
          <CertificatesSection visible={currentSection === 4} />
          <ContactSection visible={currentSection === 5} mousePosition={mousePosition} />
        </div>
      </main>

      {/* Section indicators */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {[...Array(totalSections)].map((_, index) => (
          <button
            key={index}
            onClick={() => handleNavigate(index)}
            className={`w-2 h-2 rounded-full transition-all duration-500 ease-out ${
              currentSection === index
                ? 'bg-neon-purple w-2 h-8 glow-box'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
          />
        ))}
      </div>

      {/* Background gradient overlays with parallax */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[150px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0)` }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[150px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate3d(${mousePosition.x * -15}px, ${mousePosition.y * -15}px, 0)` }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[200px] transition-transform duration-1000 ease-out"
          style={{ transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 10}px, 0)` }}
        />
      </div>
    </div>
  );
};

export default Index;
