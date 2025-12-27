import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroSectionProps {
  onEnter: () => void;
}

export const HeroSection = ({ onEnter }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });
    
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50, filter: 'blur(10px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(
      subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    .fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
      '-=0.4'
    );
  }, []);

  return (
    <section 
      ref={containerRef}
      className="min-h-screen flex items-center justify-start px-8 md:px-16 lg:px-24 relative z-10"
    >
      <div className="max-w-2xl">
        <div className="mb-4">
          <span className="text-neon-cyan text-sm font-medium tracking-widest uppercase opacity-80">
            welcome to my portfolio
          </span>
        </div>
        
        <h1 
          ref={titleRef}
          className="font-display text-5xl md:text-7xl lg:text-5xl font-bold mb-6 leading-tight opacity-0"
        >
          <span className="text-foreground">I'm </span>
          <span className="text-gradient">Rahma Aliyyah</span>
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed opacity-0"
        >
          <span className="text-foreground font-medium">Aspiring Full-Stack Developer</span>
          <br />
          An Information Technology Student who passionate about creating 
          <span className="text-neon-purple"> impactful web experiences</span> and 
          <span className="text-neon-pink"> innovative solutions</span>.
        </p>
        
        <button
          ref={buttonRef}
          onClick={onEnter}
          className="group relative px-8 py-4 font-display text-sm tracking-wider uppercase opacity-0 overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-neon opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
          <span className="absolute inset-[2px] bg-background/90 group-hover:bg-background/70 transition-colors duration-300" />
          <span className="relative z-10 text-foreground group-hover:text-gradient transition-all duration-300 flex items-center gap-3">
            Enter My Universe
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </span>
        </button>
  

      </div>
    </section>
  );
};
