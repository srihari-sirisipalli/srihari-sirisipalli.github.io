import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Type declarations for Calendly
declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const [showInlineCalendly, setShowInlineCalendly] = useState(false);
  const { toast } = useToast();
  
  // Placeholder Calendly URL - can be updated with actual Calendly link
  const CALENDLY_URL = "https://calendly.com/srihari-sirisipalli";
  
  // Load Calendly script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setIsCalendlyLoaded(true);
    document.head.appendChild(script);
    
    return () => {
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);
  
  const openCalendlyPopup = () => {
    if (isCalendlyLoaded && window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      toast({
        title: "Loading...",
        description: "Calendly is loading. Please try again in a moment.",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="section-title-contact">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="contact-description">
            Ready to collaborate on cutting-edge AI/ML projects or discuss opportunities? 
            Let's connect and explore how we can work together.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4" data-testid="contact-email">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground" data-testid="contact-email-value">sriharisirisipalli0@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4" data-testid="contact-phone">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Phone</h3>
                <p className="text-muted-foreground" data-testid="contact-phone-value">+91 8317683013</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4" data-testid="contact-location">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Location</h3>
                <p className="text-muted-foreground" data-testid="contact-location-value">Visakhapatnam, India</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4" data-testid="contact-schedule">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Schedule a Meeting</h3>
                <p className="text-muted-foreground" data-testid="contact-schedule-description">Book a consultation call</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={openCalendlyPopup}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                  data-testid="button-schedule-popup"
                >
                  <Calendar className="w-5 h-5" />
                  Quick Schedule (Popup)
                </Button>
                <Button 
                  onClick={() => setShowInlineCalendly(!showInlineCalendly)}
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center gap-2"
                  data-testid="button-schedule-inline"
                >
                  <Calendar className="w-5 h-5" />
                  {showInlineCalendly ? 'Hide' : 'Show'} Calendar
                </Button>
              </div>
              
              {showInlineCalendly && (
                <div className="bg-card rounded-lg border border-border overflow-hidden" data-testid="calendly-inline">
                  {isCalendlyLoaded ? (
                    <div 
                      className="calendly-inline-widget" 
                      data-url={CALENDLY_URL}
                      style={{ minWidth: '320px', height: '630px' }}
                    ></div>
                  ) : (
                    <div className="flex items-center justify-center h-96 text-muted-foreground">
                      <div className="text-center">
                        <Calendar className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                        <p>Loading calendar...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Connect with me</h3>
              <div className="flex gap-4">
                <a 
                  href="https://linkedin.com/in/srihari-sirisipalli" 
                  className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                  data-testid="contact-linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a 
                  href="https://github.com/srihari" 
                  className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                  data-testid="contact-github"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a 
                  href="https://sri-portfolio.com" 
                  className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                  data-testid="contact-portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Globe className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-8 rounded-lg border border-border" data-testid="contact-form">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-2">Send me a message</h3>
              <p className="text-muted-foreground text-sm">Or schedule a meeting using the options on the left</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  data-testid="input-name"
                  className="bg-input border-border text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  required
                  data-testid="input-email"
                  className="bg-input border-border text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Subject</label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Project Discussion"
                  required
                  data-testid="input-subject"
                  className="bg-input border-border text-foreground placeholder-muted-foreground"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell me about your project or how we can collaborate..."
                  required
                  data-testid="input-message"
                  className="bg-input border-border text-foreground placeholder-muted-foreground"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2"
                data-testid="button-send"
              >
                <Send className="w-5 h-5" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
