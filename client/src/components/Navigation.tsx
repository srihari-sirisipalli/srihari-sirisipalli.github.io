import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#experience", label: "Experience" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-primary" data-testid="nav-logo">Sri Hari</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-foreground hover:text-accent px-3 py-2 text-sm font-medium transition-colors"
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-accent"
              data-testid="nav-mobile-toggle"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-t border-border" data-testid="nav-mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="block text-foreground hover:text-accent px-3 py-2 text-base font-medium w-full text-left"
                data-testid={`nav-mobile-${item.label.toLowerCase()}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
