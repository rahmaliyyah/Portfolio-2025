import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Github, Linkedin, Mail, Send, Twitter } from 'lucide-react';

interface ContactSectionProps {
  visible: boolean;
}

export const ContactSection = ({ visible }: ContactSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    if (visible) {
      const tl = gsap.timeline();
      
      // Animate form from left
      tl.fromTo(
        formRef.current,
        { opacity: 0, x: -80, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' }
      )
      .fromTo(
        socialRef.current?.children || [],
        { opacity: 0, scale: 0, rotate: -180 },
        { 
          opacity: 1, 
          scale: 1, 
          rotate: 0, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: 'back.out(1.7)' 
        },
        '-=0.5'
      );
    }
  }, [visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub', color: 'hover:text-foreground' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-neon-blue' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-neon-cyan' },
    { icon: Mail, href: 'mailto:rahma@example.com', label: 'Email', color: 'hover:text-neon-pink' },
  ];

  return (
    <section 
      ref={sectionRef}
      className="h-screen flex flex-col items-center justify-center px-8 py-20 relative z-10"
    >
      {/* Portal/Black hole effect background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 rounded-full bg-gradient-radial from-neon-purple/20 via-transparent to-transparent animate-pulse" />
          <div className="absolute inset-[15%] rounded-full bg-gradient-radial from-neon-pink/15 via-transparent to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute inset-[30%] rounded-full bg-gradient-radial from-neon-blue/10 via-transparent to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <div className="text-center mb-12 relative z-10">
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient">Let's Connect</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Ready to collaborate on something extraordinary?
        </p>
      </div>
      
      <div className="max-w-2xl w-full relative z-10">
        {/* Contact Form + Social Links */}
        <div className="flex flex-col space-y-8">
          {/* Contact Form */}
          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 space-y-6 opacity-0"
          >
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse" />
                Name
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30 transition-all text-foreground placeholder:text-muted-foreground/50"
                  placeholder="Your name"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-neon-purple/0 via-neon-purple/5 to-neon-pink/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                Email
              </label>
              <div className="relative group">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30 transition-all text-foreground placeholder:text-muted-foreground/50"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
                Message
              </label>
              <div className="relative group">
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/30 transition-all text-foreground placeholder:text-muted-foreground/50 resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="group relative w-full px-8 py-4 font-display text-sm tracking-wider uppercase overflow-hidden rounded-lg"
            >
              <span className="absolute inset-0 bg-gradient-neon opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
              <span className="relative z-10 text-foreground flex items-center justify-center gap-2">
                Send Message
                <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </button>
          </form>
          
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold text-foreground text-center">
              Or find me on
            </h3>
            
            <div ref={socialRef} className="flex gap-4 justify-center">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 glass rounded-2xl ${social.color} transition-all duration-300 hover:glow-box hover:scale-110 group relative overflow-hidden`}
                >
                  {/* Rocket trail effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neon-orange/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <social.icon className="w-6 h-6 transition-transform group-hover:scale-110 relative z-10" />
                </a>
              ))}
            </div>
            
            {/* Quick contact info */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              <div className="glass rounded-xl p-3 min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-1">Email</p>
                <a 
                  href="mailto:rahma@example.com" 
                  className="text-gradient font-medium text-sm hover:underline"
                >
                  rahma@example.com
                </a>
              </div>
              
              <div className="glass rounded-xl p-3 min-w-[200px]">
                <p className="text-xs text-muted-foreground mb-1">Based in</p>
                <p className="text-foreground font-medium text-sm">
                  🌍 Available Worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="islamic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1" fill="currentColor" className="text-neon-purple" />
            <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-neon-purple" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-center text-muted-foreground text-sm">
        <p>© 2024 Rahma. Crafted with 💜 and lots of coffee.</p>
      </div>
    </section>
  );
};