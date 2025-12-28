import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Code2, Palette, Database, Wrench } from 'lucide-react';

const skillCategories = [
  {
    title: 'Languages',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E', color: '#F7DF1E' },
      { name: 'TypeScript', logo: 'logos/typescript.png', color: '#F7DF1E' },
      { name: 'PHP', logo: 'https://cdn.simpleicons.org/php/777BB4', color: '#777BB4' },
      { name: 'Python', logo: 'https://cdn.simpleicons.org/python/3776AB', color: '#3776AB' },
      { name: 'Java', logo: 'logos/java.png', color: '#F80000' },
      { name: 'HTML5', logo: 'https://cdn.simpleicons.org/html5/E34F26', color: '#E34F26' },
      { name: 'CSS3', logo: 'logos/css.png', color: '#1572B6' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Laravel', logo: 'https://cdn.simpleicons.org/laravel/FF2D20', color: '#FF2D20' },
      { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB', color: '#61DAFB' },
      { name: 'Next.js', logo: 'logos/nextjs.png', color: '#000000' },
      { name: 'Tailwind', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4', color: '#06B6D4' },
    ],
  },
  {
    title: 'Databases',
    icon: Database,
    color: 'from-green-500 to-emerald-500',
    skills: [
      { name: 'MySQL', logo: 'https://cdn.simpleicons.org/mysql/4479A1', color: '#4479A1' },
      { name: 'MongoDB', logo: 'https://cdn.simpleicons.org/mongodb/47A248', color: '#47A248' },
      { name: 'Redis', logo: 'https://cdn.simpleicons.org/redis/DC382D', color: '#DC382D' },
      { name: 'Firebase', logo: 'logos/Firebase.png', color: '#FFCA28' },
    ],
  },
  {
    title: 'Tools & Platforms',
    icon: Wrench,
    color: 'from-orange-500 to-red-500',
    skills: [
      { name: 'Git', logo: 'https://cdn.simpleicons.org/git/F05032', color: '#F05032' },
      { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/181717', color: '#181717' },
      { name: 'Docker', logo: 'https://cdn.simpleicons.org/docker/2496ED', color: '#2496ED' },
      { name: 'Postman', logo: 'https://cdn.simpleicons.org/postman/FF6C37', color: '#FF6C37' },
      { name: 'Android Studio', logo: 'logos/androidstudio.png', color: '#3DDC84' },
      { name: 'VS Code', logo: 'logos/vscode .png', color: '#007ACC' },
      { name: 'Figma', logo: 'logos/figma.png', color: '#F24E1E' },
      { name: 'Canva', logo: 'logos/canva.png', color: '#00C4CC' },
      { name: 'ThingsBoard', logo: 'logos/thingsboard.png', color: '#0056A6' },
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
          stagger: 0.2,
          ease: 'power3.out',
        }
      );

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
            stagger: 0.08
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
          A powerful constellation of technologies I use to craft digital experiences
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
            <div className={`absolute -inset-1 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 blur-xl rounded-3xl transition-opacity duration-500`} />
            
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
              <div className="flex flex-wrap gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skill.name}
                    className="skill-logo group/skill relative"
                    onMouseEnter={() => setHoveredSkill(`${categoryIndex}-${skillIndex}`)}
                    onMouseLeave={() => setHoveredSkill(null)}
                  >
                    <div className="flex flex-col items-center gap-2 cursor-pointer">
                      {/* Glow effect on hover */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover/skill:opacity-20 blur-lg transition-opacity duration-300 rounded-full"
                        style={{ backgroundColor: skill.color }}
                      />
                      
                      {/* Logo */}
                      <img 
                        src={skill.logo}
                        alt={skill.name}
                        className="w-12 h-12 object-contain relative z-10 transition-all duration-300 group-hover/skill:scale-125 group-hover/skill:drop-shadow-lg"
                        style={{
                          filter: hoveredSkill === `${categoryIndex}-${skillIndex}` 
                            ? `drop-shadow(0 0 8px ${skill.color})` 
                            : 'none'
                        }}
                      />
                      
                      {/* Name */}
                      <p className="text-xs font-medium text-center text-muted-foreground group-hover/skill:text-foreground transition-colors duration-300">
                        {skill.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} blur-2xl rounded-full transform translate-x-20 -translate-y-20`} />
            </div>
          </div>
        ))}
      </div>

      {/* Stats summary */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-4 md:gap-8">
        <div className="text-center">
          <div className="text-2xl md:text-4xl font-bold text-gradient mb-1">23+</div>
          <div className="text-xs md:text-sm text-muted-foreground">Technologies</div>
        </div>
        <div className="w-px h-8 md:h-12 bg-border" />
        <div className="text-center">
          <div className="text-2xl md:text-4xl font-bold text-gradient mb-1">2+</div>
          <div className="text-xs md:text-sm text-muted-foreground">Years Experience</div>
        </div>
        <div className="w-px h-8 md:h-12 bg-border" />
        <div className="text-center">
          <div className="text-2xl md:text-4xl font-bold text-gradient mb-1">10+</div>
          <div className="text-xs md:text-sm text-muted-foreground">Projects Built</div>
        </div>
      </div>
    </section>
  );
};