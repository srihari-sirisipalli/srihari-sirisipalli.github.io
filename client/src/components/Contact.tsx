import { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  // Calendly URL for scheduling meetings
  const CALENDLY_URL = "https://calendly.com/sriharisirisipalli0";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('https://formspree.io/f/meqwqdal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
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
            
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 hover:bg-primary/5 rounded-lg transition-colors group"
              data-testid="contact-schedule"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Calendar className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Schedule a Meeting</h3>
                <p className="text-muted-foreground" data-testid="contact-schedule-description">Book a consultation call</p>
              </div>
            </a>
            
            <div className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Connect with me</h3>
              <div className="flex gap-4">
                <a 
                  href="https://www.linkedin.com/in/sri-hari-sirisipalli-8297a01b1/" 
                  className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                  data-testid="contact-linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a 
                  href="https://github.com/srihari-sirisipalli" 
                  className="w-12 h-12 bg-primary/10 hover:bg-primary hover:text-primary-foreground rounded-lg flex items-center justify-center transition-colors"
                  data-testid="contact-github"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-6 h-6" />
                </a>
                <a 
                  href="https://srihari-sirisipalli.github.io/" 
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
