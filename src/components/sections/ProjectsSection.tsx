import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'KarirUB',
    description: 'A web-based career information system for Universitas Brawijaya alumni with integrated authentication, job search, applications, and admin management.',
    role: 'PM x Fullstack Programmer',
    skills: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'JavaScript'],
    image: 'showcase project/karirub.jpeg',
    github: 'https://github.com/rahmaliyyah/Karir-UB/',
    live: 'https://karirub.free.nf/public/index.php',
  },
  
  {
    id: 2,
    title: 'TrustArisan',
    description: 'A blockchain-based digital arisan web-app ensuring transparent and trustless transactions with smart contract integration.',
    role: 'Front-End Programmer',
    skills: ['React.js', 'Next.js', 'Blockchain', 'Smart Contracts'],
    image: 'showcase project/trustarisan.png',
    github: 'https://github.com/TrustArisan/',
    live: 'https://trustarisan.vercel.app/',
  },
  {
    id: 3,
    title: 'Langit Nusantara',
    description: 'A web-based real-time weather information system across Indonesia integrating BMKG Weather API and geocoding services.',
    role: 'Fullstack Programmer',
    skills: ['HTML', 'Tailwind CSS', 'REST API','Laravel','JavaScript', 'PHP', 'MySQL'],
    image: 'showcase project/langitnusantara.png',
    github: 'https://github.com/rahmaliyyah/Langit-Nusantara',
    live: '#',
  },
   {
    id: 4,
    title: 'TukarBaju',
    description: 'A landing web for TukarBaju campaign to overcome textile waste which focuses on promoting recycling and educating the public regarding the importance of responsible consumption and sustainable textile waste management.',
    role: 'PM x Front-End Programmer',
    skills: ['HTML', 'CSS', 'Github'],
    image: 'showcase project/tukarbaju.png',
    github: 'https://github.com/rahmaliyyah/TukarBaju',
    live: 'https://rahmaliyyah.github.io/TukarBaju/',
  },
  {
    id: 5,
    title: 'BerdeTak',
    description: 'An IoT-based health monitoring system using ESP32 and MAX30102 sensor with mobile dashboard for real-time heart rate and SpO₂ tracking.',
    role: 'Fullstack Programmer',
    skills: ['ESP32', 'Java', 'Android Studio', 'Firebase'],
    image: 'showcase project/berdetak.png',
    github: 'https://github.com/rahmaliyyah/BerdeTak-IoT',
    live: 'https://github.com/rahmaliyyah/BerdeTak-IoT',
  },
  {
    id: 6,
    title: 'Retrieval',
    description: 'An Android mobile application for lost and found item information at FILKOM, Universitas Brawijaya. Integrated with Firebase for real-time data storage and retrieval.',
    role: 'Fullstack Programmer',
    skills: ['Java', 'Android Studio', 'Firebase'],
    image: 'showcase project/retrieval.png',
    github: 'https://github.com/rahmaliyyah/retrieval',
    live: 'https://github.com/rahmaliyyah/retrieval',
  },
  {
    id: 7,
    title: 'RecipeBox',
    description: 'An Android mobile application for managing personal cooking recipes digitally with full CRUD functionality and Firebase integration.',
    role: 'Fullstack Programmer',
    skills: ['Java', 'Android Studio', 'Firebase'],
    image: 'showcase project/recipebox.png',
    github: 'https://github.com/rahmaliyyah/RecipeBox/',
    live: 'https://github.com/rahmaliyyah/RecipeBox/',
  },
  {
    id: 8,
    title: 'YOLOv8 Project',
    description: 'A computer vision project utilizing YOLOv8 for object detection and recognition tasks.',
    role: 'Fullstack Programmer',
    skills: ['YOLOv8', 'Python'],
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
    github: '#',
    live: '#',
  },
  {
    id: 9,
    title: 'ThingsBoard IoT Dashboard',
    description: 'An IoT data visualization project using ThingsBoard platform for real-time monitoring and analytics.',
    role: 'IoT Developer',
    skills: ['ThingsBoard', 'IoT', 'Data Visualization'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
    github: '#',
    live: '#',
  },
  {
    id: 10,
    title: 'Real-Time Chat System',
    description: 'Backend system for room-based messaging with polyglot persistence architecture using MongoDB and Redis with WebSocket support.',
    role: 'Backend Developer',
    skills: ['MongoDB', 'Redis', 'WebSocket', 'Node.js'],
    image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=600&h=400&fit=crop',
    github: '#',
    live: '#',
  },
 
];

interface ProjectsSectionProps {
  visible: boolean;
}

export const ProjectsSection = ({ visible }: ProjectsSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (visible) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, x: -50, rotateY: -10 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
        }
      );
    }
  }, [visible]);

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-8 py-20 relative z-10"
    >
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Crafted with passion, built with purpose
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
        {projects.map((project, index) => (
          <div
            key={project.id}
            ref={el => { if (el) cardsRef.current[index] = el; }}
            className="group relative glass rounded-2xl overflow-hidden hover:glow-box transition-all duration-500 opacity-0"
          >
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              
              {/* Floating links */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a 
                  href={project.github}
                  className="p-2 glass rounded-full hover:bg-neon-purple/20 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href={project.live}
                  className="p-2 glass rounded-full hover:bg-neon-purple/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h3 className="font-display text-xl font-bold mb-2 text-foreground group-hover:text-gradient transition-all duration-300">
                {project.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {project.description}
              </p>
              
              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs bg-neon-purple/10 text-neon-purple rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              {/* Role */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  <span className="text-neon-cyan">Role:</span> {project.role}
                </p>
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 via-transparent to-neon-pink/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};