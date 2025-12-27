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
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
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

  // Detect current section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(index);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    const targetSection = sectionsRef.current[section];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleEnter = useCallback(() => {
    handleNavigate(1);
  }, [handleNavigate]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-background"
    >
      {/* Cursor glow effect */}
      <div 
        className="cursor-glow hidden md:block"
        style={{ 
          left: cursorPosition.x,
          top: cursorPosition.y,
        }}
      />

      {/* 3D Background Scene - TETAP ADA (laptop & stars) */}
      <Scene3D 
        currentSection={currentSection} 
        mousePosition={mousePosition}
      />

      {/* Navigation */}
      <Navigation 
        currentSection={currentSection} 
        onNavigate={handleNavigate}
      />

      {/* Main Content - Normal scroll flow */}
      <main className="relative z-10">
        <div ref={(el) => el && (sectionsRef.current[0] = el)}>
          <HeroSection onEnter={handleEnter} />
        </div>
        <div ref={(el) => el && (sectionsRef.current[1] = el)}>
          <SkillsSection visible={currentSection === 1} />
        </div>
        <div ref={(el) => el && (sectionsRef.current[2] = el)}>
          <ProjectsSection visible={currentSection === 2} />
        </div>
        <div ref={(el) => el && (sectionsRef.current[3] = el)}>
          <ExperienceSection visible={currentSection === 3} />
        </div>
        <div ref={(el) => el && (sectionsRef.current[4] = el)}>
          <CertificatesSection visible={currentSection === 4} />
        </div>
        <div ref={(el) => el && (sectionsRef.current[5] = el)}>
          <ContactSection visible={currentSection === 5} />
        </div>
      </main>

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