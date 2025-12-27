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
      
      tl.fromTo(
        formRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
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
        '-=0.4'
      );
    }
  }, [visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
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
      className="min-h-screen flex flex-col items-center justify-center px-8 py-20 relative z-10"
    >
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient">Let's Connect</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Ready to collaborate on something extraordinary?
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl w-full">
        {/* Contact Form */}
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-8 space-y-6 opacity-0"
        >
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-all text-foreground placeholder:text-muted-foreground/50"
              placeholder="Your name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-all text-foreground placeholder:text-muted-foreground/50"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/50 transition-all text-foreground placeholder:text-muted-foreground/50 resize-none"
              placeholder="Tell me about your project..."
            />
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
        
        {/* Social Links & Info */}
        <div className="flex flex-col justify-center items-center lg:items-start space-y-8">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4 text-foreground">
              Or find me on
            </h3>
            <p className="text-muted-foreground mb-6">
              I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>
          </div>
          
          <div ref={socialRef} className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 glass rounded-2xl ${social.color} transition-all duration-300 hover:glow-box hover:scale-110 group`}
              >
                <social.icon className="w-6 h-6 transition-transform group-hover:scale-110" />
              </a>
            ))}
          </div>
          
          {/* Email display */}
          <div className="glass rounded-xl p-4 w-full">
            <p className="text-sm text-muted-foreground mb-1">Email me directly</p>
            <a 
              href="mailto:rahma@example.com" 
              className="text-gradient font-medium hover:underline"
            >
              rahma@example.com
            </a>
          </div>
          
          {/* Location */}
          <div className="glass rounded-xl p-4 w-full">
            <p className="text-sm text-muted-foreground mb-1">Based in</p>
            <p className="text-foreground font-medium">
              🌍 Available Worldwide
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-center text-muted-foreground text-sm">
        <p>© 2024 Rahma. Crafted with 💜 and lots of coffee.</p>
      </div>
    </section>
  );
};
