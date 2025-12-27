import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Code2, Palette, Database, Wrench, Sparkles } from 'lucide-react';

const skillCategories = [
  {
    title: 'Languages',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E', color: '#F7DF1E' },
      { name: 'TypeScript', logo: 'https://cdn.simpleicons.org/typescript/3178C6', color: '#3178C6' },
      { name: 'Python', logo: 'https://cdn.simpleicons.org/python/3776AB', color: '#3776AB' },
      { name: 'HTML5', logo: 'https://cdn.simpleicons.org/html5/E34F26', color: '#E34F26' },
      { name: 'CSS3', logo: 'https://cdn.simpleicons.org/css3/1572B6', color: '#1572B6' },
      { name: 'SQL', logo: 'https://cdn.simpleicons.org/mysql/4479A1', color: '#4479A1' },
    ],
  },
  {
    title: 'Frontend',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB', color: '#61DAFB' },
      { name: 'Next.js', logo: 'https://cdn.simpleicons.org/nextdotjs/000000', color: '#000000' },
      { name: 'Three.js', logo: 'https://cdn.simpleicons.org/threedotjs/000000', color: '#000000' },
      { name: 'Tailwind', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', color: '#06B6D4' },
      { name: 'Framer', logo: 'https://cdn.simpleicons.org/framer/0055FF', color: '#0055FF' },
    ],
  },
  {
    title: 'Backend',
    icon: Database,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs/339933', color: '#339933' },
      { name: 'Express', logo: 'https://cdn.simpleicons.org/express/000000', color: '#000000' },
      { name: 'MongoDB', logo: 'https://cdn.simpleicons.org/mongodb/47A248', color: '#47A248' },
      { name: 'PostgreSQL', logo: 'https://cdn.simpleicons.org/postgresql/4169E1', color: '#4169E1' },
      { name: 'REST API', logo: 'https://cdn.simpleicons.org/fastapi/009688', color: '#009688' },
    ],
  },
  {
    title: 'Tools',
    icon: Wrench,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Git', logo: 'https://cdn.simpleicons.org/git/F05032', color: '#F05032' },
      { name: 'Docker', logo: 'https://cdn.simpleicons.org/docker/2496ED', color: '#2496ED' },
      { name: 'Figma', logo: 'https://cdn.simpleicons.org/figma/F24E1E', color: '#F24E1E' },
      { name: 'VS Code', logo: 'https://cdn.simpleicons.org/visualstudiocode/007ACC', color: '#007ACC' },
      { name: 'Linux', logo: 'https://cdn.simpleicons.org/linux/FCC624', color: '#FCC624' },
    ],
  },
];

interface SkillsSectionProps {
  visible: boolean;
}

export const SkillsSection = ({ visible }: SkillsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  useEffect(() => {
    if (visible && sectionRef.current) {
      const tl = gsap.timeline();
      
      // Animate all cards together (no stagger)
      tl.fromTo(
        cardsRef.current,
        { 
          opacity: 0, 
          y: 100, 
          rotateX: -30,
          scale: 0.8 
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1,
          stagger: 0, // Changed from 0.2 to 0 - semua muncul bersamaan
          ease: 'power3.out',
        }
      );

      // Animate skill logos - also synchronized
      cardsRef.current.forEach((card) => {
        const skillLogos = card?.querySelectorAll('.skill-logo');
        gsap.fromTo(
          skillLogos,
          { opacity: 0, scale: 0, rotate: -180 },
          { 
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.6,
            delay: 0.5,
            ease: 'back.out(1.7)',
            stagger: 0 // Changed from 0.08 to 0 - logo juga muncul bersamaan
          }
        );
      });
    }
  }, [visible]);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-8 py-20 relative z-10"
    >
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-purple rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center mb-20 relative">
        <h2 className="font-display text-5xl md:text-7xl font-bold mb-6">
          <span className="text-gradient">Skills</span>
        </h2>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          A powerful constellation of technologies I use to craft exceptional digital experiences
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
        {skillCategories.map((category, categoryIndex) => (
          <div
            key={category.title}
            ref={el => { if (el) cardsRef.current[categoryIndex] = el; }}
            className="relative glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-500 group opacity-0"
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
            
            {/* Glow effect */}
            <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-30 blur-2xl rounded-3xl transition-opacity duration-500`} />
            
            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <category.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {category.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.skills.length} technologies
                  </p>
                </div>
              </div>

              {/* Logo Grid */}
              <div className="grid grid-cols-3 gap-3">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skill.name}
                    className="skill-logo group/skill relative"
                    onMouseEnter={() => setHoveredSkill(`${categoryIndex}-${skillIndex}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="glass rounded-xl p-4 hover:scale-110 transition-all duration-300 cursor-pointer border border-border/50 hover:border-neon-purple/50 flex flex-col items-center justify-center aspect-square relative overflow-hidden">
                      {/* Glow effect on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover/skill:opacity-20 blur-xl transition-opacity duration-300 rounded-xl"
                        style={{ backgroundColor: skill.color }}
                      />
                      
                      {/* Logo */}
                      <img 
                        src={skill.logo}
                        alt={skill.name}
                        className="w-10 h-10 object-contain relative z-10 transition-all duration-300 group-hover/skill:scale-110 group-hover/skill:drop-shadow-lg"
                        style={{
                          filter: hoveredSkill === `${categoryIndex}-${skillIndex}` 
                            ? `drop-shadow(0 0 8px ${skill.color})` 
                            : 'none'
                        }}
                      />
                      
                      {/* Name on hover */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover/skill:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-background/90 to-transparent p-2 rounded-b-xl">
                        <p className="text-xs font-medium text-center text-foreground">
                          {skill.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} blur-3xl rounded-full transform translate-x-20 -translate-y-20`} />
            </div>
          </div>
        ))}
      </div>

      {/* Stats summary */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-gradient mb-1">20+</div>
          <div className="text-sm text-muted-foreground">Technologies</div>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <div className="text-4xl font-bold text-gradient mb-1">5+</div>
          <div className="text-sm text-muted-foreground">Years Experience</div>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <div className="text-4xl font-bold text-gradient mb-1">100+</div>
          <div className="text-sm text-muted-foreground">Projects Built</div>
        </div>
      </div>
    </section>
  );
};