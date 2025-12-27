import { useState, useEffect, useRef, useCallback } from 'react';
import Lenis from '@studio-freight/lenis';
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
  const lenisRef = useRef<Lenis | null>(null);
  const isScrollingRef = useRef(false);

  const totalSections = 6;

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.5,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  // Handle wheel events for section navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isScrollingRef.current) return;
      
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSection = Math.max(0, Math.min(totalSections - 1, currentSection + direction));
      
      if (nextSection !== currentSection) {
        isScrollingRef.current = true;
        setCurrentSection(nextSection);
        
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSection]);

  // Track mouse position for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
      setCursorPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNavigate = useCallback((section: number) => {
    setCurrentSection(section);
  }, []);

  const handleEnter = useCallback(() => {
    setCurrentSection(1);
  }, []);

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
          className="transition-transform duration-1000 ease-out"
          style={{ transform: `translateY(-${currentSection * 100}vh)` }}
        >
          <HeroSection onEnter={handleEnter} />
          <SkillsSection visible={currentSection === 1} />
          <ProjectsSection visible={currentSection === 2} />
          <ExperienceSection visible={currentSection === 3} />
          <CertificatesSection visible={currentSection === 4} />
          <ContactSection visible={currentSection === 5} />
        </div>
      </main>

      {/* Section indicators */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {[...Array(totalSections)].map((_, index) => (
          <button
            key={index}
            onClick={() => handleNavigate(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSection === index
                ? 'bg-neon-purple w-2 h-8 glow-box'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
          />
        ))}
      </div>

      {/* Background gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[200px]" />
      </div>
    </div>
  );
};

export default Index;
